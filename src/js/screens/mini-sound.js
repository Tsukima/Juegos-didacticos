import {speak} from '../core/utils.js';
import {store} from '../core/store.js';
import {miniSoundLessons,miniWords} from '../mini/mini-data.js';

const wordByName=name=>miniWords.find(item=>item.word===name);

export function miniSoundScreen(id) {
  const lesson=miniSoundLessons[id]||miniSoundLessons.m;
  return `<div class="mini-world mini-activity mini-sound" data-sound-lesson="${id||'m'}"><a class="mini-back" href="#mini">← Volver con Roki</a><p class="mini-label">La cueva de los sonidos</p><div class="mini-picture" aria-hidden="true">👂</div><h1>Escucha el sonido ${lesson.letter}</h1><button class="mini-listen" type="button" data-sound-model>🔊 Escuchar: ${lesson.model}</button><p class="mini-instruction">¿Cuál palabra empieza por ${lesson.letter}?</p><div class="mini-sound-options">${lesson.choices.map(name=>{const word=wordByName(name);return `<button type="button" data-sound-choice="${name}"><span>${word?.emoji||'⭐'}</span><strong>${name}</strong></button>`}).join('')}</div><div class="mini-feedback" role="status" aria-live="polite"></div></div>`;
}

export function bindMiniSound() {
  const root=document.querySelector('.mini-sound');if(!root)return;
  const lessonId=root.dataset.soundLesson,lesson=miniSoundLessons[lessonId]||miniSoundLessons.m;
  root.querySelector('[data-sound-model]').addEventListener('click',()=>speak(`${lesson.model}. Escucha otra vez: ${lesson.model}.`,'kiwi'));
  root.querySelectorAll('[data-sound-choice]').forEach(button=>button.addEventListener('click',()=>{
    const correct=button.dataset.soundChoice===lesson.correct,feedback=root.querySelector('.mini-feedback');
    feedback.className=`mini-feedback ${correct?'success':'try'}`;
    feedback.innerHTML=correct?`<strong>¡${lesson.model}!</strong> Encontraste el sonido ${lesson.letter}. 🥚`:`<strong>Buen intento.</strong> Escucha otra vez: ${lesson.model}.`;
    if(correct){const state=store.get(),completed=new Set(state.mini?.completed||[]);completed.add(`sound-${lessonId}`);state.mini={...(state.mini||{}),completed:[...completed],eggs:completed.size};store.save(state);feedback.insertAdjacentHTML('beforeend','<div class="mini-next-actions"><a class="mini-button" href="#mini">Volver a los temas →</a></div>');}
  }));
}
