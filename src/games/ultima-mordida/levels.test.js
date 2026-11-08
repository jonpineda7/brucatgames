import test from 'node:test'
import assert from 'node:assert/strict'
import {LEVELS} from './levels.js'
import {menuFor,guestsFor} from './data.js'
import {matches,candidates,validateLevel,magnifierClue,clueText} from './clues.js'
test('20 fixed cases have true clues and exactly one enchanted dish and one villain',()=>{
 assert.equal(LEVELS.length,20)
 for(const level of LEVELS){
  assert.equal(validateLevel(level),true,`level ${level.id}`)
  const dishes=menuFor(level),guests=guestsFor(level)
  assert.equal(level.id,LEVELS.indexOf(level)+1);assert.equal(level.stage,Math.floor((level.id-1)/5))
  assert.equal(dishes.length,level.stage===0?3:5);assert.equal(guests.length,dishes.length)
  assert.ok(level.clues.every(rule=>matches(dishes.find(d=>d.id===level.enchanted),rule)))
  assert.deepEqual(candidates(dishes,level.clues).map(d=>d.id),[level.enchanted])
  if(level.mode!=='classic')assert.deepEqual(candidates(guests,level.guestClues).map(g=>g.id),[level.villain])
  if(level.stage>=2){
   for(const rule of level.clues)assert.ok(candidates(dishes,[rule]).length>=2,`advanced clue is not a giveaway: ${level.id}`)
   for(const rule of level.guestClues)assert.ok(candidates(guests,[rule]).length>=2)
  }
  if(level.stage>=1)assert.equal(level.clues.length,3)
  assert.ok(matches(dishes.find(d=>d.id===level.enchanted),magnifierClue(level)))
  for(const rule of level.clues)assert.notEqual(clueText(rule),'Revisa la ficha de la receta.')
 }
})
test('validator rejects false, ambiguous and contradictory clues and invalid swaps',()=>{
 const level=LEVELS[5]
 assert.equal(validateLevel({...level,clues:[]}),false)
 assert.equal(validateLevel({...level,clues:[{field:'flavor',op:'is',value:'imposible'}]}),false)
 assert.equal(validateLevel({...level,clues:[{field:'flavor',op:'is',value:'dulce'},{field:'flavor',op:'not',value:'dulce'}]}),false)
 assert.equal(validateLevel({...level,twist:['moru','moru']}),false)
 assert.equal(validateLevel({...level,guests:['missing']}),false)
})
