export const AUTO_TRANSITIONS={ALL_OBJECTS_FOUND:{type:'finish-discovery',delay:1100},CASE_SOLVED:{type:'show-result',delay:1400},NEXT_CASE:{type:'begin-next-case',delay:150}}
export function scheduleTransition({schedule,cancel,finish,delay}){
 let active=true
 const timer=schedule(()=>{if(active){active=false;finish()}},delay)
 return ()=>{active=false;cancel(timer)}
}
