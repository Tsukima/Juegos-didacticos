const KEY = 'tinkie-progress-v1';
const defaults = {
  stars:0, xp:0, streak:0, lastDay:'', completed:[], sessions:[], readingAttempts:[],
  settings:{sound:true, focus:false, dailyGoal:3, saveAudio:false},
  profile:{name:'Explorador', mascot:'kiwi', adventure:'explorar', encouragement:'calma', onboardingComplete:false},
  puzzle:{collection:'kiwi-01', pieces:[]}
};
const today = () => new Date().toISOString().slice(0,10);
const freshDefaults = () => structuredClone(defaults);

export const store = {
  get() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {...freshDefaults(), ...saved, completed:Array.isArray(saved.completed) ? saved.completed : [], sessions:Array.isArray(saved.sessions) ? saved.sessions : [], readingAttempts:Array.isArray(saved.readingAttempts) ? saved.readingAttempts : [], settings:{...defaults.settings, ...(saved.settings || {})}, profile:{...defaults.profile, ...(saved.profile || {})}, puzzle:{...defaults.puzzle, ...(saved.puzzle || {}), pieces:Array.isArray(saved.puzzle?.pieces) ? saved.puzzle.pieces : []}};
    } catch { return freshDefaults(); }
  },
  save(data) { localStorage.setItem(KEY, JSON.stringify(data)); window.dispatchEvent(new CustomEvent('progresschange')); },
  complete(id, type) {
    const state = this.get();
    if (state.completed.includes(id)) return false;
    state.completed.push(id); state.stars += 1; state.xp += type === 'security' ? 25 : 15;
    if (state.puzzle.pieces.length < 6) state.puzzle.pieces.push(state.puzzle.pieces.length + 1);
    const day = today();
    if (state.lastDay !== day) { const previous = new Date(); previous.setDate(previous.getDate() - 1); state.streak = state.lastDay === previous.toISOString().slice(0,10) ? state.streak + 1 : 1; state.lastDay = day; }
    state.sessions.push({id, type, date:new Date().toISOString()}); this.save(state); return true;
  },
  addReadingAttempt(id, score, passed) { const state = this.get(); state.readingAttempts.push({id, score:Math.round(score * 100), passed, date:new Date().toISOString()}); this.save(state); },
  update(patch) { this.save({...this.get(), ...patch}); },
  reset() { localStorage.removeItem(KEY); window.dispatchEvent(new CustomEvent('progresschange')); }
};
export const todayCount = state => state.sessions.filter(item => item.date.slice(0,10) === today()).length;
