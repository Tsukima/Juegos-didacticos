import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const loopUrl=process.env.MAGIC_LOOP_URL?.trim();
const requestedTheme=process.env.REQUESTED_THEME?.trim();
if (!loopUrl) throw new Error('Falta el secreto MAGIC_LOOP_URL.');

const directory=resolve('content/historias');
const indexPath=resolve(directory,'index.json');
const catalog=JSON.parse(await readFile(indexPath,'utf8'));
const existing=await Promise.all(catalog.map(async entry=>JSON.parse(await readFile(resolve(directory,entry.archivo),'utf8'))));
const nextEpisode=Math.max(0,...existing.map(story=>Number(story.episodio)||0))+1;
const existingSummary=existing.map(story=>({
  titulo:story.titulo,
  genero:story.genero,
  valor:story.valor,
  palabras_clave:[story.palabra_clave?.palabra].filter(Boolean),
  sinopsis:story.sinopsis
}));

const response=await fetch(loopUrl,{
  method:'POST',
  headers:{'Content-Type':'application/json','Accept':'application/json'},
  body:JSON.stringify({tema:requestedTheme||'',episodio:nextEpisode,cuentos_existentes:existingSummary})
});
const raw=await response.text();
if (!response.ok) throw new Error(`Magic Loops respondió ${response.status}: ${raw.slice(0,500)}`);

let story;
try {
  story=JSON.parse(raw);
  if (typeof story==='string') story=JSON.parse(story);
} catch {
  throw new Error(`Magic Loops no devolvió JSON válido: ${raw.slice(0,500)}`);
}

const text=value=>typeof value==='string'&&value.trim().length>0;
const wordCount=value=>value.trim().split(/\s+/u).filter(Boolean).length;
const failures=[];
if (!text(story.id)||!/^[a-z0-9-]+$/.test(story.id)||catalog.some(entry=>entry.id===story.id)) failures.push('id ausente, repetido o no válido');
if (!story.id?.endsWith(`-${nextEpisode}`)) failures.push(`el id debe terminar en -${nextEpisode}`);
for (const field of ['titulo','valor','genero','tema','sinopsis']) if (!text(story[field])) failures.push(`falta ${field}`);
if (story.nivel_lector!=='avanzado'||story.edad_min!==10||story.edad_max!==12) failures.push('nivel o edad no válidos');
if (story.serie!=='Expediciones de Tinkie'||story.episodio!==nextEpisode) failures.push('serie o episodio no válidos');
if (!Array.isArray(story.paginas)||story.paginas.length<6||story.paginas.length>8) failures.push('debe contener entre 6 y 8 páginas');
else story.paginas.forEach((page,index)=>{
  const words=text(page)?wordCount(page):0;
  if (words<25||words>45) failures.push(`la página ${index+1} tiene ${words} palabras; debe tener entre 25 y 45`);
});
const keyword=story.palabra_clave;
for (const field of ['palabra','definicion','ejemplo_cuento','ejemplo_cotidiano','reto']) if (!text(keyword?.[field])) failures.push(`falta palabra_clave.${field}`);
if (!Array.isArray(keyword?.silabas)||keyword.silabas.length<2||!keyword.silabas.every(text)) failures.push('separación silábica no válida');
const validateQuestion=(question,label)=>{
  if (!text(question?.enunciado)||!Array.isArray(question?.opciones)||question.opciones.length!==3||!question.opciones.every(text)||!Number.isInteger(question.correcta)||question.correcta<0||question.correcta>2||!text(question.explicacion)) failures.push(`${label} no válida`);
};
validateQuestion(keyword?.pregunta,'pregunta de palabra clave');
if (!Array.isArray(story.preguntas)||story.preguntas.length!==3) failures.push('debe contener exactamente tres preguntas de comprensión');
else story.preguntas.forEach((question,index)=>validateQuestion(question,`pregunta ${index+1}`));
if (failures.length) throw new Error(`El cuento de Magic Loops no superó la revisión:\n- ${failures.join('\n- ')}`);

const filename=`${story.id}.json`;
await writeFile(resolve(directory,filename),`${JSON.stringify(story,null,2)}\n`,'utf8');
catalog.push({id:story.id,titulo:story.titulo,nivel_lector:story.nivel_lector,edad_min:story.edad_min,edad_max:story.edad_max,valor:story.valor,serie:story.serie,episodio:story.episodio,genero:story.genero,tema:story.tema,sinopsis:story.sinopsis,palabra_clave:story.palabra_clave.palabra,archivo:filename});
await writeFile(indexPath,`${JSON.stringify(catalog,null,2)}\n`,'utf8');
await writeFile('story-files.txt',`content/historias/${filename}\n`,'utf8');
await writeFile('generated-pr-body.md',`## Resumen para la familia\n\n**${story.titulo}** · ${story.serie}, episodio ${story.episodio}\n\n${story.sinopsis}\n\n- Edad: ${story.edad_min}–${story.edad_max} años\n- Género: ${story.genero}\n- Valor: ${story.valor}\n- Palabra clave: **${story.palabra_clave.palabra}** — ${story.palabra_clave.definicion}\n\n## Qué se añadirá\n\nUn cuento de ${story.paginas.length} páginas, una palabra interactiva y tres preguntas de comprensión.\n\n## Comprobaciones\n\n- Contenido validado automáticamente\n- Aplicación compilada antes de abrir este Pull Request\n- Pendiente de aprobación adulta\n`,'utf8');
console.log(`Cuento generado por Magic Loops: ${story.titulo} (${filename})`);
