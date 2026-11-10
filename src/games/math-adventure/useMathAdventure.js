import { useEffect, useReducer, useRef, useState } from 'react'
import { reducer, initialGame, PHASES, snapshot } from './engine.js'
import { loadGame, saveGame } from './progress.js'
import { createAudio } from '../gorila-loco/audio.js'
const storage=()=>{try{return window.localStorage}catch{return null}}
export default function useMathAdventure(){
 const [state,dispatch]=useReducer(reducer,undefined,()=>{const {progress,run}=loadGame(storage());return initialGame(progress,run)})
 const [saved,setSaved]=useState(true),[audioAvailable,setAudioAvailable]=useState(true),audio=useRef(null),played=useRef(null)
 const active=JSON.stringify(snapshot(state))
 useEffect(()=>{const player=createAudio();audio.current=player;return()=>{player.close();audio.current=null}},[])
 useEffect(()=>{const ok=saveGame(storage(),state.progress,JSON.parse(active));
  // Synchronize external browser storage failure without blocking the game.
  // oxlint-disable-next-line react/set-state-in-effect
  setSaved(ok)
 },[state.progress,active])
 useEffect(()=>{if(played.current===state.event)return;played.current=state.event;if(state.settings.sound)audio.current?.play(state.event.sound)},[state.event,state.settings.sound])
 useEffect(()=>{if(state.phase!==PHASES.MOVING)return;const session=state.session,transition=state.transition;const timer=setTimeout(()=>dispatch({type:'arrived',session,transition}),matchMedia('(prefers-reduced-motion: reduce)').matches?120:900);return()=>clearTimeout(timer)},[state.phase,state.session,state.transition])
 useEffect(()=>{const session=state.session;const pause=()=>{if(document.hidden)dispatch({type:'pause',session})};const escape=event=>{if(event.key==='Escape')dispatch({type:'pause',session})};document.addEventListener('visibilitychange',pause);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('visibilitychange',pause);document.removeEventListener('keydown',escape)}},[state.session])
 function act(action){if(action.type==='sound'&&state.settings.sound)audio.current?.mute();else if((state.settings.sound||action.type==='sound')&&audio.current&&!audio.current.unlock()){setAudioAvailable(false);if(action.type==='sound')return}dispatch({...action,session:state.session,...(action.type==='explore'?{roll:Math.random()}:{})})}
 return {state,act,saved,audioAvailable}
}
