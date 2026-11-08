import { useEffect, useReducer, useRef, useState } from 'react'
import { gameReducer, newGame, PHASES } from './engine.js'
import { readProgress, saveProgress } from './progress.js'
import { createAudio } from '../gorila-loco/audio.js'
import { startReveal } from './reveal.js'
const storage=()=>{try{return window.localStorage}catch{return null}}
export default function useBanquet(){
 const [state,dispatch]=useReducer(gameReducer,undefined,()=>newGame(readProgress(storage())))
 const [saved,setSaved]=useState(true),[audioAvailable,setAudioAvailable]=useState(true)
 const audio=useRef(null),played=useRef(null)
 useEffect(()=>{const player=createAudio();audio.current=player;return()=>{player.close();audio.current=null}},[])
 useEffect(()=>{
  const stored=saveProgress(storage(),state.progress)
  // Synchronize the outcome of an external storage write, including quota errors.
  // oxlint-disable-next-line react/set-state-in-effect
  setSaved(stored)
 },[state.progress])
 useEffect(()=>{if(played.current===state.event)return;played.current=state.event;if(state.progress.sound)audio.current?.play(state.event.sound)},[state.event,state.progress.sound])
 useEffect(()=>{
  if(![PHASES.EATING,PHASES.REVEALING].includes(state.phase)||!state.resolution)return
  const {id,token}=state.resolution
  const type=state.phase===PHASES.EATING?'finish-eating':'finish-reveal'
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return startReveal({schedule:(callback,delay)=>window.setTimeout(callback,delay),cancel:timer=>window.clearTimeout(timer),onFinish:()=>dispatch({type,id,token}),delay:reduced?200:state.phase===PHASES.EATING?1800:1200})
 },[state.phase,state.resolution])
 function act(action){
  if(action.type==='sound'&&state.progress.sound)audio.current?.mute()
  else if(state.progress.sound||action.type==='sound'){
   if(audio.current&&!audio.current.unlock()){setAudioAvailable(false);if(action.type==='sound')return}
  }
  let next=action
  if(['start','restart','next-round'].includes(action.type))next={...action,roll:Math.random(),shuffleRolls:Array.from({length:4},()=>Math.random())}
  if(['finish-eating','finish-reveal'].includes(action.type))next={...action,id:state.resolution?.id,token:state.resolution?.token}
  dispatch(next)
 }
 return {state,act,saved,audioAvailable}
}
