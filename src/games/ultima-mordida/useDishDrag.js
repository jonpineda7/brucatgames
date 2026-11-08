import { useRef, useState } from 'react'
export default function useDishDrag(act,enabled){
 const pointer=useRef(null),suppressUntil=useRef(0)
 const [ghost,setGhost]=useState(null)
 function finish(event,cancelled=false){
  const current=pointer.current
  if(!current||current.id!==event.pointerId)return
  pointer.current=null
  if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)
  if(current.moved){
   suppressUntil.current=performance.now()+300
   if(!cancelled){
    const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-bite-guest]')
    if(target)act({type:'assign',dish:current.dish,guest:target.dataset.biteGuest})
   }
  }
  setGhost(null)
 }
 function handlers(dish){return {
  onClick:()=>{if(performance.now()>=suppressUntil.current)act({type:'select',dish})},
  onPointerDown:event=>{
   if(!enabled||event.button!==0||pointer.current)return
   pointer.current={id:event.pointerId,dish,x:event.clientX,y:event.clientY,moved:false}
   event.currentTarget.setPointerCapture(event.pointerId)
  },
  onPointerMove:event=>{
   const current=pointer.current
   if(!current||current.id!==event.pointerId)return
   if(Math.hypot(event.clientX-current.x,event.clientY-current.y)>8)current.moved=true
   if(current.moved)setGhost({dish,x:event.clientX,y:event.clientY})
  },
  onPointerUp:event=>finish(event),
  onPointerCancel:event=>finish(event,true),
  onLostPointerCapture:event=>{if(pointer.current?.id===event.pointerId){pointer.current=null;setGhost(null)}},
 }}
 return {handlers,ghost}
}
