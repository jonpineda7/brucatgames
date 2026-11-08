import { useEffect, useRef } from 'react'
export default function BanquetDialog({title,onClose,children,className=''}){
 const ref=useRef(null)
 useEffect(()=>{
  const dialog=ref.current,previous=document.activeElement
  dialog.showModal()
  return()=>{dialog.close();if(previous instanceof HTMLElement&&previous.isConnected)previous.focus({preventScroll:true})}
 },[])
 return <dialog className={`bite-dialog ${className}`} ref={ref} aria-labelledby="bite-dialog-title" onCancel={event=>{event.preventDefault();onClose?.()}}><h2 id="bite-dialog-title">{title}</h2>{children}</dialog>
}
