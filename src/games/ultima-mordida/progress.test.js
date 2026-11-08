import test from 'node:test'
import assert from 'node:assert/strict'
import {STORAGE_KEY,cleanProgress,readProgress,saveProgress,rememberResult} from './progress.js'
test('records, score and sound round-trip independently of the other games',()=>{
 let raw=null;const storage={getItem:()=>raw,setItem:(key,value)=>{assert.equal(key,STORAGE_KEY);raw=value}}
 let progress=rememberResult(cleanProgress(null),1,{stars:3,score:1000});progress={...progress,sound:true}
 assert.equal(saveProgress(storage,progress),true);assert.deepEqual(readProgress(storage),progress);assert.equal(progress.unlocked,2)
 progress=rememberResult(progress,1,{stars:1,score:600});assert.deepEqual(progress.completed[1],{stars:3,score:1000})
 progress=rememberResult(progress,1,{stars:3,score:1025});assert.equal(progress.completed[1].score,1025)
})
test('corrupt or denied storage does not crash; unlocks derive only from consecutive wins',()=>{
 const storage={getItem(){throw Error('denied')},setItem(){throw Error('quota')}}
 assert.deepEqual(readProgress(storage),cleanProgress(null));assert.equal(saveProgress(storage,cleanProgress(null)),false)
 assert.deepEqual(readProgress({getItem:()=>'{oops'}),cleanProgress(null));assert.equal(saveProgress(null,cleanProgress(null)),false)
 const progress=cleanProgress({unlocked:99,completed:{1:{stars:0,score:900},20:{stars:3,score:1000},3:{stars:3,score:-1}},sound:'true'})
 assert.equal(progress.unlocked,1);assert.equal(progress.completed[1],undefined);assert.equal(progress.completed[3],undefined);assert.equal(progress.sound,false)
})
