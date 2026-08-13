export const shuffle=a=>[...a].sort(()=>Math.random()-.5);
import {voiceProfiles} from '../characters/characters.js';
const latinLocales=['es-mx','es-us','es-419','es-co','es-ar','es-cl','es-pe','es-ve','es-uy','es-ec','es-cr','es-pa','es-do','es-gt','es-bo','es-py','es-sv','es-hn','es-ni','es-pr'];
const latinVoices=()=>{const spanish=speechSynthesis.getVoices().filter(v=>v.lang?.toLowerCase().startsWith('es'));const latin=spanish.filter(v=>latinLocales.includes(v.lang.toLowerCase()));return latin.length?latin:spanish.sort((a,b)=>(a.lang.toLowerCase()==='es-es')-(b.lang.toLowerCase()==='es-es'))};
export const speak=(text,character='kiwi')=>{if(!('speechSynthesis'in window))return false;speechSynthesis.cancel();const profile=voiceProfiles[character]||voiceProfiles.kiwi,u=new SpeechSynthesisUtterance(text),voices=latinVoices();u.lang=voices[0]?.lang||'es-MX';u.rate=profile.rate;u.pitch=profile.pitch;if(voices.length)u.voice=voices[profile.voiceIndex%voices.length];speechSynthesis.speak(u);return true};
export const toast=text=>{const el=document.querySelector('#toast');el.textContent=text;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)};
export const escapeHtml=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const sourceNote=label=>`<p class="source-note">ℹ️ ${label}. El archivo de datos está preparado para sustituirlo sin cambiar la interfaz.</p>`;
