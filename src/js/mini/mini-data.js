export const miniWords = [
  {id:'dino', word:'DINO', syllables:['DI','NO'], distractor:'MA', emoji:'🦕', phrase:'El dino camina.'},
  {id:'huevo', word:'HUEVO', syllables:['HUE','VO'], distractor:'SA', emoji:'🥚', phrase:'El huevo brilla.'},
  {id:'mapa', word:'MAPA', syllables:['MA','PA'], distractor:'TO', emoji:'🗺️', phrase:'Roki mira el mapa.'},
  {id:'lava', word:'LAVA', syllables:['LA','VA'], distractor:'RO', emoji:'🌋', phrase:'La lava está lejos.'},
  {id:'cueva', word:'CUEVA', syllables:['CUE','VA'], distractor:'PI', emoji:'🪨', phrase:'Roki entra en la cueva.'}
];

export const miniStories = [
  {
    id:'roki-huevo-luminoso',title:'Roki y el huevo luminoso',emoji:'🥚',keyword:'HUEVO',syllables:['HUE','VO'],
    pages:['Roki camina junto al río. Sus pasos hacen: toc, toc.','Detrás de una roca encuentra un huevo azul y brillante.','Roki no lo toca. Primero llama a Tinkie para pedir ayuda.','Tinkie mira el huevo. Dentro se escucha un suave: pío, pío.','Los dos esperan con calma. Una cría de dinosaurio asoma la cabeza.'],
    question:{text:'¿Qué encontró Roki detrás de la roca?',options:['Un huevo azul','Una pelota roja'],correct:0}
  },
  {
    id:'turbo-mapa-colores',title:'Turbo y el mapa de colores',emoji:'🗺️',keyword:'MAPA',syllables:['MA','PA'],
    pages:['Turbo corre por el bosque, pero se detiene al ver un mapa.','El mapa tiene caminos verdes, amarillos y azules.','Roki propone mirar cada señal antes de escoger una ruta.','Los amigos siguen el camino azul y encuentran un puente tranquilo.','Turbo descubre que observar con calma también es parte de una aventura.'],
    question:{text:'¿Qué camino escogieron los amigos?',options:['El camino azul','El camino rojo'],correct:0}
  }
];
