import test from 'node:test'
import assert from 'node:assert/strict'
import { OPERATIONS, DIFFICULTIES, calculate, generateProblem, validProblem, operandsInRange, explain, hintText } from './math.js'
test('all four operations in all three difficulties and adaptation tiers generate exact, bounded and unambiguous exercises',()=>{
 for(const op of Object.keys(OPERATIONS))for(const difficulty of Object.keys(DIFFICULTIES))for(let tier=0;tier<3;tier++)for(let seed=0;seed<200;seed++){
  const p=generateProblem({op,difficulty,pedagogy:{tier},level:seed%10+1,roll:seed*.0137})
  assert.equal(validProblem(p),true,JSON.stringify(p));assert.equal(operandsInRange(p),true)
  const first=op==='add'?p.a+p.b:op==='subtract'?p.a-p.b:op==='multiply'?p.a*p.b:p.a/p.b
  const answer=p.c===null?first:op==='add'?first+p.c:op==='subtract'?first-p.c:op==='multiply'?first*p.c:first/p.c
  assert.equal(p.answer,answer);assert.equal(new Set(p.choices).size,3);assert.equal(p.choices.filter(value=>value===answer).length,1)
  if(op==='divide'){assert.notEqual(p.b,0);assert.equal(p.a%p.b,0);if(p.c!==null)assert.equal((p.a/p.b)%p.c,0)}
  assert.ok(p.steps.some(step=>step.includes(String(p.answer))));assert.ok(hintText(p).length>20)
 }
})
test('novice never has negative remainders and never silently changes operation or difficulty',()=>{
 for(const op of Object.keys(OPERATIONS))for(let level=1;level<=10;level++){
  const p=generateProblem({op,difficulty:'novato',level,roll:level/17,pedagogy:{tier:99}})
  assert.equal(p.op,op);assert.equal(p.difficulty,'novato');assert.ok(p.answer>=0);assert.equal(p.c,null)
 }
})
test('division by zero, non-exact division, out-of-range values and duplicate answers are rejected',()=>{
 const p=generateProblem({op:'divide',difficulty:'novato',roll:.2})
 for(const change of [{b:0},{a:7,b:2,answer:3.5},{a:0,b:1,answer:0},{choices:[p.answer,p.answer,p.answer+1]},{op:'unknown'},{a:Infinity},{c:0},{choices:[p.answer,-1,2]}])assert.equal(validProblem({...p,...change}),false)
 assert.ok(Number.isNaN(calculate('divide',2,0)))
 assert.throws(()=>generateProblem({op:'unknown'}),RangeError)
 assert.throws(()=>generateProblem({op:'add',difficulty:'adult'}),RangeError)
})
test('recent exercise history avoids immediate repetition even in a small novice multiplication pool',()=>{
 for(const op of Object.keys(OPERATIONS)){
  const history=[]
  for(let i=0;i<80;i++){const p=generateProblem({op,difficulty:'novato',roll:0,history});assert.ok(!history.slice(-3).includes(p.key));history.push(p.key)}
 }
 const config={op:'add',difficulty:'guerrero',level:3,roll:.5}
 assert.deepEqual(generateProblem(config),generateProblem(config))
})
test('explanations describe regrouping, equal groups and equal sharing, including a second step of the same operation',()=>{
 assert.deepEqual(explain('subtract',52,19),['Para quitar 19, retira primero 10 y después 9.','52 − 10 = 42.','42 − 9 = 33.'])
 assert.ok(explain('divide',8,2).join(' ').includes('Cada grupo recibe 4'))
 assert.ok(explain('multiply',16,12).join(' ').includes('192'))
 for(const op of Object.keys(OPERATIONS)){const p=generateProblem({op,difficulty:'guerrero',level:3,roll:.3});assert.notEqual(p.c,null);assert.ok(p.expression.startsWith('('));assert.ok(p.steps.at(-1).includes(String(p.answer)))}
})
