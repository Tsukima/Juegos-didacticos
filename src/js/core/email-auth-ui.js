import {
  getEmailAccount,
  onEmailAccountChange,
  registerWithEmail,
  sendPasswordReset,
  signInWithEmail,
  signOutEmailAccount,
  updatePassword
} from './email-auth.js';

const friendlyError = error => {
  const message = (error?.message || '').toLowerCase();
  if (message.includes('invalid login credentials')) return 'El correo o la contraseña no son correctos.';
  if (message.includes('email not confirmed')) return 'Confirma tu correo desde el mensaje que te enviamos.';
  if (message.includes('user already registered')) return 'Este correo ya tiene una cuenta. Prueba a iniciar sesión.';
  if (message.includes('password should be')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (message.includes('rate limit')) return 'Espera un momento antes de volver a intentarlo.';
  return 'No pudimos completar la acción. Revisa la conexión e inténtalo de nuevo.';
};

export function setupEmailAuth(toast) {
  const dialog = document.querySelector('#auth-dialog');
  const accountButton = document.querySelector('#account-button');
  const label = document.querySelector('#account-label');
  const form = document.querySelector('#auth-form');
  const guestView = document.querySelector('#auth-guest-view');
  const userView = document.querySelector('#auth-user-view');
  const message = document.querySelector('#auth-message');
  let mode = 'login';

  const setMessage = (text = '', type = '') => {
    message.textContent = text;
    message.className = `auth-message ${type}`.trim();
  };

  const setMode = nextMode => {
    mode = nextMode;
    document.querySelectorAll('[data-auth-mode]').forEach(button => button.classList.toggle('active', button.dataset.authMode === mode));
    document.querySelector('#auth-submit').textContent = mode === 'register' ? 'Crear cuenta' : 'Entrar';
    document.querySelector('#auth-password').autocomplete = mode === 'register' ? 'new-password' : 'current-password';
    setMessage();
  };

  const paintAccount = user => {
    const signedIn = Boolean(user);
    accountButton.classList.toggle('signed-in', signedIn);
    label.textContent = signedIn ? 'Mi cuenta' : 'Entrar';
    guestView.hidden = signedIn;
    userView.hidden = !signedIn;
    document.querySelector('#account-email').textContent = user?.email || '';
  };

  const open = async () => {
    setMessage();
    try { paintAccount(await getEmailAccount()); } catch { paintAccount(null); }
    dialog.showModal();
  };

  accountButton.addEventListener('click', open);
  document.querySelector('#auth-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.querySelectorAll('[data-auth-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.authMode)));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const email = document.querySelector('#auth-email').value.trim();
    const password = document.querySelector('#auth-password').value;
    const submit = document.querySelector('#auth-submit');
    submit.disabled = true;
    setMessage('Un momento…');
    try {
      if (mode === 'register') {
        const result = await registerWithEmail(email, password);
        if (result.needsConfirmation) {
          setMessage('Cuenta creada. Revisa tu correo y pulsa el enlace de confirmación.', 'success');
          return;
        }
        toast('Cuenta creada. Tu progreso ya está protegido.');
      } else {
        await signInWithEmail(email, password);
        toast('Sesión iniciada');
      }
      paintAccount(await getEmailAccount());
      form.reset();
    } catch (error) {
      setMessage(friendlyError(error), 'error');
    } finally {
      submit.disabled = false;
    }
  });

  document.querySelector('#auth-reset').addEventListener('click', async () => {
    const email = document.querySelector('#auth-email').value.trim();
    if (!email) return setMessage('Escribe primero tu correo.', 'error');
    try {
      await sendPasswordReset(email);
      setMessage('Te enviamos un enlace para cambiar la contraseña.', 'success');
    } catch (error) { setMessage(friendlyError(error), 'error'); }
  });

  document.querySelector('#auth-signout').addEventListener('click', async () => {
    try {
      await signOutEmailAccount();
      paintAccount(null);
      dialog.close();
      toast('Sesión cerrada');
    } catch (error) { setMessage(friendlyError(error), 'error'); }
  });

  onEmailAccountChange((event, user) => {
    paintAccount(user);
    if (event !== 'PASSWORD_RECOVERY') return;
    setTimeout(async () => {
      const password = prompt('Escribe tu nueva contraseña (mínimo 6 caracteres):');
      if (!password) return;
      try {
        await updatePassword(password);
        toast('Contraseña actualizada');
      } catch (error) { setMessage(friendlyError(error), 'error'); }
    }, 0);
  });
  getEmailAccount().then(paintAccount).catch(() => paintAccount(null));
}
