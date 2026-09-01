import {speak} from '../core/utils.js';
import {store} from '../core/store.js';

const choices=[{word:'MAPA',emoji:'🗺️',correct:true},{word:'DINO',emoji:'🦕',correct:false},{word:'HUEVO',emoji:'🥚',correct:false}];

export function miniSoundScreen() {
  return `<div class="mini-world mini-activity mini-sound"><a class="mini-back" href="#mini">← Volver con Roki</a><p class="mini-label">La cueva de los sonidos</p><div class="mini-picture" aria-hidden="true">👂</div><h1>Escucha el sonido M</h1><button class="mini-listen" type="button" data-sound-model>🔊 Escuchar: mmmm</button><p class="mini-instruction">¿Cuál palabra empieza por M?</p><div class="mini-sound-options">${choices.map(item=>`<button type="button" data-sound-choice="${item.word}"><span>${item.emoji}</span><strong>${item.word}</strong></button>`).join('')}</div><div class="mini-feedback" role="status" aria-live="polite"></div></div>`;
}

export function bindMiniSound() {
  const root=document.querySelector('.mini-sound');if(!root)return;
  root.querySelector('[data-sound-model]').addEventListener('click',()=>speak('Mmmm. Mapa empieza por M.','kiwi'));
  root.querySelectorAll('[data-sound-choice]').forEach(button=>button.addEventListener('click',()=>{
    const correct=button.dataset.soundChoice==='MAPA',feedback=root.querySelector('.mini-feedback');
    feedback.className=`mini-feedback ${correct?'success':'try'}`;
    feedback.innerHTML=correct?'<strong>¡Mmmm, mapa!</strong> Encontraste el sonido M. 🥚':'<strong>Buen intento.</strong> Escucha: mmmm, mapa.';
    if(correct){const state=store.get(),completed=new Set(state.mini?.completed||[]);completed.add('sound-m');state.mini={...(state.mini||{}),completed:[...completed],eggs:completed.size};store.save(state);feedback.insertAdjacentHTML('beforeend','<div class="mini-next-actions"><a class="mini-button" href="#mini">Volver al mapa →</a></div>');}
  }));
}
