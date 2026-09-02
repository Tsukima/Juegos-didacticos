import {miniTopics,miniWords,miniStories,miniSoundLessons} from '../mini/mini-data.js';
import {store} from '../core/store.js';

export function miniThemeScreen(id) {
  const topic=miniTopics.find(item=>item.id===id)||miniTopics[0];
  const words=topic.wordIds.map(wordId=>miniWords.find(word=>word.id===wordId));
  const stories=miniStories.filter(item=>item.topic===topic.id);
  const lesson=miniSoundLessons[topic.sound];
  const total=words.length+1+stories.length;
  const completed=store.get().mini?.completed||[];
  const done=words.filter(word=>completed.includes(`word-${word.id}`)).length+(completed.includes(`sound-${topic.sound}`)?1:0)+stories.filter(story=>completed.includes(`story-${story.id}`)).length;
  return `<div class="mini-world mini-theme"><a class="mini-back" href="#mini">← Todos los temas</a>
    <section class="mini-theme-hero"><div><span class="mini-label">Unidad temática</span><h1>${topic.emoji} ${topic.title}</h1><p>${topic.subtitle}</p></div><div class="mini-theme-score"><strong>${done}/${total}</strong><span>actividades</span></div></section>
    <section class="mini-professional-panel"><div><small>Objetivo</small><strong>${topic.objective}</strong></div><div><small>Habilidad</small><strong>${topic.skill}</strong></div><div><small>Observar</small><strong>${topic.observe}</strong></div><div><small>Sesión sugerida</small><strong>8–12 minutos · 4 días</strong></div></section>
    <section class="mini-study-plan"><p class="mini-label">Plan para estudiar</p><h2>Una actividad pequeña cada día</h2><div><article><b>1</b><span><strong>Escuchar</strong><small>Descubre el sonido ${lesson.letter}.</small></span></article><article><b>2</b><span><strong>Construir</strong><small>Practica dos palabras.</small></span></article><article><b>3</b><span><strong>Leer juntos</strong><small>Escucha el cuento del tema.</small></span></article><article><b>4</b><span><strong>Repasar</strong><small>Completa las palabras restantes.</small></span></article></div></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Paso 1</span><h2>El sonido ${lesson.letter}</h2></div></div><a class="mini-wide-challenge ${completed.includes(`sound-${topic.sound}`)?'done':''}" href="#mini-sonido/${topic.sound}"><span>👂</span><div><strong>Escucha y encuentra</strong><small>Elige entre tres dibujos.</small></div><b>${completed.includes(`sound-${topic.sound}`)?'✓':'Jugar'}</b></a></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Paso 2</span><h2>Palabras del tema</h2></div><strong>${words.filter(word=>completed.includes(`word-${word.id}`)).length}/${words.length}</strong></div><div class="mini-mission-grid">${words.map((word,index)=>`<a href="#mini-juego/${word.id}" class="mini-mission ${completed.includes(`word-${word.id}`)?'done':''}"><span>${word.emoji}</span><div><small>Palabra ${index+1}</small><strong>${word.syllables.join(' · ')}</strong></div><b>${completed.includes(`word-${word.id}`)?'✓':'→'}</b></a>`).join('')}</div></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Paso 3</span><h2>Biblioteca del tema</h2><p>Elige uno de los 10 cuentos. Puedes leerlos en cualquier orden.</p></div><strong>${stories.filter(story=>completed.includes(`story-${story.id}`)).length}/${stories.length}</strong></div><div class="mini-story-library">${stories.map((story,index)=>`<a class="mini-story-card ${completed.includes(`story-${story.id}`)?'done':''}" href="#mini-cuento/${story.id}"><span>${story.emoji}</span><div><small>Cuento ${index+1} · ${story.level||'inicial'}</small><strong>${story.title}</strong><em>${completed.includes(`story-${story.id}`)?'✓ Completado':'Leer cuento →'}</em></div></a>`).join('')}</div></section>
    <section class="mini-offline"><span>🏃</span><div><p class="mini-label">Misión sin pantalla</p><h2>${topic.offline}</h2><p>Cuando termine, el adulto puede celebrarlo con un choque de manos.</p></div></section>
  </div>`;
}
