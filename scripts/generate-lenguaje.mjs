import fs from 'node:fs/promises';
import path from 'node:path';
import {LEVELS, THEMES, assert, callClaude, pick, slug, validateCommon, writeJson} from './content-utils.mjs';

const outputDir = path.resolve('content/lenguaje');
const system = `Eres especialista en lenguaje infantil para Tinkie. Generas vocabulario y frases, no historias. Usa un tono cálido, seguro y positivo. No incluyas violencia, terror, discriminación, temas adultos, datos personales, marcas ni personajes protegidos. Devuelve exclusivamente JSON válido, sin markdown.`;

function validateLanguage(set, level) {
  validateCommon(set, level);
  assert(typeof set.tema === 'string' && set.tema.trim(), 'Falta el tema.');
  assert(Array.isArray(set.palabras) && set.palabras.length >= 5 && set.palabras.length <= 8, 'Deben existir entre 5 y 8 palabras.');
  for (const item of set.palabras) {
    assert(['palabra','silabas','significado','frase_ejemplo'].every(field => typeof item?.[field] === 'string' && item[field].trim()), 'Una palabra está incompleta.');
    assert(item.silabas.includes('-') || item.palabra.length <= 3, 'La separación silábica parece incorrecta.');
  }
  assert(Array.isArray(set.oraciones_cortas) && set.oraciones_cortas.length >= 3 && set.oraciones_cortas.length <= 5 && set.oraciones_cortas.every(item => typeof item === 'string'), 'Oraciones cortas inválidas.');
  assert(Array.isArray(set.oraciones_largas), 'Falta oraciones_largas.');
  if (level.nivel_lector === 'inicial') assert(set.oraciones_largas.length === 0, 'El nivel inicial no debe incluir oraciones largas.');
  else assert(set.oraciones_largas.length >= 2 && set.oraciones_largas.length <= 3 && set.oraciones_largas.every(item => typeof item === 'string'), 'Oraciones largas inválidas.');
}

async function main() {
  await fs.mkdir(outputDir, {recursive:true});
  const date = new Date().toISOString().slice(0, 10);
  const usedThemes = new Set();
  for (const level of LEVELS) {
    let theme = pick(THEMES);
    while (usedThemes.has(theme)) theme = pick(THEMES);
    usedThemes.add(theme);
    const requestedId = `${date}-${level.nivel_lector}-${slug(theme)}`;
    const prompt = `Genera un set de vocabulario de nivel ${level.nivel_lector} para ${level.edad_min}-${level.edad_max} años sobre ${theme}. Usa el id exacto "${requestedId}". Incluye nivel_lector, edad_min, edad_max, tema, 5-8 palabras con palabra, silabas, significado y frase_ejemplo; 3-5 oraciones_cortas; y oraciones_largas según el nivel.`;
    console.log(`Generando lenguaje ${level.nivel_lector}…`);
    const set = await callClaude({system, prompt, maxTokens:2200});
    assert(set.id === requestedId, 'El set devolvió un id distinto del solicitado.');
    validateLanguage(set, level);
    await writeJson(path.join(outputDir, `${set.id}.json`), set);
  }
  console.log('Sets de lenguaje validados y guardados.');
}

main().catch(error => { console.error(error); process.exit(1); });
