import {loadStory, escapeHtml} from '../stories/story-service.js';
import {store} from '../core/store.js';

export async function storyScreen(id) {
  try {
    const story = await loadStory(id);
    const completed = store.get().completed.includes(`story-${story.id}`);
    const keyword=story.palabra_clave;
    return `<div class="story-shell"><a class="story-back" href="#misiones">← Volver a cuentos</a><p class="eyebrow">${escapeHtml(story.serie||'Cuento')} · Episodio ${escapeHtml(story.episodio||1)}</p><h1>${escapeHtml(story.titulo)}</h1><div class="mission-meta"><span class="pill">${escapeHtml(story.edad_min)}–${escapeHtml(story.edad_max)} años</span><span class="pill">${escapeHtml(story.genero||story.nivel_lector)}</span><span class="pill warm">💛 ${escapeHtml(story.valor)}</span>${completed?'<span class="pill">✓ Leído</span>':''}</div><section class="story-pages" aria-label="Páginas del cuento">${story.paginas.map((page,index)=>`<article class="card story-page"><span class="story-page-number">${index+1}</span><p>${escapeHtml(page)}</p></article>`).join('')}</section>${keyword?`<section class="section card story-keyword"><p class="eyebrow">Palabra clave</p><h2>${escapeHtml(keyword.termino)}</h2><p><strong>¿Qué significa?</strong> ${escapeHtml(keyword.definicion)}</p><p><strong>En el día a día:</strong> ${escapeHtml(keyword.uso_cotidiano)}</p><p class="feedback">${escapeHtml(keyword.ejemplo)}</p></section>`:''}<section class="section card story-quiz"><p class="eyebrow">Reto de comprensión</p><h2>¿Qué recuerdas del cuento?</h2><p class="muted">Puedes volver a leer cualquier página. No hay prisa.</p><form id="story-quiz-form" data-story-id="${escapeHtml(story.id)}">${story.preguntas.map((question,questionIndex)=>`<fieldset data-answer="${Number(question.correcta)}"><legend>${questionIndex+1}. ${escapeHtml(question.enunciado)}</legend>${question.opciones.map((option,optionIndex)=>`<label class="story-option"><input type="radio" name="question-${questionIndex}" value="${optionIndex}" required><span>${escapeHtml(option)}</span></label>`).join('')}</fieldset>`).join('')}<button class="button" type="submit">Comprobar respuestas</button></form><div class="feedback" id="story-feedback" role="status" aria-live="polite" hidden></div></section></div>`;
  } catch (error) {
    return `<section class="card empty"><h1>No pudimos abrir el cuento</h1><p>${escapeHtml(error.message)}</p><a class="button" href="#lectura?tipo=stories">Volver a Cuentos</a></section>`;
  }
}

export function bindStoryScreen(toast) {
  document.querySelector('.story-back')?.setAttribute('href', '#lectura?tipo=stories');
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
