import test from 'node:test'
import assert from 'node:assert/strict'
import { scheduleTransition, AUTO_TRANSITIONS } from './transitions.js'
test('automatic discovery, victory and next-case callbacks fire once and cleanup cancels pending work',()=>{
 assert.equal(AUTO_TRANSITIONS.ALL_OBJECTS_FOUND.type,'finish-discovery');assert.equal(AUTO_TRANSITIONS.CASE_SOLVED.type,'show-result');assert.equal(AUTO_TRANSITIONS.NEXT_CASE.type,'begin-next-case')
 let callback,completed=0,cancelled=0
 const setup=()=>scheduleTransition({schedule:fn=>{callback=fn;return 7},cancel:id=>{assert.equal(id,7);cancelled++},finish:()=>completed++,delay:120})
 let cleanup=setup();callback();callback();assert.equal(completed,1);cleanup()
 cleanup=setup();cleanup();callback();assert.equal(completed,1);assert.equal(cancelled,2)
})
