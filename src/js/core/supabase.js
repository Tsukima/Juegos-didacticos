import {createClient} from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yicqgbycigyhniaozrez.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_n5dj4O0Y7xrnJsukglPziw_yMznAPA2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: false}
});

export async function ensureAnonymousSession() {
  const {data: {session}} = await supabase.auth.getSession();
  if (session) return session;
  const {data, error} = await supabase.auth.signInAnonymously();
  if (error?.code === 'anonymous_provider_disabled') {
    throw new Error('El guardado privado aún no está activado en Supabase. Un adulto debe habilitar los inicios de sesión anónimos.');
  }
  if (error) throw error;
  return data.session;
}

export async function uploadReadingAudio(blob, {exerciseId, score, passed, durationMs}) {
  const session = await ensureAnonymousSession();
  const userId = session.user.id;
  const filename = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID()}.opus`;
  const path = `${userId}/${filename}`;
  const {error: uploadError} = await supabase.storage.from('reading-audios').upload(path, blob, {
    contentType: 'audio/ogg',
    cacheControl: '0',
    upsert: false
  });
  if (uploadError) throw uploadError;

  const {error: rowError} = await supabase.from('reading_recordings').insert({
    user_id: userId,
    exercise_id: exerciseId,
    storage_path: path,
    score: Math.round(score * 100),
    passed,
    duration_ms: Math.max(0, Math.min(300000, Math.round(durationMs))),
    byte_size: blob.size,
    mime_type: 'audio/ogg'
  });
  if (rowError) {
    await supabase.storage.from('reading-audios').remove([path]);
    throw rowError;
  }
  return path;
}

export async function getCloudReadingSummary() {
  const session = await ensureAnonymousSession();
  if (!session) return {count: 0, average: 0};
  const {data, error} = await supabase.from('reading_recordings').select('score');
  if (error) throw error;
  return {
    count: data.length,
    average: data.length ? Math.round(data.reduce((sum, row) => sum + row.score, 0) / data.length) : 0
  };
}

export async function getReadingRecordings() {
  await ensureAnonymousSession();
  const {data, error} = await supabase
    .from('reading_recordings')
    .select('id, exercise_id, storage_path, score, passed, duration_ms, created_at')
    .order('created_at', {ascending: false})
    .limit(50);
  if (error) throw error;
  if (!data.length) return [];

  const {data: signedFiles, error: signedError} = await supabase.storage
    .from('reading-audios')
    .createSignedUrls(data.map(item => item.storage_path), 600);
  if (signedError) throw signedError;
  return data.map((item, index) => ({...item, audioUrl: signedFiles[index]?.signedUrl || null}));
}
