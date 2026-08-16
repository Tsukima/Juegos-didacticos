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
  return `<section class="onboarding-shell"><div class="onboarding-progress" aria-label="Paso de bienvenida"><span class="active"></span><span></span><span></span></div>
    <article class="onboarding-step active" data-onboarding-step="0"><p class="eyebrow">Elige a tu compañero</p><h1>¿Qué animal te gusta más?</h1><p>No hay respuestas correctas. Podrás cambiarlo cuando quieras.</p>${choices(mascots, 'mascot')}<button class="onboarding-skip" type="button">Elegir más tarde</button></article>
    <article class="onboarding-step" data-onboarding-step="1"><p class="eyebrow">Tu tipo de aventura</p><h1>¿Qué te apetece hacer?</h1>${choices(adventures, 'adventure')}</article>
    <article class="onboarding-step" data-onboarding-step="2"><p class="eyebrow">Tu compañero te escucha</p><h1>¿Cómo quieres que te anime?</h1>${choices(encouragements, 'encouragement')}</article>
  </section>`;
}

export function bindOnboarding() {
  const shell = document.querySelector('.onboarding-shell');
  if (!shell) return;
  const draft = {mascot:'kiwi', adventure:'explorar', encouragement:'calma'};
  const showStep = step => {
    shell.querySelectorAll('.onboarding-step').forEach((item, index) => item.classList.toggle('active', index === step));
    shell.querySelectorAll('.onboarding-progress span').forEach((item, index) => item.classList.toggle('active', index <= step));
    shell.querySelector('.onboarding-step.active h1')?.focus?.();
  };
  const finish = () => {
    const state = store.get();
    state.profile = {...state.profile, ...draft, onboardingComplete:true};
    state.puzzle = {collection:`${draft.mascot}-01`, pieces:[]};
    store.save(state);
    location.hash = 'inicio';
  };
  shell.querySelectorAll('[data-onboarding-group]').forEach(button => button.addEventListener('click', () => {
    draft[button.dataset.onboardingGroup] = button.dataset.onboardingValue;
    const step = Number(button.closest('[data-onboarding-step]').dataset.onboardingStep);
    if (step < 2) showStep(step + 1); else finish();
  }));
  shell.querySelector('.onboarding-skip')?.addEventListener('click', finish);
}
