import {store} from '../core/store.js';
import {miniTopics,miniTopicGroups,miniStories} from '../mini/mini-data.js';

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
    <section class="mini-section" id="mini-temas"><div class="mini-section-title"><div><span class="mini-label">Programa psicopedagógico</span><h2>20 temas para aprender jugando</h2></div><strong>200 cuentos</strong></div><p class="mini-program-note">Cada unidad incluye sonido inicial, cinco palabras con sílabas, diez cuentos comprensivos y una actividad sin pantalla. Duración sugerida: 8–12 minutos.</p>${miniTopicGroups.map(group=>`<section class="mini-topic-group"><header><span>${group.emoji}</span><div><small>Bloque de trabajo</small><h3>${group.title}</h3></div><b>${miniTopics.filter(topic=>topic.group===group.id).length} temas</b></header><div class="mini-topic-grid">${miniTopics.filter(topic=>topic.group===group.id).map(topic=>{const stories=miniStories.filter(story=>story.topic===topic.id),total=topic.wordIds.length+1+stories.length;const done=topic.wordIds.filter(id=>completed.includes(`word-${id}`)).length+(completed.includes(`sound-${topic.sound}`)?1:0)+stories.filter(story=>completed.includes(`story-${story.id}`)).length;return `<a href="#mini-tema/${topic.id}" class="mini-topic-card"><span>${topic.emoji}</span><div><strong>${topic.title}</strong><small>${topic.subtitle} · 10 cuentos</small><div class="mini-topic-progress"><i style="width:${done/total*100}%"></i></div><em>${done} de ${total} actividades</em></div><b>→</b></a>`}).join('')}</div></section>`).join('')}</section>
    <p class="mini-grownup-note">👨‍👩‍👦 Mejor acompañado: un adulto puede escuchar, repetir y celebrar contigo.</p>
  </div>`;
}
