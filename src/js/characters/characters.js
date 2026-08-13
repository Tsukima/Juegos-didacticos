export const characters = {
  kiwi:{name:'Kiwi',role:'Guía emocional',emoji:'🦜',message:'No hace falta hacerlo perfecto. Un paso pequeño cuenta.'},
  coco:{name:'Coco',role:'Compañero fiel',emoji:'🐕',message:'Me quedo contigo mientras lo intentas.'},
  teo:{name:'Teo',role:'Mentor constructor',emoji:'🧑‍🌾',message:'Las palabras se construyen pieza a pieza.'},
  nova:{name:'Nova',role:'Exploradora digital',emoji:'🧑‍🚀',message:'Cada misión nos hace más fuertes.'},
  pizza:{name:'Mr. Pizza',role:'Detective de trampas',emoji:'🍕',message:'¿Podrás descubrir mi trampa antes de pulsar?'}
};
export const characterCard = key => { const c=characters[key]; return `<div class="character"><div class="avatar" aria-hidden="true">${c.emoji}</div><div><strong>${c.name}</strong><div class="muted">${c.message}</div></div></div>`; };

export const voiceProfiles = {
  kiwi:{rate:.98,pitch:1.45,voiceIndex:1,label:'Alegre'},
  coco:{rate:.76,pitch:.85,voiceIndex:0,label:'Tranquila'},
  teo:{rate:.68,pitch:.62,voiceIndex:2,label:'Sabia'},
  nova:{rate:.92,pitch:1.12,voiceIndex:3,label:'Aventurera'},
  pizza:{rate:.8,pitch:.72,voiceIndex:2,label:'Misteriosa'}
};

export const voiceSelector = selected => `
  <section class="voice-studio" aria-label="Elige quién lee">
    <div class="voice-studio-title"><span>🎧</span><div><strong>¿Quién te lo lee?</strong><small>Elige una voz y escucha con calma</small></div></div>
    <div class="voice-controls">
      <div class="voice-choices" role="radiogroup" aria-label="Personaje lector">
        ${['kiwi','coco','teo','nova'].map(key=>`<button type="button" class="voice-choice ${key===selected?'active':''}" data-voice="${key}" role="radio" aria-checked="${key===selected}"><span>${characters[key].emoji}</span>${characters[key].name}</button>`).join('')}
      </div>
      <button type="button" class="button secondary listen-character">🔊 Escuchar</button>
    </div>
  </section>`;
