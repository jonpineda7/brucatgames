import test from 'node:test'
import assert from 'node:assert/strict'
import { buildLearningModel, subtractionPlaces, placeDigits } from './learningModel.js'
import { generateProblem } from './math.js'
const problem=(op,a,b,answer,c=null)=>({op,a,b,c,answer,expression:`${a} ? ${b}`,steps:[]})
test('small supports preserve exact quantities for each selected operation',()=>{
 const add=buildLearningModel(problem('add',3,4,7));assert.equal(add.mode,'join');assert.deepEqual(add.counts,[3,4]);assert.equal(add.totalDots,7)
 const sub=buildLearningModel(problem('subtract',9,5,4));assert.equal(sub.mode,'remove');assert.equal(sub.totalDots,9);assert.equal(sub.remaining,4)
 const mul=buildLearningModel(problem('multiply',2,3,6));assert.equal(mul.mode,'groups');assert.equal(mul.groups,2);assert.equal(mul.each,3);assert.equal(mul.groups*mul.each,6)
 const div=buildLearningModel(problem('divide',8,2,4));assert.equal(div.mode,'share');assert.equal(div.groups,2);assert.equal(div.each,4);assert.equal(div.groups*div.each,8)
})
test('larger operands use bounded place/product/portion models rather than thousands of objects',()=>{
 const add=buildLearningModel(problem('add',145,278,423));assert.equal(add.mode,'places');assert.equal(add.totalDots,0)
 const sub=buildLearningModel(problem('subtract',302,168,134));assert.equal(sub.mode,'places');assert.equal(sub.totalDots,0)
 const mul=buildLearningModel(problem('multiply',16,12,192));assert.equal(mul.mode,'products');assert.equal(mul.totalDots,0)
 assert.equal(mul.chunks[0].reduce((sum,a)=>sum+mul.chunks[1].reduce((total,b)=>total+a*b,0),0),192)
 const div=buildLearningModel(problem('divide',144,12,12));assert.equal(div.mode,'portions');assert.equal(div.totalDots,0)
 assert.equal(div.portions.reduce((sum,piece)=>sum+piece.amount,0),144);assert.equal(div.portions.reduce((sum,piece)=>sum+piece.each,0),12)
 const huge=buildLearningModel(problem('add',1000000,2500000,3500000));assert.equal(huge.totalDots,0);assert.ok(huge.places[0].length<=7)
})
test('regrouping preserves the original amount and makes each subtraction column possible',()=>{
 const regrouped=subtractionPlaces(302,168)
 assert.deepEqual(regrouped.top,[2,9,12]);assert.deepEqual(regrouped.bottom,[1,6,8]);assert.equal(regrouped.regrouped,true)
 for(let a=0;a<=1100;a+=11)for(let b=0;b<=a;b+=13){
  const columns=subtractionPlaces(a,b)
  assert.equal(columns.top.reduce((sum,count,index)=>sum+count*columns.powers[index],0),a)
  assert.ok(columns.top.every((digit,index)=>digit>=columns.bottom[index]))
  assert.equal(columns.top.reduce((sum,count,index)=>sum+(count-columns.bottom[index])*columns.powers[index],0),a-b)
 }
 assert.equal(placeDigits(145).reduce((sum,item)=>sum+item.count*item.value,0),145)
})
test('second stages keep the chosen operation and help levels disclose progressively',()=>{
 for(const data of [problem('add',3,4,9,2),problem('subtract',9,3,4,2),problem('multiply',2,3,12,2),problem('divide',24,3,4,2)]){
  const initial=buildLearningModel(data,1),worked=buildLearningModel(data,2)
  assert.equal(initial.op,data.op);assert.equal(initial.c,2);assert.equal(initial.hasSecond,true);assert.equal(initial.reveal,false)
  assert.equal(worked.reveal,true);assert.equal(worked.final,data.answer)
 }
})
test('invalid arithmetic cannot produce a misleading drawing',()=>{
 for(const data of [problem('divide',8,0,0),problem('divide',9,2,4),problem('subtract',2,4,-2),problem('add',2,3,6),problem('add',-1,3,2),problem('multiply',NaN,3,4),problem('divide',24,3,2,3),problem('subtract',3,2,-1,2)])assert.equal(buildLearningModel(data),null)
 assert.equal(buildLearningModel(null),null)
})
test('all generated operations, difficulties and ten-stage problems have truthful bounded visual models',()=>{
 for(const op of ['add','subtract','multiply','divide'])for(const difficulty of ['novato','audaz','guerrero'])for(let level=1;level<=10;level++)for(const roll of [0,.2,.5,.99]){
  const question=generateProblem({op,difficulty,level,roll}),visual=buildLearningModel(question)
  assert.ok(visual,`${op}/${difficulty}/${level}/${roll}`);assert.equal(visual.final,question.answer);assert.ok(visual.totalDots<=60)
  assert.equal(visual.op,op);if(visual.mode==='groups')assert.equal(visual.totalDots,question.a*question.b)
  if(visual.mode==='share')assert.equal(visual.groups*visual.each,question.a)
 }
})
