export function adaptMastery(previous={tier:0,streak:0,misses:0},correct){
 if(correct){const streak=previous.streak+1;return {tier:Math.min(2,previous.tier+(streak%3===0?1:0)),streak,misses:0}}
 const misses=previous.misses+1
 return {tier:Math.max(0,previous.tier-(misses>=2?1:0)),streak:0,misses}
}
