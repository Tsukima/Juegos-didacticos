import {allMissions} from '../missions/mission-engine.js';
import {store} from '../core/store.js';
import {loadStoryCatalog, loadStory, escapeHtml} from '../stories/story-service.js';

const names = {word:'Palabras', phrase:'Frases', comprehension:'Comprensión', action:'Acción'};

export async function missionsScreen() {
  const state = store.get();
  let stories = [];
  let catalogError = false;
  try { stories = await loadStoryCatalog(); } catch { catalogError = true; }
  const missionCards = Object.entries(names).map(([type, name]) => {
    const list = allMissions.filter(mission => mission.type === type);
    const done = list.filter(mission => state.completed.includes(mission.id)).length;
    return `<article class="card mission-card"><span class="pill">${list[0].duration}–3 min</span><h2>${name}</h2><p>${done} de ${list.length} completadas</p><div class="progress"><span style="width:${done / list.length * 100}%"></span></div><a class="button" href="#lectura?tipo=${type}">Explorar</a></article>`;
  }).join('');
  const storyCards = stories.map(story => {
    const completed = state.completed.includes(`story-${story.id}`);
    return `<article class="card story-card"><div class="story-cover" aria-hidden="true">📚</div><div class="mission-meta"><span class="pill">${escapeHtml(story.nivel_lector)}</span><span class="pill warm">${escapeHtml(story.edad_min)}–${escapeHtml(story.edad_max)} años</span></div><h3>${escapeHtml(story.titulo)}</h3><p class="muted">Un cuento sobre ${escapeHtml(story.valor)}.</p><a class="button ${completed ? 'secondary' : ''}" href="#cuento/${escapeHtml(story.id)}">${completed ? 'Leer de nuevo' : 'Leer cuento'}</a></article>`;
  }).join('');
  const storyContent = catalogError
    ? '<article class="card adult-note"><strong>La biblioteca está descansando.</strong><p>Vuelve a intentarlo dentro de un momento.</p></article>'
    : storyCards || '<article class="card empty story-empty"><span>🦜</span><h3>Los primeros cuentos están en camino</h3><p>Tinkie y Pepito están preparando una nueva aventura.</p></article>';
  const completedEntries = stories.filter(story => state.completed.includes(`story-${story.id}`));
  const completedStories = (await Promise.all(completedEntries.map(story => loadStory(story.id).catch(() => null)))).filter(Boolean);
  const wordCards = completedStories.map(story => `<article class="dictionary-word">
    <span class="dictionary-key" aria-hidden="true">🔑</span>
    <div><h3>${escapeHtml(story.palabra_clave.palabra)}</h3><p class="keyword-syllables">${story.palabra_clave.silabas.map(escapeHtml).join(' · ')}</p><p>${escapeHtml(story.palabra_clave.definicion)}</p><small>Descubierta en «${escapeHtml(story.titulo)}»</small></div>
  </article>`).join('');
  const dictionary = `<details class="adventure-dictionary card" ${wordCards ? '' : 'data-empty="true"'}>
    <summary><span aria-hidden="true">📗</span><span><strong>Diccionario de aventuras</strong><small>${completedStories.length} de ${stories.length} palabras descubiertas</small></span><span class="dictionary-arrow" aria-hidden="true">⌄</span></summary>
    <div class="dictionary-list">${wordCards || '<div class="empty compact"><strong>Tu primera palabra está esperando.</strong><p>Completa un cuento para guardarla aquí.</p></div>'}</div>
  </details>`;
  return `<p class="eyebrow">Mapa de aventuras</p><h1>Misiones</h1><p class="muted">Elige lo que te apetezca. Puedes repetir cualquier reto.</p><div class="section grid">${missionCards}</div><section class="section stories-section"><div class="section-head"><div><p class="eyebrow">Biblioteca de Tinkie</p><h2>Cuentos</h2><p class="muted">Historias cortas para leer con calma y superar un reto de comprensión.</p></div><span class="stories-mascot" aria-hidden="true">🦜📖</span></div><div class="grid stories-grid">${storyContent}</div>${dictionary}</section>`;
}
