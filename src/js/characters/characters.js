export const characters = {
  kiwi:{name:'Tinkie',role:'Guía emocional',emoji:'🦜',message:'No hace falta hacerlo perfecto. Un paso pequeño cuenta.'},
  coco:{name:'Pepito',role:'Compañero fiel',emoji:'🐕',message:'Me quedo contigo mientras lo intentas.'},
  lumo:{name:'Lumo',role:'Explorador paciente',emoji:'🐺',message:'Vamos paso a paso. Yo sigo tu ritmo.'},
  mia:{name:'Mía',role:'Detective curiosa',emoji:'🐈',message:'Cada palabra es una pista nueva.'},
  teo:{name:'Teo',role:'Mentor constructor',emoji:'🧑‍🌾',message:'Las palabras se construyen pieza a pieza.'},
  nova:{name:'Nova',role:'Exploradora digital',emoji:'🧑‍🚀',message:'Cada misión nos hace más fuertes.'},
  pizza:{name:'Mr. Pizza',role:'Detective de trampas',emoji:'🍕',message:'¿Podrás descubrir mi trampa antes de pulsar?'}
};
export const characterCard = key => { const c=characters[key]; return `<div class="character"><div class="avatar" aria-hidden="true">${c.emoji}</div><div><strong>${c.name}</strong><div class="muted">${c.message}</div></div></div>`; };

export const voiceProfiles = {
  kiwi:{rate:.94,pitch:1.18,voiceIndex:1,label:'Alegre'},
  coco:{rate:.78,pitch:.9,voiceIndex:0,label:'Tranquila'},
  lumo:{rate:.82,pitch:.86,voiceIndex:0,label:'Serena'},
  mia:{rate:.92,pitch:1.08,voiceIndex:1,label:'Curiosa'},
  teo:{rate:.72,pitch:.78,voiceIndex:2,label:'Sabia'},
  nova:{rate:.9,pitch:1.05,voiceIndex:3,label:'Aventurera'},
  pizza:{rate:.76,pitch:.82,voiceIndex:2,label:'Misteriosa'}
};

export const voiceSelector = selected => `
  <section class="voice-studio" aria-label="Elige quién lee">
    <div class="voice-studio-title"><span>🎧</span><div><strong>¿Quién te lo lee?</strong><small>Voces en español latino neutro</small></div></div>
    <div class="voice-controls">
      <div class="voice-choices" role="radiogroup" aria-label="Personaje lector">
        ${['kiwi','coco','lumo','mia','teo','nova'].map(key=>`<button type="button" class="voice-choice ${key===selected?'active':''}" data-voice="${key}" role="radio" aria-checked="${key===selected}"><span>${characters[key].emoji}</span>${characters[key].name}</button>`).join('')}
      </div>
      <button type="button" class="button secondary listen-character">🔊 Escuchar</button>
    </div>
  </section>`;
