import test from 'node:test'
import assert from 'node:assert/strict'
import { newGame, gameReducer as reduce, PHASES } from './engine.js'
import { cleanProgress, STORAGE_KEY, loadProgress, persistProgress } from './progress.js'
import { snapshotRun, loadRun, persistRun, SESSION_KEY, cleanRun } from './session.js'
const store=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}}
const start=()=>reduce(newGame(),{type:'start',id:1,roll:.7})
test('restoring a partial investigation preserves its exact layout, found objects, help counters and camera',()=>{
 const storage=store();let state=start();state=reduce(state,{type:'find',id:'coin'});state=reduce(state,{type:'hint',kind:'description'});state=reduce(state,{type:'zoom',zoom:2})
 assert.equal(persistRun(storage,state),true);assert.equal(persistProgress(storage,state.progress),true)
 const progress=loadProgress(storage),run=loadRun(storage,progress)
 const restored=reduce(newGame(progress,run),{type:'resume-run'})
 assert.equal(restored.phase,PHASES.SEARCHING);assert.equal(restored.placementId,state.placementId)
 assert.deepEqual(restored.objects,state.objects);assert.deepEqual(restored.found,state.found);assert.equal(restored.hints,1);assert.deepEqual(restored.camera,state.camera)
 assert.equal(restored.hint,null);assert.equal(restored.cooldown,0)
})
test('completed evidence restored from a searching snapshot repairs progression instead of getting stuck',()=>{
 const state=start(),snapshot={...snapshotRun(state),found:state.objects.map(object=>object.id)}
 const run=cleanRun(snapshot,state.progress);assert.equal(run.phase,PHASES.ALL_OBJECTS_FOUND)
 let restored=reduce(newGame(state.progress,run),{type:'resume-run'})
 restored=reduce(restored,{type:'finish-discovery',session:restored.session,transition:restored.transition})
 assert.equal(restored.phase,PHASES.SOLVING)
})
test('invalid IDs, duplicates, missing evidence, unknown layouts and unavailable cases cannot be restored',()=>{
 const state=start(),snapshot=snapshotRun(state)
 for(const change of [{placementId:'fake'},{found:['coin','coin']},{found:['fake']},{phase:'RESULT'},{phase:'SOLVING'},{levelId:2},{hints:-1}])assert.equal(cleanRun({...snapshot,...change},state.progress),null)
 assert.equal(loadRun({getItem:()=>'{broken'},state.progress),null)
 assert.equal(persistRun(null,state),false)
})
test('legacy v1 records keep their stars and sound; placement history only adds valid IDs',()=>{
 const storage=store();storage.setItem(STORAGE_KEY,JSON.stringify({sound:true,completed:{1:{stars:3,hints:0,mistakes:2}}}))
 const progress=loadProgress(storage);assert.equal(progress.completed[1].stars,3);assert.equal(progress.sound,true);assert.deepEqual(progress.lastPlacements,{})
 const played=reduce(newGame(progress),{type:'start',id:1,roll:0});persistProgress(storage,played.progress)
 const again=reduce(newGame(loadProgress(storage)),{type:'start',id:1,roll:0})
 assert.notEqual(again.placementId,played.placementId);assert.equal(again.progress.completed[1].stars,3)
 assert.deepEqual(cleanProgress({lastPlacements:{1:'fake'}}).lastPlacements,{})
})
test('selector preserves resumable investigation; solved results remove the temporary run',()=>{
 const storage=store();let state=start();state=reduce(state,{type:'find',id:'key'});state=reduce(state,{type:'welcome'})
 persistRun(storage,state);assert.deepEqual(loadRun(storage,state.progress).found,['key'])
 state=reduce(state,{type:'resume-run'});for(const object of state.objects)state=reduce(state,{type:'find',id:object.id})
 state=reduce(state,{type:'finish-discovery',session:state.session,transition:state.transition})
 state=reduce(state,{type:'answer',id:state.puzzle.answer});persistRun(storage,state)
 assert.equal(storage.getItem(SESSION_KEY),null)
})
