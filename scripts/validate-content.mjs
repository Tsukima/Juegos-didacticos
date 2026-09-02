import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const directory=resolve('content/historias');
const catalog=JSON.parse(await readFile(resolve(directory,'index.json'),'utf8'));
const failures=[];
const ids=new Set();
const files=new Set(await readdir(directory));
const text=value=>typeof value==='string'&&value.trim().length>0;
const ranges=new Map([['6-8','inicial'],['8-10','intermedio'],['10-12','avanzado']]);
const rangeCounts=new Map([...ranges.keys()].map(key=>[key,0]));

if (!Array.isArray(catalog)||catalog.length!==60) failures.push(`El catálogo debe contener 60 cuentos y contiene ${catalog.length}.`);

for (const entry of Array.isArray(catalog)?catalog:[]) {
  if (!text(entry.id)||!/^[a-z0-9-]+$/.test(entry.id)) failures.push('Hay un id de catálogo no válido.');
  if (ids.has(entry.id)) failures.push(`El id ${entry.id} está repetido.`); ids.add(entry.id);
  if (entry.archivo!==`${entry.id}.json`||!files.has(entry.archivo)) failures.push(`Falta el archivo de ${entry.id}.`);
  let story;
  try { story=JSON.parse(await readFile(resolve(directory,entry.archivo),'utf8')); }
  catch { failures.push(`${entry.archivo} no contiene JSON válido.`); continue; }
  if (story.id!==entry.id||story.titulo!==entry.titulo) failures.push(`${entry.id}: el catálogo y el cuento no coinciden.`);
  const range=`${story.edad_min}-${story.edad_max}`,expectedLevel=ranges.get(range);
  if (!expectedLevel||story.nivel_lector!==expectedLevel) failures.push(`${entry.id}: rango o nivel lector no válido.`);
  else rangeCounts.set(range,rangeCounts.get(range)+1);
  if (!Array.isArray(story.paginas)||story.paginas.length<6||story.paginas.length>8||!story.paginas.every(text)) failures.push(`${entry.id}: necesita entre 6 y 8 páginas válidas.`);
  if (!Array.isArray(story.preguntas)||story.preguntas.length!==3) failures.push(`${entry.id}: necesita exactamente tres preguntas.`);
  else story.preguntas.forEach((question,index)=>{
    if (!text(question.enunciado)||!Array.isArray(question.opciones)||question.opciones.length!==3||!question.opciones.every(text)||!Number.isInteger(question.correcta)||question.correcta<0||question.correcta>2||!text(question.explicacion)) failures.push(`${entry.id}: pregunta ${index+1} no válida.`);
  });
  for (const field of ['valor','serie','genero','tema','sinopsis']) if (!text(story[field])) failures.push(`${entry.id}: falta ${field}.`);
  if (!Number.isInteger(story.episodio)||story.episodio<1) failures.push(`${entry.id}: episodio no válido.`);
  const keyword=story.palabra_clave;
  if (!text(keyword?.palabra)) failures.push(`${entry.id}: falta palabra_clave.palabra.`);
  if (!Array.isArray(keyword?.silabas)||keyword.silabas.length<2||!keyword.silabas.every(text)) failures.push(`${entry.id}: palabra_clave.silabas no es válida.`);
  for (const field of ['definicion','ejemplo_cuento','ejemplo_cotidiano','reto']) if (!text(keyword?.[field])) failures.push(`${entry.id}: falta palabra_clave.${field}.`);
  const keywordQuestion=keyword?.pregunta;
  if (!text(keywordQuestion?.enunciado)||!Array.isArray(keywordQuestion?.opciones)||keywordQuestion.opciones.length!==3||!keywordQuestion.opciones.every(text)||!Number.isInteger(keywordQuestion.correcta)||keywordQuestion.correcta<0||keywordQuestion.correcta>2||!text(keywordQuestion.explicacion)) failures.push(`${entry.id}: la pregunta de la palabra clave no es válida.`);
}

for(const [range,count] of rangeCounts) if(count!==20) failures.push(`El rango ${range} debe tener 20 cuentos y tiene ${count}.`);

if (failures.length) {
  console.error(failures.map(item=>`- ${item}`).join('\n'));
  process.exit(1);
}
console.log(`Contenido válido: ${catalog.length} cuento(s).`);
