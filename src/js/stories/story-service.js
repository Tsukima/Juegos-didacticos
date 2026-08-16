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
  if (story?.id !== id || typeof story?.titulo !== 'string' || !validPages || !validQuestions) throw new Error('El archivo del cuento no tiene el formato esperado.');
  return story;
}
