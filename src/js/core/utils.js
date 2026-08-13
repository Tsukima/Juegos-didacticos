export const shuffle=a=>[...a].sort(()=>Math.random()-.5);
export const speak=text=>{if(!('speechSynthesis'in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=.82;speechSynthesis.speak(u)};
export const toast=text=>{const el=document.querySelector('#toast');el.textContent=text;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)};
export const escapeHtml=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const sourceNote=label=>`<p class="source-note">ℹ️ ${label}. El archivo de datos está preparado para sustituirlo sin cambiar la interfaz.</p>`;
