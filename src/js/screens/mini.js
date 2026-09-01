import {store} from '../core/store.js';
import {miniTopics} from '../mini/mini-data.js';

export function miniScreen() {
  const state=store.get();
  const completed=state.mini?.completed||[], eggs=state.mini?.eggs||0;
  return `<div class="mini-world">
    <section class="mini-hero">
      <div><span class="mini-label">Mini Aventuras · 6 años</span><h1>¡Hola! Soy Roki.</h1><p>Elige un tema y estudia sonidos, sílabas y cuentos a tu ritmo.</p><div class="mini-actions"><a class="mini-button" href="#mini-tema/dinosaurios">🦕 Empezar dinosaurios</a><a class="mini-button mini-button-light" href="#mini-temas">📚 Ver temas</a></div></div>
      <div class="mini-roki" role="img" aria-label="Roki, un dinosaurio verde y amable">🦕</div>
    </section>
    <section class="mini-path" aria-label="Tu aventura en tres pasos"><h2>Hoy haremos tres cosas</h2><div><span><b>1</b> Escuchar</span><span><b>2</b> Juntar</span><span><b>3</b> Leer</span></div></section>
    <section class="mini-grid"><article class="mini-card"><span>👂</span><h2>Sonidos</h2><p>Escucha una palabra sin prisa.</p></article><article class="mini-card"><span>🧩</span><h2>Sílabas</h2><p>Une dos piezas para construirla.</p></article><article class="mini-card mini-collection"><span>🥚</span><h2>${eggs} huevos</h2><p>Cada intento descubre algo nuevo.</p></article></section>
    <section class="mini-section" id="mini-temas"><div class="mini-section-title"><div><span class="mini-label">Unidades para estudiar</span><h2>¿Qué mundo exploramos?</h2></div><strong>${miniTopics.length} temas</strong></div><div class="mini-topic-grid">${miniTopics.map(topic=>{const done=topic.wordIds.filter(id=>completed.includes(`word-${id}`)).length+(completed.includes(`sound-${topic.sound}`)?1:0)+(completed.includes(`story-${topic.story}`)?1:0);return `<a href="#mini-tema/${topic.id}" class="mini-topic-card"><span>${topic.emoji}</span><div><strong>${topic.title}</strong><small>${topic.subtitle}</small><div class="mini-topic-progress"><i style="width:${done/7*100}%"></i></div><em>${done} de 7 actividades</em></div><b>→</b></a>`}).join('')}</div></section>
    <p class="mini-grownup-note">👨‍👩‍👦 Mejor acompañado: un adulto puede escuchar, repetir y celebrar contigo.</p>
  </div>`;
}
