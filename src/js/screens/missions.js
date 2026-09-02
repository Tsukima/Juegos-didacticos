import {allMissions,bridgeMissionCount} from '../missions/mission-engine.js';
import {store} from '../core/store.js';

const names = {word:'Palabras', phrase:'Frases', comprehension:'Comprensión', action:'Acción'};

export async function missionsScreen() {
  const state = store.get();
  const missionCards = Object.entries(names).map(([type, name]) => {
    const list = allMissions.filter(mission => mission.type === type);
    const done = list.filter(mission => state.completed.includes(mission.id)).length;
    return `<article class="card mission-card"><span class="pill">${list[0].duration}–3 min</span><h2>${name}</h2><p>${done} de ${list.length} completadas</p><div class="progress"><span style="width:${done / list.length * 100}%"></span></div><a class="button" href="#lectura?tipo=${type}">Explorar</a></article>`;
  }).join('');
  return `<p class="eyebrow">Mapa de aventuras</p><h1>Misiones</h1><p class="muted">Elige lo que te apetezca. Puedes repetir cualquier reto.</p><aside class="mini-bridge-note"><span aria-hidden="true">🦕→🦜</span><div><strong>${bridgeMissionCount} misiones conectan Mini con este mapa</strong><p>Practica aquí palabras conocidas de los 20 temas Mini, ahora con el ritmo de las misiones normales.</p></div><a class="button secondary small" href="#lectura?tipo=word">Ver palabras</a></aside><div class="section grid">${missionCards}</div>`;
}
