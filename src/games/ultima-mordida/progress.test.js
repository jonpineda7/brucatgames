import test from 'node:test'
import assert from 'node:assert/strict'
import {STORAGE_KEY,LEGACY_KEY,cleanProgress,readProgress,saveProgress,rememberResult} from './progress.js'
const win={won:true,stars:3,score:1600,rounds:1,survivors:4,safeServed:0,poisonedServed:1}
test('new records round-trip, unlock levels and cannot be downgraded by a loss or worse win',()=>{
 const values=new Map(),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)}
 let progress=rememberResult(cleanProgress(null),1,win);progress={...progress,sound:true}
 assert.equal(saveProgress(storage,progress),true);assert.deepEqual(readProgress(storage),progress);assert.equal(progress.unlocked,2)
 assert.equal(rememberResult(progress,1,{...win,won:false,stars:0}),progress)
 progress=rememberResult(progress,1,{...win,stars:1,score:900,survivors:2});assert.equal(progress.completed[1].stars,3)
 assert.ok(values.has(STORAGE_KEY))
})
test('V1 migration retains unlocked access and sound without comparing incompatible old records',()=>{
 const legacy={completed:{1:{stars:3,score:1000},2:{stars:2,score:950}},sound:true}
 const storage={getItem:key=>key===LEGACY_KEY?JSON.stringify(legacy):null}
 const progress=readProgress(storage);assert.equal(progress.unlocked,3);assert.equal(progress.inheritedUnlocked,3);assert.equal(progress.sound,true);assert.deepEqual(progress.completed,{})
})
test('unavailable, corrupt or full storage allows play and validates incoming data',()=>{
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('quota')}}
 assert.deepEqual(readProgress(blocked),cleanProgress(null));assert.equal(saveProgress(blocked,cleanProgress(null)),false)
 assert.deepEqual(readProgress({getItem:()=>'{bad'}),cleanProgress(null));assert.equal(saveProgress(null,cleanProgress(null)),false)
 assert.equal(cleanProgress({completed:{1:{...win,stars:7}},inheritedUnlocked:90}).unlocked,1)
})
