export const SEQUENCES=Object.freeze({
 blink:[[0,100],[1,120],[2,100],[3,120],[0,100]],
 celebrate:[[4,180],[5,280],[6,180],[7,180]],
 help:[[8,140],[9,180],[10,750],[11,180]],
})
export const neutral=()=>({mode:'idle',elapsed:0,frame:0})
export function triggerAnimation(state,mode){
 if(mode==='neutral')return neutral()
 if(!SEQUENCES[mode]||state.mode==='celebrate'||state.mode===mode)return state
 return {mode,elapsed:0,frame:SEQUENCES[mode][0][0]}
}
export function advanceAnimation(state,delta,{paused=false,reduced=false}={}){
 if(reduced)return neutral()
 if(paused)return state
 const elapsed=state.elapsed+Math.max(0,delta)
 if(state.mode==='idle')return elapsed>=5000?triggerAnimation(neutral(),'blink'):{...state,elapsed}
 let end=0
 for(const [frame,duration]of SEQUENCES[state.mode]){end+=duration;if(elapsed<end)return {...state,elapsed,frame}}
 return neutral()
}
export const framePosition=frame=>`${(frame%4)*100/3}% ${Math.floor(frame/4)*50}%`
