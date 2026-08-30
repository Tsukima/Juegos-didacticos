const configuredBase = window.TINKIE_CONFIG?.apiBase || './api/index.php';
const apiBase = new URL(configuredBase, document.baseURI).toString();
const listeners = new Set();
let sessionState = {loaded:false, user:null, csrfToken:''};

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'No pudimos conectar con el servidor.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function request(action, {method='GET', body, form=false, csrf=false} = {}) {
  if (csrf && !sessionState.csrfToken) await getSession(true);
  const headers = {Accept:'application/json'};
  if (!form && body !== undefined) headers['Content-Type'] = 'application/json';
  if (csrf) headers['X-CSRF-Token'] = sessionState.csrfToken;
  const response = await fetch(`${apiBase}?action=${encodeURIComponent(action)}`, {
    method, headers, credentials:'same-origin',
    body:body === undefined ? undefined : (form ? body : JSON.stringify(body))
  });
  return parseResponse(response);
}

function notify(event) { listeners.forEach(listener => listener(event, sessionState.user)); }

export async function getSession(force=false) {
  if (sessionState.loaded && !force) return sessionState;
  const data=await request('session');
  sessionState={loaded:true,user:data.user||null,csrfToken:data.csrfToken||''};
  return sessionState;
}

export async function getEmailAccount() { return (await getSession()).user; }
export async function registerWithEmail(email,password) {
  const data=await request('register',{method:'POST',body:{email,password},csrf:true});
  sessionState={loaded:true,user:data.user,csrfToken:data.csrfToken}; notify('SIGNED_IN');
  return {user:data.user,needsConfirmation:false};
}
export async function signInWithEmail(email,password) {
  const data=await request('login',{method:'POST',body:{email,password},csrf:true});
  sessionState={loaded:true,user:data.user,csrfToken:data.csrfToken}; notify('SIGNED_IN'); return data.user;
}
export async function signOutEmailAccount() {
  await request('logout',{method:'POST',body:{},csrf:true});
  sessionState={loaded:false,user:null,csrfToken:''}; await getSession(true); notify('SIGNED_OUT');
}
export async function sendPasswordReset(email) { return request('password-request',{method:'POST',body:{email},csrf:true}); }
export async function updatePassword(password) {
  const token=new URLSearchParams(location.search).get('reset');
  if (!token) throw new Error('El enlace para cambiar la contraseña no es válido.');
  const data=await request('password-confirm',{method:'POST',body:{token,password},csrf:true});
  sessionState={loaded:true,user:data.user,csrfToken:data.csrfToken};
  history.replaceState({},'',`${location.pathname}${location.hash||'#inicio'}`); notify('PASSWORD_UPDATED');
}
export function onEmailAccountChange(callback) { listeners.add(callback); return {data:{subscription:{unsubscribe:()=>listeners.delete(callback)}}}; }

export async function getCloudProgress() { return request('progress'); }
export async function saveCloudProgress(progress) { return request('progress',{method:'PUT',body:{progress},csrf:true}); }
export async function uploadReadingAudio(blob,{exerciseId,score,passed,durationMs}) {
  const form=new FormData(); form.append('audio',blob,`${crypto.randomUUID()}.opus`); form.append('exerciseId',exerciseId);
  form.append('score',String(Math.round(score*100))); form.append('passed',String(Boolean(passed))); form.append('durationMs',String(Math.round(durationMs)));
  return request('recording-upload',{method:'POST',body:form,form:true,csrf:true});
}
export async function getReadingRecordings() { const data=await request('recordings'); return data.recordings||[]; }
export async function getCloudReadingSummary() {
  const rows=await getReadingRecordings(); return {count:rows.length,average:rows.length?Math.round(rows.reduce((sum,row)=>sum+row.score,0)/rows.length):0};
}
export const authRedirectType=new URLSearchParams(location.search).has('reset')?'recovery':null;
