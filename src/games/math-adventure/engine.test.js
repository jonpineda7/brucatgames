import test from 'node:test'
import assert from 'node:assert/strict'
import { reducer, initialGame, PHASES, snapshot, starsFor } from './engine.js'
import { CHALLENGES } from './data.js'
import { validProblem } from './math.js'
import { cleanSettings, runKey, statKey, loadGame, saveGame, cleanRun } from './progress.js'
import { adaptMastery } from './difficulty.js'
import { quantityDrop } from './interaction.js'
const act=(state,type,data={})=>reducer(state,{type,session:state.session,transition:state.transition,...data})
const start=settings=>act(act(initialGame(),'settings',{value:settings}),'start')
function finish(state){for(let index=0;index<10;index++){state=act(state,'explore',{roll:.123});assert.equal(validProblem(state.problem),true);state=act(state,'answer',{value:state.problem.answer});state=act(state,'arrived')}return state}
test('ten authored zones vary between platforms, doors, quantities, mechanisms and equal groups',()=>{
 assert.equal(CHALLENGES.length,10);assert.equal(new Set(CHALLENGES.map(stage=>stage.id)).size,10)
 assert.ok(new Set(CHALLENGES.map(stage=>stage.mechanic)).size>=6)
 assert.ok(CHALLENGES.every(stage=>stage.goal&&stage.reward&&stage.name))
})
test('all operation/difficulty/mode combinations finish ten real challenges and award one result',()=>{
 for(const mode of ['learn','adventure'])for(const difficulty of ['novato','audaz','guerrero'])for(const operation of ['add','subtract','multiply','divide','mixed']){
  let state=start({mode,difficulty,operation,enabled:['subtract','divide']})
  assert.equal(state.phase,PHASES.EXPLORE)
  for(let index=0;index<10;index++){
   state=act(state,'explore',{roll:index/11})
   assert.equal(state.settings.difficulty,difficulty);assert.equal(state.problem.difficulty,difficulty)
   assert.ok((operation==='mixed'?['subtract','divide']:[operation]).includes(state.problem.op))
   const key=statKey(state.problem.op,difficulty),correct=state.progress.stats[key]?.correct||0
   state=act(state,'answer',{value:state.problem.answer});assert.equal(state.phase,PHASES.MOVING)
   assert.equal(state.progress.stats[key].correct,correct+1)
   assert.equal(act(state,'answer',{value:state.problem.answer}),state)
   const callback={type:'arrived',session:state.session,transition:state.transition}
   state=reducer(state,callback);assert.equal(reducer(state,callback),state)
  }
  assert.equal(state.phase,PHASES.RESULT);assert.equal(state.completed.length,10);assert.equal(state.result.stars,3)
  assert.equal(state.progress.records[runKey(state.settings)].score,1300)
 }
})
test('an incorrect platform locks duplicate events, loses no zones or coins, and retries the same exercise',()=>{
 let state=act(start({operation:'add'}),'explore',{roll:.6}),problem=state.problem
 state=act(state,'answer',{value:problem.choices.find(value=>value!==problem.answer)})
 assert.equal(state.phase,PHASES.FEEDBACK);assert.equal(state.errors,1);assert.deepEqual(state.completed,[])
 assert.equal(act(state,'answer',{value:problem.answer}),state)
 state=act(state,'retry');assert.equal(state.problem,problem);assert.equal(state.phase,PHASES.CHALLENGE)
 state=act(state,'answer',{value:problem.answer});assert.equal(state.completed.length,1)
})
test('quantity drafts and hints do not resolve challenges, while malformed numeric submissions cannot mutate stats',()=>{
 let state=act(start({}),'explore',{roll:0})
 for(const value of ['-2','1e3','1.5','<script>','20000'])assert.equal(act(state,'draft',{value}),state)
 for(const value of [null,undefined,-1,Infinity,NaN,2001,'12'])assert.equal(act(state,'answer',{value}),state)
 state=act(state,'draft',{value:state.problem.answer});assert.equal(state.completed.length,0)
 state=act(state,'help');state=act(state,'help');assert.equal(state.helps,2);assert.equal(state.helpLevel,2)
 assert.equal(act(state,'help'),state)
 state=act(state,'answer');assert.equal(state.phase,PHASES.MOVING)
})
test('adaptive support stays inside the chosen difficulty and tracks concepts independently',()=>{
 let mastery={tier:0,streak:0,misses:0};for(let i=0;i<3;i++)mastery=adaptMastery(mastery,true)
 assert.equal(mastery.tier,1);mastery=adaptMastery(adaptMastery(mastery,false),false);assert.equal(mastery.tier,0)
 let state=act(start({difficulty:'guerrero',operation:'mixed',enabled:['add','divide']}),'explore',{roll:.3})
 state=act(state,'answer',{value:state.problem.answer+1});state=act(state,'retry');state=act(state,'answer',{value:state.problem.answer+1})
 assert.equal(state.settings.difficulty,'guerrero');assert.equal(state.progress.stats['add:guerrero'].errors,2);assert.equal(state.progress.stats['divide:guerrero'],undefined)
 assert.equal(state.helpLevel,1)
})
test('pausing freezes input; stale movement callbacks cannot change a restarted run or menu',()=>{
 let state=act(start({}),'explore',{roll:.1});state=act(state,'pause');assert.equal(state.phase,PHASES.PAUSED)
 assert.equal(act(state,'answer',{value:state.problem.answer}),state);state=act(state,'resume')
 state=act(state,'answer',{value:state.problem.answer});const callback={type:'arrived',session:state.session,transition:state.transition}
 state=act(state,'start');assert.equal(reducer(state,callback),state)
 state=act(state,'menu');assert.equal(reducer(state,callback),state)
})
test('stars reward learning without preventing advancement, and replays cannot downgrade a best record',()=>{
 assert.deepEqual([[0,0],[1,1],[2,0],[5,5],[6,0],[0,6]].map(([errors,helps])=>starsFor(errors,helps)),[3,3,2,2,1,1])
 let state=finish(start({operation:'divide'})),record=state.progress.records[runKey(state.settings)]
 state=act(state,'start');state={...state,errors:20,helps:10};state=finish(state)
 assert.equal(state.result.stars,1);assert.deepEqual(state.progress.records[runKey(state.settings)],record)
})
test('settings cannot enable unknown operations or an empty mixed set and cannot change during an expedition',()=>{
 assert.deepEqual(cleanSettings({operation:'mixed',enabled:['divide','divide','evil']}).enabled,['divide'])
 assert.deepEqual(cleanSettings({operation:'mixed',enabled:[]}).enabled,['add'])
 assert.equal(cleanSettings(null).difficulty,'novato')
 const state=start({operation:'divide'});assert.equal(act(state,'settings',{value:{operation:'add'}}),state)
})
test('partial routes round-trip, preserve the exact problem, and safe movement snapshots resume at the next zone',()=>{
 const values=new Map(),storage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)}
 let state=act(start({difficulty:'audaz',operation:'subtract'}),'explore',{roll:.55});state=act(state,'help')
 assert.equal(saveGame(storage,state.progress,snapshot(state)),true)
 let saved=loadGame(storage),restored=act(initialGame(saved.progress,saved.run),'resume-run')
 assert.deepEqual(restored.problem,state.problem);assert.equal(restored.helpLevel,1);assert.equal(restored.settings.operation,'subtract')
 state=act(state,'answer',{value:state.problem.answer});saveGame(storage,state.progress,snapshot(state));saved=loadGame(storage)
 assert.equal(saved.run.index,1);assert.equal(saved.run.phase,PHASES.EXPLORE);assert.equal(saved.run.completed.length,1)
 assert.equal(cleanRun({...snapshot(restored),problem:{...restored.problem,b:0}},restored.progress),null)
 assert.equal(saveGame(null,state.progress,snapshot(state)),false);assert.equal(loadGame(null).run,null)
})
test('pointer drag requires displacement and a real drop zone; tap and cancellation never submit an answer',()=>{
 assert.equal(quantityDrop(null,{x:30,y:30},true),false)
 assert.equal(quantityDrop({x:0,y:0},{x:4,y:2},true),false)
 assert.equal(quantityDrop({x:0,y:0},{x:30,y:30},false),false)
 assert.equal(quantityDrop({x:0,y:0},{x:30,y:30},true),true)
})
