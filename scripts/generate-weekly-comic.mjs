import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const directory=resolve('content/comics');
const dryRun=process.argv.includes('--dry-run');
const indexPath=resolve(directory,'index.json');
await mkdir(directory,{recursive:true});
let catalog=[];
try{catalog=JSON.parse(await readFile(indexPath,'utf8'));}catch{}
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if(catalog.some(item=>item.fecha===date)){console.log(`Los cómics de ${date} ya existen.`);process.exit(0);}

const arcs=[
  {title:'El misterio de la estrella verde',value:'colaboración',chapters:[
    ['La señal en el cielo','Tinkie y Roki ven una estrella verde que parpadea tres veces.',['La estrella dibuja una ruta sobre las nubes.','Roki quiere correr, pero Tinkie propone observar.','Juntos copian el patrón de luces.','El mapa señala el Bosque Sonoro.']],
    ['Las voces del bosque','El equipo sigue la señal y aprende a escuchar antes de avanzar.',['Hilito encuentra huellas bajo una hoja.','Todos guardan silencio durante diez segundos.','Un eco repite la palabra «juntos».','Las huellas conducen hasta una puerta luminosa.']],
    ['Una luz para compartir','Los amigos descubren que la estrella necesitaba reunir sus ideas.',['La puerta se abre cuando cada amigo aporta una pista.','Dentro encuentran una pequeña estrella cansada.','Construyen un faro con materiales seguros.','La estrella vuelve al cielo y agradece la colaboración.']]
  ]},
  {title:'La carrera de los caminos tranquilos',value:'autorregulación',chapters:[
    ['Motores preparados','Turbo invita al equipo a una carrera donde también cuenta saber parar.',['Los vehículos llegan a la línea de salida.','Un semáforo muestra colores desconocidos.','Mio propone descubrir qué significa cada luz.','La primera pista dice: respirar también es avanzar.']],
    ['La curva de la paciencia','Una curva difícil enseña a elegir el ritmo adecuado.',['Turbo nota que su motor va demasiado rápido.','Bruno acompaña una respiración lenta.','El equipo cruza la curva sin competir.','Una bandera amarilla revela el último camino.']],
    ['La meta compartida','Todos encuentran una manera propia de llegar a la meta.',['Cada compañero elige una velocidad cómoda.','Nadie queda atrás ni pierde la carrera.','Celebran las pausas que les ayudaron.','La copa dice: escuchar tu cuerpo es una victoria.']]
  ]},
  {title:'La biblioteca bajo el mar',value:'curiosidad',chapters:[
    ['El libro mojado','Mio encuentra un libro que deja pequeñas gotas azules.',['Una ola deposita el libro en la arena.','Sus páginas muestran peces con letras.','Tinkie formula una pregunta para abrirlo.','Aparece una escalera de burbujas.']],
    ['Palabras entre corales','El equipo busca sílabas escondidas sin tocar los corales.',['Goliat señala una sílaba brillante.','Roki encuentra otra detrás de una roca.','Unen las partes y forman «cuidado».','La palabra abre la biblioteca submarina.']],
    ['El cuento que regresó','Los amigos ayudan al libro a encontrar su estante.',['La bibliotecaria tortuga reconoce la portada.','Cada amigo cuenta una pista del viaje.','El libro ocupa de nuevo su lugar.','Una burbuja les regala una pregunta nueva.']]
  ]}
];
const day=Math.floor(new Date(`${date}T12:00:00Z`).getTime()/86400000);
const arc=arcs[day%arcs.length];
const issue=catalog.length+1;
const entries=[];
for(let index=0;index<3;index++){
  const [title,summary,panels]=arc.chapters[index];
  const transitions=['El equipo observa una señal nueva antes de continuar.','Cada compañero comparte una idea y escucha las demás.','Hacen una pausa breve para comprobar cómo se sienten.','La siguiente pista aparece cuando avanzan juntos.'];
  const expandedPanels=panels.flatMap((text,panel)=>[text,transitions[panel]]);
  const id=`comic-${date}-capitulo-${index+1}`;
  const story={id,fecha:date,coleccion:arc.title,edicion:issue,capitulo:index+1,titulo:title,valor:arc.value,sinopsis:summary,imagen:'',paneles:expandedPanels.map((texto,panel)=>({numero:panel+1,texto,alt:`Escena ${panel+1} de ${title}.`})),reflexion:index===2?`¿Dónde viste ${arc.value} durante los tres capítulos?`:'¿Qué crees que ocurrirá en el siguiente capítulo?'};
  const filename=`${id}.json`;
  if(!dryRun)await writeFile(resolve(directory,filename),`${JSON.stringify(story,null,2)}\n`,'utf8');
  entries.push({id,fecha:date,coleccion:arc.title,edicion:issue,capitulo:index+1,titulo:title,valor:arc.value,sinopsis:summary,archivo:filename});
}
if(dryRun){console.log(`Prueba correcta: ${arc.title}, 3 capítulos.`);process.exit(0);}
catalog.unshift(...entries);
await writeFile(indexPath,`${JSON.stringify(catalog,null,2)}\n`,'utf8');
console.log(`Cómic semanal creado: ${arc.title}, 3 capítulos.`);
