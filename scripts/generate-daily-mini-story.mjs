import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const directory=resolve('content/mini-diarios');
const indexPath=resolve(directory,'index.json');
await mkdir(directory,{recursive:true});
let catalog=[];
try{catalog=JSON.parse(await readFile(indexPath,'utf8'));}catch{}

const madridDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const plans=[
  ['La nube que pidió una pausa','☁️','calma',['Roki vio una nube que iba demasiado rápido.','La nube paró, respiró y escuchó el viento.','Después eligió avanzar despacio y se sintió más ligera.'],'Parar un momento puede ayudarnos a descubrir qué necesitamos.','Pon una mano en el pecho y otra en el abdomen. Respira lentamente tres veces.'],
  ['El rugido pequeñito','🦖','volumen',['Roki quería contar algo con un rugido enorme.','Mio le mostró cómo probar una voz suave.','Roki encontró un volumen cómodo y todos pudieron escucharlo.'],'Podemos ajustar nuestra voz sin dejar de expresar lo que sentimos.','Haz un rugido fuerte, uno mediano y uno suave. Elige cuál necesita tu cuerpo ahora.'],
  ['Las huellas tranquilas','🐾','ritmo',['Bruno encontró muchas huellas juntas.','Siguió una huella cada vez, sin correr.','Al final llegó a un rincón tranquilo junto a sus amigos.'],'Ir paso a paso hace que una tarea grande resulte más sencilla.','Camina cinco pasos lentos y cuenta cada uno mientras apoyas bien los pies.'],
  ['El semáforo interior','🚦','emoción',['Turbo sintió que su motor iba muy deprisa.','Miró su semáforo interior y eligió la luz amarilla.','Hizo una pausa y pudo explicar cómo se sentía.'],'Todas las emociones pueden escucharse antes de decidir qué hacer.','Elige un color: verde si estás tranquilo, amarillo si necesitas pausa o rojo si necesitas ayuda.'],
  ['La piedra que escuchaba','🪨','escuchar',['Goliat encontró una piedra tibia junto al camino.','Se sentó cerca y escuchó tres sonidos diferentes.','Su cuerpo se relajó mientras nombraba cada sonido.'],'Escuchar lo que nos rodea ayuda a volver al momento presente.','Busca tres sonidos: uno cercano, uno lejano y uno producido por ti.'],
  ['El hilo de la respiración','🧵','respirar',['Hilito imaginó un hilo que subía al tomar aire.','Después vio cómo bajaba al soltarlo lentamente.','Repitió el recorrido hasta sentirse preparado para continuar.'],'La respiración lenta puede acompañarnos cuando necesitamos regularnos.','Sube un dedo al inhalar y bájalo al exhalar. Repite tres veces sin forzar.'],
  ['La mochila de las preocupaciones','🎒','ayuda',['Lumo llevaba una mochila que parecía muy pesada.','Contó a Tinkie qué pensamiento guardaba dentro.','Al compartirlo, encontró ayuda y la mochila pesó menos.'],'Hablar con una persona segura puede hacer más llevadera una preocupación.','Nombra una persona adulta de confianza a quien puedas pedir ayuda hoy.']
];
if(catalog.some(item=>item.fecha===madridDate)){
  console.log(`El minicuento de ${madridDate} ya existe.`);
  process.exit(0);
}
const dayNumber=Math.floor(new Date(`${madridDate}T12:00:00Z`).getTime()/86400000);
const [title,emoji,keyword,pages,reflection,activity]=plans[dayNumber%plans.length];
const id=`mini-diario-${madridDate}`;
const story={id,fecha:madridDate,titulo:title,emoji,palabra_clave:keyword,paginas:pages,reflexion:reflection,actividad_regulacion:activity,duracion_minutos:4};
const filename=`${id}.json`;
await writeFile(resolve(directory,filename),`${JSON.stringify(story,null,2)}\n`,'utf8');
catalog.unshift({id,fecha:madridDate,titulo:title,emoji,archivo:filename});
await writeFile(indexPath,`${JSON.stringify(catalog,null,2)}\n`,'utf8');
console.log(`Minicuento diario creado: ${title} (${madridDate}).`);
