import test from 'node:test'
import assert from 'node:assert/strict'
import { STORAGE_KEY, cleanProgress, loadProgress, persistProgress, rememberResult } from './progress.js'
const result={stars:3,hints:0,restarts:0,moves:2}
test('progress unlocks sequentially, stores completions and never downgrades a best result',()=>{
  let progress=cleanProgress(null);assert.equal(progress.unlocked,1)
  progress=rememberResult(progress,1,result);assert.equal(progress.unlocked,2)
  progress=rememberResult(progress,1,{...result,stars:1,hints:3});assert.deepEqual(progress.completed[1],result)
  progress=rememberResult(progress,2,{...result,stars:2,hints:1});assert.equal(progress.unlocked,3)
  assert.equal(cleanProgress({unlocked:30,completed:{30:result}}).unlocked,1)
})
test('saving round-trips sound preference and best results; malformed or blocked storage degrades gracefully',()=>{
  let value=null;const storage={getItem:()=>value,setItem:(key,next)=>{assert.equal(key,STORAGE_KEY);value=next}}
  const progress={...rememberResult(cleanProgress(null),1,result),sound:true}
  assert.equal(persistProgress(storage,progress),true);assert.deepEqual(loadProgress(storage),progress)
  value='broken';assert.deepEqual(loadProgress(storage),cleanProgress(null))
  const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('quota')}}
  assert.deepEqual(loadProgress(blocked),cleanProgress(null));assert.equal(persistProgress(blocked,progress),false)
  assert.equal(persistProgress(null,progress),false);assert.deepEqual(loadProgress(null),cleanProgress(null))
})
test('corrupt stars and counters are sanitized; unlocked cannot exceed the collection',()=>{
  const progress=cleanProgress({completed:{1:{stars:8},2:{stars:2,hints:-1,restarts:'x'},99:result},sound:'true'})
  assert.equal(progress.completed[1],undefined);assert.deepEqual(progress.completed[2],{stars:2,hints:0,restarts:0,moves:0});assert.equal(progress.completed[99],undefined);assert.equal(progress.sound,false)
})
