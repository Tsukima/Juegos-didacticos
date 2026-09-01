import {miniWords} from '../mini/mini-data.js';
import {speak,escapeHtml} from '../core/utils.js';
import {store} from '../core/store.js';
import {readingCheckMarkup,bindReadingCheck} from '../core/reading-check.js';

export function miniGameScreen(id) {
  const word=miniWords.find(item=>item.id===id)||miniWords[0];
  return `<div class="mini-world mini-activity" data-mini-word="${word.id}"><a class="mini-back" href="#mini">← Volver con Roki</a><p class="mini-label">Misión de sílabas</p><div class="mini-picture" aria-hidden="true">${word.emoji}</div><h1>Construye: ${word.word}</h1><button class="mini-listen" type="button" data-listen="${escapeHtml(word.word)}">🔊 Escuchar: ${word.word}</button><p class="mini-instruction">Toca las dos sílabas en orden.</p><div class="mini-slots" aria-label="Palabra en construcción"><span></span><span></span></div><div class="mini-syllables">${[...word.syllables,word.distractor].map(value=>`<button type="button" data-syllable="${value}">${value}</button>`).join('')}</div><div class="mini-feedback" role="status" aria-live="polite"></div><div class="mini-reading" hidden>${readingCheckMarkup('Ahora leemos con Roki',word.phrase)}</div></div>`;
}

export function bindMiniGame() {
  const root=document.querySelector('[data-mini-word]');
  if (!root) return;
  const word=miniWords.find(item=>item.id===root.dataset.miniWord)||miniWords[0];
  const chosen=[];
  root.querySelector('[data-listen]')?.addEventListener('click',()=>speak(word.word,'kiwi'));
  root.querySelectorAll('[data-syllable]').forEach(button=>button.addEventListener('click',()=>{
    if (chosen.length>=2) return;
    chosen.push(button.dataset.syllable); button.disabled=true;
    root.querySelectorAll('.mini-slots span')[chosen.length-1].textContent=button.dataset.syllable;
    if (chosen.length<2) return;
    const correct=chosen.join('')===word.syllables.join('');
    const feedback=root.querySelector('.mini-feedback');
    if (correct) {
      feedback.innerHTML='<strong>¡Lo construiste!</strong> Roki encontró un huevo. 🥚';
      feedback.className='mini-feedback success';
      const state=store.get(),completed=new Set(state.mini?.completed||[]); completed.add(`word-${word.id}`); state.mini={...(state.mini||{}),completed:[...completed],eggs:completed.size}; store.save(state);
      const reading=root.querySelector('.mini-reading'); reading.hidden=false;
      bindReadingCheck(reading,word.phrase,`mini-${word.id}`);
      const topicWords=miniWords.filter(item=>item.topic===word.topic),index=topicWords.findIndex(item=>item.id===word.id),next=topicWords[index+1];
      reading.insertAdjacentHTML('afterend',`<div class="mini-next-actions"><a class="mini-button" href="${next?`#mini-juego/${next.id}`:`#mini-tema/${word.topic}`}">${next?'Siguiente palabra →':'Volver al tema 🥚'}</a></div>`);
    } else {
      feedback.innerHTML='<strong>Casi.</strong> Escuchemos otra vez y probemos con calma.';
      feedback.className='mini-feedback try';
      setTimeout(()=>{chosen.splice(0);root.querySelectorAll('.mini-slots span').forEach(slot=>slot.textContent='');root.querySelectorAll('[data-syllable]').forEach(item=>item.disabled=false);},900);
    }
  }));
}
