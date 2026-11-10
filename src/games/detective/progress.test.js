import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanProgress, loadProgress, persistProgress, rememberResult, STORAGE_KEY } from './progress.js'
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)}}
test('completed case, stars, best record, unlocked next case and sound survive reload',()=>{
 const target=storage(),initial=cleanProgress({sound:true})
 const saved=rememberResult(initial,1,{stars:2,hints:2,mistakes:4})
 assert.equal(persistProgress(target,saved),true)
 assert.deepEqual(loadProgress(target),saved);assert.equal(saved.unlocked,2);assert.equal(saved.completed[1].score,700)
 assert.equal(saved.sound,true);assert.equal(JSON.parse(target.getItem(STORAGE_KEY)).completed[1].stars,2)
})
test('better results replace a record; replays cannot downgrade stars, hints or mistakes',()=>{
 let progress=rememberResult(cleanProgress(),1,{stars:3,hints:0,mistakes:2})
 progress=rememberResult(progress,1,{stars:1,hints:8,mistakes:0})
 assert.equal(progress.completed[1].stars,3)
 progress=rememberResult(progress,1,{stars:3,hints:0,mistakes:1});assert.equal(progress.completed[1].mistakes,1)
})
test('blocked, full, malformed or missing storage permits play without throwing',()=>{
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('full')}}
 assert.deepEqual(loadProgress(blocked),cleanProgress());assert.equal(persistProgress(blocked,cleanProgress()),false)
 assert.deepEqual(loadProgress(null),cleanProgress())
 assert.deepEqual(loadProgress({getItem:()=>'{invalid'}),cleanProgress())
})
test('corrupt records and fabricated completions for pending cases cannot unlock or award stars',()=>{
 const corrupt=cleanProgress({unlocked:15,completed:{1:{stars:7,hints:-1,mistakes:0},2:{stars:3,hints:0,mistakes:0}},sound:'yes'})
 assert.equal(corrupt.unlocked,1);assert.deepEqual(corrupt.completed,{});assert.equal(corrupt.sound,false)
 assert.equal(rememberResult(cleanProgress(),14,{stars:3,hints:0,mistakes:0}).unlocked,1)
})
