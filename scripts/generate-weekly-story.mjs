import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const dryRun=process.argv.includes('--dry-run');
const directory=resolve('content/historias');
const indexPath=resolve(directory,'index.json');
const catalog=JSON.parse(await readFile(indexPath,'utf8'));
const stories=await Promise.all(catalog.map(async item=>JSON.parse(await readFile(resolve(directory,item.archivo),'utf8'))));
const episode=Math.max(0,...stories.map(item=>Number(item.episodio)||0))+1;
const ranges=[['inicial',6,8],['intermedio',8,10],['avanzado',10,12]];
const count=range=>stories.filter(item=>item.edad_min===range[1]&&item.edad_max===range[2]).length;
const [level,min,max]=[...ranges].sort((a,b)=>count(a)-count(b)||a[1]-b[1])[0];
const heroes=['Tinkie','Roki','Hilito','Turbo','Mio','Goliat','Bruno','Lumo'];
const hero=heroes[episode%heroes.length];
const plans=[
  ['puente-luminoso','El puente de las luces tranquilas','el valle luminoso','un puente cuyas luces se encendían al escuchar','varias luces parpadeaban sin orden','observaron el patrón y cruzaron por turnos','atención','patrón',['pa','trón'],'Orden que se repite y permite anticipar lo que viene.','Observar con atención ayuda a decidir con calma'],
  ['semillas-viajeras','Las semillas viajeras','el jardín del cielo','semillas suaves que buscaban tierra y agua','el viento cambiaba de dirección','prepararon macetas y protegieron cada semilla','paciencia','germinar',['ger','mi','nar'],'Comenzar a crecer una planta desde una semilla.','Cada ser vivo necesita tiempo y cuidado para crecer'],
  ['eco-amable','El eco de las palabras amables','la cueva del eco','paredes que devolvían cada palabra con un color','los ecos se mezclaban y nadie entendía el mensaje','hablaron despacio y escucharon cada respuesta','amabilidad','tono',['to','no'],'Manera en que suena una voz y expresa una intención.','Un tono amable ayuda a que otros se sientan seguros'],
  ['reloj-de-pausas','El reloj de las pausas valientes','el taller de los minutos','un reloj que reservaba momentos para respirar','sus agujas confundían todas las tareas','ordenaron los pasos e hicieron una pausa','autocuidado','pausa',['pau','sa'],'Detención breve que permite descansar, observar o pensar.','Hacer una pausa también forma parte de avanzar'],
  ['isla-de-turnos','La isla de los buenos turnos','la isla de los juegos cooperativos','un tablero gigante que necesitaba a todo el equipo','dos fichas querían ocupar el mismo lugar','acordaron turnos y celebraron cada avance','cooperación','acuerdo',['a','cuer','do'],'Decisión aceptada por varias personas.','Un acuerdo justo permite disfrutar en equipo'],
  ['brujula-curiosa','La brújula de las preguntas','el bosque de los porqués','una brújula que señalaba preguntas nuevas','aparecieron tres caminos interesantes','compararon pistas y eligieron una ruta segura','curiosidad','investigar',['in','ves','ti','gar'],'Buscar información para comprender algo mejor.','Preguntar e investigar abre caminos para aprender'],
  ['nube-de-colores','La nube que aprendió sus colores','el observatorio de las emociones','una nube que cambiaba de color con cada emoción','sus colores cambiaban demasiado rápido','usaron el semáforo emocional y nombraron lo que sentían','educación emocional','emoción',['e','mo','ción'],'Respuesta del cuerpo y la mente ante lo que vivimos.','Nombrar una emoción ayuda a comprender lo que necesitamos'],
  ['portal-cuidadoso','El portal de la pregunta segura','la ciudad digital','un portal que ofrecía premios por datos personales','el mensaje exigía responder con prisa','cerraron el mensaje y pidieron ayuda a una persona adulta','seguridad digital','privacidad',['pri','va','ci','dad'],'Cuidado y derecho de proteger la información personal.','Parar y pedir ayuda es una decisión digital segura'],
  ['mapa-de-sonidos','El mapa de los sonidos escondidos','la biblioteca sonora','un mapa que se completaba con sonidos y sílabas','una palabra larga bloqueaba la pista','separaron la palabra en partes y volvieron a leer','perseverancia','sílaba',['sí','la','ba'],'Cada golpe de voz con el que pronunciamos una palabra.','Dividir una dificultad en partes facilita continuar'],
  ['faro-de-ideas','El faro de las ideas compartidas','la bahía de las historias','un faro que brillaba al compartir ideas','la niebla ocultó el camino','unieron sus propuestas y comprobaron las señales','trabajo en equipo','colaborar',['co','la','bo','rar'],'Trabajar con otras personas para lograr una meta.','Las ideas crecen cuando colaboramos']
];
const [slug,title,place,discovery,problem,solution,value,word,syllables,definition,learning]=plans[(episode-1)%plans.length];
const id=`semanal-${slug}-${episode}`;
if(catalog.some(item=>item.id===id)) throw new Error(`El cuento ${id} ya existe.`);
const cap=value=>value.charAt(0).toUpperCase()+value.slice(1);
const pages=[
  `${hero} y Tinkie llegaron a ${place}. Allí descubrieron ${discovery}.`,
  `${cap(problem)}. Antes de actuar, respiraron y observaron lo que ocurría.`,
  `Tinkie escuchó todas las ideas. ${hero} recordó la palabra «${word}» y explicó por qué podía ayudarles.`,
  `El equipo imaginó dos soluciones. Revisaron cuál era más tranquila, clara y segura antes de escoger.`,
  `${cap(solution)}. Cada paso pequeño permitió descubrir una pista nueva.`,
  `Cuando algo cambió, ajustaron el plan, se ayudaron y comprobaron juntos el resultado.`,
  `Al terminar, celebraron el esfuerzo. ${learning}. ${hero} guardó el aprendizaje para otra aventura.`
];
const q=(enunciado,opciones,correcta,explicacion)=>({enunciado,opciones,correcta,explicacion});
const story={id,titulo:`${title} · Episodio ${episode}`,nivel_lector:level,edad_min:min,edad_max:max,valor:value,serie:'Expediciones de Tinkie',episodio:episode,genero:'aventura educativa',tema:process.env.REQUESTED_THEME?.trim()||learning,sinopsis:`${hero} y Tinkie visitan ${place}, resuelven una dificultad con calma y practican ${value}.`,imagen:'',palabra_clave:{palabra:word,silabas:syllables,definicion:definition,ejemplo_cuento:`${hero} usó «${word}» para explicar una idea importante.`,ejemplo_cotidiano:`Puedes practicar ${word} durante una tarea o un juego acompañado.`,reto:`Busca hoy una ocasión segura para practicar ${word}.`,pregunta:q(`¿Qué significa «${word}»?`,[definition,'Hacer todo con prisa','Evitar escuchar'],0,definition)},paginas:pages,narracion:{formato:'audio/ogg; codecs=opus',voces:{narradora:'cálida y tranquila'},tono_por_pagina:pages.map((_,i)=>i===0?'curioso':i===pages.length-1?'reflexivo':'tranquilo'),audio_por_pagina:pages.map(()=>null)},preguntas:[q('¿Qué descubrieron al comenzar?',[discovery,'Una carrera sin reglas','Un premio inesperado'],0,`Descubrieron ${discovery}.`),q('¿Cómo avanzó el equipo?',['Sin mirar',solution,'Abandonando la misión'],1,`El equipo ${solution}.`),q('¿Qué aprendieron?',['Que siempre hay que competir','Que escuchar no sirve',learning],2,learning)]};
if(dryRun){console.log(`Prueba correcta: «${story.titulo}» (${min}-${max} años).`);process.exit(0);}
const filename=`${id}.json`;
await writeFile(resolve(directory,filename),`${JSON.stringify(story,null,2)}\n`,'utf8');
catalog.push({id,titulo:story.titulo,nivel_lector:level,edad_min:min,edad_max:max,valor:value,serie:story.serie,episodio:episode,genero:story.genero,tema:story.tema,sinopsis:story.sinopsis,palabra_clave:word,imagen:'',archivo:filename});
catalog.sort((a,b)=>a.edad_min-b.edad_min||a.episodio-b.episodio);
await writeFile(indexPath,`${JSON.stringify(catalog,null,2)}\n`,'utf8');
console.log(`Cuento semanal creado localmente: ${story.titulo} (${filename}).`);
