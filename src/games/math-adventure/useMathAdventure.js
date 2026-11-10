import { useEffect, useReducer, useRef, useState } from 'react'
import { reducer, initialGame, snapshot } from './engine.js'
import { loadGame, saveGame } from './progress.js'
import { createAudio } from '../gorila-loco/audio.js'
const storage=()=>{try{return window.localStorage}catch{return null}}
export default function useMathAdventure(){
 const [state,dispatch]=useReducer(reducer,undefined,()=>{const {progress,run}=loadGame(storage());return initialGame(progress,run)})
 const [saved,setSaved]=useState(true),[audioAvailable,setAudioAvailable]=useState(true),audio=useRef(null),played=useRef(null),clock=useRef(null)
 const active=JSON.stringify(snapshot(state))
 useEffect(()=>{const player=createAudio();audio.current=player;return()=>{player.close();audio.current=null}},[])
 useEffect(()=>{const ok=saveGame(storage(),state.progress,JSON.parse(active));
  // Synchronize external browser storage failure without blocking the game.
  // oxlint-disable-next-line react/set-state-in-effect
  setSaved(ok)
 },[state.progress,active])
 useEffect(()=>{if(played.current===state.event)return;played.current=state.event;if(state.settings.sound)audio.current?.play(state.event.sound)},[state.event,state.settings.sound])
 useEffect(()=>{
  const timings={OBSTACLE_RESOLVING:['obstacle-resolved',320],MOVING:['arrived',850],ARENA_MOVING:['arrived',850],RESOLVING:['resolved',450],IMPACT:['impact-ended',300]},timing=timings[state.phase]
  if(!timing)return
  const [type,duration]=timing,session=state.session,transition=state.transition,key=`${session}:${state.index}:${state.obstacleIndex}:${state.phase}:${state.event.id}`
  if(clock.current?.key!==key)clock.current={key,remaining:matchMedia('(prefers-reduced-motion: reduce)').matches?30:duration}
  const started=performance.now(),timer=setTimeout(()=>dispatch({type,session,transition,roll:Math.random()}),clock.current.remaining)
  return()=>{clearTimeout(timer);if(clock.current?.key===key)clock.current.remaining=Math.max(0,clock.current.remaining-(performance.now()-started))}
 },[state.phase,state.session,state.transition,state.index,state.obstacleIndex,state.event.id])
 useEffect(()=>{const session=state.session;const pause=()=>{if(document.hidden)dispatch({type:'pause',session})};const escape=event=>{if(event.key==='Escape')dispatch({type:'pause',session})};document.addEventListener('visibilitychange',pause);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('visibilitychange',pause);document.removeEventListener('keydown',escape)}},[state.session])
 function act(action){if(action.type==='sound'&&state.settings.sound)audio.current?.mute();else if((state.settings.sound||action.type==='sound')&&audio.current&&!audio.current.unlock()){setAudioAvailable(false);if(action.type==='sound')return}dispatch({...action,session:state.session,...(['explore','play','answer','fight'].includes(action.type)?{roll:Math.random()}:{})})}
 return {state,act,saved,audioAvailable}
}
