import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const directory=resolve('content/historias');
const existingIds=['el-mapa-de-las-palabras-perdidas','el-faro-de-las-voces-valientes','tinkie-y-el-jardin-de-sentimientos-3'];
const companions=['Roki','Hilito','Turbo','Pepito','Mía','Lumo'];
const themes=[
  ['huevo-dinosaurio','El huevo que hacía toc toc','huella',['hue','lla'],'curiosidad','el valle de los dinosaurios','un huevo con pequeñas huellas alrededor','no sabían quién cuidaba el huevo','observaron las huellas y avisaron a la cuidadora del valle','Mirar con atención ayuda a descubrir sin tocar lo que no conocemos.','una huella','una corona','un tambor'],
  ['mapa-luminoso','El mapa de las tres rutas','orientación',['o','rien','ta','ción'],'planificación','el bosque de los mapas','un mapa con tres caminos de colores','todos querían elegir un camino diferente','compararon las señales y marcaron juntos una ruta segura','Planificar permite avanzar con calma y cambiar el camino si hace falta.','un mapa','una cuchara','una almohada'],
  ['capa-compartida','La capa que ayudaba a todos','cooperación',['co','o','pe','ra','ción'],'cooperación','la plaza de los héroes','una capa enorme que podían usar entre varios','una caja pesada bloqueaba la entrada','sostuvieron la capa como red y movieron la caja en equipo','Ser héroe también significa escuchar y colaborar.','una capa','un cepillo','una taza'],
  ['carrera-pausas','La carrera de las pausas','autocontrol',['au','to','con','trol'],'autocuidado','el circuito de Turbo','un semáforo que enseñaba cuándo parar','Turbo quería correr antes de mirar la luz','respiraron, esperaron el verde y recorrieron la pista por turnos','Hacer una pausa protege el cuerpo y mejora nuestras decisiones.','un semáforo','un libro','un barco'],
  ['concierto-animales','El concierto del bosque','armonía',['ar','mo','ní','a'],'respeto','el bosque sonoro','animales preparando un concierto','cada animal tocaba al mismo tiempo y no podían escucharse','organizaron turnos y dejaron un momento para cada sonido','Escuchar a los demás convierte muchos sonidos en armonía.','un concierto','una carrera','una receta'],
  ['robot-cuerpo','El robot que aprendió a moverse','equilibrio',['e','qui','li','brio'],'conocimiento corporal','el taller de Lumo','un robot que confundía brazos, piernas y manos','el robot no podía seguir una secuencia de movimientos','nombraron cada parte y practicaron despacio frente a un espejo','Conocer el cuerpo ayuda a movernos y expresar lo que necesitamos.','un robot','un pez','una nube'],
  ['nube-emociones','La nube de muchos colores','serenidad',['se','re','ni','dad'],'educación emocional','el jardín del cielo','una nube que cambiaba de color con cada emoción','la nube no sabía explicar por qué se sentía diferente','usaron el semáforo emocional para nombrar y compartir cada sensación','Todas las emociones pueden escucharse sin prisa.','una nube','una bicicleta','un bocadillo'],
  ['casa-ruidos','La casa de los ruidos pequeños','atención',['a','ten','ción'],'atención','la casa de Tinkie','sonidos escondidos en cada habitación','un sonido desconocido inquietaba a los amigos','pararon, escucharon y descubrieron una ventana movida por el viento','Escuchar con atención permite comprender antes de imaginar.','una ventana','un cohete','un patín'],
  ['biblioteca-pistas','La biblioteca de las pistas','estrategia',['es','tra','te','gia'],'aprendizaje','la escuela de Tinkie','un libro con pistas entre sus páginas','una palabra larga detenía la lectura','la separaron en sílabas, pidieron una pista y volvieron a leer','Usar una estrategia hace que una dificultad sea más pequeña.','un libro','un casco','una pala'],
  ['semilla-viajera','La semilla que buscaba hogar','paciencia',['pa','cien','cia'],'cuidado ambiental','el sendero verde','una semilla llevada suavemente por el viento','no encontraban un lugar seguro para plantarla','buscaron tierra, luz y agua antes de preparar su nuevo hogar','La naturaleza crece con tiempo, cuidado y paciencia.','una semilla','una moneda','una pelota'],
  ['estrella-cercana','La estrella que parecía cercana','perspectiva',['pers','pec','ti','va'],'curiosidad científica','el observatorio de Lumo','una estrella brillante vista por el telescopio','parecía pequeña aunque sabían que era enorme','compararon distancias y anotaron nuevas preguntas','Cambiar de perspectiva nos ayuda a comprender mejor lo que vemos.','una estrella','una galleta','una llave'],
  ['faro-marino','El faro de los peces viajeros','dirección',['di','rec','ción'],'orientación','la bahía tranquila','un grupo de peces siguiendo una luz','una nube cubrió el faro y perdieron la dirección','usaron las boyas como pistas hasta que volvió la luz','Las pistas y la calma ayudan cuando perdemos la dirección.','un faro','un columpio','un lápiz'],
  ['merienda-colores','La merienda de cinco colores','variedad',['va','rie','dad'],'hábitos saludables','la cocina de Pepito','una cesta con alimentos de muchos colores','querían preparar una merienda que todos pudieran disfrutar','preguntaron por gustos y necesidades antes de elegir juntos','La variedad y el respeto hacen más agradable compartir la mesa.','una cesta','un tren','un paraguas'],
  ['tren-estaciones','El tren de las cuatro estaciones','secuencia',['se','cuen','cia'],'organización','la estación de aventuras','un tren con vagones desordenados','las paradas aparecían en el orden equivocado','leyeron el recorrido y colocaron las estaciones en secuencia','Ordenar los pasos facilita llegar a una meta.','un tren','una planta','un delfín'],
  ['formas-ciudad','La ciudad de las formas','creatividad',['cre','a','ti','vi','dad'],'creatividad','la ciudad geométrica','piezas redondas, cuadradas y triangulares','faltaba un puente para unir dos barrios','combinaron distintas formas hasta construir un puente firme','La creatividad aparece cuando probamos más de una posibilidad.','un triángulo','una zanahoria','un reloj'],
  ['planeta-numeros','El planeta de los números saltarines','cantidad',['can','ti','dad'],'razonamiento','el planeta Contador','números que saltaban de piedra en piedra','dos grupos no sabían cuál tenía más elementos','contaron señalando uno a uno y compararon las cantidades','Contar con orden ayuda a comparar una cantidad.','cinco piedras','una sola pluma','ningún objeto'],
  ['reloj-rutinas','El reloj que olvidó la mañana','rutina',['ru','ti','na'],'autonomía','la torre del reloj','un reloj con sus momentos del día mezclados','la mañana aparecía después de la noche','ordenaron despertar, asearse, aprender, jugar y descansar','Una rutina flexible nos orienta y deja espacio para las pausas.','un reloj','una montaña','un pulpo'],
  ['burbujas-viajeras','Las burbujas viajeras','higiene',['hi','gie','ne'],'autocuidado','el laboratorio de burbujas','burbujas que señalaban los pasos del lavado','algunos pasos estaban escondidos','recordaron agua, jabón, frotar, aclarar y secar','La higiene es una forma cotidiana de cuidar nuestro cuerpo.','jabón','arena','pintura'],
  ['juego-turnos','El mando de los buenos turnos','acuerdo',['a','cuer','do'],'amistad','la sala de videojuegos','un mando cooperativo para dos jugadores','los dos querían controlar el mismo personaje','crearon un acuerdo para alternar y ayudarse en cada nivel','Un acuerdo justo permite jugar y disfrutar en compañía.','un mando','una escoba','una maceta'],
  ['portal-seguro','El portal de la clave secreta','privacidad',['pri','va','ci','dad'],'seguridad digital','el mundo digital de Tinkie','un portal que pedía datos personales','un premio brillante intentaba apresurarlos','cerraron el mensaje y consultaron a un adulto de confianza','La privacidad se protege parando y pidiendo ayuda.','un portal','una cometa','un bocadillo']
];

const keywordDetails={
  huella:['Marca que deja una persona, un animal o un objeto al pasar.','Las pequeñas huellas indicaban que alguien había caminado alrededor del huevo.','Puedes ver huellas de zapatos después de pisar arena mojada.','Busca una huella segura y cuenta qué crees que la dejó.'],
  orientación:['Capacidad de reconocer dónde estamos y hacia dónde debemos ir.','El mapa ayudó al equipo a mantener la orientación durante el recorrido.','Usas la orientación cuando sigues señales para llegar a un lugar.','Describe un camino sencillo usando derecha, izquierda y adelante.'],
  cooperación:['Acción de trabajar con otras personas para alcanzar una meta común.','Mover la caja fue posible gracias a la cooperación de todo el equipo.','Cooperas cuando repartes una tarea y cumples tu parte.','Ayuda hoy en una tarea pequeña y reconoce la aportación de otra persona.'],
  autocontrol:['Capacidad de detener un impulso y elegir una acción segura.','Turbo mostró autocontrol al esperar la luz verde antes de correr.','Practicas autocontrol cuando esperas tu turno aunque tengas muchas ganas de empezar.','Haz una pausa, respira dos veces y elige tu siguiente paso.'],
  armonía:['Equilibrio agradable entre sonidos, ideas o personas.','Los animales lograron armonía cuando escucharon cada instrumento por turnos.','Hay armonía cuando un grupo se escucha y trabaja sin tapar la voz de nadie.','Escucha tres sonidos cercanos y descríbelos por separado.'],
  equilibrio:['Capacidad de mantener estabilidad al mover el cuerpo o tomar decisiones.','El robot practicó equilibrio mientras aprendía la secuencia de movimientos.','Usas el equilibrio al caminar despacio sobre una línea.','Camina cinco pasos lentos sobre una línea imaginaria.'],
  serenidad:['Estado de calma que ayuda a pensar con claridad.','La nube recuperó la serenidad al nombrar lo que sentía.','Puedes buscar serenidad respirando y hablando con alguien de confianza.','Respira lentamente y nombra cómo te sientes ahora.'],
  atención:['Capacidad de concentrarse en una señal o tarea durante un momento.','La atención permitió descubrir que el ruido venía de la ventana.','Usas la atención cuando escuchas una instrucción corta antes de comenzar.','Escucha durante diez segundos y nombra dos sonidos.'],
  estrategia:['Plan o conjunto de pasos pensado para resolver una dificultad.','Separar la palabra en sílabas fue una estrategia de lectura.','Puedes usar una estrategia al dividir una tarea grande en pasos pequeños.','Elige una tarea y escribe o di sus dos primeros pasos.'],
  paciencia:['Capacidad de esperar y continuar sin apresurarse.','El equipo tuvo paciencia mientras buscaba el mejor lugar para la semilla.','Practicas paciencia cuando das tiempo a algo que todavía está creciendo.','Espera un minuto observando algo y cuenta qué cambios notas.'],
  perspectiva:['Forma particular de observar o comprender una situación.','El telescopio cambió la perspectiva que tenían de la estrella.','Escuchar otra opinión puede darte una perspectiva diferente.','Mira un objeto desde dos lugares y explica qué cambia.'],
  dirección:['Camino o rumbo que seguimos para llegar a un lugar.','Las boyas ayudaron a los peces a recuperar la dirección.','Una flecha puede indicar la dirección correcta.','Da una indicación usando las palabras adelante y derecha.'],
  variedad:['Conjunto de cosas diferentes entre sí.','La cesta ofrecía variedad de colores y alimentos.','Hay variedad cuando eliges objetos de distintos tamaños o colores.','Encuentra tres objetos diferentes y explica en qué cambian.'],
  secuencia:['Conjunto de pasos colocados en un orden.','La secuencia correcta permitió ordenar las estaciones del tren.','Seguir una receta requiere respetar una secuencia.','Ordena tres acciones que haces al comenzar el día.'],
  creatividad:['Capacidad de imaginar y probar ideas nuevas.','La creatividad ayudó a construir el puente con varias formas.','Usas creatividad cuando encuentras más de una manera de dibujar o construir algo.','Inventa dos usos seguros para una caja vacía.'],
  cantidad:['Número de elementos que hay en un grupo.','Contaron uno a uno para comparar la cantidad de piedras.','Puedes conocer una cantidad contando cada objeto una sola vez.','Agrupa cinco objetos y comprueba la cantidad señalándolos.'],
  rutina:['Conjunto de acciones que solemos realizar en un orden conocido.','Ordenar los momentos del día ayudó al reloj a recuperar su rutina.','Preparar la mochila cada tarde puede formar parte de una rutina.','Elige tres pasos de tu rutina y colócalos en orden.'],
  higiene:['Hábitos que mantienen limpios y cuidados el cuerpo y los espacios.','Las burbujas recordaron al equipo los pasos de higiene de manos.','Lavarse las manos antes de comer es un hábito de higiene.','Explica en orden cómo te lavas las manos.'],
  acuerdo:['Decisión aceptada por dos o más personas.','El acuerdo permitió que ambos jugadores usaran el mando por turnos.','Puedes llegar a un acuerdo para compartir un juego.','Propón un acuerdo sencillo para repartir turnos.'],
  privacidad:['Derecho y cuidado de mantener protegidos nuestros datos personales.','El equipo protegió su privacidad al no compartir la clave.','Cuidar tu nombre completo y tus contraseñas protege tu privacidad.','Nombra a un adulto de confianza al que pedirías ayuda ante un mensaje extraño.']
};
const featuredImages={
  'huevo-dinosaurio':'images/mini/cuentos/roki-huevo-luminoso.png',
  'nube-emociones':'images/stories/featured/nube-emociones.jpg',
  'estrella-cercana':'images/stories/featured/estrella-cercana.jpg',
  'faro-marino':'images/stories/featured/faro-marino.jpg',
  'formas-ciudad':'images/stories/featured/formas-ciudad.jpg',
  'portal-seguro':'images/stories/featured/portal-seguro.jpg',
  'juego-turnos':'images/stories/featured/juego-turnos.jpg'
};

const ranges=[
  {key:'inicial',level:'inicial',min:6,max:8,start:101,count:20},
  {key:'intermedio',level:'intermedio',min:8,max:10,start:201,count:20},
  {key:'avanzado',level:'avanzado',min:10,max:12,start:4,count:17,offset:3}
];

const sentenceCase=value=>value.charAt(0).toUpperCase()+value.slice(1);
const makePages=(theme,hero,level)=>{
  const [, ,keyword,, ,place,discovery,challenge,solution,learning]=theme;
  const destination=place.startsWith('el ')?`al ${place.slice(3)}`:`a ${place}`;
  const base=[
    `${hero} y Tinkie llegaron ${destination}. Allí encontraron ${discovery}.`,
    `${sentenceCase(challenge)}. Los amigos se detuvieron para observar antes de actuar.`,
    `Tinkie propuso escuchar todas las ideas. ${hero} recordó la palabra «${keyword}» y la repitió despacio.`,
    `${sentenceCase(solution)}. Cada paso fue pequeño, claro y seguro.`,
    `Al terminar, comprobaron juntos el resultado y celebraron el esfuerzo de todo el equipo.`,
    `${learning} ${hero} decidió usar este aprendizaje en su próxima aventura.`
  ];
  if(level!=='inicial') base.splice(3,0,`Antes de continuar, hicieron un plan con dos opciones. Eligieron la más tranquila y dejaron preparada una alternativa.`);
  if(level==='avanzado') base.splice(5,0,`Una nueva pista cambió parte del plan. En vez de apresurarse, explicaron lo que pensaban, revisaron la información y ajustaron su estrategia.`);
  return base;
};

const makeQuestion=(enunciado,correct,distractors,index=0,explanation='La respuesta aparece en la historia.')=>({
  enunciado,opciones:index===0?[correct,...distractors]:index===1?[distractors[0],correct,distractors[1]]:[...distractors,correct],correcta:index,explicacion:explanation
});

const makeStory=(theme,range,index)=>{
  const [slug,title,keyword,syllables,value,place,discovery,challenge,solution,learning,answer,...distractors]=theme;
  const hero=companions[index%companions.length];
  const id=`${range.key}-${slug}`;
  const episode=range.start+index;
  const [definition,storyExample,dailyExample,challengePrompt]=keywordDetails[keyword];
  return {
    id,titulo:title,nivel_lector:range.level,edad_min:range.min,edad_max:range.max,valor:value,
    serie:'Expediciones de Tinkie',episodio:episode,genero:index%3===0?'aventura amable':index%3===1?'misterio educativo':'fantasía educativa',
    tema:learning.replace(/\.$/,''),sinopsis:`${hero} y Tinkie visitan ${place}, encuentran ${discovery} y practican ${value} para resolver una dificultad con calma.`,imagen:featuredImages[slug]||'',
    palabra_clave:{palabra:keyword,silabas:syllables,definicion:definition,ejemplo_cuento:storyExample,ejemplo_cotidiano:dailyExample,reto:challengePrompt,pregunta:makeQuestion(`¿Qué significa «${keyword}»?`,definition,['Una recompensa que aparece sin esfuerzo','Una orden que debe obedecerse sin preguntar'],0,definition)},
    paginas:makePages(theme,hero,range.level),
    narracion:{formato:'audio/ogg; codecs=opus',voces:{narradora:'cálida y tranquila'},tono_por_pagina:makePages(theme,hero,range.level).map((_,page)=>page===0?'curioso':page===makePages(theme,hero,range.level).length-1?'reflexivo':'tranquilo'),audio_por_pagina:makePages(theme,hero,range.level).map(()=>null)},
    preguntas:[
      makeQuestion('¿Qué pista importante observaron?',answer,distractors,0,`La historia cuenta que encontraron ${discovery}.`),
      makeQuestion('¿Cómo avanzó el equipo?',sentenceCase(solution),['Actuaron sin escuchar a nadie','Abandonaron la misión'],1,`Esa acción les permitió resolver la dificultad juntos.`),
      makeQuestion('¿Qué aprendizaje se llevaron?',learning.replace(/\.$/,''),['Ganar siempre es lo único importante','Pedir ayuda hace más difícil una misión'],2,learning)
    ]
  };
};

const stories=[];
for(const range of ranges){
  const selected=themes.slice(range.offset||0,(range.offset||0)+range.count);
  selected.forEach((theme,index)=>stories.push(makeStory(theme,range,index)));
}

for(const story of stories) await writeFile(resolve(directory,`${story.id}.json`),`${JSON.stringify(story,null,2)}\n`,'utf8');

const existing=[];
for(const id of existingIds) existing.push(JSON.parse(await readFile(resolve(directory,`${id}.json`),'utf8')));
const catalog=[...stories,...existing].sort((a,b)=>a.edad_min-b.edad_min||a.episodio-b.episodio).map(story=>({
  id:story.id,titulo:story.titulo,nivel_lector:story.nivel_lector,edad_min:story.edad_min,edad_max:story.edad_max,valor:story.valor,serie:story.serie,episodio:story.episodio,genero:story.genero,tema:story.tema,sinopsis:story.sinopsis,palabra_clave:story.palabra_clave.palabra,imagen:story.imagen||'',archivo:`${story.id}.json`
}));
await writeFile(resolve(directory,'index.json'),`${JSON.stringify(catalog,null,2)}\n`,'utf8');
console.log(`Catálogo generado: ${catalog.length} cuentos.`);
