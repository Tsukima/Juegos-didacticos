import {supabase} from './supabase.js';

const redirectUrl = () => `${location.origin}${location.pathname}`;

export async function getEmailAccount() {
  const {data: {session}, error} = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user?.email ? session.user : null;
}

export async function registerWithEmail(email, password) {
  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {emailRedirectTo: redirectUrl()}
  });
  if (error) throw error;
  return {user: data.user, needsConfirmation: !data.session};
}

export async function signInWithEmail(email, password) {
  const {data, error} = await supabase.auth.signInWithPassword({email, password});
  if (error) throw error;
  return data.user;
}

export async function sendPasswordReset(email) {
  const {error} = await supabase.auth.resetPasswordForEmail(email, {redirectTo: redirectUrl()});
  if (error) throw error;
}

export async function updatePassword(password) {
  const {error} = await supabase.auth.updateUser({password});
  if (error) throw error;
}

export async function signOutEmailAccount() {
  const {error} = await supabase.auth.signOut();
  if (error) throw error;
}

export function onEmailAccountChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => callback(event, session?.user?.email ? session.user : null));
}
