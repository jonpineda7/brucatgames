import { objectName } from './evidence.js'
import { useRef } from 'react'
import { OBJECTS } from './objects.js'
import { cameraBox, objectAnchor, screenToScene } from './geometry.js'
import { ObjectVisual } from './ObjectArt.jsx'
import { objectTransform } from './placements.js'
import { PHASES } from './engine.js'
const base=import.meta.env.BASE_URL
export default function DetectiveScene({state,level,act,onImageError,onImageReady}){
 const svg=useRef(null),gesture=useRef(null)
 const box=cameraBox(state.camera),interactive=state.phase===PHASES.SEARCHING
 const debug=import.meta.env.DEV&&new URLSearchParams(window.location.search).get('detectiveDebug')==='1'
 function down(event){
  if(!interactive||event.button!==0||event.isPrimary===false||gesture.current)return
  gesture.current={id:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,moved:false,session:state.session}
  event.currentTarget.setPointerCapture(event.pointerId)
 }
 function move(event){
  const gestureState=gesture.current
  if(!gestureState||gestureState.id!==event.pointerId||gestureState.session!==state.session)return
  if(Math.hypot(event.clientX-gestureState.startX,event.clientY-gestureState.startY)>7)gestureState.moved=true
  if(gestureState.moved&&state.camera.zoom>1)act({type:'pan',dx:event.clientX-gestureState.x,dy:event.clientY-gestureState.y,rect:svg.current.getBoundingClientRect()})
  gestureState.x=event.clientX;gestureState.y=event.clientY
 }
 function finish(event,cancelled=false){
  const current=gesture.current
  if(!current||current.id!==event.pointerId)return
  gesture.current=null
  if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)
  if(!cancelled&&!current.moved&&interactive&&current.session===state.session)act({type:'point',point:screenToScene(event.clientX,event.clientY,svg.current.getBoundingClientRect(),state.camera)})
 }
 function keyboard(event,object){
  if(!interactive)return
  if(event.key==='Enter'||event.key===' '){event.preventDefault();act({type:'find',id:object.id})}
 }
 function focusObject(object){
  if(state.camera.zoom>1&&!state.hint)act({type:'center'})
  const node=svg.current?.querySelector(`[data-object="${object.id}"]`)
  node?.focus({preventScroll:true})
 }
 return <div className="detective-scene-frame"><svg ref={svg} data-placement-id={state.placementId} className={`detective-scene ${state.camera.zoom>1?'is-zoomed':''}`} viewBox={`${box.x*1000} ${box.y*1000} ${box.size*1000} ${box.size*1000}`} role="group" aria-label={`${level.sceneTitle||'Biblioteca del castillo'}. Usa Tab para explorar los objetos y Enter o espacio para recoger el enfocado.`} onPointerDown={down} onPointerMove={move} onPointerUp={event=>finish(event)} onPointerCancel={event=>finish(event,true)} onLostPointerCapture={()=>{gesture.current=null}}>
  <defs><filter id="detective-shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="1.5" dy="3" stdDeviation="2.2" floodColor="#392119" floodOpacity=".65"/></filter></defs>
  <image href={`${base}${level.scene}`} x="0" y="0" width="1000" height="1000" onLoad={onImageReady} onError={onImageError}/>
  {level.objects.map(object=>{
   const found=state.found.includes(object.id),anchor=objectAnchor(object)
   return <g key={object.id} className={`detective-scene-object ${found?'is-found':''}`} role="button" tabIndex={interactive&&!found?0:-1} aria-disabled={!interactive||found} aria-label={`${objectName(object)}${found?', encontrado':', pulsa Enter para recoger'}`} onKeyDown={event=>keyboard(event,object)} onClick={event=>{if(event.detail===0&&interactive)act({type:'find',id:object.id})}} onFocus={event=>{if(event.currentTarget.matches(':focus-visible')&&state.camera.zoom>1&&!state.hint)act({type:'center'})}} data-object={object.id}>
    <g transform={objectTransform(object)} filter="url(#detective-shadow)"><ObjectVisual object={object}/>{debug&&OBJECTS[object.kind].regions.map((region,index)=>region.type==='circle'?<circle key={index} {...{cx:region.cx,cy:region.cy,r:region.r}} fill="none" stroke="#ff166b" strokeWidth="1.5"/>:<polygon key={index} points={region.points.map(point=>point.join(',')).join(' ')} fill="none" stroke="#ff166b" strokeWidth="1.5"/>)}</g>
    <circle className="detective-object-focus" cx={anchor.x*1000} cy={anchor.y*1000} r={object.size*430} fill="none" stroke="#ffe87a" strokeWidth="4" pointerEvents="none"/>
    {found&&<g className="detective-discovery" pointerEvents="none"><circle cx={anchor.x*1000} cy={anchor.y*1000} r={object.size*400} fill="#ffe98c18" stroke="#ffe98c" strokeWidth="2"/><text x={anchor.x*1000} y={anchor.y*1000+6} textAnchor="middle" fill="#fffbd6" stroke="#403046" strokeWidth="1" fontSize="26">✓</text></g>}
   </g>
  })}
  {state.hint&&state.hint.kind!=='description'&&(()=>{const object=level.objects.find(item=>item.id===state.hint.target),anchor=objectAnchor(object);return <circle className="detective-hint-ring" cx={anchor.x*1000} cy={anchor.y*1000} r={object.size*610} fill="none" stroke="#fff3a8" strokeWidth="6" pointerEvents="none"/>})()}
 </svg><span className="detective-scene-caption" aria-hidden="true">{level.sceneTitle||'El castillo misterioso'} <span>✦</span></span>
 {state.camera.zoom>1&&<p className="detective-pan-note">Arrastra para explorar · Usa las flechas de desplazamiento si lo prefieres</p>}
 <details className="detective-guided"><summary>Ayuda para explorar con teclado</summary><p>Tab resalta cada objeto visible; Enter o espacio lo recoge. También puedes enfocar uno desde esta lista. No añade pistas ni penalizaciones.</p><div>{level.objects.filter(object=>!state.found.includes(object.id)).map(object=><button key={object.id} onClick={()=>focusObject(object)}>Enfocar {objectName(object).toLowerCase()}</button>)}</div></details>
 </div>
}
