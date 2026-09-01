import {miniTopics,miniWords,miniStories} from '../mini/mini-data.js';
import {store} from '../core/store.js';

export function miniThemeScreen(id) {
  const topic=miniTopics.find(item=>item.id===id)||miniTopics[0];
  const words=topic.wordIds.map(wordId=>miniWords.find(word=>word.id===wordId));
  const story=miniStories.find(item=>item.id===topic.story);
  const completed=store.get().mini?.completed||[];
  const done=words.filter(word=>completed.includes(`word-${word.id}`)).length+(completed.includes(`sound-${topic.sound}`)?1:0)+(completed.includes(`story-${topic.story}`)?1:0);
  return `<div class="mini-world mini-theme"><a class="mini-back" href="#mini">← Todos los temas</a>
    <section class="mini-theme-hero"><div><span class="mini-label">Unidad temática</span><h1>${topic.emoji} ${topic.title}</h1><p>${topic.subtitle}</p></div><div class="mini-theme-score"><strong>${done}/7</strong><span>actividades</span></div></section>
    <section class="mini-study-plan"><p class="mini-label">Plan para estudiar</p><h2>Una actividad pequeña cada día</h2><div><article><b>1</b><span><strong>Escuchar</strong><small>Descubre el sonido ${topic.sound.toUpperCase()}.</small></span></article><article><b>2</b><span><strong>Construir</strong><small>Practica dos palabras.</small></span></article><article><b>3</b><span><strong>Leer juntos</strong><small>Escucha el cuento del tema.</small></span></article><article><b>4</b><span><strong>Repasar</strong><small>Completa las palabras restantes.</small></span></article></div></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Paso 1</span><h2>El sonido ${topic.sound.toUpperCase()}</h2></div></div><a class="mini-wide-challenge ${completed.includes(`sound-${topic.sound}`)?'done':''}" href="#mini-sonido/${topic.sound}"><span>👂</span><div><strong>Escucha y encuentra</strong><small>Elige entre tres dibujos.</small></div><b>${completed.includes(`sound-${topic.sound}`)?'✓':'Jugar'}</b></a></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Paso 2</span><h2>Palabras del tema</h2></div><strong>${words.filter(word=>completed.includes(`word-${word.id}`)).length}/${words.length}</strong></div><div class="mini-mission-grid">${words.map((word,index)=>`<a href="#mini-juego/${word.id}" class="mini-mission ${completed.includes(`word-${word.id}`)?'done':''}"><span>${word.emoji}</span><div><small>Palabra ${index+1}</small><strong>${word.syllables.join(' · ')}</strong></div><b>${completed.includes(`word-${word.id}`)?'✓':'→'}</b></a>`).join('')}</div></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Paso 3</span><h2>Cuento del tema</h2></div></div><a class="mini-wide-challenge mini-story-link ${completed.includes(`story-${story.id}`)?'done':''}" href="#mini-cuento/${story.id}"><span>${story.emoji}</span><div><strong>${story.title}</strong><small>Escucha, sigue el texto y responde una pregunta.</small></div><b>${completed.includes(`story-${story.id}`)?'✓':'Leer'}</b></a></section>
    <section class="mini-offline"><span>🏃</span><div><p class="mini-label">Misión sin pantalla</p><h2>${topic.offline}</h2><p>Cuando termine, el adulto puede celebrarlo con un choque de manos.</p></div></section>
  </div>`;
}
