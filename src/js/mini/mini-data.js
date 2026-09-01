export const miniWords = [
  {id:'dino',topic:'dinosaurios',word:'DINO',syllables:['DI','NO'],distractor:'MA',emoji:'🦕',phrase:'El dino camina.'},
  {id:'huevo',topic:'dinosaurios',word:'HUEVO',syllables:['HUE','VO'],distractor:'SA',emoji:'🥚',phrase:'El huevo brilla.'},
  {id:'lava',topic:'dinosaurios',word:'LAVA',syllables:['LA','VA'],distractor:'RO',emoji:'🌋',phrase:'La lava está lejos.'},
  {id:'cueva',topic:'dinosaurios',word:'CUEVA',syllables:['CUE','VA'],distractor:'PI',emoji:'🪨',phrase:'Roki entra en la cueva.'},
  {id:'roca',topic:'dinosaurios',word:'ROCA',syllables:['RO','CA'],distractor:'ME',emoji:'🪨',phrase:'Roki mira la roca.'},
  {id:'mapa',topic:'aventuras',word:'MAPA',syllables:['MA','PA'],distractor:'TO',emoji:'🗺️',phrase:'Roki mira el mapa.'},
  {id:'ruta',topic:'aventuras',word:'RUTA',syllables:['RU','TA'],distractor:'MI',emoji:'🧭',phrase:'La ruta es segura.'},
  {id:'puente',topic:'aventuras',word:'PUENTE',syllables:['PUEN','TE'],distractor:'LA',emoji:'🌉',phrase:'Cruzamos el puente.'},
  {id:'cofre',topic:'aventuras',word:'COFRE',syllables:['CO','FRE'],distractor:'NA',emoji:'🧰',phrase:'El cofre tiene pistas.'},
  {id:'isla',topic:'aventuras',word:'ISLA',syllables:['IS','LA'],distractor:'PO',emoji:'🏝️',phrase:'La isla está cerca.'},
  {id:'capa',topic:'heroes',word:'CAPA',syllables:['CA','PA'],distractor:'RI',emoji:'🦸',phrase:'La capa vuela.'},
  {id:'salto',topic:'heroes',word:'SALTO',syllables:['SAL','TO'],distractor:'ME',emoji:'🕸️',phrase:'Hilito da un salto.'},
  {id:'ayuda',topic:'heroes',word:'AYUDA',syllables:['A','YU','DA'],distractor:'FO',emoji:'🤝',phrase:'Ayudar nos hace fuertes.'},
  {id:'escudo',topic:'heroes',word:'ESCUDO',syllables:['ES','CU','DO'],distractor:'MA',emoji:'🛡️',phrase:'El escudo protege.'},
  {id:'equipo',topic:'heroes',word:'EQUIPO',syllables:['E','QUI','PO'],distractor:'SA',emoji:'🫶',phrase:'Somos un equipo.'},
  {id:'rayo',topic:'velocidad',word:'RAYO',syllables:['RA','YO'],distractor:'MI',emoji:'⚡',phrase:'El rayo ilumina.'},
  {id:'meta',topic:'velocidad',word:'META',syllables:['ME','TA'],distractor:'RO',emoji:'🏁',phrase:'Turbo llega a la meta.'},
  {id:'pista',topic:'velocidad',word:'PISTA',syllables:['PIS','TA'],distractor:'LU',emoji:'🛤️',phrase:'La pista tiene curvas.'},
  {id:'paso',topic:'velocidad',word:'PASO',syllables:['PA','SO'],distractor:'NI',emoji:'👟',phrase:'Vamos paso a paso.'},
  {id:'freno',topic:'velocidad',word:'FRENO',syllables:['FRE','NO'],distractor:'CA',emoji:'🛑',phrase:'Turbo usa el freno.'}
];

export const miniStories = [
  {id:'roki-huevo-luminoso',topic:'dinosaurios',title:'Roki y el huevo luminoso',emoji:'🥚',keyword:'HUEVO',syllables:['HUE','VO'],pages:['Roki camina junto al río. Sus pasos hacen: toc, toc.','Detrás de una roca encuentra un huevo azul y brillante.','Roki no lo toca. Primero llama a Tinkie para pedir ayuda.','Tinkie mira el huevo. Dentro se escucha un suave: pío, pío.','Los dos esperan con calma. Una cría de dinosaurio asoma la cabeza.'],question:{text:'¿Qué encontró Roki detrás de la roca?',options:['Un huevo azul','Una pelota roja'],correct:0}},
  {id:'turbo-mapa-colores',topic:'aventuras',title:'Turbo y el mapa de colores',emoji:'🗺️',keyword:'MAPA',syllables:['MA','PA'],pages:['Turbo corre por el bosque, pero se detiene al ver un mapa.','El mapa tiene caminos verdes, amarillos y azules.','Roki propone mirar cada señal antes de escoger una ruta.','Los amigos siguen el camino azul y encuentran un puente tranquilo.','Turbo descubre que observar con calma también es parte de una aventura.'],question:{text:'¿Qué camino escogieron los amigos?',options:['El camino azul','El camino rojo'],correct:0}},
  {id:'hilito-puente-amable',topic:'heroes',title:'Hilito y el puente amable',emoji:'🕸️',keyword:'AYUDA',syllables:['A','YU','DA'],pages:['Hilito ve que una tortuga quiere cruzar un pequeño charco.','Con su red prepara un puente firme y suave.','Roki sostiene una punta mientras Tinkie mira desde arriba.','La tortuga cruza despacio y da las gracias a todo el equipo.','Hilito aprende que ayudar también es una forma de ser héroe.'],question:{text:'¿Para quién construyeron el puente?',options:['Para una tortuga','Para un pez'],correct:0}},
  {id:'turbo-carrera-tranquila',topic:'velocidad',title:'Turbo y la carrera tranquila',emoji:'🏁',keyword:'META',syllables:['ME','TA'],pages:['Turbo prepara sus zapatos para una carrera por el parque.','Al comenzar, corre muy rápido y casi olvida mirar la pista.','Tinkie le recuerda que puede respirar y observar cada curva.','Turbo baja la velocidad, usa el freno y sigue paso a paso.','Llega a la meta contento porque corrió de forma segura.'],question:{text:'¿Qué hizo Turbo antes de seguir?',options:['Respiró y miró la pista','Cerró los ojos'],correct:0}}
];

export const miniSoundLessons={
  d:{letter:'D',model:'dddd, dino',correct:'DINO',choices:['DINO','MAPA','HUEVO']},
  m:{letter:'M',model:'mmmm, mapa',correct:'MAPA',choices:['MAPA','DINO','HUEVO']},
  a:{letter:'A',model:'aaaa, ayuda',correct:'AYUDA',choices:['AYUDA','CAPA','SALTO']},
  r:{letter:'R',model:'rrrr, rayo',correct:'RAYO',choices:['RAYO','META','PISTA']}
};

export const miniTopics=[
  {id:'dinosaurios',emoji:'🦕',title:'Mundo dinosaurio',subtitle:'Huevos, cuevas y volcanes',sound:'d',story:'roki-huevo-luminoso',offline:'Camina como un dinosaurio y di DI · NO.',wordIds:['dino','huevo','lava','cueva','roca']},
  {id:'aventuras',emoji:'🗺️',title:'Mapas y aventuras',subtitle:'Rutas, puentes e islas',sound:'m',story:'turbo-mapa-colores',offline:'Dibuja una ruta sencilla y señala dónde empieza.',wordIds:['mapa','ruta','puente','cofre','isla']},
  {id:'heroes',emoji:'🦸',title:'Héroes que ayudan',subtitle:'Capas, redes y trabajo en equipo',sound:'a',story:'hilito-puente-amable',offline:'Haz una acción amable y di A · YU · DA.',wordIds:['capa','salto','ayuda','escudo','equipo']},
  {id:'velocidad',emoji:'⚡',title:'Velocidad segura',subtitle:'Pistas, metas y autocuidado',sound:'r',story:'turbo-carrera-tranquila',offline:'Corre cinco pasos, frena y respira con calma.',wordIds:['rayo','meta','pista','paso','freno']}
];
