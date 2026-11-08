import test from 'node:test'
import assert from 'node:assert/strict'
import {startReveal} from './reveal.js'
test('the reveal completes once; cleanup prevents delayed results after leaving or restarting',()=>{
 let callback,cancelled=null,count=0
 const schedule=(fn,delay)=>{assert.equal(delay,1400);callback=fn;return 7}
 let stop=startReveal({schedule,cancel:id=>{cancelled=id},onFinish:()=>count++})
 callback();callback();assert.equal(count,1);stop();assert.equal(cancelled,7)
 stop=startReveal({schedule,cancel:id=>{cancelled=id},onFinish:()=>count++});stop();callback();assert.equal(count,1)
})
