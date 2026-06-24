import assert from 'node:assert/strict';
import test from 'node:test';
import {act,initial,restore,valid,dump} from '../src/engine.js';

test('initial game is valid',()=>assert.equal(valid(initial()),true));
test('river blocks movement',()=>{const s=initial(),n=act(s,{type:'move',dir:'north'},()=>.5);assert.equal(n.p.x,1);assert.equal(n.p.y,1)});
test('village restores resources',()=>{const s=initial();s.p.hp=1;s.p.mn=0;const n=act(act(s,{type:'move',dir:'east'},()=>.99),{type:'move',dir:'west'},()=>.99);assert.equal(n.p.hp,n.p.mh);assert.equal(n.p.mn,n.p.mm)});
test('normal victory grants a relic',()=>{const s=initial();s.b={name:'test',sigil:'x',hp:1,max:1,atk:1,xp:1,gold:1,boss:false};const n=act(s,{type:'combat',name:'strike'},()=>.99);assert.equal(n.p.relics,1);assert.equal(n.b,null)});
test('boss victory completes quest',()=>{const s=initial();s.p.relics=3;s.b={name:'Bell Warden',sigil:'x',hp:1,max:62,atk:12,xp:72,gold:40,boss:true};const n=act(s,{type:'combat',name:'strike'},()=>.99);assert.equal(n.won,true);assert.equal(n.b,null)});
test('invalid saves recover safely',()=>assert.equal(valid(restore('{"v":1,"p":null}')),true));
test('valid saves round-trip',()=>assert.deepEqual(restore(dump(initial())),initial()));
