export const characters = {
  kiwi:{name:'Kiwi',role:'Guía emocional',emoji:'🦜',message:'No hace falta hacerlo perfecto. Un paso pequeño cuenta.'},
  coco:{name:'Coco',role:'Compañero fiel',emoji:'🐕',message:'Me quedo contigo mientras lo intentas.'},
  teo:{name:'Teo',role:'Mentor constructor',emoji:'🧑‍🌾',message:'Las palabras se construyen pieza a pieza.'},
  nova:{name:'Nova',role:'Exploradora digital',emoji:'🧑‍🚀',message:'Cada misión nos hace más fuertes.'},
  pizza:{name:'Mr. Pizza',role:'Detective de trampas',emoji:'🍕',message:'¿Podrás descubrir mi trampa antes de pulsar?'}
};
export const characterCard = key => { const c=characters[key]; return `<div class="character"><div class="avatar" aria-hidden="true">${c.emoji}</div><div><strong>${c.name}</strong><div class="muted">${c.message}</div></div></div>`; };
