import { useEffect, useReducer, useRef, useState } from 'react'
import { gameReducer, newGame } from './engine.js'
import { readProgress, saveProgress } from './progress.js'
import { createAudio } from '../gorila-loco/audio.js'
import { startReveal } from './reveal.js'
const storage=()=>{try{return window.localStorage}catch{return null}}
export default function useBanquet(){
 const [state,dispatch]=useReducer(gameReducer,undefined,()=>newGame(readProgress(storage())))
 const [saved,setSaved]=useState(true)
 const [audioAvailable,setAudioAvailable]=useState(true)
 const audio=useRef(null),played=useRef(null)
 useEffect(()=>{const player=createAudio();audio.current=player;return()=>{player.close();audio.current=null}},[])
 useEffect(()=>{
  const stored=saveProgress(storage(),state.progress)
  // Synchronizes the outcome of a browser storage operation, including quota failures.
  // oxlint-disable-next-line react/set-state-in-effect
  setSaved(stored)
 },[state.progress])
 useEffect(()=>{if(played.current===state.event)return;played.current=state.event;if(state.progress.sound)audio.current?.play(state.event.sound)},[state.event,state.progress.sound])
 useEffect(()=>{
  if(state.phase!=='revealing')return
  return startReveal({schedule:(callback,delay)=>window.setTimeout(callback,delay),cancel:id=>window.clearTimeout(id),onFinish:()=>dispatch({type:'reveal'}),delay:window.matchMedia('(prefers-reduced-motion: reduce)').matches?200:1400})
 },[state.phase])
 function act(action){
  if(action.type==='sound'&&state.progress.sound)audio.current?.mute()
  else if(state.progress.sound||action.type==='sound'){
   if(audio.current&&!audio.current.unlock()){setAudioAvailable(false);if(action.type==='sound')return}
  }
  dispatch(action)
 }
 return {state,act,saved,audioAvailable}
}
