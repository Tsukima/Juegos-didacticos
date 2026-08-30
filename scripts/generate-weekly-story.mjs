import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const apiKey=process.env.GEMINI_API_KEY?.trim();
const model=(process.env.GEMINI_MODEL||'gemini-3.7-flash').trim();
const requestedTheme=process.env.REQUESTED_THEME?.trim();
if (!apiKey) throw new Error('Falta el secreto GEMINI_API_KEY.');

const directory=resolve('content/historias');
const indexPath=resolve(directory,'index.json');
const catalog=JSON.parse(await readFile(indexPath,'utf8'));
const existing=await Promise.all(catalog.map(async entry=>JSON.parse(await readFile(resolve(directory,entry.archivo),'utf8'))));
const storyInstructions=await readFile(resolve('.github/agents/tinkie-historias.agent.md'),'utf8');
const commonInstructions=await readFile(resolve('.github/instructions/tinkie-comun.instructions.md'),'utf8');
const nextEpisode=Math.max(0,...existing.map(story=>Number(story.episodio)||0))+1;
const existingSummary=existing.map(story=>({titulo:story.titulo,serie:story.serie,episodio:story.episodio,genero:story.genero,tema:story.tema,valor:story.valor,palabra:story.palabra_clave?.palabra,sinopsis:story.sinopsis}));

const prompt=`Eres Tinkie Historias, autora educativa en español latino neutro.
Sigue estas normas editoriales del proyecto, subordinadas al formato JSON solicitado más abajo:
${storyInstructions}
${commonInstructions}

Genera exactamente UN cuento nuevo para un niño de 11 años con dificultades de atención.
Debe ser emocionalmente seguro, sin burlas, castigos ni sensación de fracaso.
Continúa la serie "Expediciones de Tinkie" como episodio ${nextEpisode} y evita repetir tramas,
valores, géneros y palabras clave de los cuentos existentes.
Personajes disponibles: Tinkie (loro guía emocional), Pepito (perro compañero), un aldeano mentor,
un avatar de Roblox y Mr. Pizza únicamente para seguridad digital.
${requestedTheme?`Tema solicitado por la familia: ${requestedTheme}`:'Escoge un tema positivo y cotidiano apropiado.'}

Cuentos existentes:
${JSON.stringify(existingSummary,null,2)}

Devuelve solamente un objeto JSON válido, sin Markdown, con esta estructura exacta:
{
  "id":"slug-unico-en-minusculas", "titulo":"string", "nivel_lector":"avanzado",
  "edad_min":10, "edad_max":12, "valor":"string", "serie":"Expediciones de Tinkie",
  "episodio":${nextEpisode}, "genero":"string", "tema":"string",
  "sinopsis":"2 o 3 frases sin revelar el final",
  "palabra_clave":{"palabra":"string","silabas":["silaba 1","silaba 2"],"definicion":"explicación sencilla","ejemplo_cuento":"string","ejemplo_cotidiano":"string","reto":"micro-reto seguro","pregunta":{"enunciado":"string","opciones":["a","b","c"],"correcta":0,"explicacion":"string"}},
  "paginas":["página 1","página 2","página 3","página 4","página 5","página 6"],
  "narracion":{"formato":"audio/ogg; codecs=opus","voces":{"narradora":"cálida y tranquila"},"tono_por_pagina":["tono 1","tono 2","tono 3","tono 4","tono 5","tono 6"],"audio_por_pagina":[null,null,null,null,null,null]},
  "preguntas":[
    {"enunciado":"string","opciones":["a","b","c"],"correcta":0,"explicacion":"string"},
    {"enunciado":"string","opciones":["a","b","c"],"correcta":1,"explicacion":"string"},
    {"enunciado":"string","opciones":["a","b","c"],"correcta":2,"explicacion":"string"}
  ]
}
Escribe entre 6 y 8 páginas, con 55-90 palabras por página. No incluyas datos personales,
publicidad, enlaces, compras, secretos ni instrucciones peligrosas.`;

const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{
  method:'POST',
  headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},
  body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0.85}})
});
const payload=await response.json();
if (!response.ok) throw new Error(`Gemini respondió ${response.status}: ${payload?.error?.message||'error desconocido'}`);
const raw=payload?.candidates?.[0]?.content?.parts?.map(part=>part.text||'').join('').trim();
if (!raw) throw new Error('Gemini no devolvió contenido.');
const story=JSON.parse(raw.replace(/^```json\s*|\s*```$/g,''));
if (!/^[a-z0-9-]+$/.test(story.id)||catalog.some(entry=>entry.id===story.id)) throw new Error('Gemini devolvió un id repetido o no válido.');

const filename=`${story.id}.json`;
await writeFile(resolve(directory,filename),`${JSON.stringify(story,null,2)}\n`,'utf8');
catalog.push({id:story.id,titulo:story.titulo,nivel_lector:story.nivel_lector,edad_min:story.edad_min,edad_max:story.edad_max,valor:story.valor,serie:story.serie,episodio:story.episodio,genero:story.genero,tema:story.tema,sinopsis:story.sinopsis,palabra_clave:story.palabra_clave.palabra,archivo:filename});
await writeFile(indexPath,`${JSON.stringify(catalog,null,2)}\n`,'utf8');
await writeFile('story-files.txt',`content/historias/${filename}\n`,'utf8');
await writeFile('generated-pr-body.md',`## Resumen para la familia\n\n**${story.titulo}** · ${story.serie}, episodio ${story.episodio}\n\n${story.sinopsis}\n\n- Edad: ${story.edad_min}–${story.edad_max} años\n- Género: ${story.genero}\n- Valor: ${story.valor}\n- Palabra clave: **${story.palabra_clave.palabra}** — ${story.palabra_clave.definicion}\n\n## Qué se añadirá\n\nUn cuento de ${story.paginas.length} páginas, una palabra interactiva y tres preguntas de comprensión.\n\n## Comprobaciones\n\n- Contenido validado automáticamente\n- Aplicación compilada antes de abrir este Pull Request\n- Pendiente de aprobación adulta\n`,'utf8');
console.log(`Cuento generado: ${story.titulo} (${filename})`);
