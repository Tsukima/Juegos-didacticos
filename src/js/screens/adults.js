import {store,todayCount} from '../core/store.js';
import {getReadingRecordings} from '../core/supabase.js';

const escapeHtml = text => String(text).replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

const formatDuration = milliseconds => {
  const seconds = Math.max(0, Math.round((milliseconds || 0) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

export function adultsScreen() {
  const s = store.get();
  const reads = s.readingAttempts || [];
  const average = reads.length ? Math.round(reads.reduce((n,x) => n + x.score, 0) / reads.length) : 0;
  return `<p class="eyebrow">Zona de acompañamiento</p><h1>Panel para adultos</h1><p class="source-note">Este panel evita rankings, notas y tiempos de respuesta. Prioriza constancia, autonomía y bienestar.</p><section class="section grid"><article class="card stat"><strong>${s.completed.length}</strong>Misiones únicas</article><article class="card stat"><strong>${todayCount(s)}</strong>Hoy</article><article class="card stat"><strong>${reads.length}</strong>Lecturas comprobadas</article></section><section class="section card"><p class="eyebrow">Progreso lector</p><h2>${reads.length ? `${average}% reconocido de media` : 'Todavía no hay lecturas comprobadas'}</h2><div class="progress"><span style="width:${average}%"></span></div><p class="muted">Es una orientación del reconocimiento de voz, no una nota ni un diagnóstico.</p></section><section class="section card recordings-panel"><div class="section-head"><div><p class="eyebrow">Seguimiento de lectura</p><h2>Grabaciones realizadas</h2></div><button class="button secondary small" id="refresh-recordings" type="button">Actualizar</button></div><p class="muted">Sólo se muestran las grabaciones privadas vinculadas a este dispositivo.</p><div id="recordings-list" aria-live="polite"><p class="recordings-loading">Cargando grabaciones…</p></div></section><section class="section grid two"><article class="card"><h2>Preferencias</h2><label>Nombre de aventura<input id="profile-name" value="${escapeHtml(s.profile.name)}" maxlength="20" style="display:block;width:100%;margin:.5rem 0 1rem;padding:.7rem;border:1px solid var(--line);border-radius:12px"></label><label>Objetivo diario<select id="daily-goal" style="display:block;width:100%;margin:.5rem 0;padding:.7rem;border:1px solid var(--line);border-radius:12px"><option value="2" ${s.settings.dailyGoal===2?'selected':''}>2 misiones</option><option value="3" ${s.settings.dailyGoal===3?'selected':''}>3 misiones</option><option value="4" ${s.settings.dailyGoal===4?'selected':''}>4 misiones</option></select></label><label class="consent-box"><input id="save-audio" type="checkbox" ${s.settings.saveAudio?'checked':''}><span><strong>Guardar audios en Supabase</strong><small>Confirmo que soy el adulto responsable y autorizo guardar las lecturas como .opus en un espacio privado.</small></span></label><button class="button" id="save-settings">Guardar</button></article><article class="card"><h2>Privacidad</h2><p>Los audios sólo se suben cuando esta autorización está activa. Cada dispositivo accede únicamente a sus propios archivos.</p><button class="button coral" id="reset-progress">Borrar progreso local</button></article></section><section class="section card"><h2>Sugerencias de acompañamiento</h2><ul><li>Ofrecer una misión, no imponer una sesión larga.</li><li>Celebrar estrategia y esfuerzo: «Pediste una pista; eso fue inteligente».</li><li>Ante burlas, escuchar y creer primero; documentar, bloquear, reportar y coordinar con el centro o plataforma.</li><li>Terminar en un éxito pequeño para proteger la motivación.</li></ul></section>`;
}

export async function loadAdultRecordings() {
  const container = document.querySelector('#recordings-list');
  const refresh = document.querySelector('#refresh-recordings');
  if (!container) return;
  refresh?.setAttribute('disabled', '');
  container.innerHTML = '<p class="recordings-loading">Cargando grabaciones privadas…</p>';
  try {
    const recordings = await getReadingRecordings();
    if (!recordings.length) {
      container.innerHTML = '<div class="empty compact"><strong>Todavía no hay audios guardados.</strong><p>Activa el guardado y completa una lectura para verla aquí.</p></div>';
      return;
    }
    container.innerHTML = `<div class="recordings-list">${recordings.map(item => `
      <article class="recording-item">
        <div class="recording-info"><strong>${escapeHtml(item.exercise_id)}</strong><span>${new Date(item.created_at).toLocaleString('es-ES', {dateStyle:'medium', timeStyle:'short'})} · ${formatDuration(item.duration_ms)}</span></div>
        <span class="pill ${item.passed ? '' : 'warm'}">${item.passed ? 'Lectura lograda' : 'En práctica'} · ${item.score}%</span>
        ${item.audioUrl ? `<audio controls preload="none" src="${escapeHtml(item.audioUrl)}">Tu navegador no puede reproducir este audio.</audio>` : '<span class="muted">Audio no disponible</span>'}
      </article>`).join('')}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="source-note"><strong>No se pudieron cargar las grabaciones.</strong><br>${escapeHtml(error.message || 'Revisa la conexión con Supabase.')}</div>`;
  } finally {
    refresh?.removeAttribute('disabled');
  }
}

export function bindAdultRecordings() {
  if (!document.querySelector('#recordings-list')) return;
  document.querySelector('#refresh-recordings')?.addEventListener('click', loadAdultRecordings);
  loadAdultRecordings();
}
