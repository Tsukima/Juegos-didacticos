import OpusMediaRecorder from 'opus-media-recorder';
import EncoderWorker from 'opus-media-recorder/encoderWorker.umd.js?worker';
import OggOpusEncoderWasmPath from 'opus-media-recorder/OggOpusEncoder.wasm?url';

export async function startOpusRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {channelCount: 1, echoCancellation: true, noiseSuppression: true},
    video: false
  });
  const recorder = new OpusMediaRecorder(stream, {
    mimeType: 'audio/ogg',
    audioBitsPerSecond: 24000
  }, {
    encoderWorkerFactory: () => new EncoderWorker(),
    OggOpusEncoderWasmPath
  });
  const startedAt = performance.now();
  let stopped = false;
  recorder.start();

  return {
    stop() {
      if (stopped) return Promise.reject(new Error('La grabación ya terminó.'));
      stopped = true;
      return new Promise((resolve, reject) => {
        recorder.addEventListener('dataavailable', event => {
          stream.getTracks().forEach(track => track.stop());
          if (!event.data?.size) return reject(new Error('No se obtuvo audio.'));
          resolve({blob: event.data, durationMs: performance.now() - startedAt});
        }, {once: true});
        recorder.addEventListener('error', event => {
          stream.getTracks().forEach(track => track.stop());
          reject(event.error || new Error('No se pudo codificar el audio.'));
        }, {once: true});
        recorder.stop();
      });
    },
    cancel() {
      if (!stopped) {
        stopped = true;
        try { recorder.stop(); } catch {}
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };
}
