const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const loadCatalog=()=>fetch('content/comics/index.json',{cache:'no-store'}).then(response=>response.ok?response.json():Promise.reject());

export async function comicsScreen(){
  try{
    const catalog=await loadCatalog();
    if(!catalog.length)return '<p class="eyebrow">Nueva sección</p><h1>Cómics de Tinkie</h1><div class="card empty"><span>💬</span><h2>La primera aventura llega el miércoles</h2><p>Cada semana publicaremos tres capítulos para leer en orden.</p></div>';
    const issues=[...new Map(catalog.map(item=>[item.fecha,item])).values()];
    return `<p class="eyebrow">Tres capítulos cada miércoles</p><h1>Cómics de Tinkie</h1><p class="muted">Aventuras por viñetas, con una pregunta para imaginar y conversar.</p><div class="comic-library">${issues.map(issue=>{const chapters=catalog.filter(item=>item.fecha===issue.fecha).sort((a,b)=>a.capitulo-b.capitulo);return `<section class="card comic-issue"><div class="comic-cover" aria-hidden="true">💥<span>💬</span></div><div><small>Edición ${issue.edicion} · ${escapeHtml(issue.fecha)}</small><h2>${escapeHtml(issue.coleccion)}</h2><p>${escapeHtml(issue.valor)}</p><nav>${chapters.map(chapter=>`<a href="#comic/${escapeHtml(chapter.id)}"><b>${chapter.capitulo}</b><span>${escapeHtml(chapter.titulo)}</span></a>`).join('')}</nav></div></section>`}).join('')}</div>`;
  }catch{return '<div class="card adult-note"><strong>La colección de cómics está descansando.</strong><p>Vuelve a intentarlo dentro de un momento.</p></div>';}
}

export async function comicChapterScreen(id){
  try{
    const catalog=await loadCatalog();
    const entry=catalog.find(item=>item.id===id);
    if(!entry)throw new Error();
    const comic=await fetch(`content/comics/${encodeURIComponent(entry.archivo)}`,{cache:'no-store'}).then(response=>response.ok?response.json():Promise.reject());
    const next=catalog.find(item=>item.fecha===comic.fecha&&item.capitulo===comic.capitulo+1);
    return `<div class="comic-reader"><a class="story-back" href="#comics">← Volver a cómics</a><p class="eyebrow">${escapeHtml(comic.coleccion)} · Capítulo ${comic.capitulo} de 3</p><h1>${escapeHtml(comic.titulo)}</h1><p class="muted">${escapeHtml(comic.sinopsis)}</p><section class="comic-panels">${comic.paneles.map(panel=>`<article><span>${panel.numero}</span><div aria-hidden="true">${panel.numero%2?'✨':'💬'}</div><p>${escapeHtml(panel.texto)}</p></article>`).join('')}</section><aside class="card comic-reflection"><span>💭</span><div><small>Para imaginar y conversar</small><strong>${escapeHtml(comic.reflexion)}</strong></div></aside><div class="comic-actions">${next?`<a class="button" href="#comic/${escapeHtml(next.id)}">Siguiente capítulo →</a>`:'<a class="button" href="#comics">Ver más cómics</a>'}</div></div>`;
  }catch{return '<div class="empty"><h1>Capítulo no encontrado</h1><a class="button" href="#comics">Volver a cómics</a></div>';}
}
