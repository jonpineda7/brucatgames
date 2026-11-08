import test from 'node:test'
import assert from 'node:assert/strict'
import { LEVELS } from './levels.js'
import {newGame,gameReducer as reduce,assignDish,exchange,validAssignments,readyToServe,resolveBanquet,starsFor} from './engine.js'
const result={stars:3,score:1300}
const allProgress={completed:Object.fromEntries(LEVELS.map(level=>[level.id,result]))}
const start=id=>reduce(newGame(allProgress),{type:'start',id})
const act=(state,type,data={})=>reduce(state,{type,...data})
function correct(level){const other=level.dishes.filter(id=>id!==level.enchanted),assignments={[level.villain]:level.enchanted};level.guests.filter(id=>id!==level.villain).forEach((id,index)=>{assignments[id]=other[index]});return assignments}
function fill(state,assignments){for(const [guest,dish] of Object.entries(assignments))state=act(state,'assign',{guest,dish});return state}
function permutations(items){return items.length?items.flatMap((item,i)=>permutations(items.filter((_,j)=>i!==j)).map(rest=>[item,...rest])):[[]]}
test('assignment moves or swaps plates atomically, never duplicates or accepts invalid IDs',()=>{
 const level=LEVELS[0]
 let assignments=assignDish(level,{},'pizza','pipo');assignments=assignDish(level,assignments,'sushi','miga')
 assignments=assignDish(level,assignments,'pizza','miga');assert.deepEqual(assignments,{pipo:'sushi',miga:'pizza'})
 assignments=assignDish(level,assignments,'pizza','moru');assert.deepEqual(assignments,{pipo:'sushi',moru:'pizza'})
 assert.equal(assignDish(level,assignments,'alien','pipo'),assignments)
 assert.equal(assignDish(level,assignments,'pizza','alien'),assignments)
 assert.equal(validAssignments(level,{pipo:'pizza',miga:'pizza'}),false)
 assert.equal(readyToServe(level,assignments),false)
})
test('rapid repeated selection and assignment preserves the one-dish/one-guest invariant',()=>{
 let state=start(6);const level=LEVELS[5]
 for(let i=0;i<400;i++){
  state=act(state,'select',{dish:level.dishes[i%5]});state=act(state,'guest',{guest:level.guests[(i*7)%5]})
  state=act(state,'assign',{dish:level.dishes[(i+2)%5],guest:level.guests[(i+1)%5]})
  assert.equal(validAssignments(level,state.assignments),true)
 }
})
test('normal exchange, undo and restart are usable before serving; restarts do not refund powers',()=>{
 let state=fill(start(11),correct(LEVELS[10]));const previous=state.assignments
 state=act(state,'exchange');state=act(state,'guest',{guest:'pipo'});state=act(state,'guest',{guest:'miga'})
 assert.deepEqual(state.assignments,exchange(LEVELS[10],previous,'pipo','miga'))
 state=act(state,'undo');assert.deepEqual(state.assignments,previous)
 state=act(state,'magnifier');state=act(state,'restart')
 assert.deepEqual(state.assignments,{});assert.equal(state.helps,1);assert.equal(state.powers.magnifier,0);assert.equal(state.extraClues.length,1);assert.equal(state.restarts,1)
})
test('all permutations of all 20 cases have exactly the expected wins, with no luck or hidden action',()=>{
 for(const level of LEVELS){
  let wins=0
  for(const permutation of permutations(level.dishes)){
   const assignments=Object.fromEntries(level.guests.map((guest,i)=>[guest,permutation[i]]))
   const result=resolveBanquet(level,assignments,null)
   assert.equal(result.won,assignments[level.villain]===level.enchanted)
   assert.equal(result.stars,result.won?3:0);if(result.won)wins++
  }
  assert.equal(wins,level.dishes.length===3?2:24)
 }
})
test('serving requires full assignments and explicit confirmation; cancellation reveals nothing',()=>{
 let state=start(1);assert.equal(act(state,'request-serve'),state)
 state=fill(state,correct(LEVELS[0]));state=act(state,'request-serve');assert.equal(state.phase,'confirm');assert.equal(state.result,null)
 assert.equal(act(state,'guest',{guest:'pipo'}),state)
 state=act(state,'cancel-serve');assert.equal(state.phase,'playing');assert.equal(state.result,null)
 state=act(state,'request-serve');state=act(state,'confirm-serve');assert.equal(state.phase,'revealing')
 state=act(state,'reveal');assert.equal(state.phase,'result');assert.equal(state.result.won,true);assert.equal(act(state,'reveal'),state)
})
test('wrong serving transforms one innocent, awards no stars and never downgrades previous best',()=>{
 let state=start(6);const assignments=exchange(LEVELS[5],correct(LEVELS[5]),LEVELS[5].villain,'pipo')
 state=fill(state,assignments);const previous=state.progress
 state=act(act(act(state,'request-serve'),'confirm-serve'),'reveal')
 assert.equal(state.result.won,false);assert.equal(state.result.affected,'pipo');assert.equal(state.result.protected,false);assert.equal(state.result.stars,0);assert.equal(state.result.score,0);assert.equal(state.progress,previous)
})
test('a shield prevents the frog transformation, not a wrong answer; choosing villain gives no oracle',()=>{
 let state=start(11);state=act(state,'shield');state=act(state,'guest',{guest:'pipo'})
 assert.equal(state.shield,'pipo');assert.equal(state.helps,1);assert.equal(state.powers.shield,0)
 const level=LEVELS[10];state=fill(state,exchange(level,correct(level),level.villain,'pipo'))
 const protectedResult=resolveBanquet(level,state.assignments,state.shield,state.helps)
 assert.equal(protectedResult.protected,true);assert.equal(protectedResult.won,false);assert.equal(protectedResult.stars,0)
 let other=start(11);other=act(act(other,'shield'),'guest',{guest:level.villain});assert.equal(other.helps,1);assert.equal(other.shield,level.villain)
})
test('magic swap is a counted, deterministic correction and requires complete assignments',()=>{
 let state=start(11);assert.equal(act(state,'magic-swap').helps,0)
 const level=LEVELS[10];state=fill(state,exchange(level,correct(level),level.villain,'pipo'))
 state=act(state,'magic-swap');assert.equal(state.assignments[level.villain],level.enchanted);assert.equal(state.helps,1);assert.equal(state.powers.swap,0)
 state=act(state,'magic-swap');assert.equal(state.helps,1)
 state=act(state,'undo');assert.notEqual(state.assignments[level.villain],level.enchanted);assert.equal(state.helps,1)
})
test('Cambia-Platos announces a single visible swap, allows correction and cannot defeat a confirmed solution',()=>{
 for(const level of LEVELS.slice(15)){
  let state=fill(start(level.id),correct(level));const previous=state.assignments
  state=act(state,'request-serve');assert.equal(state.phase,'twist');assert.equal(state.result,null);assert.equal(state.twistDone,true)
  assert.deepEqual(state.lastSwap,level.twist);assert.deepEqual(state.assignments,exchange(level,previous,...level.twist))
  assert.equal(act(state,'request-serve'),state)
  state=act(state,'acknowledge-twist');state=act(state,'undo');assert.deepEqual(state.assignments,previous)
  state=act(state,'request-serve');assert.equal(state.phase,'confirm')
  state=act(act(state,'confirm-serve'),'reveal');assert.equal(state.result.won,true);assert.equal(state.result.stars,3)
 }
})
test('stars track the number of helps exactly, and unavailable powers do not count',()=>{
 assert.equal(starsFor(0),3);assert.equal(starsFor(1),2);assert.equal(starsFor(2),1);assert.equal(starsFor(3),1)
 let state=start(1);state=act(state,'magnifier');state=act(state,'shield');assert.equal(state.helps,0)
 state=start(11);state=act(state,'magnifier');state=act(state,'magnifier');assert.equal(state.helps,1)
})
test('winning all levels unlocks progression sequentially; locked variants cannot be started',()=>{
 let state=newGame()
 assert.equal(act(state,'start',{id:11}),state);assert.equal(act(state,'stage',{stage:2}),state)
 for(const level of LEVELS){
  state=act(state,'start',{id:level.id});state=fill(state,correct(level));state=act(state,'request-serve')
  if(state.phase==='twist'){state=act(state,'acknowledge-twist');state=act(state,'undo');state=act(state,'request-serve')}
  state=act(act(state,'confirm-serve'),'reveal')
  assert.equal(state.result.won,true);assert.equal(state.progress.unlocked,Math.min(20,level.id+1))
 }
 assert.equal(Object.keys(state.progress.completed).length,20)
})
test('the reducer never mutates earlier assignments or history snapshots',()=>{
 const state=start(1),before=JSON.stringify(state);const next=fill(state,correct(LEVELS[0]));assert.equal(JSON.stringify(state),before)
 const snapshot=JSON.stringify(next.assignments);act(next,'restart');assert.equal(JSON.stringify(next.assignments),snapshot)
})
