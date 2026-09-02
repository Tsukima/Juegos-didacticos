import {miniStories,miniTopics} from '../src/js/mini/mini-data.js';
import {allMissions,bridgeMissionCount} from '../src/js/missions/mission-engine.js';

const problems=[];
const storyIds=new Set();

if(miniTopics.length!==20) problems.push(`Se esperaban 20 temas y hay ${miniTopics.length}.`);
if(miniStories.length!==200) problems.push(`Se esperaban 200 cuentos y hay ${miniStories.length}.`);
if(bridgeMissionCount!==40) problems.push(`Se esperaban 40 misiones puente y hay ${bridgeMissionCount}.`);
if(allMissions.filter(mission=>mission.type==='word').length!==90) problems.push('La biblioteca normal debe tener 90 misiones de palabras.');
if(new Set(allMissions.map(mission=>mission.id)).size!==allMissions.length) problems.push('Hay identificadores de misión duplicados.');

for(const topic of miniTopics){
  const stories=miniStories.filter(story=>story.topic===topic.id);
  if(stories.length!==10) problems.push(`${topic.id} tiene ${stories.length} cuentos; debe tener 10.`);
}

for(const story of miniStories){
  if(storyIds.has(story.id)) problems.push(`ID de cuento duplicado: ${story.id}.`);
  storyIds.add(story.id);
  if(!story.title||!story.keyword) problems.push(`${story.id} no tiene título o palabra clave.`);
  if(!Array.isArray(story.pages)||story.pages.length!==5) problems.push(`${story.id} debe tener 5 páginas.`);
  if(!story.question||!Array.isArray(story.question.options)||story.question.options.length!==2) problems.push(`${story.id} debe tener una pregunta con 2 opciones.`);
  if(!Number.isInteger(story.question?.correct)||story.question.correct<0||story.question.correct>1) problems.push(`${story.id} tiene una respuesta correcta inválida.`);
}

if(problems.length){
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(`Contenido conectado válido: ${miniStories.length} cuentos Mini y ${allMissions.length} misiones normales, incluidas ${bridgeMissionCount} misiones puente.`);
