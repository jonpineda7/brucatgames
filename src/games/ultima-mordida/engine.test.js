import test from 'node:test'
import assert from 'node:assert/strict'
import { CHARACTERS, VILLAIN_ID } from './data.js'
import { gameReducer as reduce, newGame, PHASES, heartsLeft, activeParticipants, guestAvailable, dishAvailable, readyToEat, validRoundAssignments, starsFor, resolveDelivery } from './engine.js'
const start=(roll=0,id=1)=>reduce(newGame({inheritedUnlocked:20}),{type:'start',id,roll})
const act=(state,type,data={})=>reduce(state,{type,...data})
const assign=(state,dish,guest)=>act(state,'assign',{dish,guest})
const animationAction=(state,type)=>({type,id:state.resolution.id,token:state.resolution.token})
const finish=state=>reduce(reduce(state,animationAction(state,'finish-eating')),animationAction(state,'finish-reveal'))
function distribute(state,poisonGuest){
 const guests=activeParticipants(state).map(character=>character.id)
 const foods=state.round.dishes.filter(dish=>dish!==state.round.poisonedDish)
 state=assign(state,state.round.poisonedDish,poisonGuest)
 for(const guest of guests.filter(guest=>guest!==poisonGuest))state=assign(state,foods.shift(),guest)
 return state
}
const round=(state,poisonGuest)=>finish(act(distribute(state,poisonGuest),'eat'))
const innocents=CHARACTERS.filter(character=>character.innocent).map(character=>character.id)

test('first round has five active participants, four opportunities and exactly one poison',()=>{
 const state=start()
 assert.equal(heartsLeft(state),4);assert.equal(activeParticipants(state).length,5)
 assert.equal(state.characters[VILLAIN_ID],'active');assert.equal(state.round.dishes.length,5)
 assert.equal(state.round.dishes.filter(id=>id===state.round.poisonedDish).length,1)
 assert.deepEqual(state.round.assignments,{});assert.equal(readyToEat(state),false)
})
test('assigning, changing, removing and swapping dishes never evaluates food or changes opportunities, stats or records',()=>{
 const initial=start(),snapshot=JSON.stringify(initial)
 let state=assign(initial,initial.round.poisonedDish,'gata')
 state=assign(state,'burger','brucat');state=assign(state,'burger','gata')
 assert.equal(state.round.assignments.brucat,'pizza');assert.equal(state.round.assignments.gata,'burger')
 state=act(state,'remove-assignment',{guest:'gata'});state=assign(state,'cake','brucat')
 assert.equal(state.phase,PHASES.SELECTING);assert.equal(state.resolution,null);assert.equal(state.result,null)
 assert.deepEqual(state.characters,initial.characters);assert.deepEqual(state.stats,initial.stats)
 assert.deepEqual(state.progress,initial.progress);assert.equal(state.round.hintRevealed,false)
 assert.equal(state.history.length,0);assert.equal(heartsLeft(state),4)
 assert.equal(JSON.stringify(initial),snapshot)
})
test('a used dish moves to an empty recipient or swaps with an assigned one, never duplicating plates',()=>{
 let state=start();state=assign(state,'pizza','brucat');state=assign(state,'pizza','gata')
 assert.deepEqual(state.round.assignments,{gata:'pizza'})
 state=assign(state,'sushi','bruno');state=assign(state,'pizza','bruno')
 assert.deepEqual(state.round.assignments,{gata:'sushi',bruno:'pizza'})
 assert.equal(validRoundAssignments(state),true)
 state=assign(state,'tacos','bruno');assert.equal(Object.values(state.round.assignments).includes('pizza'),false)
 assert.equal(assign(state,'unknown','bruno'),state);assert.equal(assign(state,'pizza','unknown'),state)
})
test('keyboard selection and direct assignment share the same editable distribution',()=>{
 let state=start();state=act(state,'select',{dish:'pizza'});state=act(state,'guest',{guest:'brucat'})
 assert.equal(state.round.assignments.brucat,'pizza');assert.equal(state.selectedDish,null)
 state=act(state,'select',{dish:'burger'});state=act(state,'clear-selection')
 assert.equal(state.selectedDish,null);assert.equal(state.phase,PHASES.SELECTING)
})
test('eating requires a complete, unique assignment to every active participant',()=>{
 let state=start();assert.equal(act(state,'eat'),state)
 for(const [index,guest] of activeParticipants(state).entries()){
  if(index<4){state=assign(state,state.round.dishes[index],guest.id);assert.equal(readyToEat(state),false);assert.equal(act(state,'eat'),state)}
 }
 state=assign(state,state.round.dishes[4],VILLAIN_ID);assert.equal(readyToEat(state),true)
 const corrupt={...state,round:{...state.round,assignments:{...state.round.assignments,gata:state.round.assignments.brucat}}}
 assert.equal(readyToEat(corrupt),false);assert.equal(act(corrupt,'eat'),corrupt)
 const extra={...state,round:{...state.round,assignments:{...state.round.assignments,unknown:'pizza'}}}
 assert.equal(readyToEat(extra),false)
})
test('one click snapshots all assignments and commits every safe meal and exactly one elimination together',()=>{
 const draft=distribute(start(),'gata'),snapshot=JSON.stringify(draft.round.assignments)
 let state=act(draft,'eat')
 assert.equal(state.phase,PHASES.EATING);assert.equal(state.characters.gata,'poisoned');assert.equal(heartsLeft(state),3)
 assert.equal(state.resolution.beforeCharacters.gata,'active');assert.equal(state.resolution.participants.length,5)
 assert.equal(JSON.stringify(state.resolution.assignments),snapshot);assert.ok(Object.isFrozen(state.resolution.assignments))
 assert.equal(Object.values(state.resolution.outcomes).filter(value=>value==='safe').length,4)
 assert.deepEqual(state.stats,{safeServed:4,poisonedServed:1,hintsUsed:0})
 assert.equal(state.history.length,1);assert.equal(state.resolution.after,PHASES.ROUND_END)
 state=finish(state);assert.equal(state.phase,PHASES.ROUND_END)
})
test('double clicks, edits during eating/reveal and repeated presentation callbacks cannot resolve a round twice',()=>{
 let state=act(distribute(start(),'gata'),'eat'),snapshot=JSON.stringify(state.stats)
 for(const type of ['eat','assign','guest','select','remove-assignment','hint','next-round'])assert.equal(act(state,type,{dish:'pizza',guest:'bruno',roll:0}),state)
 state=reduce(state,animationAction(state,'finish-eating'))
 for(const type of ['eat','assign','guest','select','remove-assignment','hint','next-round','finish-eating'])assert.equal(act(state,type,{dish:'pizza',guest:'bruno',roll:0}),state)
 state=reduce(state,animationAction(state,'finish-reveal'))
 assert.equal(reduce(state,animationAction(state,'finish-reveal')),state)
 assert.equal(JSON.stringify(state.stats),snapshot);assert.equal(state.history.length,1)
})
test('next round retains eliminations and opportunities, clears drafts and offers exactly as many dishes as active participants',()=>{
 let state=round(start(),'gata'),previousToken=state.round.token
 state=act(state,'next-round',{roll:.65,shuffleRolls:[.8,.7,.6,.5]})
 assert.equal(state.phase,PHASES.SELECTING);assert.equal(state.round.number,2);assert.notEqual(state.round.token,previousToken)
 assert.equal(heartsLeft(state),3);assert.equal(state.characters.gata,'poisoned');assert.equal(guestAvailable(state,'gata'),false)
 assert.equal(state.round.dishes.length,4);assert.deepEqual(state.round.assignments,{});assert.equal(state.resolution,null)
 assert.equal(assign(state,state.round.dishes[0],'gata'),state)
 assert.equal(dishAvailable(state,state.round.dishes[0]),true);assert.equal(guestAvailable(state,'brucat'),true)
 assert.equal(state.stats.safeServed,4);assert.equal(state.stats.poisonedServed,1)
})
test('a corrupted draft cannot feed a character eliminated in an earlier round',()=>{
 let state=act(round(start(),'gata'),'next-round',{roll:0})
 state=distribute(state,'bruno')
 const corrupt={...state,round:{...state.round,assignments:{...state.round.assignments,gata:state.round.dishes[0]}}}
 assert.equal(validRoundAssignments(corrupt),false);assert.equal(act(corrupt,'eat'),corrupt)
})
test('poisoning the crocodile produces victory, processes all safe dishes and saves records once',()=>{
 let state=act(distribute(start(),VILLAIN_ID),'eat')
 assert.equal(state.result.won,true);assert.equal(state.characters[VILLAIN_ID],'defeated');assert.equal(state.result.survivors,4)
 assert.equal(state.result.safeServed,4);assert.equal(state.progress.completed[1].stars,3)
 const saved=JSON.stringify(state.progress);state=finish(state)
 assert.equal(state.phase,PHASES.VICTORY);assert.equal(act(state,'eat'),state)
 assert.equal(act(state,'next-round'),state);assert.equal(JSON.stringify(state.progress),saved)
})
test('four jointly resolved rounds remove exactly four innocents and end with Game Over',()=>{
 let state=start()
 for(let index=0;index<4;index++){
  assert.equal(state.round.dishes.length,5-index)
  state=round(state,innocents[index]);assert.equal(heartsLeft(state),3-index)
  if(index<3){assert.equal(state.phase,PHASES.ROUND_END);state=act(state,'next-round',{roll:.3})}
 }
 assert.equal(state.phase,PHASES.GAME_OVER);assert.equal(state.result.stars,0);assert.equal(state.stats.poisonedServed,4)
 assert.equal(state.stats.safeServed,10);assert.equal(state.result.rounds,4)
 assert.equal(state.characters[VILLAIN_ID],'active');assert.equal(act(state,'next-round'),state)
})
test('restart during animation restores all five characters, four hearts and empty round-one state',()=>{
 const old=act(distribute(start(),'gata'),'eat'),oldCallback=animationAction(old,'finish-eating')
 let state=act(old,'restart',{roll:.8})
 assert.equal(heartsLeft(state),4);assert.equal(activeParticipants(state).length,5);assert.equal(state.round.number,1)
 assert.equal(state.round.dishes.length,5);assert.deepEqual(state.round.assignments,{})
 assert.deepEqual(state.stats,{safeServed:0,poisonedServed:0,hintsUsed:0});assert.equal(state.resolution,null);assert.equal(state.history.length,0)
 assert.equal(reduce(state,oldCallback),state)
 state=act(distribute(state,'bruno'),'eat');assert.equal(reduce(state,oldCallback),state)
})
test('stale callbacks cannot affect a changed level, a new reveal, or a return to the level screen',()=>{
 let state=act(distribute(start(),'gata'),'eat')
 const eating=animationAction(state,'finish-eating'),reveal=animationAction(state,'finish-reveal')
 state=act(state,'start',{id:2,roll:.4});state=act(distribute(state,VILLAIN_ID),'eat')
 assert.equal(reduce(state,eating),state);assert.equal(reduce(state,reveal),state)
 state=reduce(state,animationAction(state,'finish-eating'));assert.equal(reduce(state,reveal),state)
 assert.equal(act(state,'finish-reveal',{id:state.resolution.id,token:'wrong'}),state)
 state=act(state,'welcome');assert.equal(reduce(state,eating),state);assert.equal(reduce(state,reveal),state)
})
test('help blocks draft edits and confirmation; hint stats are accounted for only at round resolution',()=>{
 let state=distribute(start(),'gata');state=act(state,'help')
 assert.equal(act(state,'eat'),state);assert.equal(assign(state,'pizza','bruno'),state)
 state=act(state,'help');state=act(state,'hint')
 assert.equal(state.stats.hintsUsed,0);assert.equal(heartsLeft(state),4);assert.equal(state.round.hintRevealed,true)
 assert.equal(act(state,'hint'),state);state=act(state,'eat');assert.equal(state.stats.hintsUsed,1)
 assert.equal(act(state,'eat'),state);state=finish(state);assert.equal(state.stats.hintsUsed,1)
 state=act(state,'next-round',{roll:0});assert.equal(state.round.hintUsed,false);assert.equal(state.round.hintRevealed,false)
})
test('stars depend only on surviving innocents and losses earn no new record',()=>{
 assert.deepEqual([4,3,2,1,0].map(starsFor),[3,2,1,1,0])
 for(let lost=0;lost<4;lost++){
  let state=start()
  for(let index=0;index<lost;index++){state=round(state,innocents[index]);state=act(state,'next-round',{roll:.4})}
  state=round(state,VILLAIN_ID)
  assert.equal(state.result.stars,[3,2,1,1][lost]);assert.equal(state.result.survivors,4-lost)
 }
})
test('all twenty levels and all five poison choices can be won by resolving a complete distribution',()=>{
 for(let id=1;id<=20;id++)for(let index=0;index<5;index++){
  const state=round(start(index/5+.01,id),VILLAIN_ID)
  assert.equal(state.phase,PHASES.VICTORY);assert.equal(state.result.stars,3)
  assert.equal(state.result.poisonedServed,1);assert.equal(state.result.safeServed,4)
 }
})
test('only victory unlocks the next level; locked levels and stages stay protected',()=>{
 let state=newGame();assert.equal(act(state,'start',{id:20,roll:0}),state);assert.equal(act(state,'stage',{stage:3}),state)
 state=act(state,'start',{id:1,roll:0});state=round(state,'gata');assert.equal(state.progress.unlocked,1)
 state=act(state,'next-round',{roll:0});state=round(state,VILLAIN_ID);assert.equal(state.progress.unlocked,2)
})
test('pure outcome rules and reducers never mutate a previous draft or confirmed round',()=>{
 assert.equal(resolveDelivery('pizza','sushi',VILLAIN_ID),'safe');assert.equal(resolveDelivery('pizza','pizza','gata'),'innocent-poisoned')
 const state=distribute(start(),'gata'),snapshot=JSON.stringify(state)
 round(state,'gata');assert.equal(JSON.stringify(state),snapshot)
})
