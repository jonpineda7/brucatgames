import { buildPuzzle, validatePuzzle } from './puzzle.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CASES, getCase } from './levels.js'
import { OBJECTS } from './objects.js'
import { cameraAt, cameraBox, screenToScene, panCamera, objectAnchor, hitTest, localToScene, sceneToLocal } from './geometry.js'
function imageDimensions(buffer){
 if(buffer.subarray(1,4).toString()==='PNG')return {width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)}
 assert.equal(buffer.readUInt16BE(0),0xffd8,'valid JPEG signature')
 let offset=2
 while(offset<buffer.length){
  assert.equal(buffer[offset++],0xff)
  while(buffer[offset]===0xff)offset++
  const marker=buffer[offset++],length=buffer.readUInt16BE(offset)
  if([0xc0,0xc1,0xc2].includes(marker))return {height:buffer.readUInt16BE(offset+3),width:buffer.readUInt16BE(offset+5)}
  offset+=length
 }
 throw Error('missing image dimensions')
}
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≈ ${b}`)
test('all declared targets are visible artwork with valid normalized geometry and unique selectable anchors',()=>{
 for(const level of CASES.filter(level=>level.status==='ready')){
  assert.ok(level.objects.length>=5&&level.objects.length<=10);assert.equal(new Set(level.objects.map(object=>object.id)).size,level.objects.length)
  for(const object of level.objects){
   assert.ok(OBJECTS[object.kind].regions.length>0)
   assert.ok(object.cx-object.size/2>0&&object.cx+object.size/2<1&&object.cy-object.size/2>0&&object.cy+object.size/2<1)
   assert.equal(hitTest(objectAnchor(object),level.objects),object.id)
   assert.equal(hitTest(localToScene({x:2,y:2},object),level.objects),null)
  }
 }
})
test('hit detection follows the actual circle/polygon rather than an invisible rectangular hotspot',()=>{
 const coin=getCase(1).objects.find(object=>object.id==='coin')
 assert.equal(hitTest(localToScene({x:50,y:50},coin),[coin]),'coin')
 assert.equal(hitTest(localToScene({x:20,y:20},coin),[coin]),null)
 assert.equal(hitTest(localToScene({x:81,y:50},coin),[coin]),null)
 const key=getCase(1).objects[0]
 assert.equal(hitTest(localToScene({x:55,y:75},key),[key]),null)
 for(const point of [null,{x:NaN,y:0},{x:1.1,y:.5},{x:.5,y:-1}])assert.equal(hitTest(point,[coin]),null)
})
test('rotated objects use reversible local-to-scene transforms',()=>{
 for(const object of getCase(1).objects)for(const point of [{x:0,y:0},{x:35,y:45},{x:100,y:100}]){
  const transformed=sceneToLocal(localToScene(point,object),object)
  close(transformed.x,point.x);close(transformed.y,point.y)
 }
})
test('responsive coordinates, zoom and panning find the same object at desktop, tablet and mobile sizes',()=>{
 for(const width of [320,375,768,1100])for(const zoom of [1,1.5,2,3])for(const object of getCase(1).objects){
  const target=objectAnchor(object),camera=cameraAt(zoom,target.x,target.y),box=cameraBox(camera),rect={left:32,top:170,width,height:width}
  const x=rect.left+(target.x-box.x)/box.size*width,y=rect.top+(target.y-box.y)/box.size*width
  const point=screenToScene(x,y,rect,camera)
  assert.equal(hitTest(point,getCase(1).objects),object.id)
  close(point.x,target.x);close(point.y,target.y)
 }
})
test('pan camera tracks drag distance at the current zoom and clamps the viewport to the original scene',()=>{
 const camera=cameraAt(2),next=panCamera(camera,100,-50,{width:400,height:400})
 close(next.cx,.375);close(next.cy,.5625)
 assert.deepEqual(panCamera(camera,9999,-9999,{width:375,height:375}),{zoom:2,cx:.25,cy:.75})
 assert.deepEqual(cameraAt(1,-500,900),{zoom:1,cx:.5,cy:.5})
 assert.deepEqual(cameraAt(NaN,NaN,Infinity),{zoom:1,cx:.5,cy:.5})
 assert.equal(panCamera(camera,NaN,10,{width:400,height:400}),camera)
})
test('off-scene touches, invalid rectangles and letterbox-free square edges are handled safely',()=>{
 const rect={left:10,top:20,width:375,height:375},camera=cameraAt()
 assert.deepEqual(screenToScene(10,20,rect,camera),{x:0,y:0})
 assert.deepEqual(screenToScene(385,395,rect,camera),{x:1,y:1})
 assert.equal(screenToScene(386,395,rect,camera),null)
 assert.equal(screenToScene(10,20,{...rect,width:0},camera),null)
 assert.equal(screenToScene(NaN,20,rect,camera),null)
})
test('every playable case has its actual bundled square illustration; all fifteen cases are implemented',()=>{
 for(const level of CASES){
  if(level.status==='pending'){assert.equal(level.scene,undefined);assert.equal(level.objects,undefined);continue}
  const buffer=readFileSync(new URL(`../../../public/${level.scene}`,import.meta.url))
  const {width,height}=imageDimensions(buffer)
  assert.equal(width,height);assert.ok(width>=1000)
  assert.ok(validatePuzzle(buildPuzzle(level,level.id===1?level.objects.map(object=>({...object,zoneId:level.sceneConfig.distributions[0].slots[object.id],locationShort:object.location})):level.objects)))
 }
 assert.equal(CASES.length,15)
})
