import {characters} from '../characters/characters.js';
import {companionKeys} from '../characters/companions.js';
import {store} from '../core/store.js';

const adventures = [
  ['explorar','🗺️','Explorar'], ['misterios','🔎','Resolver misterios'],
  ['construir','🧱','Construir'], ['ayudar','💛','Ayudar a otros']
];
const encouragements = [
  ['calma','🌿','Con calma'], ['humor','😄','Con humor'],
  ['celebrar','🎉','Celebrando mucho'], ['pistas','💡','Dándome pistas']
];

const choices = (items, group) => `<div class="onboarding-choices">${items.map(([value, emoji, label]) => `<button type="button" class="onboarding-choice" data-onboarding-group="${group}" data-onboarding-value="${value}"><span>${emoji}</span><strong>${label}</strong></button>`).join('')}</div>`;

export function onboardingScreen() {
  const mascots = companionKeys.map(key => [key, characters[key].emoji, characters[key].name]);
  return `<section class="onboarding-shell"><div class="onboarding-progress" aria-label="Paso de bienvenida"><span class="active"></span><span></span><span></span><span></span></div>
    <article class="onboarding-step active" data-onboarding-step="0"><p class="eyebrow">Elige tu camino</p><h1>¿Qué aventura quieres abrir?</h1><div class="learning-path-choices"><button type="button" data-learning-path="mini"><span>🦕</span><div><strong>Mini Aventuras</strong><small>6 años · sonidos, sílabas y cuentos acompañados</small></div></button><button type="button" data-learning-path="explorer"><span>🦜</span><div><strong>Explorador de Palabras</strong><small>Misiones de lectura, valores y seguridad digital</small></div></button></div></article>
    <article class="onboarding-step" data-onboarding-step="1"><p class="eyebrow">Elige a tu compañero de aventuras</p><h1>¿Quién quieres que te acompañe?</h1><p>No hay respuestas correctas. Podrás cambiarlo cuando quieras.</p>${choices(mascots, 'mascot')}<button class="onboarding-skip" type="button">Elegir más tarde</button></article>
    <article class="onboarding-step" data-onboarding-step="2"><p class="eyebrow">Tu tipo de aventura</p><h1>¿Qué te apetece hacer?</h1>${choices(adventures, 'adventure')}</article>
    <article class="onboarding-step" data-onboarding-step="3"><p class="eyebrow">Tu compañero te escucha</p><h1>¿Cómo quieres que te anime?</h1>${choices(encouragements, 'encouragement')}</article>
  </section>`;
}

export function bindOnboarding() {
  const shell = document.querySelector('.onboarding-shell');
  if (!shell) return;
  const currentProfile=store.get().profile||{};
  const draft = {learningPath:currentProfile.learningPath||'explorer',mascot:currentProfile.mascot||'kiwi', adventure:currentProfile.adventure||'explorar', encouragement:currentProfile.encouragement||'calma'};
  const showStep = step => {
    shell.querySelectorAll('.onboarding-step').forEach((item, index) => item.classList.toggle('active', index === step));
    shell.querySelectorAll('.onboarding-progress span').forEach((item, index) => item.classList.toggle('active', index <= step));
    shell.querySelector('.onboarding-step.active h1')?.focus?.();
  };
  const finish = (path=draft.learningPath) => {
    const state = store.get();
    state.profile = {...state.profile, ...draft, learningPath:path, onboardingComplete:true};
    state.puzzle = {collection:`${draft.mascot}-01`, pieces:[]};
    store.save(state);
    location.hash = path==='mini'?'mini':'inicio';
  };
  const requestedStep=Number(sessionStorage.getItem('onboarding-start-step'));
  sessionStorage.removeItem('onboarding-start-step');
  if(requestedStep>=1&&requestedStep<=3) showStep(requestedStep);
  shell.querySelectorAll('[data-learning-path]').forEach(button=>button.addEventListener('click',()=>{
    draft.learningPath=button.dataset.learningPath;
    showStep(1);
  }));
  shell.querySelectorAll('[data-onboarding-group]').forEach(button => button.addEventListener('click', () => {
    draft[button.dataset.onboardingGroup] = button.dataset.onboardingValue;
    if (button.dataset.onboardingGroup === 'mascot') document.documentElement.dataset.companion = button.dataset.onboardingValue;
    if (button.dataset.onboardingGroup === 'mascot' && requestedStep === 1) { finish(); return; }
    const step = Number(button.closest('[data-onboarding-step]').dataset.onboardingStep);
    if (step < 3) showStep(step + 1); else finish();
  }));
  shell.querySelector('.onboarding-skip')?.addEventListener('click', finish);
}
