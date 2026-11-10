import { ZONES,currentObstacle,effectivePhase } from './journey.js'
import { PHASES } from './engine.js'
import BruCatCharacter from './BruCatCharacter.jsx'
import './JourneyScene.css'
const base=import.meta.env.BASE_URL
export function ObstacleArt({kind,repaired}){
 return <svg viewBox="0 0 160 100" aria-hidden="true" className={`journey-obstacle-art ${repaired?'repaired':''}`}>
 {['bridge','paths'].includes(kind)?<g stroke="#563a35" strokeWidth="3" fill="#e7c580"><path d="M0 32H160M0 76H160" stroke="#f5e0a1" strokeWidth="5"/>{[5,35,95,125].map(x=><path key={x} d={`M${x} 28h23v55h-23Z`}/>)}<path className="repair-piece" d="M65 28h23v55H65Z"/></g>:['gate','portal'].includes(kind)?<g stroke="#f6d78b" strokeWidth="6"><path d="M20 95V35Q80 -25 140 35V95" fill="#4c315c"/><path className="gate-leaf" d="M32 93V40Q80 -5 128 40V93Z" fill="#a868c0"/><circle className="gate-leaf" cx="100" cy="65" r="6" fill="#ffea95"/></g>:kind==='gears'?<g stroke="#725040" fill="#e4c57c" strokeWidth="5"><path d="M35 0v85m90-85v85"/><circle cx="80" cy="28" r="23"/><path d="M80 0v14m0 28v14M50 28h14m32 0h14"/><path className="lift-deck" d="M20 80h120v15H20Z" fill="#81ab65"/></g>:kind==='groups'?<g fill="#fff3a3" stroke="#6b8e4c" strokeWidth="3">{[30,65,100,135].map((x,i)=><g key={x}><path d={`M${x} 95V${40+i%2*20}`} fill="none"/><circle className="route-light" cx={x} cy={30+i%2*20} r="12"/></g>)}</g>:<g fill="#a97748" stroke="#f0ce93" strokeWidth="5"><path d="M20 35h120l-12 60H32Z"/><path d="M40 35Q80 -10 120 35" fill="none"/><path d="M50 42v44m30-44v44m30-44v44"/><path className="repair-piece" d="M55 20l15 10 25-25" stroke="#ceffd1" fill="none"/></g>}
 </svg>
}
export default function JourneyScene({state}){
 const zone=ZONES[state.index],step=Math.min(state.obstacleIndex,2),obstacle=currentObstacle(state),phase=effectivePhase(state),paused=state.phase===PHASES.PAUSED
 const moving=[PHASES.MOVING,PHASES.ARENA_MOVING].includes(phase),resolving=phase===PHASES.OBSTACLE_RESOLVING,repaired=resolving||moving,from=zone.supports[step],to=zone.supports[step+1]
 return <div className={`math-world journey-world ${paused?'is-paused':''}`} style={{'--zone-accent':zone.accent}} aria-label={`Recorrido de ${zone.name}. Apoyo ${step+1} hacia ${step+2}.`}>
  <div key={`${state.session}:${state.index}:${step}`} className={`journey-camera ${state.cameraMove?'camera-advancing':''}`} style={{'--camera':`${-step*67/2.7}%`,'--camera-from':`${-(state.cameraMove?Math.max(0,step-1):step)*67/2.7}%`}}>
   {[0,1,2].map(panel=><div key={panel} className="journey-backdrop" style={{left:`${panel*100/2.7}%`,backgroundImage:`url(${base}games/math-adventure/jungle.jpg)`,backgroundPosition:`${20+panel*30}% center`}}/>)}
   <svg className="journey-trail" viewBox="0 0 2700 340" preserveAspectRatio="none" aria-hidden="true"><path d={zone.supports.map((p,i)=>`${i?'L':'M'}${p.x*10} ${p.y*3.4}`).join(' ')} fill="none" stroke="#ffe6a9" strokeWidth="3" strokeDasharray="9 11" opacity=".5"/></svg>
   {zone.supports.map((point,i)=><div key={i} aria-hidden="true" className={`journey-support ${i<=step?'visited':''} ${moving&&i===step+1?'destination':''}`} style={{left:`${point.x/2.7}%`,top:`${point.y}%`}}><span>{i===3?'ARENA':i===0?'SALIDA':`APOYO ${i+1}`}</span></div>)}
   {zone.obstacles.map((item,i)=>{const ready=i<step||i===step&&repaired;return <div key={item.id} aria-hidden="true" className={`journey-prop kind-${item.kind} ${ready?'is-open':''}`} style={{left:`${(zone.supports[i].x+34)/2.7}%`,top:`${zone.supports[i+1].y-22}%`}}><ObstacleArt kind={item.kind} repaired={ready}/><span>{ready?'✓':i+1} · {item.name}</span></div>})}
   <div className={`journey-character ${moving?`moving-${obstacle.movement}`:''}`} style={{'--from-x':`${from.x/2.7}%`,'--to-x':`${to.x/2.7}%`,'--from-y':`${from.y}%`,'--to-y':`${to.y}%`}}><BruCatCharacter poseFrame={moving&&obstacle.movement==='jump'?5:null} celebrating={resolving} helpCount={state.helps} errorCount={state.errors} paused={paused}/>{moving&&obstacle.movement==='lift'&&<span className="journey-moving-deck"/>}</div>
  </div>
  <span className="journey-destination">{step===2?'Destino: arena final':`Después: ${zone.obstacles[step+1].name}`}</span>
  <p className="journey-status" role="status">{repaired?obstacle.change:phase===PHASES.FEEDBACK?'Paso a paso. Tu camino sigue aquí.':`Apoyo ${step+1} · ${obstacle.name}`}</p>
 </div>
}
