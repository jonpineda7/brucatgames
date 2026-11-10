import test from 'node:test'
import assert from 'node:assert/strict'
import { addSequence, moveSequence, assignPuzzle, draftComplete, puzzleDrop } from './puzzleInteraction.js'
import { OBJECTS } from './objects.js'
import { insideRegion } from './geometry.js'
const items=[{id:'one'},{id:'two'},{id:'three'}],targets=[{id:'left'},{id:'middle'},{id:'right'}]
test('sequence controls reject duplicates and reorder without mutating the previous draft',()=>{
 let draft=addSequence([], 'two',items);draft=addSequence(draft,'one',items);draft=addSequence(draft,'three',items)
 assert.deepEqual(draft,['two','one','three']);assert.equal(addSequence(draft,'two',items),draft);assert.equal(addSequence(draft,'missing',items),draft)
 const moved=moveSequence(draft,'one',0);assert.deepEqual(moved,['one','two','three']);assert.deepEqual(draft,['two','one','three'])
 assert.equal(moveSequence(draft,'one',-1),draft);assert.equal(moveSequence(draft,'missing',1),draft)
 assert.equal(draftComplete({type:'sequence',items},draft),true);assert.equal(draftComplete({type:'sequence',items},['one','one','two']),false)
})
test('piece placement swaps occupied destinations and cannot duplicate, invent or lose a piece',()=>{
 let draft=assignPuzzle({},'one','left',items,targets);draft=assignPuzzle(draft,'two','middle',items,targets)
 const old=draft;draft=assignPuzzle(draft,'one','middle',items,targets)
 assert.deepEqual(draft,{one:'middle',two:'left'});assert.deepEqual(old,{one:'left',two:'middle'})
 draft=assignPuzzle(draft,'three','left',items,targets);assert.deepEqual(draft,{one:'middle',three:'left'})
 assert.equal(assignPuzzle(draft,'missing','left',items,targets),draft);assert.equal(assignPuzzle(draft,'one','missing',items,targets),draft)
 draft=assignPuzzle(draft,'two','right',items,targets)
 assert.equal(draftComplete({type:'assemble',items,targets},draft),true)
 assert.equal(draftComplete({type:'match',items,targets},{one:'left',two:'left',three:'right'}),false)
})
test('choice completion accepts only a visible option, including an empty draft',()=>{
 const puzzle={type:'choice',options:[{id:'a'},{id:'b'}]}
 assert.equal(draftComplete(puzzle,null),false);assert.equal(draftComplete(puzzle,'a'),true);assert.equal(draftComplete(puzzle,'arbitrary'),false)
})
test('every original SVG proof has an anchor in its actual visible shared silhouette',()=>{
 for(const [kind,object] of Object.entries(OBJECTS)){
  const point={x:object.anchor[0],y:object.anchor[1]}
  assert.ok(object.regions.some(region=>insideRegion(point,region)),`${kind} anchor must hit its artwork`)
  for(const region of object.regions)if(region.type==='circle')assert.ok(region.cx-region.r>=0&&region.cy-region.r>=0&&region.cx+region.r<=100&&region.cy+region.r<=100)
  else assert.ok(region.points.every(([x,y])=>x>=0&&x<=100&&y>=0&&y<=100))
 }
})

test('piece gestures require a deliberate in-board drop; cancellation and short taps cannot assign',()=>{
 const start={id:'piece',x:30,y:40}
 assert.equal(puzzleDrop(null,{x:100,y:100},'slot'),null)
 assert.equal(puzzleDrop(start,{x:35,y:42},'slot'),null)
 assert.equal(puzzleDrop(start,{x:100,y:100},undefined),null)
 assert.equal(puzzleDrop(start,{x:100,y:100},'slot',false),null)
 assert.equal(puzzleDrop(start,{x:NaN,y:100},'slot'),null)
 assert.deepEqual(puzzleDrop(start,{x:100,y:100},'slot'),{id:'piece',target:'slot'})
 assert.deepEqual(start,{id:'piece',x:30,y:40})
})

test('a selective recipe can use three of four ingredients, leaving the distractor unselected',()=>{
 const choices=[...items,{id:'salt'}],puzzle={type:'sequence',items:choices,requiredCount:3}
 assert.equal(draftComplete(puzzle,['one','two','three']),true)
 assert.equal(draftComplete(puzzle,['one','two','three','salt']),false)
 assert.equal(draftComplete(puzzle,['one','two','invented']),false)
 assert.equal(draftComplete(puzzle,['one','one','two']),false)
 assert.equal(draftComplete(puzzle,['one','two']),false)
 const full=['one','two','three'];assert.equal(addSequence(full,'salt',choices,3),full)
 assert.deepEqual(addSequence(['one','two'],'three',choices,3),full)
})
