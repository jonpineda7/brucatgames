import JourneyScene from './JourneyScene.jsx'
import { ZONES, inCombat, isAnswering, interactionFor, zoneStatus } from './journey.js'
import { useEffect,useRef,useState } from 'react'
import { CHALLENGES } from './data.js'
import { BOSSES } from './bosses.js'
import { PHASES } from './engine.js'
import BruCatCharacter from './BruCatCharacter.jsx'
const base=import.meta.env.BASE_URL
export default function WorldScene({state,act}){
 const stage=CHALLENGES[state.index],boss=BOSSES[state.index],paused=state.phase===PHASES.PAUSED
 const phase=paused?state.pausedPhase:state.phase,victory=phase===PHASES.VICTORY,impact=phase===PHASES.IMPACT,resolving=phase===PHASES.RESOLVING,combat=inCombat(state)
 const resultFocus=useRef(null),introFocus=useRef(null)
 useEffect(()=>{const node=victory?resultFocus.current:phase===PHASES.BOSS_INTRO?introFocus.current:null;node?.focus({preventScroll:true});node?.scrollIntoView({block:'nearest',behavior:'instant'})},[victory,phase])
 const pose=victory?'friendly':impact?'impact':'idle',[failed,setFailed]=useState('')
 useEffect(()=>{const images=[...(combat?Object.values(boss.assets):state.obstacleIndex===2?[boss.assets.idle]:[]),...(victory&&BOSSES[state.index+1]?[BOSSES[state.index+1].assets.idle]:[])].map(src=>{const image=new Image();image.src=base+src;return image});return()=>{for(const image of images){image.onload=null;image.onerror=null}}},[boss,state.index,combat,state.obstacleIndex,victory])
 return <><div className="math-encounter-header"><p role="status">{combat?'Desafío final':`Recorrido: ${Math.min(state.obstacleIndex+1,3)}/3`}</p><details className="math-map"><summary>Mapa de las diez zonas</summary><ol className="math-route" aria-label="Ruta de las diez zonas">{CHALLENGES.map((item,index)=>{const status=zoneStatus(state,index);return <li key={item.id} className={`${index===state.index?'current':''} ${status==='completada'?'done':''}`}><span aria-label={`Zona ${index+1}: ${item.name}, ${status}`}>{status==='completada'?'✓':index+1}</span><small>{status==='completada'?'Lista':status==='jefe pendiente'?'Jefe':status==='recorrido en progreso'?'Recorrido':'Pendiente'}</small></li>})}</ol></details></div>{combat?<div className={`math-world boss-arena mechanic-${stage.mechanic} effect-${boss.effect} ${victory?'is-restored':''} ${paused?'is-paused':''}`}>
  <img className="math-jungle" src={`${base}games/math-adventure/jungle.jpg`} alt="Selva con un río turquesa y dos islas para nuestros personajes" width="1254" height="1254"/>

  <div className="boss-shield" style={{'--shield':boss.color}}><strong>{boss.name}</strong><div role="progressbar" aria-label={`Energía del escudo de ${boss.name}`} aria-valuemin={0} aria-valuemax={boss.maxEnergy} aria-valuenow={state.bossEnergy} aria-valuetext={`${state.bossEnergy/10} de ${boss.exercises} segmentos`} className="boss-segments">{Array.from({length:boss.exercises},(_,i)=><span key={i} className={i*10<state.bossEnergy?'filled':''}/>)}</div><small>{state.bossEnergy/10} / {boss.exercises} segmentos · un acierto, un segmento</small></div>
  <div className="math-island hero-island" aria-hidden="true"/><div className="math-island boss-island" aria-hidden="true"/>
  <div className="math-character"><BruCatCharacter celebrating={resolving||impact||victory} helpCount={state.helps} errorCount={state.errors} paused={paused}/></div>
  <div className={`math-boss pose-${pose}`}><img src={base+boss.assets[failed===boss.assets[pose]?'idle':pose]} onError={()=>setFailed(boss.assets[pose])} alt={`${boss.name}${victory?', sonriente y amistoso':impact?', sorprendido por el acierto':''}`} width="352" height="352"/></div>

  <div className="zone-decoration" aria-hidden="true">{stage.mechanic==='groups'?'✦ · ✧ · ✦':stage.mechanic==='gears'?'⚙':stage.mechanic==='portal'?'◉':stage.mechanic==='gate'?'♧':'❧'}</div>
  {resolving&&<span className="math-projectile" aria-hidden="true">{state.problem.op==='multiply'?'×':state.problem.op==='divide'?'÷':state.problem.op==='subtract'?'−':'+'}</span>}
  <p className="boss-status" role="status">{resolving||impact?'¡Acierto! Un segmento menos.':victory?'¡Escudo resuelto! La zona vuelve a brillar.':state.phase===PHASES.FEEDBACK?'Paso a paso. Puedes volver a intentarlo.':''}</p>
 </div>:<JourneyScene state={state}/>}

 {phase===PHASES.EXPLORE&&<article className="math-explore-card"><span>EXPLORA · RESUELVE · AVANZA</span><h3>{stage.name}</h3><p>Tres obstáculos nos separan de la arena. ¡Vamos paso a paso!</p><button className="primary-button" onClick={()=>act({type:'explore'})}>Empezar recorrido →</button></article>}
 {phase===PHASES.BOSS_INTRO&&<article className="math-explore-card"><span>¡UN ÚLTIMO DESAFÍO PARA ABRIR EL CAMINO!</span><h3 ref={introFocus} tabIndex={-1}>{boss.name}</h3><p>{boss.intro}</p><p>{boss.exercises} aciertos para calmar su escudo. Las pistas siempre ayudan.</p><button className="primary-button" onClick={()=>act({type:'fight'})}>Omitir presentación y jugar →</button></article>}
 {victory&&<article className="math-explore-card boss-victory"><span>★ {stage.reward} · +{ZONES[state.index].coins} monedas · insignia de {boss.theme}</span><h3 ref={resultFocus} tabIndex={-1}>¡Gracias, BruCat!</h3><p>{boss.outro}</p><p>Siguiente destino: {ZONES[state.index].exit}.</p><button className="primary-button" onClick={()=>act({type:'next-zone'})}>{state.index===9?'Ver resultado':'Siguiente zona'} →</button></article>}
 </>
}

export function ChoicePlatforms({state,act}){const stage=interactionFor(state),active=isAnswering(state);return <div className={`math-platforms ${inCombat(state)?'combat-answers':''}`} aria-label={inCombat(state)?'Respuestas para lanzar':'Plataformas del camino'}>{state.problem.choices.map(value=><button key={value} disabled={!active} onClick={()=>act({type:'answer',value})} aria-label={`${inCombat(state)?'Lanzar respuesta':stage.kind==='paths'?'Camino':'Plataforma'} ${value}`}><span>{value}</span>{inCombat(state)&&<small>Lanzar respuesta</small>}<svg viewBox="0 0 180 55" aria-hidden="true"><path d="M10 10Q90 -2 170 10L160 42Q90 56 20 42Z" fill="#708e56" stroke="#f2dc99" strokeWidth="4"/></svg></button>)}</div>}
