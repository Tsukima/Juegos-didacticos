import fs from 'node:fs/promises';
import path from 'node:path';
import {LEVELS, THEMES, VALUES, assert, callClaude, pick, slug, validateCommon, writeJson} from './content-utils.mjs';

const outputDir = path.resolve('content/historias');
const indexPath = path.join(outputDir, 'index.json');
const system = `Eres el escritor infantil de Tinkie. Tinkie es un loro guía emocional y Pepito un perro acompañante. Escribe con tono cálido, seguro y positivo. Nunca incluyas violencia, terror, discriminación, temas adultos, datos personales, marcas ni personajes protegidos. Devuelve exclusivamente JSON válido, sin markdown.`;

function validateStory(story, level) {
  validateCommon(story, level);
  assert(typeof story.titulo === 'string' && story.titulo.length <= 80, 'Título ausente o demasiado largo.');
  assert(typeof story.valor === 'string' && VALUES.includes(story.valor.toLowerCase()), 'Valor no permitido.');
  const pageRange = level.nivel_lector === 'inicial' ? [4,5] : level.nivel_lector === 'medio' ? [5,7] : [6,8];
  assert(Array.isArray(story.paginas) && story.paginas.length >= pageRange[0] && story.paginas.length <= pageRange[1], 'Número de páginas incorrecto.');
  assert(story.paginas.every(page => typeof page === 'string' && page.trim().length > 0 && page.length <= 700), 'Página vacía o demasiado larga.');
  assert(Array.isArray(story.preguntas) && story.preguntas.length === 3, 'Deben existir tres preguntas.');
  for (const question of story.preguntas) {
    assert(typeof question.enunciado === 'string', 'Pregunta sin enunciado.');
    assert(Array.isArray(question.opciones) && question.opciones.length === 3 && question.opciones.every(option => typeof option === 'string'), 'Cada pregunta necesita tres opciones.');
    assert(Number.isInteger(question.correcta) && question.correcta >= 0 && question.correcta < 3, 'Respuesta correcta inválida.');
    assert(typeof question.explicacion === 'string', 'Falta una explicación amable.');
  }
}

async function readIndex() {
  try {
    const index = JSON.parse(await fs.readFile(indexPath, 'utf8'));
    return Array.isArray(index) ? index : [];
  } catch { return []; }
}

async function main() {
  await fs.mkdir(outputDir, {recursive:true});
  const catalog = await readIndex();
  const date = new Date().toISOString().slice(0, 10);
  for (const level of LEVELS) {
    const theme = pick(THEMES);
    const value = pick(VALUES);
    const requestedId = `${date}-${level.nivel_lector}-${slug(theme)}-${slug(value)}`;
    const prompt = `Crea una historia de nivel ${level.nivel_lector} para ${level.edad_min}-${level.edad_max} años sobre ${theme}, reforzando ${value}. Usa el id exacto "${requestedId}". Incluye titulo, nivel_lector, edad_min, edad_max, valor, paginas y exactamente 3 preguntas con enunciado, opciones, correcta y explicacion. Respeta la longitud adecuada al tramo.`;
    console.log(`Generando historia ${level.nivel_lector}…`);
    const story = await callClaude({system, prompt});
    assert(story.id === requestedId, 'La historia devolvió un id distinto del solicitado.');
    validateStory(story, level);
    const filename = `${story.id}.json`;
    await writeJson(path.join(outputDir, filename), story);
    const entry = {id:story.id, titulo:story.titulo, nivel_lector:story.nivel_lector, edad_min:story.edad_min, edad_max:story.edad_max, valor:story.valor, archivo:filename};
    const existing = catalog.findIndex(item => item.id === story.id);
    if (existing >= 0) catalog[existing] = entry; else catalog.push(entry);
  }
  catalog.sort((a, b) => a.id.localeCompare(b.id));
  await writeJson(indexPath, catalog);
  console.log('Historias e índice validados y guardados.');
}

main().catch(error => { console.error(error); process.exit(1); });
