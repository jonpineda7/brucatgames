import { useEffect,useRef,useState } from 'react'
import { CHALLENGES } from './data.js'
import { BOSSES } from './bosses.js'
import { PHASES } from './engine.js'
import BruCatCharacter from './BruCatCharacter.jsx'
const base=import.meta.env.BASE_URL
export default function WorldScene({state,act}){
 const stage=CHALLENGES[state.index],boss=BOSSES[state.index],paused=state.phase===PHASES.PAUSED
 const phase=paused?state.pausedPhase:state.phase,victory=phase===PHASES.VICTORY,impact=phase===PHASES.IMPACT,resolving=phase===PHASES.RESOLVING
 const resultFocus=useRef(null)
 useEffect(()=>{if(victory)resultFocus.current?.focus({preventScroll:true})},[victory])
 const pose=victory?'friendly':impact?'impact':'idle',[failed,setFailed]=useState('')
 useEffect(()=>{const images=[...Object.values(boss.assets),...(BOSSES[state.index+1]?[BOSSES[state.index+1].assets.idle]:[])].map(src=>{const image=new Image();image.src=base+src;return image});return()=>{for(const image of images){image.onload=null;image.onerror=null}}},[boss,state.index])
 return <><div className={`math-world boss-arena mechanic-${stage.mechanic} effect-${boss.effect} ${victory?'is-restored':''} ${paused?'is-paused':''}`}>
  <img className="math-jungle" src={`${base}games/math-adventure/jungle.jpg`} alt="Selva con un río turquesa y dos islas para nuestros personajes" width="1254" height="1254"/>
  <details className="math-map"><summary>Ver recorrido · {state.index+1}/10</summary><ol className="math-route" aria-label="Ruta de las diez zonas">{CHALLENGES.map((item,index)=><li key={item.id} className={`${index===state.index?'current':''} ${state.completed.includes(item.id)?'done':''}`}><span aria-label={`Zona ${index+1}${state.completed.includes(item.id)?', completada':''}`}>{state.completed.includes(item.id)?'✓':index+1}</span></li>)}</ol></details>
  <div className="boss-shield" style={{'--shield':boss.color}}><strong>{boss.name}</strong><div role="progressbar" aria-label={`Energía del escudo de ${boss.name}`} aria-valuemin={0} aria-valuemax={boss.maxEnergy} aria-valuenow={state.bossEnergy} aria-valuetext={`${state.bossEnergy/10} de ${boss.exercises} segmentos`} className="boss-segments">{Array.from({length:boss.exercises},(_,i)=><span key={i} className={i*10<state.bossEnergy?'filled':''}/>)}</div><small>{state.bossEnergy/10} / {boss.exercises} segmentos · un acierto, un segmento</small></div>
  <div className="math-island hero-island" aria-hidden="true"/><div className="math-island boss-island" aria-hidden="true"/>
  <div className="math-character"><BruCatCharacter celebrating={resolving||impact||victory} helpCount={state.helps} errorCount={state.errors} paused={paused}/></div>
  <div className={`math-boss pose-${pose}`}><img src={base+boss.assets[failed===boss.assets[pose]?'idle':pose]} onError={()=>setFailed(boss.assets[pose])} alt={`${boss.name}${victory?', sonriente y amistoso':impact?', sorprendido por el acierto':''}`} width="352" height="352"/></div>
  <svg className="zone-scene-art" viewBox="0 0 120 80" aria-hidden="true">{['bridge','paths'].includes(stage.mechanic)?<g fill="#efcf91" stroke="#6c4939" strokeWidth="3"><path d="M3 25Q60 55 117 25M3 48Q60 78 117 48" fill="none" stroke="#efcf91"/>{[10,30,70,90].map(x=><path key={x} d={`M${x} 27v30h14V27Z`}/>)}<path className="zone-restored-piece" d="M50 32v30h14V32Z"/></g>:['gate','portal'].includes(stage.mechanic)?<g stroke="#f6d78b" strokeWidth="5"><path d="M20 75V30Q60 -15 100 30V75" fill="#523574"/><path className="zone-door-leaf" d="M31 74V34Q60 0 89 34V74Z" fill="#a263cb"/></g>:stage.mechanic==='groups'?<g fill="#fff9b9">{[15,40,65,90].map((x,i)=><circle key={x} cx={x} cy={30+i%2*25} r={victory?6:3}/>)}</g>:stage.mechanic==='gears'?<g fill="#e4c57c" stroke="#764779" strokeWidth="6"><circle cx="60" cy="40" r="29"/><path d="M60 0v25m0 30v25M20 40h25m30 0h25"/><circle cx="60" cy="40" r="9"/></g>:<g fill="#a97748" stroke="#f0ce93" strokeWidth="4"><path d="M20 30h80L90 72H30Z"/><path d="M30 30Q60 -10 90 30" fill="none"/><path d="M40 35v30m20-30v30m20-30v30"/></g>}</svg>
  <div className="zone-decoration" aria-hidden="true">{stage.mechanic==='groups'?'✦ · ✧ · ✦':stage.mechanic==='gears'?'⚙':stage.mechanic==='portal'?'◉':stage.mechanic==='gate'?'♧':'❧'}</div>
  {resolving&&<span className="math-projectile" aria-hidden="true">{state.problem.op==='multiply'?'×':state.problem.op==='divide'?'÷':state.problem.op==='subtract'?'−':'+'}</span>}
  <p className="boss-status" role="status">{resolving||impact?'¡Acierto! Un segmento menos.':victory?'¡Escudo resuelto! La zona vuelve a brillar.':state.phase===PHASES.FEEDBACK?'Paso a paso. Puedes volver a intentarlo.':''}</p>
 </div>

 {phase===PHASES.EXPLORE&&<article className="math-explore-card"><span>CONOCE A TU COMPAÑERO · ZONA {state.index+1}</span><h3>{boss.name}</h3><p>{boss.intro}</p><p>{boss.exercises} aciertos para calmar su escudo. Las pistas siempre ayudan.</p><button className="primary-button" onClick={()=>act({type:'explore'})}>Resolver el reto →</button></article>}
 {victory&&<article className="math-explore-card boss-victory"><span>★ {stage.reward} · +5 monedas · insignia de {boss.theme}</span><h3 ref={resultFocus} tabIndex={-1}>¡Gracias, BruCat!</h3><p>{boss.outro}</p><button className="primary-button" onClick={()=>act({type:'next-zone'})}>{state.index===9?'Ver resultado':'Siguiente zona'} →</button></article>}
 </>
}

export function ChoicePlatforms({state,act}){const stage=CHALLENGES[state.index],active=state.phase===PHASES.CHALLENGE;return <div className="math-platforms" aria-label="Plataformas del camino">{state.problem.choices.map(value=><button key={value} disabled={!active} onClick={()=>act({type:'answer',value})} aria-label={`${stage.mechanic==='paths'?'Camino':'Plataforma'} ${value}`}><span>{value}</span><svg viewBox="0 0 180 55" aria-hidden="true"><path d="M10 10Q90 -2 170 10L160 42Q90 56 20 42Z" fill="#708e56" stroke="#f2dc99" strokeWidth="4"/></svg></button>)}</div>}
