// Banco provisional creado para que la app sea funcional. Sustituir por la transcripción
// literal de programa-lectoescritura-tarjetas.pdf cuando el archivo esté disponible.
export const sourceStatus = { exact: false, label: 'Contenido pedagógico provisional · PDF pendiente de adjuntar' };

export const wordCards = [
  ['casa','ca-sa'],['perro','pe-rro'],['loro','lo-ro'],['amigo','a-mi-go'],['juego','jue-go'],
  ['bloque','blo-que'],['mundo','mun-do'],['equipo','e-qui-po'],['respeto','res-pe-to'],['ayuda','a-yu-da'],
  ['valiente','va-lien-te'],['calma','cal-ma'],['pausa','pau-sa'],['seguro','se-gu-ro'],['mensaje','men-sa-je'],
  ['clave','cla-ve'],['adulto','a-dul-to'],['bloquear','blo-que-ar'],['reportar','re-por-tar'],['cuidar','cui-dar'],
  ['escuchar','es-cu-char'],['intentar','in-ten-tar'],['aprender','a-pren-der'],['sonreír','son-re-ír'],['compartir','com-par-tir'],
  ['aventura','a-ven-tu-ra'],['tesoro','te-so-ro'],['misión','mi-sión'],['estrella','es-tre-lla'],['campeón','cam-pe-ón']
].map(([word,syllables],i)=>({id:`w${i+1}`,word,syllables,level:i<10?1:i<20?2:3}));

export const phraseCards = [
 'Mi perro corre feliz.','El loro canta por la mañana.','Construyo una casa con bloques.','Un amigo escucha con respeto.','Puedo pedir ayuda.',
 'Hoy completo una misión corta.','Respiro y vuelvo a intentarlo.','Mi voz también importa.','Compartimos el tesoro en equipo.','Leo despacio y lo consigo.',
 'El aldeano guarda un mapa secreto.','La exploradora abre una puerta azul.','El perro encuentra una pista brillante.','El loro celebra cada pequeño paso.','Ser amable también es ser valiente.',
 'Una contraseña protege mi mundo.','No comparto mis datos personales.','Bloqueo los mensajes que me hacen daño.','Cuento a un adulto lo que ha ocurrido.','Un premio gratis puede ser una trampa.',
 'Antes de pulsar, paro y pienso.','Reportar ayuda a proteger a otros.','Nadie merece burlas en un juego.','Mis errores me ayudan a aprender.','Hago una pausa cuando la necesito.',
 'Invito a jugar a quien está solo.','Pregunto antes de compartir una foto.','El equipo supera el reto con calma.','Cada palabra abre una aventura.','Hoy estoy orgulloso de mi esfuerzo.'
].map((text,i)=>({id:`p${i+1}`,text,level:i<10?1:i<20?2:3}));

export const comprehensionCards = [
 {text:'Leo encontró un cofre. Antes de abrirlo, llamó a su equipo.',question:'¿Qué hizo Leo antes de abrir el cofre?',options:['Llamó a su equipo','Salió del juego','Escondió el mapa'],answer:0},
 {text:'Un mensaje prometía monedas gratis, pero pedía la contraseña.',question:'¿Cuál es la señal de peligro?',options:['Tiene un dibujo','Pide la contraseña','Llega por la tarde'],answer:1},
 {text:'Luna se equivocó dos veces y después pidió una pista.',question:'¿Qué valor mostró Luna?',options:['Perseverancia','Prisa','Enfado'],answer:0},
 {text:'A Nico le escribieron algo cruel. Hizo una captura y se lo contó a su madre.',question:'¿Qué hizo bien?',options:['Respondió con insultos','Lo ocultó','Guardó prueba y pidió ayuda'],answer:2},
 {text:'El perro ladró junto al árbol. Allí estaba la llave dorada.',question:'¿Dónde estaba la llave?',options:['Junto al árbol','En la casa','Bajo el agua'],answer:0},
 {text:'Sara vio a un jugador nuevo solo y lo invitó al equipo.',question:'¿Qué valor practicó?',options:['Empatía','Engaño','Impaciencia'],answer:0},
 {text:'Tomás estaba cansado. Paró cinco minutos y luego terminó.',question:'¿Para qué sirvió la pausa?',options:['Para rendirse','Para cuidarse y continuar','Para perder la misión'],answer:1},
 {text:'Una web copiaba el aspecto del juego, pero la dirección era extraña.',question:'¿Qué conviene hacer?',options:['Cerrar y pedir ayuda','Escribir la clave','Compartir el enlace'],answer:0},
 {text:'El loro dio una pista: la palabra comienza por M y termina por A.',question:'¿Qué palabra puede ser?',options:['Mapa','Perro','Sol'],answer:0},
 {text:'Dos compañeros querían el mismo bloque y decidieron turnarse.',question:'¿Cómo resolvieron el problema?',options:['Discutiendo','Por turnos','Abandonando'],answer:1}
].map((card,i)=>({...card,id:`c${i+1}`}));

export const actionCards = [
 {text:'Da dos pasos y di: «Puedo intentarlo».',icon:'👣'},
 {text:'Toca algo azul y lee la palabra «calma».',icon:'🔵'},
 {text:'Estira los brazos como alas y di «loro».',icon:'🦜'},
 {text:'Haz una respiración lenta y cuenta hasta cuatro.',icon:'🌬️'},
 {text:'Dibuja un bloque en el aire con el dedo.',icon:'🧱'},
 {text:'Choca los cinco contigo: ¡misión cumplida!',icon:'✋'}
].map((card,i)=>({...card,id:`a${i+1}`}));
