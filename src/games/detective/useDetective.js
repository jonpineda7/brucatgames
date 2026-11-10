import { useEffect, useReducer, useRef, useState } from 'react'
import { gameReducer, newGame, PHASES } from './engine.js'
import { loadProgress, persistProgress } from './progress.js'
import { loadRun, snapshotRun, writeRun } from './session.js'
import { AUTO_TRANSITIONS, scheduleTransition } from './transitions.js'
import { createAudio } from '../gorila-loco/audio.js'
const storage=()=>{try{return window.localStorage}catch{return null}}
export default function useDetective(){
 const [state,dispatch]=useReducer(gameReducer,undefined,()=>{const progress=loadProgress(storage());return newGame(progress,loadRun(storage(),progress))})
 const [saved,setSaved]=useState(true),[runSaved,setRunSaved]=useState(true),[audioAvailable,setAudioAvailable]=useState(true)
 const audio=useRef(null),played=useRef(null)
 const snapshot=JSON.stringify(snapshotRun(state))
 useEffect(()=>{
  const stored=writeRun(storage(),snapshot)
  // Reflect an external session write, including quota errors.
  // oxlint-disable-next-line react/set-state-in-effect
  setRunSaved(stored)
 },[snapshot])
 useEffect(()=>{const player=createAudio();audio.current=player;return()=>{player.close();audio.current=null}},[])
 useEffect(()=>{
  const stored=persistProgress(storage(),state.progress)
  // Synchronize an external browser storage operation, including storage failures.
  // oxlint-disable-next-line react/set-state-in-effect
  setSaved(stored)
 },[state.progress])
 useEffect(()=>{if(played.current===state.event)return;played.current=state.event;if(state.progress.sound)audio.current?.play(state.event.sound)},[state.event,state.progress.sound])
 useEffect(()=>{
  if(state.phase!==PHASES.SEARCHING)return
  const session=state.session
  let previous=performance.now()
  const timer=window.setInterval(()=>{const now=performance.now();dispatch({type:'tick',session,delta:Math.min(1000,now-previous)});previous=now},250)
  const hidden=()=>{if(document.hidden)dispatch({type:'pause',session})}
  const escape=event=>{if(event.key==='Escape')dispatch({type:'pause',session})}
  document.addEventListener('visibilitychange',hidden);document.addEventListener('keydown',escape)
  return()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',hidden);document.removeEventListener('keydown',escape)}
 },[state.phase,state.session])
 useEffect(()=>{
  const transition=AUTO_TRANSITIONS[state.phase]
  if(!transition||state.overlay)return
  const session=state.session,token=state.transition
  return scheduleTransition({schedule:(callback,delay)=>window.setTimeout(callback,delay),cancel:timer=>window.clearTimeout(timer),finish:()=>dispatch({type:transition.type,session,transition:token,roll:Math.random()}),delay:window.matchMedia('(prefers-reduced-motion: reduce)').matches?120:transition.delay})
 },[state.phase,state.session,state.transition,state.overlay])
 function act(action){
  if(action.type==='sound'&&state.progress.sound)audio.current?.mute()
  else if((state.progress.sound&&!['tick','pan','zoom','center'].includes(action.type))||action.type==='sound'){
   if(audio.current&&!audio.current.unlock()){setAudioAvailable(false);if(action.type==='sound')return}
  }
  dispatch({...action,session:state.session,transition:state.transition,...(['start','restart'].includes(action.type)?{roll:Math.random()}:{})})
 }
 return {state,act,saved:saved&&runSaved,audioAvailable}
}
