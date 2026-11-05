const title=document.getElementById('title'),world=document.getElementById('world'),room=document.getElementById('room'),modal=document.getElementById('modal'),modalBody=document.getElementById('modal-body'),modalTitle=document.getElementById('modal-title');const pets=[{id:'antsui',name:'Antsui',emoji:'🐜🥝',sound:'Antsui wiggles happily!'},{id:'blueberry',name:'Blueberry Cat',emoji:'🐱🫐',sound:'Blueberry Cat purrs!'},{id:'ratdog',name:'Rat Dog',emoji:'🐭🐶',sound:'Rat Dog does a silly dance!'}];let owned=['blueberry'];let selected='blueberry',bathBusy=false;const today=()=>new Date().toLocaleDateString('en-CA');let state={};try{state=JSON.parse(localStorage.getItem('squiggles-care-v2')||'{}')}catch{}function save(){localStorage.setItem('squiggles-care-v2',JSON.stringify(state))}function care(id){if(!state[id])state[id]={date:'',played:false,bathed:false};if(state[id].date!==today()){state[id].date=today();state[id].played=false;state[id].bathed=false}return state[id]}function current(){return pets.find(p=>p.id===selected)||pets[0]}function showRoom(name){document.querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('selected',b.dataset.room===name));if(name==='playroom'){renderPlayroom();return}const rooms={merge:['🏰 Merging Castle','Combine pets and fruits to discover magical new creatures!','🐱 + 🫐 = 💙'],garden:['🌱 Garden','Grow fruits and vegetables for your future creations!','🌱 🍓 🥕'],shop:['🎁 Mystery Shop','Mystery pets and seeds will be available here soon!','🎁 🎁 🎁'],fridge:['🧊 Fridge','Keep your seeds fresh in three starter slots.','🧊 🌱 🌱 🌱']};let r=rooms[name];room.innerHTML=`<div class="generic"><h1>${r[0]}</h1><p>${r[1]}</p><div class="icons">${r[2]}</div><p>More adventures are coming soon!</p></div>`}function renderPlayroom(message){if(!owned.includes(selected))selected=owned[0]||'';const p=current(),c=care(p.id),done=owned.filter(id=>care(id).played).length;room.innerHTML=`<div class="play-layout"><aside class="panel"><h2>🐾 My Pets</h2>${owned.length?owned.map(id=>{let a=pets.find(x=>x.id===id);return `<button class="pet-choice ${selected===id?'active':''}" data-pet="${id}">${id==='blueberry'||id==='antsui'?`<img class="pet-choice-art" src="${id==='blueberry'?'assets/images/blueberry-cat.png':'assets/images/antsui.png'}" alt="">`:a.emoji} <span class="pet-choice-name">${a.name}</span> <span class="pet-choice-status">${care(id).played?'✓':'♡'}</span></button>`}).join(''):'<p>No pets yet!</p>'}<div class="progress">Played today: ${done}/${owned.length}</div><p class="small">Play with every pet each day!</p></aside><section class="center-stage"><div class="speech" id="speech">${message|| (c.played?'Happy to see you again!':'Pick a pet and play!')}</div><div class="pet-display" aria-label="${p.name}">${p.id==='blueberry'?'<img class="blueberry-sprite" src="assets/images/blueberry-cat.png" alt="Blueberry Cat from the original title artwork">':p.id==='antsui'?'<img class="antsui-sprite" src="assets/images/antsui.png" alt="Antsui from the original title artwork">':p.emoji}</div><button class="action" id="antsui-wiggle" ${p.id==='antsui'?'':'hidden'}>🥝 Antsui wiggle!</button><button class="action" id="cat-dance" ${p.id==='blueberry'?'':'hidden'}>✨ Paws up & spin!</button><button class="action" id="pet-play">🪀 Play with ${p.name}!</button><div class="small">${c.played?'💖 Played today':'💗 Wants to play'} · ${c.bathed?'🫧 Sparkly clean':'🧼 Bath available'}</div></section><aside class="panel"><h2>🫧 Bath Time</h2><button class="bath-tile" id="bath-open"><span class="tub">🛁</span>Tap for a bath!</button><p class="small">One pet at a time. Splashy bubbles!</p></aside></div>`;room.querySelectorAll('[data-pet]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.pet;renderPlayroom()}));document.getElementById('antsui-wiggle').addEventListener('click',()=>{const sprite=room.querySelector('.antsui-sprite');if(!sprite)return;sprite.classList.remove('antsui-wiggling');void sprite.offsetWidth;sprite.classList.add('antsui-wiggling');document.getElementById('speech').textContent='Antsui does a happy kiwi wiggle!';});document.getElementById('cat-dance').addEventListener('click',()=>{const sprite=room.querySelector('.blueberry-sprite');if(!sprite)return;sprite.classList.remove('cat-dancing');void sprite.offsetWidth;sprite.classList.add('cat-dancing');document.getElementById('speech').textContent='Look! Paws up, then a silly spin!';});document.getElementById('pet-play').addEventListener('click',()=>{let c=care(selected);c.played=true;save();let all=owned.every(id=>care(id).played);renderPlayroom(all?'🎉 Hooray! You played with everyone today!':p.sound)});document.getElementById('bath-open').addEventListener('click',openBath)}function petArt(id,extra=''){const file=id==='blueberry'?'assets/images/blueberry-cat.png':id==='antsui'?'assets/images/antsui.png':null;return file?`<img class="bath-pet-art ${extra}" src="${file}" alt="${id==='blueberry'?'Blueberry Cat':'Antsui'}">`:'<span class="bath-other-pet">🐾</span>'}function openBath(){bathBusy=false;modal.classList.remove('hidden');modalTitle.textContent='Which pet would you like to bathe?';modalBody.innerHTML=owned.length?`<div class="bath-list">${owned.map(id=>{let p=pets.find(x=>x.id===id);return `<button class="pet-choice" data-bathe="${id}">${petArt(id,'bath-choice-art')}<br>${p.name}</button>`}).join('')}</div><p>One pet at a time!</p>`:'<p>You have no pets to bathe yet! Visit the shop to find a friend.</p>';modalBody.querySelectorAll('[data-bathe]').forEach(b=>b.addEventListener('click',()=>startBath(b.dataset.bathe)))}function startBath(id){if(bathBusy)return;bathBusy=true;let p=pets.find(x=>x.id===id);modalTitle.textContent=`${p.name}'s bubble bath!`;const isCat=id==='blueberry';const phases=isCat?['😱 NOOO! NOT THE WATER!','〰️ Wait... this feels warm...','😌 Mmmm! This is actually nice!']:['😮 Here come the bubbles!','💦 SPLAAASH!','🥰 Squeaky clean and happy!'];let n=0;function paint(){modalBody.innerHTML=`<div class="bath-scene"><div class="bath-character ${isCat?'bath-cat':'bath-antsui'} bath-phase-${n}">${petArt(id,'bath-main-art')}</div><div class="bath-foam"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="illustrated-tub"><div class="tub-rim"></div><div class="tub-body"><span class="tub-paw">♥</span></div><div class="tub-feet"><b></b><b></b></div></div><div class="bath-droplets"><i></i><i></i><i></i><i></i></div></div><div class="bath-reaction">${phases[n]}</div><p>${n===2?'All clean!':'Splash, splash!'}</p><button class="action" id="bath-next">${n===2?'Done ✓':'Next →'}</button>`;document.getElementById('bath-next').addEventListener('click',()=>{if(n<2){n++;paint()}else{care(id).bathed=true;save();bathBusy=false;modal.classList.add('hidden');selected=id;renderPlayroom(`${p.name} is squeaky clean! 🫧`)}})}paint()}document.getElementById('play').addEventListener('click',()=>{title.classList.remove('active');world.classList.add('active');showRoom('playroom')});document.getElementById('home').addEventListener('click',()=>{world.classList.remove('active');title.classList.add('active');modal.classList.add('hidden')});document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>showRoom(b.dataset.room)));document.getElementById('close-modal').addEventListener('click',()=>modal.classList.add('hidden'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.add('hidden')});
// Daily shop: one free mystery pet and one free mystery seed per local calendar day.
// Extra purchases and real payments are intentionally not enabled.
const shopKey='squiggles-shop-v1';
function shopData(){let s={};try{s=JSON.parse(localStorage.getItem(shopKey)||'{}')}catch{}if(s.date!==today())s={date:today(),petClaimed:false,seedClaimed:false,seeds:[]};return s}
function saveShop(s){localStorage.setItem(shopKey,JSON.stringify(s))}
function renderShop(message=''){
 const s=shopData();
 const petItems=[0,1,2].map(i=>`<button class="shop-hotspot shop-pet slot-${i}" data-shop-pet="${i}" aria-label="${s.petClaimed?'Daily mystery pet already claimed':'Claim free daily mystery pet'}" ${s.petClaimed?'disabled':''}><span class="shop-hotspot-status">${s.petClaimed?'✓ Claimed':'Free today'}</span></button>`).join('');
 const seedItems=[0,1,2].map(i=>`<button class="shop-hotspot shop-seed slot-${i}" data-shop-seed="${i}" aria-label="${s.seedClaimed?'Daily mystery seed already claimed':'Claim free daily mystery seed'}" ${s.seedClaimed?'disabled':''}><span class="shop-hotspot-status">${s.seedClaimed?'✓ Claimed':'Free today'}</span></button>`).join('');
 const extras=['Fertilizer','Fridge Space','Accessories'].map((name,i)=>`<button class="shop-hotspot shop-extra slot-${i}" disabled aria-label="${name}, coming soon"><span class="shop-hotspot-status">Coming soon</span></button>`).join('');
 room.innerHTML=`<div class="shop-page shop-art-layout"><button class="shop-art-home" id="shop-art-home" aria-label="Back to playroom"></button><div class="shop-art-items">${petItems}${seedItems}${extras}</div><div class="shop-art-feedback" role="status">${message||'🎁 One free mystery pet and one free mystery seed each day!'}</div><div class="shop-art-inventory">${s.petClaimed?'✓ Pet claimed':'🎁 Pet ready'} · ${s.seedClaimed?'✓ Seed claimed':'🌱 Seed ready'}${s.seeds.length?' · Seeds: '+s.seeds.join(', '):''}</div></div>`;
 room.querySelectorAll('[data-shop-pet]').forEach(b=>b.addEventListener('click',()=>{const d=shopData();if(d.petClaimed)return;d.petClaimed=true;saveShop(d);const pool=['antsui','blueberry'];const id=pool[Math.floor(Math.random()*pool.length)];const pet=pets.find(p=>p.id===id);if(!owned.includes(id)){owned.push(id);localStorage.setItem('squiggles-owned-v1',JSON.stringify(owned));renderShop(`🎉 Surprise! You found ${pet.name}! Visit My Pets to meet your new friend.`)}else renderShop(`🎉 Surprise! It's ${pet.name}! You already have this friend, so you get a happy reunion!`)}));
 room.querySelectorAll('[data-shop-seed]').forEach(b=>b.addEventListener('click',()=>{const d=shopData();if(d.seedClaimed)return;d.seedClaimed=true;const seed=['🍓 Strawberry','🥝 Kiwi','🫐 Blueberry','🥕 Carrot','🍎 Apple'][Math.floor(Math.random()*5)];d.seeds.push(seed);saveShop(d);renderShop(`🌱 Surprise! You got a ${seed} seed! Your garden will be ready for planting soon.`)}));
}

// Replace the old shop placeholder while leaving other rooms unchanged.
room.addEventListener('click',e=>{if(e.target.closest('#shop-art-home'))showRoom('playroom')});
const originalShowRoom=showRoom;
showRoom=function(name){document.querySelector('.scene').classList.toggle('shop-fullscreen',name==='shop');
 document.querySelector('.scene').classList.toggle('playroom-illustrated',name==='playroom');if(name==='shop'){document.querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('selected',b.dataset.room===name));renderShop();return}originalShowRoom(name)};

// Persistent inventory and daily story.
const adventureKey='ss-adventure-v3';
let adventure={firstDay:today(),animals:['blueberry'],seeds:[],plants:[],harvest:[],creatures:[],rawAnimals:[],day2Seen:false,day2Opened:false};
try{adventure={...adventure,...JSON.parse(localStorage.getItem(adventureKey)||'{}')}}catch{}
// Completed hybrids are pets; ordinary animals remain separate until merged.
const rawAnimalTypes=[{id:'cat',name:'Cat',emoji:'🐱'},{id:'dog',name:'Dog',emoji:'🐶'},{id:'rabbit',name:'Rabbit',emoji:'🐰'},{id:'fox',name:'Fox',emoji:'🦊'},{id:'bear',name:'Bear',emoji:'🐻'}];
adventure.rawAnimals=Array.isArray(adventure.rawAnimals)?adventure.rawAnimals:[];
(adventure.creatures||[]).forEach((c,i)=>{if(c.id&&!pets.some(p=>p.id===c.id))pets.push({id:c.id,name:c.name,emoji:c.emoji,sound:c.name+' is happy to see you!'})});
owned=[...new Set(adventure.animals.filter(id=>pets.some(p=>p.id===id)))];
if(!owned.length){owned=['blueberry'];adventure.animals=['blueberry']}
function saveAdventure(){localStorage.setItem(adventureKey,JSON.stringify(adventure))}
saveAdventure();
const crops=[{id:'kiwi',name:'Kiwi',emoji:'🥝'},{id:'blueberry',name:'Blueberry',emoji:'🫐'},{id:'strawberry',name:'Strawberry',emoji:'🍓'},{id:'carrot',name:'Carrot',emoji:'🥕'},{id:'apple',name:'Apple',emoji:'🍎'}];
const cropName=id=>crops.find(c=>c.id===id)?.name||id;
const cropEmoji=id=>crops.find(c=>c.id===id)?.emoji||'🌱';
const growMs=3*60*1000;
const isDayTwo=()=>today()!==adventure.firstDay;
function popup(title,html){modal.classList.remove('hidden');modalTitle.textContent=title;modalBody.innerHTML=html}
function revealAnimal(id,after){
 const name=pets.find(p=>p.id===id)?.name||id;
 popup('✨ A magical surprise!','<div class="magic-box">🎁<span>✦ ✧ ✦</span></div><p>Something wonderful is inside...</p>');
 setTimeout(()=>{
  if(modal.classList.contains('hidden'))return;
  modalTitle.textContent='✨ Meet '+name+'!';
  modalBody.innerHTML=`<div class="magic-reveal ${id==='antsui'?'float-wiggle':'float-spin'}">${petArt(id,'magic-pet')}</div><p>${name} is ready for an adventure!</p><button class="action" id="welcome-pet">Welcome, ${name}! 💖</button>`;
  document.getElementById('welcome-pet').onclick=()=>{
   if(!adventure.animals.includes(id))adventure.animals.push(id);
   owned=[...adventure.animals];saveAdventure();modal.classList.add('hidden');
   if(after)after();else showRoom('shop');
  };
 },2200);
}
function gardenRoom(){
 const now=Date.now();let changed=false;
 adventure.plants=adventure.plants.filter(p=>{
  if(now-p.at>=growMs){adventure.harvest.push(p.crop);changed=true;return false}return true
 });
 if(changed)saveAdventure();
 room.innerHTML=`<div class="adventure-room"><h1>🌱 Magical Garden</h1><p>Plant a seed and watch it grow! Each seed takes 3 minutes, even if you visit another room.</p>
 <div class="adventure-grid">${adventure.seeds.map((c,i)=>`<button class="adventure-item" data-plant="${i}"><b>${cropEmoji(c)}</b><span>Plant ${cropName(c)}</span></button>`).join('')||'<p>No seeds yet. Collect your free daily seed at S&S Shop!</p>'}</div>
 <h2>🌿 Growing</h2><div class="adventure-grid">${adventure.plants.map(p=>`<div class="adventure-item"><b>🌱</b><span>${cropName(p.crop)} · ${Math.max(1,Math.ceil((growMs-(now-p.at))/60000))} min left</span></div>`).join('')||'<p>Nothing growing yet</p>'}</div>
 <h2>🧺 Harvested</h2><p>${adventure.harvest.map(c=>cropEmoji(c)+' '+cropName(c)).join(' · ')||'Your crops will appear here automatically when ready!'}</p><button class="action" id="garden-refresh">Check plants 🌷</button><button class="action" id="to-castle">🏰 Go to Castle</button></div>`;
 room.querySelectorAll('[data-plant]').forEach(b=>b.onclick=()=>{const [c]=adventure.seeds.splice(Number(b.dataset.plant),1);adventure.plants.push({crop:c,at:Date.now()});saveAdventure();gardenRoom()});
 document.getElementById('garden-refresh').onclick=gardenRoom;
 document.getElementById('to-castle').onclick=()=>showRoom('merge');
}
function castleRoom(){
 const available=adventure.rawAnimals;
 room.innerHTML=`<div class="adventure-room"><h1>🏰 Merge Castle</h1><p>Bring an animal from the shop and a grown fruit or vegetable from the garden to create a creature!</p>
 <div class="castle-columns"><div><h2>🐾 Choose an animal</h2><select id="merge-animal">${available.map((id,i)=>`<option value="${i}">${rawAnimalTypes.find(p=>p.id===id)?.emoji} ${rawAnimalTypes.find(p=>p.id===id)?.name}</option>`).join('')}</select></div>
 <div><h2>🧺 Choose a harvest</h2><select id="merge-crop">${adventure.harvest.map((c,i)=>`<option value="${i}">${cropEmoji(c)} ${cropName(c)}</option>`).join('')}</select></div></div>
 <button class="action" id="merge-now" ${!available.length||!adventure.harvest.length?'disabled':''}>✨ Merge!</button>
 <p class="small">${!adventure.harvest.length?'Grow and harvest a seed first!':''}</p>
 <h2>💜 Your creations</h2><p>${adventure.creatures.map(c=>`${c.emoji} ${c.name}`).join(' · ')||'Your magical creations will appear here!'}</p></div>`;
 document.getElementById('merge-now').onclick=()=>{
 const animalIndex=Number(document.getElementById('merge-animal').value);
 const animal=adventure.rawAnimals[animalIndex];
 if(!animal||!adventure.harvest.length)return;
 const idx=Number(document.getElementById('merge-crop').value);
 const [crop]=adventure.harvest.splice(idx,1);
 adventure.rawAnimals.splice(animalIndex,1);
 const raw=rawAnimalTypes.find(a=>a.id===animal);
 const name=cropName(crop)+' '+raw.name;
 const emoji=raw.emoji+cropEmoji(crop);
 const id='hybrid-'+Date.now()+'-'+Math.floor(Math.random()*1000);
 const creature={id,animal,crop,name,emoji};
 adventure.creatures.push(creature);adventure.animals.push(id);
 pets.push({id,name,emoji,sound:name+' is happy to see you!'});
 owned=[...adventure.animals];saveAdventure();
 popup('✨ A new creature!',`<div class="magic-reveal float-spin"><span style="font-size:75px">${emoji}</span></div><p>Meet ${name}! A magical new friend!</p><button class="action" id="merge-finish">🏡 Visit Playroom</button>`);
 document.getElementById('merge-finish').onclick=()=>{modal.classList.add('hidden');showRoom('playroom')};
 };
}
// Replace original shop handler and room router with adventure-aware versions.
showRoom=function(name){
 document.querySelector('.scene').classList.toggle('shop-fullscreen',name==='shop');
 document.querySelector('.scene').classList.toggle('playroom-illustrated',name==='playroom');
 document.querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('selected',b.dataset.room===name));
 if(name==='shop'){renderAdventureShop();return}
 if(name==='garden'){gardenRoom();return}
 if(name==='merge'){castleRoom();return}
 originalShowRoom(name);
};
function renderAdventureShop(message=''){
 const s=shopData(),special=isDayTwo()&&!adventure.day2Opened;
 const petItems=[0,1,2].map(i=>`<button class="shop-hotspot shop-pet slot-${i}" data-shop-pet="${i}" ${s.petClaimed&&!special?'disabled':''}><span class="shop-hotspot-status">${special?'✨ Visitor!':s.petClaimed?'✓ Claimed':'Free today'}</span></button>`).join('');
 const seedItems=[0,1,2].map(i=>`<button class="shop-hotspot shop-seed slot-${i}" data-shop-seed="${i}" ${s.seedClaimed?'disabled':''}><span class="shop-hotspot-status">${s.seedClaimed?'✓ Claimed':'Free today'}</span></button>`).join('');
 const extras=['Fertilizer','Fridge Space','Accessories'].map((n,i)=>`<button class="shop-hotspot shop-extra slot-${i}" disabled><span class="shop-hotspot-status">Coming soon</span></button>`).join('');
 room.innerHTML=`<div class="shop-page shop-art-layout"><button class="shop-art-home" id="shop-art-home" aria-label="Back to playroom"></button><div class="shop-art-items">${petItems}${seedItems}${extras}</div><div class="shop-art-feedback" role="status">${message||'🎁 Open your present here, then visit the garden and castle!'}</div><div class="shop-art-inventory">🐾 Pets: ${adventure.animals.length} · 🎁 Animals to merge: ${adventure.rawAnimals.length} · 🌱 Seeds: ${adventure.seeds.length} · 🧺 Harvest: ${adventure.harvest.length}</div><button class="shop-garden-link" id="shop-to-garden">🌱 Garden →</button></div>`;
 document.getElementById('shop-art-home').onclick=()=>showRoom('playroom');
 document.getElementById('shop-to-garden').onclick=()=>showRoom('garden');
 room.querySelectorAll('[data-shop-pet]').forEach(b=>b.onclick=()=>{
  const d=shopData();
  if(isDayTwo()&&!adventure.day2Opened){
   adventure.day2Opened=true;saveAdventure();
   revealAnimal('antsui',()=>renderAdventureShop('🥝 Antsui is already a finished creature and is ready for the playroom!'));return;
  }
  if(d.petClaimed)return;
  d.petClaimed=true;saveShop(d);
  const animal=rawAnimalTypes[Math.floor(Math.random()*rawAnimalTypes.length)];
  popup('✨ A magical surprise!','<div class="magic-box">🎁<span>✦ ✧ ✦</span></div><p>Your present is opening...</p>');
  setTimeout(()=>{
   if(modal.classList.contains('hidden'))return;
   modalTitle.textContent='🎉 You found a '+animal.name+'!';
   modalBody.innerHTML=`<div class="magic-reveal float-wiggle" style="font-size:95px">${animal.emoji}</div><p>Take your ${animal.name} to the Merge Castle after your seed grows!</p><button class="action" id="welcome-animal">Take to Castle 🏰</button>`;
   document.getElementById('welcome-animal').onclick=()=>{adventure.rawAnimals.push(animal.id);saveAdventure();modal.classList.add('hidden');renderAdventureShop('✨ Your '+animal.name+' is waiting for a grown fruit or vegetable!')};
  },2200);
 });
 room.querySelectorAll('[data-shop-seed]').forEach(b=>b.onclick=()=>{
  const d=shopData();if(d.seedClaimed)return;
  d.seedClaimed=true;saveShop(d);
  const c=crops[Math.floor(Math.random()*crops.length)];
  adventure.seeds.push(c.id);saveAdventure();
  renderAdventureShop(`🌱 You found a ${c.name} seed! Go plant it in the garden.`);
 });
}
document.getElementById('play').addEventListener('click',()=>{
 if(isDayTwo()&&!adventure.day2Seen){
  adventure.day2Seen=true;saveAdventure();
  popup('💌 A mysterious visitor!',`<div class="magic-box">🎁<span>✧ ✦ ✧</span></div><p>Someone would like to meet you in the shop!</p><button class="action" id="visit-shop">🛍️ Visit S&S Shop</button>`);
  document.getElementById('visit-shop').onclick=()=>{modal.classList.add('hidden');showRoom('shop')};
 }
},{capture:false});
