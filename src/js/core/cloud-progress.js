import {store} from './store.js';
import {getCloudProgress,getEmailAccount,onEmailAccountChange,saveCloudProgress} from './hostinger-api.js';

let applyingCloud=false;
let saveTimer;

const uniqueBy = (items,key) => [...new Map(items.map(item=>[key(item),item])).values()];
const dateValue = value => Number.isFinite(Date.parse(value)) ? Date.parse(value) : 0;

function mergeProgress(local,cloud,userId) {
  if (!cloud) return local;
  const localIsNewer=dateValue(local._updatedAt)>=dateValue(cloud._updatedAt);
  const recent=localIsNewer?local:cloud;
  return {
    ...cloud,...local,...recent,
    stars:Math.max(local.stars||0,cloud.stars||0),
    xp:Math.max(local.xp||0,cloud.xp||0),
    streak:Math.max(local.streak||0,cloud.streak||0),
    completed:[...new Set([...(cloud.completed||[]),...(local.completed||[])])],
    sessions:uniqueBy([...(cloud.sessions||[]),...(local.sessions||[])],item=>`${item.id}|${item.date}`),
    readingAttempts:uniqueBy([...(cloud.readingAttempts||[]),...(local.readingAttempts||[])],item=>`${item.id}|${item.date}`),
    settings:{...(localIsNewer?cloud.settings:local.settings),...(recent.settings||{})},
    profile:{...(localIsNewer?cloud.profile:local.profile),...(recent.profile||{})},
    puzzle:{...(localIsNewer?cloud.puzzle:local.puzzle),...(recent.puzzle||{}),pieces:[...new Set([...(cloud.puzzle?.pieces||[]),...(local.puzzle?.pieces||[])])]},
    _updatedAt:new Date(Math.max(dateValue(local._updatedAt),dateValue(cloud._updatedAt),Date.now())).toISOString(),
    _cloudUserId:userId
  };
}

export async function syncProgressWithCloud() {
  const user=await getEmailAccount();
  if (!user) return false;
  const remote=await getCloudProgress();
  let local=store.get();
  if (local._cloudUserId && local._cloudUserId!==user.id) {
    store.reset();
    local=store.get();
  }
  const merged=mergeProgress(local,remote.progress,user.id);
  merged._cloudUserId=user.id;
  applyingCloud=true;
  try { store.save(merged); await saveCloudProgress(store.get()); }
  finally { applyingCloud=false; }
  window.dispatchEvent(new CustomEvent('cloudprogresssynced'));
  return true;
}

export function setupCloudProgress() {
  const upload=async()=>{
    if (applyingCloud) return;
    try { if (await getEmailAccount()) await saveCloudProgress(store.get()); }
    catch (error) { console.warn('Progreso pendiente de sincronizar:',error.message); }
  };
  addEventListener('progresschange',()=>{
    if (applyingCloud) return;
    clearTimeout(saveTimer); saveTimer=setTimeout(upload,900);
  });
  onEmailAccountChange(event=>{
    if (event==='SIGNED_IN'||event==='PASSWORD_UPDATED') syncProgressWithCloud().catch(error=>console.warn('No se pudo sincronizar:',error.message));
  });
  getEmailAccount().then(user=>{if(user)return syncProgressWithCloud();}).catch(()=>{});
}
