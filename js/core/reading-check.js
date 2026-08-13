const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const normalize = text => text
  .toLocaleLowerCase('es')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zñ0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const readingScore = (expected, heard) => {
  const wanted = normalize(expected).split(' ').filter(Boolean);
  const spoken = normalize(heard).split(' ').filter(Boolean);
  if (!wanted.length || !spoken.length) return 0;
  const remaining = [...spoken];
  const hits = wanted.reduce((total, word) => {
    const index = remaining.indexOf(word);
    if (index < 0) return total;
    remaining.splice(index, 1);
    return total + 1;
  }, 0);
  return hits / wanted.length;
};

export const readingCheckMarkup = () => `
  <section class="reading-check" aria-labelledby="reading-check-title">
    <div class="reading-check-head">
      <div>
        <p class="eyebrow">Comprobador de lectura</p>
        <h3 id="reading-check-title">Lee el texto en voz alta</h3>
      </div>
      <span class="privacy-chip">🔒 No guardamos el audio</span>
    </div>
    <button class="button record-reading" type="button">🎙️ Grabar lectura</button>
    <p class="recording-hint muted">Acepta el permiso del micrófono y lee a tu ritmo.</p>
    <div class="reading-result" role="status" aria-live="polite" hidden></div>
  </section>`;

export function bindReadingCheck(root, targetText) {
  const button = root?.querySelector('.record-reading');
  const result = root?.querySelector('.reading-result');
  const hint = root?.querySelector('.recording-hint');
  if (!button || !result) return;

  if (!SpeechRecognition) {
    button.disabled = true;
    hint.textContent = 'Este navegador no permite comprobar la voz. Puedes usar Chrome o Edge, o continuar leyendo con un adulto.';
    return;
  }

  let activeRecognition;
  button.addEventListener('click', () => {
    if (activeRecognition) {
      activeRecognition.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    activeRecognition = recognition;
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    button.classList.add('recording');
    button.textContent = '■ Terminar';
    button.setAttribute('aria-pressed', 'true');
    hint.textContent = 'Escuchando… Lee sin prisa.';
    result.hidden = true;

    recognition.onresult = event => {
      const alternatives = [...event.results[0]].map(item => ({
        transcript: item.transcript,
        score: readingScore(targetText, item.transcript)
      })).sort((a, b) => b.score - a.score);
      const best = alternatives[0];
      const shortText = normalize(targetText).split(' ').length <= 2;
      const passed = best.score >= (shortText ? 1 : .65);
      result.hidden = false;
      result.className = `reading-result ${passed ? 'success' : 'try'}`;
      result.innerHTML = passed
        ? `<strong>¡Lectura comprobada!</strong><span>He entendido: “${best.transcript}”. Tu voz abre el camino.</span>`
        : `<strong>Te he oído. Vamos otra vez con calma.</strong><span>He entendido: “${best.transcript}”. Acércate al micrófono o escucha el modelo antes de repetir.</span>`;
    };

    recognition.onerror = event => {
      result.hidden = false;
      result.className = 'reading-result try';
      const denied = event.error === 'not-allowed' || event.error === 'service-not-allowed';
      result.innerHTML = denied
        ? '<strong>Necesitamos permiso para escuchar.</strong><span>Activa el micrófono en el candado de la barra del navegador. También puedes continuar sin grabar.</span>'
        : '<strong>No he podido oírte bien.</strong><span>Comprueba el micrófono y vuelve a probar cuando quieras.</span>';
    };

    recognition.onend = () => {
      activeRecognition = null;
      button.classList.remove('recording');
      button.textContent = '🎙️ Volver a grabar';
      button.setAttribute('aria-pressed', 'false');
      hint.textContent = 'La grabación ha terminado y no se conserva.';
    };

    try { recognition.start(); } catch { recognition.abort(); }
  });
}
