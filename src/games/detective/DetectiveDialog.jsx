import { useEffect, useRef } from 'react'
export default function DetectiveDialog({title,children,onClose,className=''}){
 const ref=useRef(null)
 useEffect(()=>{const node=ref.current,previous=document.activeElement;node.showModal();node.querySelector('h2')?.focus();return()=>{node.close();if(previous instanceof HTMLElement&&previous.isConnected)previous.focus({preventScroll:true})}},[])
 return <dialog ref={ref} className={`detective-dialog ${className}`} aria-labelledby="detective-dialog-title" onCancel={event=>{event.preventDefault();onClose?.()}}><h2 id="detective-dialog-title" tabIndex={-1}>{title}</h2>{children}</dialog>
}
