import {securityScenarios} from '../security/security-data.js';
import {store} from '../core/store.js';
import {toast} from '../core/utils.js';
import {readingCheckMarkup, bindReadingCheck} from '../core/reading-check.js?v=4';

export function securityGameScreen(id) {
  const scenario = securityScenarios.find(item => item.id === id);
  if (!scenario) return '<h1>Reto no encontrado</h1>';
  setTimeout(() => bindSecurityGame(scenario), 0);
  return `
    <div class="game-shell">
      <a href="#seguridad" class="muted">← Volver a la academia</a>
      <p class="eyebrow" style="margin-top:1.5rem">Reto de Mr. Pizza</p>
      <h1>${scenario.title}</h1>
      <article class="card">
        <div class="character"><div class="avatar">🍕</div><strong>Detecta la trampa</strong></div>
        <div class="game-prompt">${scenario.text}</div>
        <h2>${scenario.question}</h2>
        <div class="options">
          ${scenario.options.map((option, index) => `<button class="option answer" data-i="${index}">${option}</button>`).join('')}
        </div>
        <div class="feedback" hidden></div>
      </article>
    </div>`;
}

function bindSecurityGame(scenario) {
  const root = document.querySelector('.game-shell');
  if (!root) return;
  root.querySelectorAll('.answer').forEach(button => {
    button.addEventListener('click', () => {
      const feedback = root.querySelector('.feedback');
      const right = Number(button.dataset.i) === scenario.answer;
      feedback.hidden = false;
      feedback.className = `feedback ${right ? 'success' : 'try'}`;
      if (right) {
        store.complete(scenario.id, 'security');
        feedback.innerHTML = `<strong>¡Escudo activado!</strong> ${scenario.lesson}`;
        toast('🛡️ Has protegido tu mundo');
      } else {
        feedback.innerHTML = '<strong>Mr. Pizza casi te engaña.</strong> Busca la opción que protege tus datos y te acerca a un adulto.';
      }
      feedback.insertAdjacentHTML('beforeend', readingCheckMarkup(
        right ? 'Muy bien, ahora leámoslo juntos' : 'Vamos a leerlo juntos y descubramos la pista',
        scenario.text
      ));
      bindReadingCheck(feedback, scenario.text, scenario.id);
      if (right) {
        feedback.insertAdjacentHTML('beforeend', '<div class="actions"><a class="button" href="#seguridad">Siguiente reto</a></div>');
      }
    });
  });
}
