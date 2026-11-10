import { OBJECTS } from './objects.js'
import { localToScene, hitTest, objectAnchor, clamp } from './geometry.js'
export function placedObjects(level,placementId){
 const scene=level.sceneConfig,layout=scene?.distributions.find(item=>item.id===placementId)
 if(!layout)return []
 return level.objects.map(object=>{
  const zoneId=layout.slots[object.id],zone=scene.zones[zoneId]
  if(!zone)return null
  return {...object,cx:zone.cx,cy:zone.cy,zoneId,zoneName:zone.name,location:`Busca ${zone.location}.`,locationShort:zone.location,layer:scene.layers.objects}
 }).filter(Boolean).sort((a,b)=>a.layer-b.layer)
}
export function objectBounds(object){
 const points=OBJECTS[object.kind].regions.flatMap(region=>region.type==='circle'?[[region.cx-region.r,region.cy-region.r],[region.cx+region.r,region.cy-region.r],[region.cx+region.r,region.cy+region.r],[region.cx-region.r,region.cy+region.r]]:region.points).map(([x,y])=>localToScene({x,y},object))
 // Include artwork outlines as well as its filled hit regions.
 return {left:Math.min(...points.map(point=>point.x))-.003,top:Math.min(...points.map(point=>point.y))-.003,right:Math.max(...points.map(point=>point.x))+.003,bottom:Math.max(...points.map(point=>point.y))+.003}
}
export function validatePlacement(level,layout){
 if(!layout||!level.sceneConfig||level.sceneConfig.background!==level.scene)return false
 const objects=placedObjects(level,layout.id)
 if(objects.length!==level.objects.length||new Set(objects.map(object=>object.id)).size!==objects.length||Object.keys(layout.slots).length!==objects.length)return false
 const bounds=[]
 for(const object of objects){
  if(!OBJECTS[object.kind]||![object.cx,object.cy,object.size,object.rotation,object.layer].every(Number.isFinite)||object.size<=0)return false
  const zone=level.sceneConfig.zones[object.zoneId],bound=objectBounds(object)
  if(!zone.kinds.includes(object.kind)||bound.left<0||bound.top<0||bound.right>1||bound.bottom>1||bound.left<zone.bounds[0]||bound.top<zone.bounds[1]||bound.right>zone.bounds[2]||bound.bottom>zone.bounds[3])return false
  if(bounds.some(other=>bound.left<other.right+.004&&bound.right>other.left-.004&&bound.top<other.bottom+.004&&bound.bottom>other.top-.004))return false
  if(hitTest(objectAnchor(object),objects)!==object.id)return false
  bounds.push(bound)
 }
 return true
}
export const validPlacements=level=>(level.sceneConfig?.distributions||[]).filter(layout=>validatePlacement(level,layout))
export function selectPlacement(level,previousId,roll=0){
 const valid=validPlacements(level),alternatives=valid.filter(layout=>layout.id!==previousId),pool=alternatives.length?alternatives:valid
 if(!pool.length)return null
 const value=Number.isFinite(roll)?clamp(roll,0,1-Number.EPSILON):0
 const layout=pool[Math.floor(value*pool.length)]
 return {placementId:layout.id,objects:Object.freeze(placedObjects(level,layout.id).map(object=>Object.freeze(object)))}
}
// Used by the renderer as well: one transform governs artwork and interaction geometry.
export const objectTransform=object=>`translate(${object.cx*1000} ${object.cy*1000}) rotate(${object.rotation}) scale(${object.size*10}) translate(-50 -50)`
