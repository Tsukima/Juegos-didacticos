import {characters,characterPortrait} from '../characters/characters.js';
import {store} from '../core/store.js';

const moods=[
  {id:'verde',light:'🟢',label:'Estoy listo',hint:'Me siento tranquilo, curioso o con energía para comenzar.',companions:['turbo','mia','kiwi'],message:'¡Luz verde! Podemos explorar, descubrir pistas o empezar una misión.'},
  {id:'amarillo',light:'🟡',label:'Necesito ir despacio',hint:'Tengo dudas, estoy distraído o necesito una pista.',companions:['hilito','kiwi','lumo'],message:'Luz amarilla: bajamos el ritmo, respiramos y elegimos un paso pequeño.'},
  {id:'rojo',light:'🔴',label:'Necesito parar',hint:'Estoy enfadado, cansado, triste o todo se siente demasiado.',companions:['roki','coco','lumo'],message:'Luz roja: paramos. No hay que terminar ahora; primero buscamos calma y compañía.'}
];

const stories={
  kiwi:{origin:'Tinkie aprendió a volar siguiendo rutas cortas entre los árboles.',reason:'Está en el equipo para escuchar, celebrar los intentos y recordar que equivocarse también enseña.'},
  coco:{origin:'Pepito acompañaba a los exploradores que se sentían solos en caminos nuevos.',reason:'Está en Tinkie para ofrecer compañía fiel y hacer que pedir ayuda resulte más fácil.'},
  lumo:{origin:'Lumo descubrió que observar la Luna con paciencia revela detalles que la prisa esconde.',reason:'Está en el equipo para aportar serenidad y avanzar al ritmo que cada niño necesita.'},
  mia:{origin:'Mía convertía cada ruido, letra y huella en una pista para investigar.',reason:'Está en Tinkie para despertar la curiosidad y transformar las dudas en pequeños misterios.'},
  roki:{origin:'Roki es un pequeño kaiju que aprendió que la verdadera fuerza también sabe detenerse y cuidar.',reason:'Está en el equipo para proteger, dar seguridad y ayudar a expresar emociones grandes sin miedo.'},
  hilito:{origin:'Hilito construía puentes suaves para que los animales pequeños pudieran cruzar juntos.',reason:'Está en Tinkie para enseñar cooperación, turnos y soluciones amables.'},
  turbo:{origin:'Turbo quería llegar siempre primero, hasta que descubrió que frenar y mirar también forma parte de la aventura.',reason:'Está en el equipo para canalizar la energía, moverse con seguridad y celebrar el autocontrol.'}
};

const card=key=>{const character=characters[key],story=stories[key];return `<article class="team-character" data-team-character="${key}"><div class="team-character-icon">${characterPortrait(key, 'team-character-image')}</div><div><span>${character.role}</span><h3>${character.name}</h3><p><strong>Su historia:</strong> ${story.origin}</p><p><strong>Su misión:</strong> ${story.reason}</p><button class="button secondary small" type="button" data-pick-companion="${key}">Elegir a ${character.name}</button></div></article>`};

export function teamScreen(){
  const state=store.get(),selected=state.profile?.currentEmotion;
  const required=sessionStorage.getItem('emotion-check-required')==='1';
  return `<div class="team-world"><section class="team-hero"><div><p class="eyebrow">${required?'Parada antes de comenzar':'Equipo Tinkie'}</p><h1>¿Cómo está tu motor hoy?</h1><p>Antes de empezar, mira tu semáforo interior. Cualquier color está bien.</p></div><div class="f1-car" aria-hidden="true">🏎️</div></section>
    <section class="emotion-pit"><div class="emotion-heading"><div><span class="pit-label">Parada en boxes</span><h2>El semáforo de las emociones</h2><p>Elige el color que más se parece a cómo te sientes ahora.</p></div><div class="f1-lights" aria-label="Semáforo de Fórmula 1"><i class="red"></i><i class="yellow"></i><i class="green"></i></div></div>
    <div class="mood-grid">${moods.map(mood=>`<button type="button" class="mood-card ${selected===mood.id?'selected':''}" data-mood="${mood.id}"><span>${mood.light}</span><strong>${mood.label}</strong><small>${mood.hint}</small></button>`).join('')}</div><div class="pit-result" role="status" aria-live="polite">${selected?resultMarkup(moods.find(mood=>mood.id===selected)): '<p>Cuando elijas un color, el equipo te recomendará compañeros.</p>'}</div></section>
    <section class="team-section"><p class="eyebrow">Conoce al equipo</p><h2>Siete compañeros, siete formas de ayudar</h2><p>Cada personaje llegó a Tinkie por una razón diferente.</p><div class="team-grid">${Object.keys(stories).map(card).join('')}</div></section>
    <p class="team-adult-note">Para la persona adulta: este semáforo facilita una conversación breve sobre el estado emocional. No sustituye una valoración profesional.</p></div>`;
}

function resultMarkup(mood){return `<div><strong>${mood.message}</strong><span>Compañeros recomendados:</span><div>${mood.companions.map(key=>`<button type="button" data-pick-companion="${key}">${characterPortrait(key, 'recommendation-character-image')} ${characters[key].name}</button>`).join('')}</div></div>`}

export function bindTeam(){
  const root=document.querySelector('.team-world'); if(!root)return;
  root.querySelectorAll('[data-mood]').forEach(button=>button.addEventListener('click',()=>{
    const mood=moods.find(item=>item.id===button.dataset.mood),state=store.get();
    state.profile={...state.profile,currentEmotion:mood.id};store.save(state);
    root.querySelectorAll('[data-mood]').forEach(item=>item.classList.toggle('selected',item===button));
    root.querySelector('.pit-result').innerHTML=resultMarkup(mood);bindPicks(root);
  }));
  bindPicks(root);
}

function bindPicks(root){root.querySelectorAll('[data-pick-companion]').forEach(button=>{if(button.dataset.bound)return;button.dataset.bound='1';button.addEventListener('click',()=>{const state=store.get(),key=button.dataset.pickCompanion;state.profile={...state.profile,mascot:key};state.puzzle={collection:`${key}-01`,pieces:state.puzzle?.pieces||[]};store.save(state);document.documentElement.dataset.companion=key;root.querySelectorAll('[data-team-character]').forEach(card=>card.classList.toggle('chosen',card.dataset.teamCharacter===key));button.textContent=`✓ ${characters[key].name} te acompaña`;if(sessionStorage.getItem('emotion-check-required')==='1'){const destination=sessionStorage.getItem('emotion-check-return')||(state.profile.learningPath==='mini'?'#mini':'#inicio');sessionStorage.setItem('emotion-check-complete','1');sessionStorage.removeItem('emotion-check-required');sessionStorage.removeItem('emotion-check-return');setTimeout(()=>{location.hash=destination},350);}});});}
