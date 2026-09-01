import {miniStories} from '../mini/mini-data.js';
import {speak} from '../core/utils.js';
import {store} from '../core/store.js';

export function miniStoryScreen(id) {
  const story=miniStories.find(item=>item.id===id)||miniStories[0];
  const iconsByTopic={dinosaurios:['🌿','🥚','🦜','👂','🐣'],aventuras:['🌲','🗺️','🦕','🌉','⭐'],heroes:['🕸️','🌊','🦕','🐢','⭐'],velocidad:['👟','⚡','🦜','🛑','🏁']};
  const pageIcons=iconsByTopic[story.topic]||iconsByTopic.dinosaurios;
  return `<div class="mini-world mini-story" data-mini-story="${story.id}"><a class="mini-back" href="#mini-tema/${story.topic}">← Volver al tema</a><p class="mini-label">Cuento pequeño</p><h1>${story.title}</h1><div class="mini-keyword"><span>Palabra nueva</span><strong>${story.syllables.join(' · ')}</strong><button type="button" data-story-speak="${story.keyword}">🔊 Escuchar</button></div><div class="mini-story-pages">${story.pages.map((page,index)=>`<article><span>${index+1}</span><div aria-hidden="true">${pageIcons[index]}</div><p>${page}</p><button type="button" data-story-speak="${page}">🔊 Leer conmigo</button></article>`).join('')}</div><section class="mini-question"><h2>${story.question.text}</h2>${story.question.options.map((option,index)=>`<button type="button" data-mini-answer="${index}">${option}</button>`).join('')}<p role="status" aria-live="polite"></p></section></div>`;
}

export function bindMiniStory() {
  const root=document.querySelector('.mini-story');
  if (!root) return;
  const story=miniStories.find(item=>item.id===root.dataset.miniStory)||miniStories[0];
  root.querySelectorAll('[data-story-speak]').forEach(button=>button.addEventListener('click',()=>speak(button.dataset.storySpeak,'kiwi')));
  root.querySelectorAll('[data-mini-answer]').forEach(button=>button.addEventListener('click',()=>{
    const correct=Number(button.dataset.miniAnswer)===story.question.correct;
    const result=root.querySelector('.mini-question p');
    result.className=correct?'success':'try';
    result.textContent=correct?`¡Sí! ${story.question.options[story.question.correct]}. ⭐`:'Buena idea. Mira otra vez el cuento y prueba con calma.';
    if (correct) {const state=store.get(),completed=new Set(state.mini?.completed||[]);completed.add(`story-${story.id}`);state.mini={...(state.mini||{}),completed:[...completed],eggs:completed.size};store.save(state);}
  }));
}
