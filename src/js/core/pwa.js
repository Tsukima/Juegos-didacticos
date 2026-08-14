export function setupPwaInstall(notify) {
  if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  const button = document.querySelector('#install-app');
  if (!button) return;
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let installPrompt;
  if (ios && !standalone) button.hidden = false;
  addEventListener('beforeinstallprompt', event => {event.preventDefault();installPrompt=event;button.hidden=false});
  addEventListener('appinstalled', () => {installPrompt=null;button.hidden=true;notify('Tinkie se ha instalado correctamente')});
  button.addEventListener('click', async () => {
    if (installPrompt) {await installPrompt.prompt();installPrompt=null;return}
    if (ios) notify('En Safari: toca Compartir y después “Añadir a pantalla de inicio”');
  });
}
