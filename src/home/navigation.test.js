import test from 'node:test'
import assert from 'node:assert/strict'
import {revealSection,returnToTop} from './navigation.js'

function browser(reduced=false){
 const calls=[],location={}
 Object.defineProperty(location,'hash',{get:()=>'#/',set(){throw Error('In-page navigation must never change the router hash')}})
 return {calls,window:{location,matchMedia:()=>({matches:reduced}),scrollTo:options=>calls.push(['top',options])},node:{focus:options=>calls.push(['focus',options]),scrollIntoView:options=>calls.push(['section',options])}}
}
test('Explore and skip navigation focus their target and scroll without writing the router hash',()=>{
 const before=globalThis.window,b=browser();globalThis.window=b.window
 try{revealSection(b.node);assert.deepEqual(b.calls,[['focus',{preventScroll:true}],['section',{block:'start',behavior:'smooth'}]]);assert.equal(b.window.location.hash,'#/')}finally{globalThis.window=before}
})
test('reduced motion replaces smooth scrolling with immediate navigation and preserves focus',()=>{
 const before=globalThis.window,b=browser(true);globalThis.window=b.window
 try{revealSection(b.node);returnToTop(b.node);assert.equal(b.calls[1][1].behavior,'instant');assert.deepEqual(b.calls[3],['top',{top:0,behavior:'instant'}]);assert.equal(b.window.location.hash,'#/')}finally{globalThis.window=before}
})
test('Top is a real scroll action and an absent optional section fails safely',()=>{
 const before=globalThis.window,b=browser();globalThis.window=b.window
 try{revealSection(null);assert.deepEqual(b.calls,[]);returnToTop(b.node);assert.deepEqual(b.calls,[['focus',{preventScroll:true}],['top',{top:0,behavior:'smooth'}]])}finally{globalThis.window=before}
})
