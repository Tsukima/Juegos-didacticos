import {supabase} from './supabase.js';

const authRedirect = () => `${location.origin}${location.pathname}#adultos`;

export async function getAccount() {
  const {data: {session}, error} = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user && !session.user.is_anonymous ? session.user : null;
}

export async function registerWithEmail(email, password) {
  const {data: {session}} = await supabase.auth.getSession();
  if (session?.user?.is_anonymous) {
    const {data, error} = await supabase.auth.updateUser(
      {email, password},
      {emailRedirectTo: authRedirect()}
    );
    if (error) throw error;
    return {user: data.user, needsConfirmation: !data.user?.email_confirmed_at};
  }
  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {emailRedirectTo: authRedirect()}
  });
  if (error) throw error;
  return {user: data.user, needsConfirmation: !data.session};
}

export async function signInWithEmail(email, password) {
  const {data, error} = await supabase.auth.signInWithPassword({email, password});
  if (error) throw error;
  return data.user;
}

export async function signInWithGoogle() {
  const {error} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {redirectTo: authRedirect()}
  });
  if (error) throw error;
}

export async function sendPasswordReset(email) {
  const {error} = await supabase.auth.resetPasswordForEmail(email, {redirectTo: authRedirect()});
  if (error) throw error;
}

export async function signOutAccount() {
  const {error} = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAccountChange(callback) {
  const {data} = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user && !session.user.is_anonymous ? session.user : null);
  });
  return () => data.subscription.unsubscribe();
}
