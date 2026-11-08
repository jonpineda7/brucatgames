export function startReveal({schedule,cancel,onFinish,delay=1400}){
 let stopped=false
 const timer=schedule(()=>{if(!stopped){stopped=true;onFinish()}},delay)
 return ()=>{stopped=true;cancel(timer)}
}
