import {loadStory, escapeHtml} from '../stories/story-service.js';
import {store} from '../core/store.js';

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const highlightKeyword = (text, keyword) => {
  const pattern = new RegExp(`(${escapeRegExp(keyword)})`, 'giu');
  return String(text).split(pattern).map(part => part.toLocaleLowerCase('es') === keyword.toLocaleLowerCase('es')
    ? `<mark class="story-keyword-mark">${escapeHtml(part)}</mark>`
    : escapeHtml(part)).join('');
};

const keywordIntro = keyword => `<section class="section card keyword-card keyword-intro">
  <div class="keyword-icon" aria-hidden="true">🔑</div>
  <div>
    <p class="eyebrow">Palabra clave del cuento</p>
    <h2>${escapeHtml(keyword.palabra)}</h2>
    <p class="keyword-syllables" aria-label="Separación en sílabas">${keyword.silabas.map(escapeHtml).join(' · ')}</p>
    <p>${escapeHtml(keyword.definicion)}</p>
    <p class="keyword-example"><strong>En esta aventura:</strong> ${escapeHtml(keyword.ejemplo_cuento)}</p>
  </div>
</section>`;

const keywordPractice = keyword => `<section class="section card keyword-card keyword-practice">
  <div>
    <p class="eyebrow">Llévala a tu mundo</p>
    <h2>¿Cómo usamos «${escapeHtml(keyword.palabra)}»?</h2>
    <p><strong>En el día a día:</strong> ${escapeHtml(keyword.ejemplo_cotidiano)}</p>
    <div class="keyword-challenge"><span aria-hidden="true">🌟</span><p><strong>Mini-reto:</strong> ${escapeHtml(keyword.reto)}</p></div>
  </div>
  <form class="keyword-question" id="keyword-question" data-answer="${Number(keyword.pregunta.correcta)}">
    <fieldset>
      <legend>${escapeHtml(keyword.pregunta.enunciado)}</legend>
      ${keyword.pregunta.opciones.map((option, index) => `<label class="story-option"><input type="radio" name="keyword-answer" value="${index}" required><span>${escapeHtml(option)}</span></label>`).join('')}
    </fieldset>
    <button class="button secondary" type="submit">Comprobar palabra</button>
  </form>
  <div class="feedback" id="keyword-feedback" role="status" aria-live="polite" hidden data-success="${escapeHtml(keyword.pregunta.explicacion)}"></div>
</section>`;

export async function storyScreen(id) {
  try {
    const story = await loadStory(id);
    const completed = store.get().completed.includes(`story-${story.id}`);
    return `<div class="story-shell"><a class="story-back" href="#misiones">← Volver a cuentos</a><p class="eyebrow">Cuento · ${escapeHtml(story.nivel_lector)}</p><h1>${escapeHtml(story.titulo)}</h1><div class="mission-meta"><span class="pill">${escapeHtml(story.edad_min)}–${escapeHtml(story.edad_max)} años</span><span class="pill warm">💛 ${escapeHtml(story.valor)}</span>${completed ? '<span class="pill">✓ Leído</span>' : ''}</div>${keywordIntro(story.palabra_clave)}<section class="story-pages" aria-label="Páginas del cuento">${story.paginas.map((page, index) => `<article class="card story-page"><span class="story-page-number">${index + 1}</span><p>${highlightKeyword(page, story.palabra_clave.palabra)}</p></article>`).join('')}</section>${keywordPractice(story.palabra_clave)}<section class="section card story-quiz"><p class="eyebrow">Reto de comprensión</p><h2>¿Qué recuerdas del cuento?</h2><p class="muted">Puedes volver a leer cualquier página. No hay prisa.</p><form id="story-quiz-form" data-story-id="${escapeHtml(story.id)}">${story.preguntas.map((question, questionIndex) => `<fieldset data-answer="${Number(question.correcta)}"><legend>${questionIndex + 1}. ${escapeHtml(question.enunciado)}</legend>${question.opciones.map((option, optionIndex) => `<label class="story-option"><input type="radio" name="question-${questionIndex}" value="${optionIndex}" required><span>${escapeHtml(option)}</span></label>`).join('')}</fieldset>`).join('')}<button class="button" type="submit">Comprobar respuestas</button></form><div class="feedback" id="story-feedback" role="status" aria-live="polite" hidden></div></section></div>`;
  } catch (error) {
    return `<section class="card empty"><h1>No pudimos abrir el cuento</h1><p>${escapeHtml(error.message)}</p><a class="button" href="#misiones">Volver a Misiones</a></section>`;
  }
}

export function bindStoryScreen(toast) {
  document.querySelector('#keyword-question')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const feedback = document.querySelector('#keyword-feedback');
    const passed = Number(form.querySelector('input:checked')?.value) === Number(form.dataset.answer);
    feedback.hidden = false;
    feedback.className = `feedback ${passed ? 'success' : 'try'}`;
    feedback.innerHTML = passed
      ? `<strong>¡Esa es!</strong> ${feedback.dataset.success}`
      : '<strong>Casi.</strong> Piensa en la definición y prueba otra vez. Puedes hacerlo con calma.';
  });
  document.querySelector('#story-quiz-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const questions = [...form.querySelectorAll('fieldset')];
    let correct = 0;
    questions.forEach(fieldset => {
      const passed = Number(fieldset.querySelector('input:checked')?.value) === Number(fieldset.dataset.answer);
      fieldset.classList.toggle('answered-correct', passed);
      fieldset.classList.toggle('answered-try', !passed);
      if (passed) correct += 1;
    });
    const feedback = document.querySelector('#story-feedback');
    feedback.hidden = false;
    if (correct === questions.length) {
      const piecesBefore = store.get().puzzle.pieces.length;
      const firstTime = store.complete(`story-${form.dataset.storyId}`, 'story');
      const puzzlePiece = firstTime && store.get().puzzle.pieces.length > piecesBefore;
      feedback.className = 'feedback success';
      feedback.innerHTML = `<strong>¡Cuento completado!</strong> Comprendiste las ${correct} preguntas.${firstTime ? ' Ganaste una estrella.' : ' Puedes repetirlo cuando quieras.'}${puzzlePiece ? ' También descubriste una pieza del rompecabezas.' : ''}`;
      toast('¡Cuento completado!');
    } else {
      feedback.className = 'feedback try';
      feedback.innerHTML = `<strong>Vas muy bien.</strong> Acertaste ${correct} de ${questions.length}. Revisa las marcadas en amarillo y vuelve a intentarlo.`;
    }
  });
}
