import { CHALLENGES } from './data.js'
import { BOSSES } from './bosses.js'

const mechanics=[
 ['bridge','gears','gate'],['paths','gears','gate'],['bridge','basket','groups'],
 ['paths','gears','bridge'],['bridge','groups','gate'],['paths','basket','gate'],
 ['bridge','groups','gate'],['paths','basket','gears'],['bridge','gears','paths'],['paths','groups','portal'],
]
const obstacles={
 bridge:{name:'El puente incompleto',goal:'Elige la plataforma que completa el puente.',action:'Completar puente',change:'¡Puente completo! Ya puedes cruzar.',movement:'jump'},
 paths:{name:'Las piedras del sendero',goal:'Escoge la piedra con la respuesta para seguir el sendero.',action:'Elegir camino',change:'¡Una nueva piedra abre el sendero!',movement:'jump'},
 gears:{name:'El ascensor de bambú',goal:'Construye la cantidad que activa el ascensor.',action:'Activar ascensor',change:'¡Mecanismo listo! La plataforma sube contigo.',movement:'lift'},
 gate:{name:'La puerta de raíces',goal:'Descifra el código para abrir la puerta.',action:'Abrir puerta',change:'¡Raíces apartadas! La puerta está abierta.',movement:'jump'},
 portal:{name:'El arco de cristal',goal:'Completa el código para encender el arco.',action:'Activar portal',change:'¡El arco brilla! La arena está al otro lado.',movement:'jump'},
 basket:{name:'La mochila del camino',goal:'Coloca la cantidad indicada para preparar el paso.',action:'Preparar mochila',change:'¡Mochila preparada! Se despliega un paso nuevo.',movement:'jump'},
 groups:{name:'Las luces de la selva',goal:'Reúne o reparte las luces para iluminar el camino.',action:'Iluminar camino',change:'¡Luces encendidas! Ahora se ve el siguiente apoyo.',movement:'jump'},
}
/** Authored route geometry is in viewport percentages, independent of pixel width. */
export const ZONES=Object.freeze(CHALLENGES.map((zone,index)=>{
 let y=78
 const supports=[{x:18,y}]
 const route=mechanics[index].map((kind,i)=>{
  if(kind==='gears')y-=15
  supports.push({x:18+(i+1)*67,y})
  return {...obstacles[kind],id:`${zone.id}:obstacle-${i+1}`,kind,from:i,to:i+1}
 })
 return {...zone,boss:BOSSES[index],obstacles:route,supports,coins:5,exit:index===9?'La selva completa':CHALLENGES[index+1].name,accent:['#a4ecdf','#f8d389','#d9b9ff'][index%3]}
}))
export const effectivePhase=state=>state.phase==='PAUSED'?state.pausedPhase:state.phase
export const inCombat=state=>state.obstacleIndex===3
export const currentObstacle=state=>ZONES[state.index].obstacles[Math.min(state.obstacleIndex,2)]
export const interactionFor=state=>inCombat(state)?{kind:'combat',name:'Desafío final',goal:'Resuelve y lanza tu respuesta: un acierto quita un segmento.',action:'Lanzar respuesta'}:currentObstacle(state)
export const isAnswering=state=>['OBSTACLE','CHALLENGE'].includes(state.phase)
export function zoneStatus(state,index){return state.completed.includes(CHALLENGES[index].id)?'completada':index!==state.index?'pendiente':inCombat(state)?'jefe pendiente':'recorrido en progreso'}

export const coinsFor=completed=>ZONES.filter(zone=>completed.includes(zone.id)).reduce((total,zone)=>total+zone.coins,0)
