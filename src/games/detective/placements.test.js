import test from 'node:test'
import assert from 'node:assert/strict'
import { getCase } from './levels.js'
import { OBJECTS } from './objects.js'
import { validPlacements, validatePlacement, selectPlacement, placedObjects, objectBounds, objectTransform } from './placements.js'
import { hitTest, objectAnchor, cameraAt, cameraBox, screenToScene } from './geometry.js'
import { buildPuzzle } from './puzzle.js'
const level=getCase(1)
test('all four layouts contain one visible copy of each object, inside approved zones with no overlap',()=>{
 assert.equal(validPlacements(level).length,4)
 for(const layout of level.sceneConfig.distributions){
  assert.equal(validatePlacement(level,layout),true)
  const objects=placedObjects(level,layout.id)
  assert.equal(new Set(objects.map(object=>object.id)).size,5)
  assert.deepEqual(objects.map(object=>object.id),level.objects.map(object=>object.id))
  for(const object of objects){assert.ok(OBJECTS[object.kind].regions.length);assert.equal(hitTest(objectAnchor(object),objects),object.id);const box=objectBounds(object);assert.ok(box.left>=0&&box.right<=1&&box.top>=0&&box.bottom<=1)}
 }
})
test('selection excludes the previous layout even with repeated or boundary random inputs',()=>{
 for(const previous of level.sceneConfig.distributions)for(const roll of [-1,0,.25,.5,.99,1,NaN,Infinity])assert.notEqual(selectPlacement(level,previous.id,roll).placementId,previous.id)
 for(const layout of level.sceneConfig.distributions)assert.ok(selectPlacement(level,null,level.sceneConfig.distributions.indexOf(layout)/4).placementId)
})
test('invalid placements are rejected before they can be selected',()=>{
 const copy=structuredClone(level)
 copy.sceneConfig.distributions[0].slots.coin='chest' // crown already occupies it
 assert.equal(validatePlacement(copy,copy.sceneConfig.distributions[0]),false)
 assert.equal(validPlacements(copy).length,3)
 const outside=structuredClone(level);outside.sceneConfig.zones.chest.cx=1.1
 assert.equal(validatePlacement(outside,outside.sceneConfig.distributions[0]),false)
 const missing=structuredClone(level);delete missing.sceneConfig.distributions[0].slots.key
 assert.equal(validatePlacement(missing,missing.sceneConfig.distributions[0]),false)
})
test('drawing transforms and normalized hit detection share the same active objects across every viewport and zoom',()=>{
 for(const layout of validPlacements(level))for(const width of [320,375,768,1100])for(const zoom of [1,1.5,2,3]){
  const objects=placedObjects(level,layout.id)
  for(const object of objects){
   assert.ok(objectTransform(object).startsWith(`translate(${object.cx*1000} ${object.cy*1000})`))
   const anchor=objectAnchor(object),camera=cameraAt(zoom,anchor.x,anchor.y),box=cameraBox(camera),rect={left:21,top:140,width,height:width}
   const point=screenToScene(rect.left+(anchor.x-box.x)/box.size*width,rect.top+(anchor.y-box.y)/box.size*width,rect,camera)
   assert.equal(hitTest(point,objects),object.id)
  }
 }
})
test('the deduction has exactly one answer backed by the actual crown in every layout',()=>{
 for(const layout of validPlacements(level)){
  const objects=placedObjects(level,layout.id),puzzle=buildPuzzle(level,objects),crown=objects.find(object=>object.kind==='crown')
  assert.equal(puzzle.options.length,3);assert.equal(new Set(puzzle.options.map(option=>option.id)).size,3)
  assert.equal(puzzle.options.filter(option=>option.id===crown.zoneId).length,1);assert.equal(puzzle.answer,crown.zoneId)
  assert.ok(puzzle.evidence.includes(crown.locationShort));assert.ok(puzzle.explanation.includes(crown.locationShort))
 }
})
