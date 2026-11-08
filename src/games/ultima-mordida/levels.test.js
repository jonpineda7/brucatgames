import test from 'node:test'
import assert from 'node:assert/strict'
import {LEVELS} from './levels.js'
import {menuFor,STAGES} from './data.js'
import {buildClues,candidates,matches,validateRoundClues} from './clues.js'
import {createRound,randomIndex} from './rounds.js'
test('every level has five unique recipes and all possible Easy rounds have a unique logical solution',()=>{
 assert.equal(LEVELS.length,20)
 for(const level of LEVELS){
  const dishes=menuFor(level),difficulty=STAGES[level.stage].difficulty
  assert.equal(dishes.length,5);assert.equal(new Set(dishes.map(d=>d.id)).size,5)
  for(const [index,target] of dishes.entries()){
   const round=createRound(level,1,10,index/5+.01)
   assert.equal(round.poisonedDish,target.id)
   assert.equal(validateRoundClues(dishes,target.id,round.clues,{unique:difficulty==='easy'}),true)
   assert.ok(round.clues.every(rule=>matches(target,rule)))
   const count=candidates(dishes,round.clues).length
   if(difficulty==='easy')assert.equal(count,1)
   else if(difficulty==='normal')assert.ok(count>=2&&count<=3)
   else assert.ok(count>=3&&count<=4)
  }
 }
})
test('random choice covers five dishes; random input is injected and finite, with no mid-round resampling',()=>{
 assert.deepEqual([0,.2,.4,.6,.8].map(roll=>randomIndex(roll,5)),[0,1,2,3,4])
 assert.equal(randomIndex(1,5),4);assert.equal(randomIndex(-1,5),0);assert.equal(randomIndex(NaN,5),0)
 const level=LEVELS[0],a=createRound(level,1,1,.4),b=createRound(level,2,1,.8)
 assert.notEqual(a.token,b.token);assert.notEqual(a.poisonedDish,b.poisonedDish)
})
test('false, contradictory, empty and wrongly declared unique clues are rejected',()=>{
 const dishes=menuFor(LEVELS[0])
 assert.equal(validateRoundClues(dishes,'pizza',[]),false)
 assert.equal(validateRoundClues(dishes,'pizza',[{field:'temperature',op:'is',value:'frío'}]),false)
 assert.equal(validateRoundClues(dishes,'pizza',[{field:'ingredients',op:'has',value:'masa'},{field:'ingredients',op:'lacks',value:'masa'}]),false)
 assert.equal(validateRoundClues(dishes,'pizza',[{field:'flavor',op:'is',value:'salado'}],{unique:true}),false)
 assert.throws(()=>buildClues(dishes,'missing','easy'))
})

test('all 2–5 recipe subsets keep a valid poison solution for every level and every target',()=>{
 for(const level of LEVELS){
  const menu=menuFor(level),difficulty=STAGES[level.stage].difficulty
  for(let mask=1;mask<32;mask++){
   const dishes=menu.filter((_,index)=>mask&(1<<index))
   if(dishes.length<2)continue
   for(const target of dishes){
    const clues=buildClues(dishes,target.id,difficulty)
    assert.equal(validateRoundClues(dishes,target.id,clues,{unique:difficulty==='easy'}),true)
    if(difficulty!=='easy')assert.ok(candidates(dishes,clues).length>=2)
   }
  }
 }
})
test('smaller rounds draw exactly one unique dish per active participant with one poison and fresh clues',()=>{
 for(const level of LEVELS)for(let count=2;count<=5;count++)for(const roll of [0,.2,.6,.99]){
  const round=createRound(level,6-count,12,roll,count,[roll,.6,.4,.8])
  const dishes=menuFor(level).filter(dish=>round.dishes.includes(dish.id))
  assert.equal(round.dishes.length,count);assert.equal(new Set(round.dishes).size,count)
  assert.equal(round.dishes.filter(id=>id===round.poisonedDish).length,1)
  assert.equal(validateRoundClues(dishes,round.poisonedDish,round.clues,{unique:level.stage===0}),true)
  assert.deepEqual(round.assignments,{})
 }
 assert.throws(()=>createRound(LEVELS[0],1,1,0,1))
 assert.throws(()=>createRound(LEVELS[0],1,1,0,6))
})
