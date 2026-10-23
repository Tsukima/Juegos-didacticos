import {access,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const directory=resolve('content/comics');
const catalog=JSON.parse(await readFile(resolve(directory,'index.json'),'utf8'));
const errors=[];
const ids=new Set();
for(const item of catalog){
  if(ids.has(item.id))errors.push(`ID repetido: ${item.id}.`);
  ids.add(item.id);
  try{
    const comic=JSON.parse(await readFile(resolve(directory,item.archivo),'utf8'));
    if(comic.id!==item.id||comic.capitulo!==item.capitulo)errors.push(`${item.archivo} no coincide con el índice.`);
    if(!Array.isArray(comic.paneles)||comic.paneles.length<8)errors.push(`${item.id} necesita al menos ocho viñetas.`);
    if(!comic.reflexion)errors.push(`${item.id} necesita una reflexión.`);
    if(comic.imagen)try{await access(resolve('public',comic.imagen));}catch{errors.push(`${item.id}: falta la ilustración ${comic.imagen}.`);}
  }catch{errors.push(`No se pudo leer ${item.archivo}.`);}
}
const dates=new Set(catalog.map(item=>item.fecha));
for(const date of dates)if(catalog.filter(item=>item.fecha===date).length!==3)errors.push(`${date} debe tener exactamente tres capítulos.`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Cómics válidos: ${catalog.length} capítulos.`);
