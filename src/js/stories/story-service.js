const catalogUrl = './content/historias/index.json';
const validId = value => typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
const validFilename = value => typeof value === 'string' && /^[a-z0-9-]+\.json$/.test(value);

export const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

export async function loadStoryCatalog() {
  const response = await fetch(catalogUrl, {cache: 'no-store'});
  if (!response.ok) throw new Error('No se pudo cargar el catálogo de cuentos.');
  const catalog = await response.json();
  if (!Array.isArray(catalog)) throw new Error('El catálogo de cuentos no es válido.');
  return catalog.filter(item => validId(item?.id) && validFilename(item?.archivo));
}

export async function loadStory(id) {
  if (!validId(id)) throw new Error('El cuento solicitado no es válido.');
  const catalog = await loadStoryCatalog();
  const entry = catalog.find(item => item.id === id);
  if (!entry) throw new Error('Este cuento todavía no está disponible.');
  const response = await fetch(`./content/historias/${entry.archivo}`, {cache: 'no-store'});
  if (!response.ok) throw new Error('No se pudo abrir el cuento.');
  const story = await response.json();
  const validPages = Array.isArray(story?.paginas) && story.paginas.length >= 4 && story.paginas.every(page => typeof page === 'string' && page.trim());
  const validQuestions = Array.isArray(story?.preguntas) && story.preguntas.length === 3 && story.preguntas.every(question =>
    typeof question?.enunciado === 'string' && Array.isArray(question.opciones) && question.opciones.length === 3 &&
    question.opciones.every(option => typeof option === 'string') && Number.isInteger(question.correcta) && question.correcta >= 0 && question.correcta < 3
  );
  const keyword = story?.palabra_clave;
  const validKeyword = keyword && typeof keyword.palabra === 'string' && keyword.palabra.trim() &&
    Array.isArray(keyword.silabas) && keyword.silabas.length >= 2 && keyword.silabas.every(syllable => typeof syllable === 'string' && syllable.trim()) &&
    ['definicion', 'ejemplo_cuento', 'ejemplo_cotidiano', 'reto'].every(field => typeof keyword[field] === 'string' && keyword[field].trim()) &&
    typeof keyword.pregunta?.enunciado === 'string' && Array.isArray(keyword.pregunta.opciones) && keyword.pregunta.opciones.length === 3 &&
    keyword.pregunta.opciones.every(option => typeof option === 'string' && option.trim()) && Number.isInteger(keyword.pregunta.correcta) &&
    keyword.pregunta.correcta >= 0 && keyword.pregunta.correcta < 3 && typeof keyword.pregunta.explicacion === 'string';
  if (story?.id !== id || typeof story?.titulo !== 'string' || !validPages || !validQuestions || !validKeyword) throw new Error('El archivo del cuento no tiene el formato esperado.');
  return story;
}
