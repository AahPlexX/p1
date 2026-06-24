export const MAP=[
['~','~','.','.','t','t','.','.','~','~'],
['~','v','v','.','t','.','.','t','s','~'],
['~','v','v','.','t','~','r','r','.','~'],
['~','.','.','.','t','.','r','r','t','~'],
['~','t','~','.','t','.','.','t','t','~'],
['~','.','t','t','.','~','.','.','t','~'],
['~','~','~','~','~','~','~','~','~','~']
];
const tile={'.':['Meadow','The old road runs through silver grass.'],'t':['Thicket','Wet branches close around the road.'],'v':['Cinderwake','The village hearth restores your strength.'],'s':['Mossbound shrine','An undying ember warms your hands.'],'r':['Sunken Archive','Broken stone leans over black water.'],'~':['Cinderwater','The river blocks your path.']};
const foes=[['Mireling','◉',20,6,16,5],['Hollow Wolf','◈',25,7,19,7],['Ash Wisp','✧',18,8,18,8]];
const boss=['Bell Warden','◫',62,12,72,40,true];
const dirs={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
const cap=(n,a,b)=>Math.min(Math.max(n,a),b);
const roll=(r,a,b)=>a+Math.floor(cap(Number(r()),0,.999999)*(b-a+1));
const copy=s=>JSON.parse(JSON.stringify(s));
const note=(s,m)=>{s.log.unshift(m);s.log=s.log.slice(0,7)};
const goal=l=>20+l*12;
const foe=(r,b=false)=>{const f=b?boss:foes[Math.floor(cap(Number(r()),0,.999999)*foes.length)];return {name:f[0],sigil:f[1],hp:f[2],max:f[2],atk:f[3],xp:f[4],gold:f[5],boss:Boolean(f[6])}};

export function initial(){return {v:1,p:{x:1,y:1,hp:42,mh:42,mn:10,mm:10,lvl:1,xp:0,gold:0,pots:2,relics:0,guard:false},b:null,won:false,log:['Find three relics in the thickets, then silence the Hollow Bell.','The elder sends you toward the Sunken Archive.']}}
export function at(x,y){return MAP[y]?.[x]??null}
export function scene(s){return tile[at(s.p.x,s.p.y)]??tile['.']}
export function valid(s){const p=s?.p;return Boolean(s&&s.v===1&&p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&at(p.x,p.y)&&at(p.x,p.y)!=='~'&&p.hp>=0&&p.hp<=p.mh&&p.mn>=0&&p.mn<=p.mm&&p.relics>=0&&p.relics<=3&&Array.isArray(s.log))}
export function dump(s){return JSON.stringify(s)}
export function restore(raw){try{const s=typeof raw==='string'?JSON.parse(raw):raw;return valid(s)?s:initial()}catch{return initial()}}
function level(s){while(s.p.xp>=goal(s.p.lvl)){s.p.xp-=goal(s.p.lvl);s.p.lvl++;s.p.mh+=8;s.p.mm+=2;s.p.hp=s.p.mh;s.p.mn=s.p.mm;note(s,`Level ${s.p.lvl}: vitality and ember are restored.`)}}
function lose(s){const lost=Math.ceil(s.p.gold/3);s.p.gold-=lost;s.p.x=1;s.p.y=1;s.p.hp=Math.ceil(s.p.mh/2);s.p.mn=Math.ceil(s.p.mm/2);s.p.guard=false;s.b=null;note(s,`You wake in Cinderwake. The Vale takes ${lost} gold.`)}
function enemy(s,r){if(!s.b)return;const e=s.b;const d=s.p.guard?Math.ceil(roll(r,Math.max(2,e.atk-2),e.atk+2)/2):roll(r,Math.max(2,e.atk-2),e.atk+2);s.p.hp=Math.max(0,s.p.hp-d);s.p.guard=false;note(s,`${e.name} hits for ${d}.`);if(!s.p.hp)lose(s)}
function win(s){const e=s.b;s.p.gold+=e.gold;s.p.xp+=e.xp;level(s);s.b=null;if(e.boss){s.won=true;note(s,'The Bell Warden falls silent. The Vale can breathe again.');return}if(s.p.relics<3){s.p.relics++;note(s,`You recover a relic (${s.p.relics} of 3).`)}note(s,`${e.name} is defeated. +${e.xp} XP, +${e.gold} gold.`)}
function fight(s,a,r){const e=s.b;if(!e)return;if(a==='flee'){if(e.boss){note(s,'There is no fleeing the Bell Warden.');return}if(r()>.38){s.b=null;s.p.guard=false;note(s,'You escape through the thicket.');return}note(s,'The path closes before you.');enemy(s,r);return}if(a==='drink'){if(!s.p.pots){note(s,'No moonwort draught remains.');return}s.p.pots--;const n=Math.min(22,s.p.mh-s.p.hp);s.p.hp+=n;note(s,`Moonwort restores ${n} vitality.`);enemy(s,r);return}if(a==='guard'){s.p.guard=true;note(s,'You brace behind the guarding charm.');enemy(s,r);return}let d=0;if(a==='strike'){d=roll(r,7+s.p.lvl,12+s.p.lvl*2);note(s,`Your blade deals ${d}.`)}if(a==='ember'){if(s.p.mn<3){note(s,'Not enough ember.');return}s.p.mn-=3;d=roll(r,13+s.p.lvl,19+s.p.lvl*2);note(s,`Ember Lance deals ${d}.`)}if(!d){note(s,'That action has no effect.');return}e.hp=Math.max(0,e.hp-d);if(!e.hp)win(s);else enemy(s,r)}
function enter(s,t,r){if(t==='v'){s.p.hp=s.p.mh;s.p.mn=s.p.mm;s.p.guard=false;note(s,'Cinderwake restores your vitality and ember.');return}if(t==='s'){s.p.hp=Math.min(s.p.mh,s.p.hp+10);s.p.mn=Math.min(s.p.mm,s.p.mn+6);note(s,'The shrine steadies your heart.');return}if(t==='r'){if(s.won){note(s,'The archive is quiet.');return}if(s.p.relics<3){note(s,'Three relics must answer the Hollow Bell.');return}s.b=foe(r,true);note(s,'The Bell Warden answers from below.');return}if(t==='t'&&r()<.38){s.b=foe(r);note(s,`${s.b.name} steps from the thicket.`);return}if(t==='t')note(s,'The thicket is quiet for now.');}
export function act(current,a,r=Math.random){const s=copy(current);if(a?.type==='combat'){fight(s,a.name,r);return s}if(a?.type!=='move'||!dirs[a.dir]){note(s,'Nothing answers that command.');return s}if(s.b){note(s,'Finish the encounter before moving on.');return s}const [dx,dy]=dirs[a.dir],x=s.p.x+dx,y=s.p.y+dy,t=at(x,y);if(!t||t==='~'){note(s,'The Cinderwater blocks the way.');return s}s.p.x=x;s.p.y=y;s.p.guard=false;enter(s,t,r);return s}
