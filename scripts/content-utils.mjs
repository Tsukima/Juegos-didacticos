import fs from 'node:fs/promises';

export const LEVELS = [
  {nivel_lector:'inicial', edad_min:4, edad_max:6},
  {nivel_lector:'medio', edad_min:7, edad_max:9},
  {nivel_lector:'avanzado', edad_min:10, edad_max:12}
];

export const THEMES = ['animales', 'amistad', 'naturaleza', 'el colegio', 'el barrio', 'emociones', 'juegos cooperativos', 'curiosidad'];
export const VALUES = ['respeto', 'empatía', 'confianza', 'honestidad', 'perseverancia', 'generosidad', 'gratitud', 'paciencia'];

export function pick(items) { return items[Math.floor(Math.random() * items.length)]; }
export function slug(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
}
export function extractJson(text) {
  const cleaned = String(text).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}
export async function writeJson(filepath, value) {
  await fs.writeFile(filepath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
export function assert(condition, message) { if (!condition) throw new Error(message); }
export function validateCommon(item, level) {
  assert(item && typeof item === 'object', 'La respuesta no es un objeto JSON.');
  assert(/^[a-z0-9-]+$/.test(item.id), 'El id debe ser un slug seguro.');
  assert(item.nivel_lector === level.nivel_lector, 'El nivel lector no coincide.');
  assert(item.edad_min === level.edad_min && item.edad_max === level.edad_max, 'El tramo de edad no coincide.');
}

export async function callClaude({system, prompt, maxTokens = 2600}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Falta el secreto ANTHROPIC_API_KEY.');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{'content-type':'application/json', 'x-api-key':apiKey, 'anthropic-version':'2023-06-01'},
    body:JSON.stringify({model:process.env.ANTHROPIC_MODEL || 'claude-sonnet-5', max_tokens:maxTokens, system, messages:[{role:'user', content:prompt}]})
  });
  if (!response.ok) throw new Error(`Anthropic API ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const text = data.content?.filter(block => block.type === 'text').map(block => block.text).join('') || '';
  assert(text, 'La API no devolvió contenido de texto.');
  return extractJson(text);
}
