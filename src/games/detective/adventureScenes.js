import { SCENE_ZONES } from './sceneZones.js'
import { OBJECTS } from './objects.js'
/** Each new scene supplies inspected furniture surfaces, never random coordinates. */
export function adventureScene(level){
 const approved=SCENE_ZONES[level.id]?.zones
 if(!approved||approved.length<level.objects.length)throw Error(`Caso ${level.id}: faltan zonas visuales inspeccionadas`)
 const zones=Object.fromEntries(approved.map(zone=>[zone.id,{...zone,kinds:Object.keys(OBJECTS)}]))
 const ids=Object.keys(zones)
 return {id:`case-${level.id}`,background:level.scene,layers:{background:0,objects:10,feedback:30},zones,
 distributions:Array.from({length:4},(_,variant)=>({id:`case-${level.id}-${variant+1}`,name:`Distribución ${variant+1}`,slots:Object.fromEntries(level.objects.map((object,index)=>[object.id,ids[(index+variant*2)%ids.length]]))}))}
}
