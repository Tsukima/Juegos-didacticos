import {store} from '../core/store.js';
import {miniWords,miniStories} from '../mini/mini-data.js';

export function miniScreen() {
  const state=store.get();
  const completed=state.mini?.completed||[], eggs=state.mini?.eggs||0;
  return `<div class="mini-world">
    <section class="mini-hero">
      <div><span class="mini-label">Mini Aventuras · 6 años</span><h1>¡Hola! Soy Roki.</h1><p>Vamos a escuchar sonidos, juntar sílabas y descubrir palabras.</p><div class="mini-actions"><a class="mini-button" href="#mini-juego/dino">🦕 Jugar con sílabas</a><a class="mini-button mini-button-light" href="#mini-cuento">📖 Escuchar un cuento</a></div></div>
      <div class="mini-roki" role="img" aria-label="Roki, un dinosaurio verde y amable">🦕</div>
    </section>
    <section class="mini-path" aria-label="Tu aventura en tres pasos"><h2>Hoy haremos tres cosas</h2><div><span><b>1</b> Escuchar</span><span><b>2</b> Juntar</span><span><b>3</b> Leer</span></div></section>
    <section class="mini-grid"><article class="mini-card"><span>👂</span><h2>Sonidos</h2><p>Escucha una palabra sin prisa.</p></article><article class="mini-card"><span>🧩</span><h2>Sílabas</h2><p>Une dos piezas para construirla.</p></article><article class="mini-card mini-collection"><span>🥚</span><h2>${eggs} huevos</h2><p>Cada intento descubre algo nuevo.</p></article></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Camino de sílabas</span><h2>Ayuda a Roki a encontrar palabras</h2></div><strong>${completed.filter(id=>id.startsWith('word-')).length} / ${miniWords.length}</strong></div><div class="mini-mission-grid">${miniWords.map((word,index)=>`<a href="#mini-juego/${word.id}" class="mini-mission ${completed.includes(`word-${word.id}`)?'done':''}"><span>${word.emoji}</span><div><small>Paso ${index+1}</small><strong>${word.syllables.join(' · ')}</strong></div><b>${completed.includes(`word-${word.id}`)?'✓':'→'}</b></a>`).join('')}</div></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Sonido inicial</span><h2>¿Qué palabra empieza por M?</h2></div></div><a class="mini-wide-challenge ${completed.includes('sound-m')?'done':''}" href="#mini-sonido/m"><span>👂</span><div><strong>La cueva del sonido M</strong><small>Escucha y elige entre tres dibujos.</small></div><b>${completed.includes('sound-m')?'✓':'Jugar'}</b></a></section>
    <section class="mini-section"><div class="mini-section-title"><div><span class="mini-label">Biblioteca pequeña</span><h2>Cuentos para escuchar juntos</h2></div></div><div class="mini-story-grid">${miniStories.map(story=>`<a href="#mini-cuento/${story.id}"><span>${story.emoji}</span><strong>${story.title}</strong><small>${story.syllables.join(' · ')}</small></a>`).join('')}</div></section>
    <p class="mini-grownup-note">👨‍👩‍👦 Mejor acompañado: un adulto puede escuchar, repetir y celebrar contigo.</p>
  </div>`;
}
