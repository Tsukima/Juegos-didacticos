import {allMissions} from '../missions/mission-engine.js';
import {store} from '../core/store.js';
import {loadStoryCatalog, escapeHtml} from '../stories/story-service.js';

const types=[['word','Palabras'],['phrase','Frases'],['comprehension','Comprensión'],['action','Acción'],['stories','Cuentos']];

function missionList(type,state) {
  return allMissions.filter(m=>m.type===type).map(m=>`<article class="card mission-card"><div class="mission-meta"><span class="pill">${m.duration} min</span>${state.completed.includes(m.id)?'<span class="pill warm">✓ Superada</span>':''}</div><h3>${m.title}</h3><p class="muted">${type==='word'?m.data.word:type==='phrase'?m.data.text:type==='action'?m.data.text:m.data.question}</p><a class="button ${state.completed.includes(m.id)?'secondary':''}" href="#jugar/${m.id}">${state.completed.includes(m.id)?'Repetir':'Empezar'}</a></article>`).join('');
}

async function storyLibrary(state) {
  try {
    const stories=await loadStoryCatalog();
    const cards=stories.map(story=>{
      const completed=state.completed.includes(`story-${story.id}`);
      return `<article class="card story-card"><div class="story-cover" aria-hidden="true">📚</div><div class="mission-meta"><span class="pill">${escapeHtml(story.nivel_lector)}</span><span class="pill warm">${escapeHtml(story.edad_min)}–${escapeHtml(story.edad_max)} años</span></div><h3>${escapeHtml(story.titulo)}</h3><p class="muted">${escapeHtml(story.sinopsis||`Un cuento sobre ${story.valor}.`)}</p><a class="button ${completed?'secondary':''}" href="#cuento/${escapeHtml(story.id)}">${completed?'Leer de nuevo':'Leer cuento'}</a></article>`;
    }).join('');
    return cards||'<article class="card empty story-empty"><span>🦜</span><h3>Los primeros cuentos están en camino</h3><p>Tinkie y Pepito están preparando una nueva aventura.</p></article>';
  } catch {
    return '<article class="card adult-note"><strong>La biblioteca está descansando.</strong><p>Vuelve a intentarlo dentro de un momento.</p></article>';
  }
}

export async function readingScreen(params={}) {
  const type=params.tipo||'word';
  const state=store.get();
  const isStories=type==='stories';
  const content=isStories?await storyLibrary(state):missionList(type,state);
  const tabs=types.map(([key,name])=>`<a class="button ${type===key?'':'secondary'} small" href="#lectura?tipo=${key}" ${type===key?'aria-current="page"':''}>${key==='stories'?'📚 ':''}${name}</a>`).join('');
  const body=isStories
    ? `<section class="section stories-section"><div class="section-head"><div><p class="eyebrow">Biblioteca de Tinkie</p><h2>Cuentos</h2><p class="muted">Historias para leer con calma, descubrir palabras y superar retos de comprensión.</p></div><span class="stories-mascot" aria-hidden="true">🦜📖</span></div><div class="grid stories-grid">${content}</div></section>`
    : `<section class="section grid">${content}</section>`;
  return `<p class="eyebrow">Biblioteca</p><h1>Lectura</h1><p class="muted">Practica con retos cortos o elige una aventura de la biblioteca de Tinkie.</p><nav class="actions reading-tabs" aria-label="Tipos de lectura">${tabs}</nav>${body}`;
}
