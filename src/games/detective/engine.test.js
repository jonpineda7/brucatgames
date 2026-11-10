import test from 'node:test'
import assert from 'node:assert/strict'
import { gameReducer as reduce, newGame, PHASES, starsFor, activeCase, allObjectsFound } from './engine.js'
import { CASES, nextImplementedCase, isCaseUnlocked } from './levels.js'
import { objectAnchor, cameraBox } from './geometry.js'
const act=(state,type,data={})=>reduce(state,{type,session:state.session,transition:state.transition,...data})
const start=(roll=0)=>act(newGame(),'start',{id:1,roll})
const findAll=state=>state.objects.reduce((current,object)=>act(current,'point',{point:objectAnchor(object)}),state)
const solving=state=>act(findAll(state),'finish-discovery')
const win=state=>act(solving(state),'answer',{id:state.puzzle.answer})
const tick=(state,amount)=>{while(amount>0){const delta=Math.min(amount,1000);state=act(state,'tick',{delta});amount-=delta}return state}

test('the selector offers fifteen real cases and protects sequentially locked cases',()=>{
 const initial=newGame();assert.equal(initial.phase,PHASES.INTRO);assert.equal(start().phase,PHASES.SEARCHING)
 assert.equal(CASES.filter(level=>level.status==='ready').length,15)
 for(const id of [-1,0,2,15,16,NaN,'1'])assert.equal(act(initial,'start',{id}),initial)
})
test('clicks use the active visible placement; misses preserve collected objects and duplicates are ignored',()=>{
 let state=start(.8);state=act(state,'point',{point:objectAnchor(state.objects[0])})
 assert.deepEqual(state.found,['key']);assert.equal(act(state,'find',{id:'key'}),state)
 state=act(state,'point',{point:{x:.02,y:.02}});assert.deepEqual(state.found,['key']);assert.equal(state.mistakes,1)
 assert.equal(act(state,'find',{id:'invisible-object'}),state)
})
test('the last actual object enters discovery once, locks search and advances automatically with a guarded event',()=>{
 let state=start();for(const object of state.objects.slice(0,-1))state=act(state,'find',{id:object.id})
 assert.equal(state.phase,PHASES.SEARCHING);assert.equal(allObjectsFound(state),false)
 state=act(state,'find',{id:state.objects.at(-1).id});assert.equal(state.phase,PHASES.ALL_OBJECTS_FOUND)
 assert.equal(allObjectsFound(state),true);assert.equal(state.found.length,5)
 for(const action of [{type:'find',id:'coin'},{type:'point',point:{x:.5,y:.5}},{type:'hint',kind:'visual'},{type:'answer',id:state.puzzle.answer}])assert.equal(reduce(state,action),state)
 const callback={type:'finish-discovery',session:state.session,transition:state.transition}
 assert.equal(reduce(state,{...callback,transition:state.transition-1}),state)
 state=reduce(state,callback);assert.equal(state.phase,PHASES.SOLVING);assert.equal(reduce(state,callback),state)
})
test('completion checks the exact required ID set, rejecting a false counter or duplicate IDs',()=>{
 const state=start(),ids=state.objects.map(object=>object.id)
 for(const found of [[...ids.slice(0,-1),'fake'],['key','key','glass','coin','crown'],[]])assert.equal(allObjectsFound({...state,found}),false)
 assert.equal(allObjectsFound({...state,found:ids}),true)
 const corrupt={...state,phase:PHASES.ALL_OBJECTS_FOUND,found:['key','key','glass','coin','crown']}
 assert.equal(act(corrupt,'finish-discovery'),corrupt)
})
test('a wrong deduction is recoverable without restarting search; the answer follows the current crown placement',()=>{
 for(const roll of [0,.3,.6,.9]){
  let state=solving(start(roll));const found=state.found
  assert.equal(state.puzzle.answer,state.objects.find(object=>object.id==='crown').zoneId)
  const wrong=state.puzzle.options.find(option=>option.id!==state.puzzle.answer).id
  assert.equal(act(state,'answer',{id:'unknown'}),state)
  state=act(state,'answer',{id:wrong});assert.equal(state.phase,PHASES.CASE_FAILED)
  assert.deepEqual(state.found,found);assert.equal(state.mistakes,1);assert.equal(Object.keys(state.progress.completed).length,0)
  assert.equal(act(state,'answer',{id:state.puzzle.answer}),state)
  state=act(state,'retry-puzzle');assert.equal(state.phase,PHASES.SOLVING)
  state=act(state,'answer',{id:state.puzzle.answer});assert.equal(state.phase,PHASES.CASE_SOLVED)
 }
})
test('victory commits once, then result presentation cannot re-award stars or complete the case again',()=>{
 let state=win(start());assert.equal(state.phase,PHASES.CASE_SOLVED);assert.equal(state.result.stars,3)
 assert.equal(state.progress.unlocked,2);const record=state.progress.completed[1]
 assert.equal(act(state,'answer',{id:state.puzzle.answer}),state)
 const callback={type:'show-result',session:state.session,transition:state.transition}
 state=reduce(state,callback);assert.equal(state.phase,PHASES.RESULT)
 assert.equal(reduce(state,callback),state);assert.equal(act(state,'find',{id:'key'}),state)
 assert.equal(state.progress.completed[1],record)
})
test('next navigation unlocks actual successors in order and skips unavailable catalog entries',()=>{
 const state=act(win(start()),'show-result')
 assert.equal(nextImplementedCase(1).id,2);assert.equal(act(state,'next-case').phase,PHASES.NEXT_CASE);assert.equal(act(state,'start',{id:3}),state);assert.equal(nextImplementedCase(15),null)
 const catalog=[{id:1,status:'ready'},{id:2,status:'pending'},{id:3,status:'ready'},{id:4,status:'ready'}]
 assert.equal(nextImplementedCase(1,catalog).id,3)
 assert.equal(isCaseUnlocked({completed:{1:{stars:3}}},3,catalog),true)
 assert.equal(isCaseUnlocked({completed:{1:{stars:3}}},4,catalog),false)
 assert.equal(isCaseUnlocked({completed:{1:{stars:3}}},2,catalog),false)
})
test('the real second case follows RESULT → NEXT_CASE → SEARCHING only once',()=>{
 let state=act(win(start()),'show-result')
 state=act(state,'next-case');assert.equal(state.phase,PHASES.NEXT_CASE);assert.equal(state.nextCaseId,2)
 const callback={type:'begin-next-case',session:state.session,transition:state.transition,roll:.9}
 assert.equal(reduce(state,{...callback,transition:state.transition-1}),state)
 state=reduce(state,callback);assert.equal(state.phase,PHASES.SEARCHING);assert.equal(state.levelId,2)
 assert.equal(state.found.length,0);assert.equal(state.objects.length,5);assert.equal(state.progress.completed[1].stars,3)
 assert.equal(reduce(state,callback),state)
})
test('new investigations and every restart exclude the previous layout, reset temporaries and retain records',()=>{
 let state=act(win(start()),'show-result'),record=state.progress.completed[1]
 for(const roll of [0,0,.9,.2,.7]){
  const old=state.placementId,token=state.session
  state=act(state,'restart',{roll})
  assert.notEqual(state.placementId,old);assert.equal(state.session,token+1)
  assert.deepEqual(state.found,[]);assert.equal(state.hints,0);assert.equal(state.mistakes,0);assert.equal(state.hint,null);assert.equal(state.overlay,null)
  assert.equal(state.progress.completed[1].stars,record.stars);assert.deepEqual(state.camera,{zoom:1,cx:.5,cy:.5})
 }
})
test('positions remain stable through hints, pause, camera changes and repeated progress ticks',()=>{
 let state=start(.4);const positions=JSON.stringify(state.objects),id=state.placementId
 for(const action of [{type:'zoom',zoom:3},{type:'pan',dx:10,dy:20,rect:{width:375,height:375}},{type:'hint',kind:'visual'},{type:'tick',delta:1000},{type:'pause'},{type:'resume'},{type:'center'}]){
  state=reduce(state,action);assert.equal(JSON.stringify(state.objects),positions);assert.equal(state.placementId,id)
 }
})
test('all three hints use existing pending targets and descriptions from each active distribution',()=>{
 for(const roll of [0,.3,.6,.9])for(const kind of ['visual','description','magic']){
  let state=act(start(roll),'find',{id:'key'});const target=state.objects[1]
  state=act(state,'hint',{kind});assert.equal(state.hint.target,'glass');assert.equal(state.hints,1)
  if(kind==='description')assert.equal(state.message,target.location)
  else {const anchor=objectAnchor(target),box=cameraBox(state.camera);assert.ok(anchor.x>=box.x&&anchor.x<=box.x+box.size&&anchor.y>=box.y&&anchor.y<=box.y+box.size)}
  assert.equal(act(state,'hint',{kind}),state)
  state=tick(state,5000);assert.equal(state.hint,null);assert.equal(state.cooldown,1000)
  state=tick(state,1000);state=act(state,'hint',{kind});assert.equal(state.hints,2)
 }
})
test('finding a hinted object ends that hint and magic restores the exact previous camera',()=>{
 for(const ending of ['expire','close','find']){
  let state=act(start(),'zoom',{zoom:2});state=act(state,'pan',{dx:-60,dy:35,rect:{width:375,height:375}})
  const prior=state.camera;state=act(state,'hint',{kind:'magic'})
  assert.equal(state.camera.zoom,2.7);assert.equal(act(state,'zoom',{zoom:1}),state)
  state=ending==='expire'?tick(state,5000):ending==='close'?act(state,'end-hint'):act(state,'find',{id:'key'})
  assert.deepEqual(state.camera,prior);assert.equal(state.hint,null)
 }
})
test('pausing freezes hint time and input; one modal owner prevents help/restart from hiding the deduction',()=>{
 let state=act(start(),'hint',{kind:'magic'});state=tick(state,500);state=act(state,'open-help')
 assert.equal(state.phase,PHASES.PAUSED);assert.equal(state.overlay.type,'help')
 assert.equal(act(state,'find',{id:'key'}),state);assert.equal(act(state,'tick',{delta:1000}),state)
 state=act(state,'close-overlay');assert.equal(state.phase,PHASES.SEARCHING);assert.equal(state.hint.remaining,4500)
 state=solving(state);state=act(state,'open-restart');assert.equal(state.overlay.type,'restart')
 state=act(state,'close-overlay');assert.equal(state.phase,PHASES.SOLVING);assert.equal(state.overlay,null)
})
test('pending transition and input callbacks cannot change a restarted investigation or selector',()=>{
 let state=findAll(start()),callback={type:'finish-discovery',session:state.session,transition:state.transition}
 state=act(state,'restart',{roll:.8});assert.equal(reduce(state,callback),state)
 state=findAll(state);assert.equal(reduce(state,callback),state)
 state=act(state,'welcome');assert.equal(state.phase,PHASES.INTRO);assert.equal(reduce(state,callback),state)
})
test('stars and best records remain compatible: hints affect stars, errors and zoom do not',()=>{
 assert.deepEqual([0,1,2,3,8].map(starsFor),[3,2,2,1,1])
 for(let count=0;count<4;count++){
  let state=act(start(),'zoom',{zoom:3});state=act(state,'point',{point:{x:.01,y:.01}})
  for(let i=0;i<count;i++){state=act(state,'hint',{kind:'description'});state=tick(state,6000)}
  state=win(state);assert.equal(state.result.stars,[3,2,2,1][count])
 }
})
test('reducer never mutates previous states and refuses invalid clock values',()=>{
 const state=start(),snapshot=JSON.stringify(state);findAll(state);act(state,'hint',{kind:'magic'})
 assert.equal(JSON.stringify(state),snapshot);assert.ok(Object.isFrozen(state.objects));assert.ok(state.objects.every(Object.isFrozen))
 for(const delta of [0,-1,Infinity,NaN,1001])assert.equal(act(state,'tick',{delta}),state)
 assert.equal(act(state,'zoom',{zoom:NaN}),state);assert.equal(activeCase(state).objects,state.objects)
})
