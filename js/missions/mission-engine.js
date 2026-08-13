import {wordCards,phraseCards,comprehensionCards,actionCards} from '../pdf-data/cards.js';
const guides=['kiwi','coco','teo','nova'];
export const allMissions=[
 ...wordCards.map((x,i)=>({id:x.id,type:'word',title:`Palabra ${i+1}`,duration:2,guide:guides[i%4],data:x,reward:'1 estrella'})),
 ...phraseCards.map((x,i)=>({id:x.id,type:'phrase',title:`Frase ${i+1}`,duration:2,guide:guides[(i+1)%4],data:x,reward:'1 estrella'})),
 ...comprehensionCards.map((x,i)=>({id:x.id,type:'comprehension',title:`Detective ${i+1}`,duration:3,guide:guides[(i+2)%4],data:x,reward:'1 estrella'})),
 ...actionCards.map((x,i)=>({id:x.id,type:'action',title:`Lee y muévete ${i+1}`,duration:2,guide:'coco',data:x,reward:'1 estrella'}))
];
export const dailyMissions=(count=3)=>{const seed=Number(new Date().toISOString().slice(0,10).replaceAll('-',''));return Array.from({length:count},(_,i)=>allMissions[(seed+i*17)%allMissions.length])};
export const getMission=id=>allMissions.find(m=>m.id===id);
