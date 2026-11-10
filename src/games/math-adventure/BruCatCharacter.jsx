import { useEffect,useRef,useState } from 'react'
import { advanceAnimation,triggerAnimation,neutral,framePosition } from './characterAnimation.js'
import './BruCatCharacter.css'
const base=import.meta.env.BASE_URL
const sprite=`${base}games/math-adventure/character/brucat-math-sprites.png`
const fallback=`${base}games/math-adventure/character/brucat-math-explorer.png`
/** Fixed square viewport. Animation is presentation only; it never dispatches game actions. */
export default function BruCatCharacter({celebrating=false,helpCount=0,errorCount=0,paused=false,poseFrame=null,spriteSrc=sprite}){
 const model=useRef(neutral()),seen=useRef({celebrating:false,helpCount,errorCount})
 const [frame,setFrame]=useState(0),[ready,setReady]=useState(false),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)
 useEffect(()=>{
  let live=true;const image=new Image();image.onload=()=>{if(live)setReady(image.naturalWidth===1448&&image.naturalHeight===1086)};image.onerror=()=>{if(live)setReady(false)};image.src=spriteSrc
  return()=>{live=false;image.onload=null;image.onerror=null}
 },[spriteSrc])
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[])
 useEffect(()=>{
  const old=seen.current
  // Correct answers win over simultaneous help; counters are consumed only once.
  if(reduced)model.current=neutral()
  else if(celebrating&&!old.celebrating)model.current=triggerAnimation(model.current,'celebrate')
  else if(errorCount!==old.errorCount)model.current=triggerAnimation(model.current,'neutral')
  else if(helpCount!==old.helpCount)model.current=triggerAnimation(model.current,'help')
  seen.current={celebrating,helpCount,errorCount}
 },[celebrating,helpCount,errorCount,reduced])
 useEffect(()=>{
  if(paused||reduced||!ready)return
  const timer=setInterval(()=>{model.current=advanceAnimation(model.current,50);setFrame(model.current.frame)},50)
  return()=>clearInterval(timer)
 },[paused,reduced,ready])
 return <span className="brucat-sprite" role="img" aria-label="BruCat explorador con su cuaderno de matemáticas" data-frame={reduced?0:poseFrame??frame} data-paused={paused||reduced}>
  {ready?<span className="brucat-sprite-frame" style={{backgroundImage:`url("${spriteSrc}")`,backgroundPosition:framePosition(reduced?0:poseFrame??frame)}}/>:<img src={fallback} alt="" width="1135" height="1399" draggable={false}/>}
 </span>
}
