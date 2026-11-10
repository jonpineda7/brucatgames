import test from 'node:test'
import assert from 'node:assert/strict'
import { ADVENTURE_CASES, CHAPTERS } from './adventureCases.js'

function validatePuzzle(puzzle){
 assert.ok(['choice','sequence','match','assemble','multi'].includes(puzzle.type))
 for(const field of ['question','clue','evidence','feedback','explanation'])assert.ok(typeof puzzle[field]==='string'&&puzzle[field].length>(field==='question'?10:20),field)
 if(puzzle.type==='multi'){
  assert.ok(puzzle.stages.length>=2)
  puzzle.stages.forEach(validatePuzzle)
  return
 }
 const items=puzzle.type==='choice'?puzzle.options:puzzle.items
 assert.ok(items.length>=3)
 assert.equal(new Set(items.map(item=>item.id)).size,items.length)
 assert.ok(items.every(item=>item.label?.length>1))
 if(puzzle.type==='choice'){
  assert.equal(items.filter(item=>item.id===puzzle.answer).length,1)
  assert.ok(items.some(item=>item.id!==puzzle.answer),'a real wrong alternative is available')
 }else if(puzzle.type==='sequence'){
  assert.ok(Array.isArray(puzzle.answer)&&puzzle.answer.length>=3)
  assert.equal(new Set(puzzle.answer).size,puzzle.answer.length)
  assert.ok(puzzle.answer.every(id=>items.some(item=>item.id===id)))
 }else{
  assert.equal(Object.keys(puzzle.answer).length,items.length)
  assert.equal(puzzle.targets.length,items.length)
  assert.equal(new Set(puzzle.targets.map(item=>item.id)).size,items.length)
  assert.equal(new Set(Object.values(puzzle.answer)).size,items.length)
  for(const item of items)assert.ok(puzzle.targets.some(target=>target.id===puzzle.answer[item.id]))
 }
}

test('the authored adventure includes all fourteen additional cases and five connected chapters',()=>{
 assert.deepEqual(ADVENTURE_CASES.map(level=>level.id),Array.from({length:14},(_,i)=>i+2))
 assert.deepEqual(CHAPTERS.map(chapter=>chapter.id),[0,1,2,3,4])
 assert.equal(new Set(ADVENTURE_CASES.map(level=>level.scene)).size,14)
 assert.equal(new Set(ADVENTURE_CASES.map(level=>level.name)).size,14)
 for(const chapter of CHAPTERS){
  assert.ok(chapter.name.length>10&&chapter.description.length>20&&chapter.clue.length>20)
  assert.match(chapter.scene,/\.jpg$/)
 }
})

for(let world=0;world<5;world++)test(`chapter ${world+1} has complete authored objects, evidence and solvable puzzle configurations`,()=>{
 const cases=ADVENTURE_CASES.filter(level=>level.world===world)
 assert.equal(cases.length,world===0?2:3) // Existing case 1 remains in levels.js.
 for(const level of cases){
  const expected=level.id<=5?5:level.id<=10?7:9
  assert.equal(level.objects.length,expected)
  assert.equal(new Set(level.objects.map(object=>object.id)).size,expected)
  for(const object of level.objects){
   assert.ok(object.name.length>3&&object.kind.length>1)
   assert.ok(object.detail.length>15&&object.clue===object.detail)
   assert.ok(Number.isFinite(object.rotation)&&object.size>=.075&&object.size<=.095)
  }
  for(const field of ['description','mission','outro','sceneTitle'])assert.ok(level[field].length>20)
  assert.match(level.scene,new RegExp(`case-${String(level.id).padStart(2,'0')}\\.jpg$`))
  validatePuzzle(level.puzzle)
 }
})

test('the jungle map has four different visible fragments and a complete quadrant reconstruction',()=>{
 const level=ADVENTURE_CASES.find(level=>level.id===4)
 assert.deepEqual(level.objects.filter(item=>item.kind==='map').map(item=>item.fragment),[0,1,2,3])
 assert.deepEqual(new Set(level.puzzle.items.map(item=>item.fragment)),new Set([0,1,2,3]))
 assert.equal(level.puzzle.layout,'map')
 assert.deepEqual(Object.values(level.puzzle.answer).sort(),['ne','nw','se','sw'])
})

test('advanced clues include visual comparison, meaningful exclusions and a three-stage adventure conclusion',()=>{
 const recipe=ADVENTURE_CASES.find(level=>level.id===7).puzzle
 assert.equal(recipe.answer.length,3)
 assert.equal(recipe.items.length,4)
 assert.ok(!recipe.answer.includes('salt'))
 const art=ADVENTURE_CASES.find(level=>level.id===14).puzzle.stages[0]
 assert.deepEqual(art.referencePattern,['sun','moon','star'])
 assert.deepEqual(art.options.find(item=>item.id===art.answer).pattern,['sun','moon','leaf'])
 const final=ADVENTURE_CASES.at(-1)
 assert.equal(final.id,15)
 assert.equal(final.puzzle.stages.length,3)
 assert.deepEqual(final.puzzle.stages.map(stage=>stage.type),['sequence','match','choice'])
 assert.match(final.puzzle.explanation,/Fiesta de la Amistad/)
 assert.match(final.outro,/Aventura completada/)
})
