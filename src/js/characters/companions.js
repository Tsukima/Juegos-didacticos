import {characters} from './characters.js';

export const companionKeys = ['kiwi', 'coco', 'lumo', 'mia', 'roki', 'hilito', 'turbo'];
export const companion = key => characters[companionKeys.includes(key) ? key : 'kiwi'];

export function puzzleMarkup(state, compact = false) {
  const mascot = companion(state.profile?.mascot);
  const pieces = state.puzzle?.pieces || [];
  const complete = pieces.length >= 6;
  return `<article class="card puzzle-card ${compact ? 'compact' : ''}">
    <div class="puzzle-copy"><p class="eyebrow">Rompecabezas de ${mascot.name}</p><h2>${complete ? '¡Colección completada!' : `${pieces.length} de 6 piezas`}</h2><p class="muted">${complete ? `${mascot.name} está listo para la próxima aventura.` : 'Cada nueva misión completada descubre una pieza.'}</p></div>
    <div class="puzzle-board ${complete ? 'complete' : ''}" role="img" aria-label="Rompecabezas de ${mascot.name}: ${pieces.length} de 6 piezas descubiertas"><div class="puzzle-art" aria-hidden="true">${mascot.image?`<img src="${mascot.image}" alt="">`:mascot.emoji}</div><div class="puzzle-grid">${Array.from({length:6}, (_, index) => `<span class="puzzle-piece ${pieces.includes(index + 1) ? 'revealed' : ''}">${pieces.includes(index + 1) ? '' : index + 1}</span>`).join('')}</div></div>
  </article>`;
}
