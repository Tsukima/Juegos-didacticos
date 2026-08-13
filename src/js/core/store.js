const KEY='tinkie-progress-v1';
const defaults={stars:0,xp:0,streak:0,lastDay:'',completed:[],sessions:[],readingAttempts:[],settings:{sound:true,focus:false,dailyGoal:3,saveAudio:false},profile:{name:'Explorador'}};
const today=()=>new Date().toISOString().slice(0,10);
export const store={
  get(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return structuredClone(defaults)}},
  save(data){localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new CustomEvent('progresschange'));},
  complete(id,type){const s=this.get();if(s.completed.includes(id))return false;s.completed.push(id);s.stars+=1;s.xp+=type==='security'?25:15;const day=today();if(s.lastDay!==day){const prev=new Date();prev.setDate(prev.getDate()-1);s.streak=s.lastDay===prev.toISOString().slice(0,10)?s.streak+1:1;s.lastDay=day}s.sessions.push({id,type,date:new Date().toISOString()});this.save(s);return true},
  addReadingAttempt(id,score,passed){const s=this.get();s.readingAttempts=s.readingAttempts||[];s.readingAttempts.push({id,score:Math.round(score*100),passed,date:new Date().toISOString()});this.save(s)},
  update(patch){const s=this.get();this.save({...s,...patch});},
  reset(){localStorage.removeItem(KEY);window.dispatchEvent(new CustomEvent('progresschange'));}
};
export const todayCount=s=>s.sessions.filter(x=>x.date.slice(0,10)===today()).length;
