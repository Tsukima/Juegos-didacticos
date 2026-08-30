import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const directory=resolve('content/historias');
const catalog=JSON.parse(await readFile(resolve(directory,'index.json'),'utf8'));
const failures=[];
const ids=new Set();
const files=new Set(await readdir(directory));
const text=value=>typeof value==='string'&&value.trim().length>0;

if (!Array.isArray(catalog)||catalog.length===0) failures.push('El catálogo debe contener al menos un cuento.');

for (const entry of Array.isArray(catalog)?catalog:[]) {
  if (!text(entry.id)||!/^[a-z0-9-]+$/.test(entry.id)) failures.push('Hay un id de catálogo no válido.');
  if (ids.has(entry.id)) failures.push(`El id ${entry.id} está repetido.`); ids.add(entry.id);
  if (entry.archivo!==`${entry.id}.json`||!files.has(entry.archivo)) failures.push(`Falta el archivo de ${entry.id}.`);
  let story;
  try { story=JSON.parse(await readFile(resolve(directory,entry.archivo),'utf8')); }
  catch { failures.push(`${entry.archivo} no contiene JSON válido.`); continue; }
  if (story.id!==entry.id||story.titulo!==entry.titulo) failures.push(`${entry.id}: el catálogo y el cuento no coinciden.`);
  if (story.nivel_lector!=='avanzado'||story.edad_min!==10||story.edad_max!==12) failures.push(`${entry.id}: debe ser avanzado para 10-12 años.`);
  if (!Array.isArray(story.paginas)||story.paginas.length<6||story.paginas.length>8||!story.paginas.every(text)) failures.push(`${entry.id}: necesita entre 6 y 8 páginas válidas.`);
  if (!Array.isArray(story.preguntas)||story.preguntas.length!==3) failures.push(`${entry.id}: necesita exactamente tres preguntas.`);
  else story.preguntas.forEach((question,index)=>{
    if (!text(question.enunciado)||!Array.isArray(question.opciones)||question.opciones.length!==3||!question.opciones.every(text)||!Number.isInteger(question.correcta)||question.correcta<0||question.correcta>2||!text(question.explicacion)) failures.push(`${entry.id}: pregunta ${index+1} no válida.`);
  });
  for (const field of ['valor','serie','genero','tema','sinopsis']) if (!text(story[field])) failures.push(`${entry.id}: falta ${field}.`);
  if (!Number.isInteger(story.episodio)||story.episodio<1) failures.push(`${entry.id}: episodio no válido.`);
  for (const field of ['termino','definicion','uso_cotidiano','ejemplo']) if (!text(story.palabra_clave?.[field])) failures.push(`${entry.id}: falta palabra_clave.${field}.`);
}

if (failures.length) {
  console.error(failures.map(item=>`- ${item}`).join('\n'));
  process.exit(1);
}
console.log(`Contenido válido: ${catalog.length} cuento(s).`);
