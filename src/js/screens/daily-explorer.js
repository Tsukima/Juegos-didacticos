const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export async function dailyExplorerScreen(){
  try{
    const catalog=await fetch('content/explorador-diarios/index.json',{cache:'no-store'}).then(response=>response.ok?response.json():Promise.reject());
    if(!catalog.length)return '<div class="card empty"><h1>Historia para hoy</h1><p>La primera lectura llegará en la próxima publicación diaria.</p></div>';
    const story=await fetch(`content/explorador-diarios/${encodeURIComponent(catalog[0].archivo)}`,{cache:'no-store'}).then(response=>response.ok?response.json():Promise.reject());
    return `<div class="story-shell daily-explorer"><a class="story-back" href="#inicio">← Volver al inicio</a><p class="eyebrow">Historia diaria · ${escapeHtml(story.edad_min)}–${escapeHtml(story.edad_max)} años</p><h1>${escapeHtml(story.emoji)} ${escapeHtml(story.titulo)}</h1><div class="mission-meta"><span class="pill">${escapeHtml(story.duracion_minutos)} minutos</span><span class="pill warm">Palabra: ${escapeHtml(story.palabra_clave)}</span></div><section class="story-pages">${story.paginas.map((page,index)=>`<article class="card story-page"><span class="story-page-number">${index+1}</span><p>${escapeHtml(page)}</p></article>`).join('')}</section><section class="section card daily-explorer-reflection"><p class="eyebrow">Para reflexionar</p><h2>${escapeHtml(story.reflexion)}</h2><div class="mini-daily-tools"><article><small>Regulación para hoy</small><strong>${escapeHtml(story.actividad_regulacion)}</strong></article><article><small>Preguntas para conversar</small>${story.preguntas.map(question=>`<strong>• ${escapeHtml(question)}</strong>`).join('')}</article></div></section></div>`;
  }catch{return '<div class="card adult-note"><strong>No pudimos cargar la historia diaria.</strong><p>Vuelve a intentarlo dentro de un momento.</p></div>';}
}
