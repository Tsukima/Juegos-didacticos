import {supabase} from '../js/core/supabase.js';

const root = document.querySelector('#app');
let state = {user:null, apps:[], proposals:[], reviews:[], agents:[]};

const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const statusName = value => ({active:'Activa',configuration:'Por enlazar',paused:'Pausada',pending:'Pendiente',approved:'Aprobada',changes_requested:'Cambios pedidos',rejected:'Rechazada',published:'Publicada',ready:'Listo',running:'Trabajando',success:'Completado',failed:'Con error'}[value] || value);
const formatDate = value => new Intl.DateTimeFormat('es-ES',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));

function loginView(message=''){
  root.innerHTML = `<section class="login"><form class="login-card" id="login-form">
    <div class="brand"><span class="brand-mark">🧭</span> Panel Angsys</div>
    <p class="eyebrow">Espacio privado</p><h1>Tus aplicaciones, en un solo lugar</h1>
    <p>Entra con la cuenta adulta de Tinkie para revisar contenido y administrar tus proyectos.</p>
    <label for="email">Correo</label><input class="field" id="email" type="email" autocomplete="email" required>
    <label for="password">Contraseña</label><input class="field" id="password" type="password" autocomplete="current-password" required>
    <button class="primary" type="submit">Entrar al panel</button><p class="message" role="alert">${esc(message)}</p>
  </form></section>`;
  document.querySelector('#login-form').addEventListener('submit', signIn);
}

async function signIn(event){
  event.preventDefault(); const button=event.submitter; button.disabled=true;
  const email=document.querySelector('#email').value.trim(); const password=document.querySelector('#password').value;
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error){button.disabled=false;document.querySelector('.message').textContent='No pudimos iniciar sesión. Revisa el correo y la contraseña.';return;}
  await boot();
}

async function boot(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){loginView();return;}
  const {data:membership,error:membershipError}=await supabase.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
  if(membershipError || !membership){await supabase.auth.signOut();loginView('Esta cuenta no tiene acceso al panel administrador.');return;}
  state.user=user;
  const [apps,proposals,reviews,agents]=await Promise.all([
    supabase.from('managed_apps').select('*').order('name'),
    supabase.from('content_proposals').select('*').order('created_at',{ascending:false}),
    supabase.from('proposal_reviews').select('*, content_proposals(title,app_id)').order('created_at',{ascending:false}).limit(30),
    supabase.from('agent_runs').select('*').order('created_at',{ascending:false})
  ]);
  const failed=[apps,proposals,reviews,agents].find(result=>result.error); if(failed){loginView('No pudimos cargar el panel. Inténtalo de nuevo.');return;}
  Object.assign(state,{apps:apps.data,proposals:proposals.data,reviews:reviews.data,agents:agents.data}); render();
}

function render(){
  const pending=state.proposals.filter(item=>item.status==='pending').length;
  root.innerHTML=`<div class="shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">🧭</span> Panel Angsys</div>
    <nav class="nav" aria-label="Panel"><button class="active" data-view="summary">⌂ Resumen</button><button data-view="proposals">✓ Propuestas</button><button data-view="apps">▦ Apps</button><button data-view="agents">⚙ Agentes</button><button data-view="history">↺ Historial</button></nav>
    <div class="sidebar-foot"><small>${esc(state.user.email)}</small><button class="secondary" id="signout">Cerrar sesión</button></div></aside>
    <main class="workspace"><header class="topbar"><div><p class="eyebrow">Centro de control</p><h1 id="view-title">Buenos días</h1><p>Decide qué entra en tus aplicaciones con calma y desde un solo lugar.</p></div><button class="secondary" id="refresh">↻ Actualizar</button></header>
      <section class="view active" id="summary">${stats(pending)}${appsBlock()}${proposalBlock(state.proposals.filter(p=>p.status==='pending').slice(0,3),'Por revisar')}</section>
      <section class="view" id="proposals">${proposalBlock(state.proposals,'Todas las propuestas')}</section>
      <section class="view" id="apps">${appsBlock('Aplicaciones conectadas')}</section>
      <section class="view" id="agents">${agentsBlock()}</section>
      <section class="view" id="history">${historyBlock()}</section>
    </main></div><dialog class="modal" id="proposal-modal"></dialog>`;
  wire();
}

function stats(pending){return `<div class="stats"><article class="stat"><span>Aplicaciones</span><strong>${state.apps.length}</strong><small>en tu panel</small></article><article class="stat"><span>Por revisar</span><strong>${pending}</strong><small>decisiones pendientes</small></article><article class="stat"><span>Agentes</span><strong>${state.agents.filter(a=>a.status==='ready').length}</strong><small>preparados</small></article></div>`;}
function appsBlock(title='Tus aplicaciones'){return `<div class="section-head"><h2>${title}</h2></div><div class="apps">${state.apps.map(app=>`<article class="card app-card"><div class="app-title"><span class="app-icon">${esc(app.icon)}</span><div><h3>${esc(app.name)}</h3><span class="badge ${esc(app.status)}">${statusName(app.status)}</span></div></div><p>${esc(app.description)}</p><div class="app-actions">${app.public_url?`<a class="secondary" href="${esc(app.public_url)}" target="_blank" rel="noopener">Abrir web</a>`:'<span class="badge configuration">Falta dominio</span>'}${app.repository_url?`<a class="secondary" href="${esc(app.repository_url)}" target="_blank" rel="noopener">GitHub</a>`:'<span class="badge configuration">Falta repositorio</span>'}</div></article>`).join('')}</div>`;}
function proposalBlock(items,title){return `<div class="section-head"><h2>${title}</h2><span>${items.length}</span></div><div class="list">${items.length?items.map(p=>`<article class="card proposal"><div><span class="eyebrow">${esc(p.app_id)} · ${esc(p.kind)}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><div class="proposal-meta"><span class="badge">${statusName(p.status)}</span><span>${formatDate(p.created_at)}</span></div></div><div class="proposal-actions"><button class="secondary" data-preview="${p.id}">Ver propuesta</button>${p.status==='pending'?`<button class="primary" data-review="${p.id}" data-decision="approved">Aprobar</button>`:''}</div></article>`).join(''):'<div class="card empty">No hay propuestas en esta sección.</div>'}</div>`;}
function agentsBlock(){return `<div class="section-head"><h2>Agentes de contenido</h2></div><div class="list">${state.agents.map(a=>`<article class="card agent"><div><span class="eyebrow">${esc(a.app_id)}</span><h3>${esc(a.agent_name)}</h3><p>${esc(a.summary)}</p></div><span class="badge">${statusName(a.status)}</span></article>`).join('')||'<div class="card empty">Aún no hay agentes conectados.</div>'}</div>`;}
function historyBlock(){return `<div class="section-head"><h2>Historial de decisiones</h2></div><div class="list">${state.reviews.map(r=>`<article class="card history-row"><div><strong>${esc(r.content_proposals?.title||'Propuesta')}</strong><br><span>${statusName(r.decision)}${r.comment?` · ${esc(r.comment)}`:''}</span></div><time>${formatDate(r.created_at)}</time></article>`).join('')||'<div class="card empty">Todavía no has tomado decisiones.</div>'}</div>`;}

function wire(){
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===button.dataset.view));document.querySelector('#view-title').textContent=button.textContent.replace(/^\S+\s/,'');}));
  document.querySelector('#signout').addEventListener('click',async()=>{await supabase.auth.signOut();loginView();}); document.querySelector('#refresh').addEventListener('click',boot);
  document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>openProposal(button.dataset.preview)));
  document.querySelectorAll('[data-review]').forEach(button=>button.addEventListener('click',()=>review(button.dataset.review,button.dataset.decision,'')));
}

function openProposal(id){
  const p=state.proposals.find(item=>item.id===id); const modal=document.querySelector('#proposal-modal'); const details=Object.entries(p.preview||{}).map(([key,value])=>`<p><strong>${esc(key)}:</strong> ${esc(Array.isArray(value)?value.join(' · '):value)}</p>`).join('');
  modal.innerHTML=`<div class="modal-body"><p class="eyebrow">${esc(p.app_id)} · Vista previa</p><h2>${esc(p.title)}</h2><p>${esc(p.summary)}</p><div class="preview">${details||'Sin vista previa adicional.'}</div>${p.source_url?`<p><a href="${esc(p.source_url)}" target="_blank" rel="noopener">Ver fuente en GitHub ↗</a></p>`:''}${p.status==='pending'?`<label for="review-comment"><strong>Comentario opcional</strong></label><textarea class="comment" id="review-comment" placeholder="Indica qué debería cambiar..."></textarea>`:''}<div class="modal-actions"><button class="secondary" data-close>Cerrar</button>${p.status==='pending'?`<button class="danger" data-modal-review="changes_requested">Pedir cambios</button><button class="danger" data-modal-review="rejected">Rechazar</button><button class="primary" data-modal-review="approved">Aprobar</button>`:''}</div></div>`;
  modal.querySelector('[data-close]').addEventListener('click',()=>modal.close()); modal.querySelectorAll('[data-modal-review]').forEach(button=>button.addEventListener('click',()=>review(id,button.dataset.modalReview,modal.querySelector('#review-comment').value))); modal.showModal();
}

async function review(id,decision,comment){
  const {error}=await supabase.rpc('review_content_proposal',{proposal:id,new_decision:decision,review_comment:comment||''});
  if(error){toast('No se pudo guardar la decisión.');return;} const modal=document.querySelector('#proposal-modal'); if(modal?.open)modal.close(); toast('Decisión guardada.'); await boot();
}
function toast(text){const node=document.createElement('div');node.className='toast';node.textContent=text;document.body.append(node);setTimeout(()=>node.remove(),2600);}

boot();
