import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const errors=[];
for(const [folder,type] of [['mini-diarios','mini'],['explorador-diarios','explorador']]){
  const directory=resolve('content',folder);
  const catalog=JSON.parse(await readFile(resolve(directory,'index.json'),'utf8'));
  const dates=new Set();
  for(const item of catalog){
    if(dates.has(item.fecha))errors.push(`${type}: fecha duplicada ${item.fecha}.`);
    dates.add(item.fecha);
    try{
      const story=JSON.parse(await readFile(resolve(directory,item.archivo),'utf8'));
      if(story.id!==item.id||story.fecha!==item.fecha)errors.push(`${item.archivo} no coincide con su índice.`);
      const expected=type==='mini'?3:5;
      if(!Array.isArray(story.paginas)||story.paginas.length!==expected)errors.push(`${item.id} debe tener ${expected} páginas.`);
      if(!story.reflexion||!story.actividad_regulacion)errors.push(`${item.id} necesita reflexión y regulación.`);
      if(type==='explorador'&&(story.edad_min!==8||story.edad_max!==12))errors.push(`${item.id} debe ser para 8–12 años.`);
    }catch{errors.push(`No se pudo leer ${item.archivo}.`);}
  }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Publicaciones diarias válidas.');
