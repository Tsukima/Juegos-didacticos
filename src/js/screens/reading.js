import {allMissions} from '../missions/mission-engine.js';
import {store} from '../core/store.js';
import {loadStoryCatalog, escapeHtml} from '../stories/story-service.js';

const types=[['word','Palabras'],['phrase','Frases'],['comprehension','Comprensión'],['action','Acción'],['stories','Cuentos']];

function missionList(type,state) {
  return allMissions.filter(m=>m.type===type).map(m=>`<article class="card mission-card ${m.data.source==='mini'?'bridge-mission':''}"><div class="mission-meta"><span class="pill">${m.duration} min</span>${m.data.source==='mini'?'<span class="pill mini-pill">🦕 Puente Mini</span>':''}${state.completed.includes(m.id)?'<span class="pill warm">✓ Superada</span>':''}</div><h3>${m.data.emoji||''} ${m.title}</h3><p class="muted">${type==='word'?(m.data.source==='mini'?`${m.data.syllables.replaceAll('-',' · ')} · ${m.data.phrase}`:m.data.word):type==='phrase'?m.data.text:type==='action'?m.data.text:m.data.question}</p>${m.data.topic?`<small class="mission-topic">Tema: ${m.data.topic}</small>`:''}<a class="button ${state.completed.includes(m.id)?'secondary':''}" href="#jugar/${m.id}">${state.completed.includes(m.id)?'Repetir':'Empezar'}</a></article>`).join('');
}

async function storyLibrary(state,ageRange='6-8') {
  try {
    const allStories=await loadStoryCatalog();
    const stories=ageRange==='all'?allStories:allStories.filter(story=>`${story.edad_min}-${story.edad_max}`===ageRange);
    const cards=stories.map(story=>{
      const completed=state.completed.includes(`story-${story.id}`);
      const cover=story.imagen?`<img class="story-cover story-cover-image" src="./${escapeHtml(story.imagen)}" alt="Ilustración de ${escapeHtml(story.titulo)}" loading="lazy">`:'<div class="story-cover" aria-hidden="true">📚</div>';
      return `<article class="card story-card">${cover}<div class="mission-meta"><span class="pill">${escapeHtml(story.nivel_lector)}</span><span class="pill warm">${escapeHtml(story.edad_min)}–${escapeHtml(story.edad_max)} años</span></div><h3>${escapeHtml(story.titulo)}</h3><p class="muted">${escapeHtml(story.sinopsis||`Un cuento sobre ${story.valor}.`)}</p><a class="button ${completed?'secondary':''}" href="#cuento/${escapeHtml(story.id)}">${completed?'Leer de nuevo':'Leer cuento'}</a></article>`;
    }).join('');
    const completedStories=stories.filter(story=>state.completed.includes(`story-${story.id}`));
    const words=completedStories.map(story=>`<article class="dictionary-word"><span class="dictionary-key" aria-hidden="true">🔑</span><div><h3>${escapeHtml(story.palabra_clave?.palabra||'Palabra')}</h3><p class="keyword-syllables">${(story.palabra_clave?.silabas||[]).map(escapeHtml).join(' · ')}</p><p>${escapeHtml(story.palabra_clave?.definicion||'')}</p><small>Descubierta en «${escapeHtml(story.titulo)}»</small></div></article>`).join('');
    const dictionary=`<details class="adventure-dictionary card"><summary><span aria-hidden="true">📗</span><span><strong>Diccionario de aventuras</strong><small>${completedStories.length} de ${stories.length} palabras descubiertas</small></span><span class="dictionary-arrow" aria-hidden="true">⌄</span></summary><div class="dictionary-list">${words||'<div class="empty compact"><strong>Tu primera palabra está esperando.</strong><p>Completa un cuento para guardarla aquí.</p></div>'}</div></details>`;
    const library=cards||'<article class="card empty story-empty"><span>🦜</span><h3>Los primeros cuentos están en camino</h3><p>Tinkie y Pepito están preparando una nueva aventura.</p></article>';
    return `${library}${dictionary}`;
  } catch {
    return '<article class="card adult-note"><strong>La biblioteca está descansando.</strong><p>Vuelve a intentarlo dentro de un momento.</p></article>';
  }
}

export async function readingScreen(params={}) {
  const type=params.tipo||'word';
  const state=store.get();
  const isStories=type==='stories';
  const allowedRanges=['6-8','8-10','10-12','all'];
  const ageRange=allowedRanges.includes(params.edad)?params.edad:'6-8';
  const content=isStories?await storyLibrary(state,ageRange):missionList(type,state);
  const tabs=types.map(([key,name])=>`<a class="button ${type===key?'':'secondary'} small" href="#lectura?tipo=${key}" ${type===key?'aria-current="page"':''}>${key==='stories'?'📚 ':''}${name}</a>`).join('');
  const bridgeNote=type==='word'?`<aside class="mini-bridge-note"><span aria-hidden="true">🦕→🦜</span><div><strong>Mini también crece contigo</strong><p>Encontrarás palabras de Mini Aventuras adaptadas como misiones normales de lectura.</p></div></aside>`:'';
  const ageTabs=[['6-8','6–8 años'],['8-10','8–10 años'],['10-12','10–12 años'],['all','Todos']].map(([key,label])=>`<a class="story-age-tab ${ageRange===key?'active':''}" href="#lectura?tipo=stories&edad=${key}" ${ageRange===key?'aria-current="page"':''}>${label}${key!=='all'?'<small>20 cuentos</small>':'<small>60 cuentos</small>'}</a>`).join('');
  const sectionCover={'6-8':'cuentos-6-8.jpg','8-10':'cuentos-8-10.jpg','10-12':'cuentos-10-12.jpg',all:'cuentos-8-10.jpg'}[ageRange];
  const body=isStories
    ? `<section class="section stories-section"><img class="stories-section-cover" src="./images/stories/covers/${sectionCover}" alt="Tinkie, Roki, Hilito y Turbo explorando cuentos" loading="eager"><div class="section-head"><div><p class="eyebrow">Biblioteca de Tinkie</p><h2>Cuentos por edad</h2><p class="muted">Historias para leer con calma, descubrir palabras y superar retos de comprensión.</p></div><span class="stories-mascot" aria-hidden="true">🦜📖</span></div><nav class="story-age-tabs" aria-label="Rangos de edad">${ageTabs}</nav><div class="grid stories-grid">${content}</div></section>`
    : `${bridgeNote}<section class="section grid">${content}</section>`;
  return `<p class="eyebrow">Biblioteca</p><h1>Lectura</h1><p class="muted">Practica con retos cortos o elige una aventura de la biblioteca de Tinkie.</p><nav class="actions reading-tabs" aria-label="Tipos de lectura">${tabs}</nav>${body}`;
}
