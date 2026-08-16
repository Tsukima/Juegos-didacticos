import {homeScreen} from './screens/home.js';
import {missionsScreen} from './screens/missions.js';
import {readingScreen} from './screens/reading.js';
import {achievementsScreen} from './screens/achievements.js';
import {valuesScreen} from './screens/values.js';
import {securityScreen} from './screens/security.js';
import {adultsScreen, bindAdultRecordings} from './screens/adults.js?v=5';
import {gameScreen} from './screens/game.js?v=4';
import {securityGameScreen} from './screens/security-game.js?v=4';
import {storyScreen, bindStoryScreen} from './screens/story.js';
import {onboardingScreen, bindOnboarding} from './screens/onboarding.js';
import {store} from './core/store.js';
import {toast} from './core/utils.js';
import {setupPwaInstall} from './core/pwa.js';
import {setupEmailAuth} from './core/email-auth-ui.js';

const routes = {inicio:homeScreen, bienvenida:onboardingScreen, misiones:missionsScreen, lectura:readingScreen, logros:achievementsScreen, valores:valuesScreen, seguridad:securityScreen, adultos:adultsScreen};

function parse() {
  const raw = location.hash.slice(1) || 'inicio';
  const [path, query = ''] = raw.split('?');
  const [route, id] = path.split('/');
  return {route, id, params: Object.fromEntries(new URLSearchParams(query))};
}

function closeMobileMenu() {
  document.body.classList.remove('mobile-menu-open');
  document.querySelector('#mobile-more-toggle')?.setAttribute('aria-expanded', 'false');
  document.querySelector('#mobile-more-menu')?.setAttribute('aria-hidden', 'true');
}

function openMobileMenu() {
  document.body.classList.add('mobile-menu-open');
  document.querySelector('#mobile-more-toggle')?.setAttribute('aria-expanded', 'true');
  document.querySelector('#mobile-more-menu')?.setAttribute('aria-hidden', 'false');
  document.querySelector('#mobile-menu-close')?.focus();
}

function bindPage() {
  document.querySelector('#save-settings')?.insertAdjacentHTML('afterend', '<button class="button secondary" id="change-companion" type="button" style="margin-top:.7rem">Cambiar compañero y preferencias</button>');
  document.querySelector('#save-settings')?.addEventListener('click', () => {
    const state = store.get();
    state.profile.name = document.querySelector('#profile-name').value.trim() || 'Explorador';
    state.settings.dailyGoal = +document.querySelector('#daily-goal').value;
    state.settings.saveAudio = Boolean(document.querySelector('#save-audio')?.checked);
    store.save(state);
    toast('Preferencias guardadas');
  });
  document.querySelector('#reset-progress')?.addEventListener('click', () => {
    if (confirm('¿Borrar todo el progreso guardado en este navegador?')) {
      store.reset();
      render();
      toast('Progreso borrado');
    }
  });
  bindAdultRecordings();
  bindStoryScreen(toast);
  bindOnboarding();
  document.querySelector('#change-companion')?.addEventListener('click', () => {
    const state = store.get();
    state.profile.onboardingComplete = false;
    store.save(state);
    location.hash = 'bienvenida';
  });
}

let renderSequence = 0;
async function render() {
  const sequence = ++renderSequence;
  const {route, id, params} = parse();
  if (!store.get().profile.onboardingComplete && route !== 'bienvenida') {
    location.hash = 'bienvenida';
    return;
  }
  const view = route === 'jugar' ? () => gameScreen(id) : route === 'reto-seguro' ? () => securityGameScreen(id) : route === 'cuento' ? () => storyScreen(id) : routes[route] || homeScreen;
  closeMobileMenu();
  const app = document.querySelector('#app');
  app.innerHTML = '<div class="card loading-card" role="status">Preparando la aventura…</div>';
  const html = await view(params);
  if (sequence !== renderSequence) return;
  app.innerHTML = html;
  document.querySelectorAll('[data-route]').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
    if (link.dataset.route === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('#mobile-more-toggle')?.classList.toggle('active', ['valores','seguridad','adultos'].includes(route));
  document.querySelector('#streak-count').textContent = store.get().streak;
  app.focus({preventScroll:true});
  bindPage();
}

setupPwaInstall(toast);
setupEmailAuth(toast);
const focus = document.querySelector('#focus-toggle');
focus.onclick = () => {
  const on = !document.body.classList.contains('focus-mode');
  document.body.classList.toggle('focus-mode', on);
  focus.setAttribute('aria-pressed', String(on));
};
document.querySelector('#mobile-more-toggle')?.addEventListener('click', () => document.body.classList.contains('mobile-menu-open') ? closeMobileMenu() : openMobileMenu());
document.querySelector('#mobile-menu-close')?.addEventListener('click', closeMobileMenu);
document.querySelector('#mobile-menu-backdrop')?.addEventListener('click', closeMobileMenu);
addEventListener('keydown', event => {if (event.key === 'Escape') closeMobileMenu()});
addEventListener('hashchange', render);
addEventListener('progresschange', () => {document.querySelector('#streak-count').textContent = store.get().streak});
render();
