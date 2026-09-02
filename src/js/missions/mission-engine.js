import {wordCards,phraseCards,comprehensionCards,actionCards} from '../pdf-data/cards.js';
import {miniTopics,miniWords} from '../mini/mini-data.js';
const guides=['kiwi','coco','teo','nova'];
const miniBridgeMissions=miniTopics.flatMap((topic,topicIndex)=>topic.wordIds.slice(0,2).map((wordId,wordIndex)=>{
 const word=miniWords.find(item=>item.id===wordId);
 return {id:`bridge-${topic.id}-${word.id}`,type:'word',title:`Puente Mini · ${word.word}`,duration:2,guide:guides[(topicIndex+wordIndex)%guides.length],data:{word:word.word.toLowerCase(),syllables:word.syllables.join('-').toLowerCase(),emoji:word.emoji,topic:topic.title,phrase:word.phrase,source:'mini'},reward:'1 estrella'};
}));
export const allMissions=[
 ...wordCards.map((x,i)=>({id:x.id,type:'word',title:`Palabra ${i+1}`,duration:2,guide:guides[i%4],data:x,reward:'1 estrella'})),
 ...miniBridgeMissions,
 ...phraseCards.map((x,i)=>({id:x.id,type:'phrase',title:`Frase ${i+1}`,duration:2,guide:guides[(i+1)%4],data:x,reward:'1 estrella'})),
 ...comprehensionCards.map((x,i)=>({id:x.id,type:'comprehension',title:`Detective ${i+1}`,duration:3,guide:guides[(i+2)%4],data:x,reward:'1 estrella'})),
 ...actionCards.map((x,i)=>({id:x.id,type:'action',title:`Lee y muévete ${i+1}`,duration:2,guide:'coco',data:x,reward:'1 estrella'}))
];
export const bridgeMissionCount=miniBridgeMissions.length;
export const dailyMissions=(count=3)=>{const seed=Number(new Date().toISOString().slice(0,10).replaceAll('-',''));return Array.from({length:count},(_,i)=>allMissions[(seed+i*17)%allMissions.length])};
export const getMission=id=>allMissions.find(m=>m.id===id);
