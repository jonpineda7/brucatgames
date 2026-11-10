// Serializable draft operations shared by pointer, keyboard and select controls.
export function addSequence(draft,id,items,requiredCount=items.length){
 const order=Array.isArray(draft)?draft:[]
 return order.length<requiredCount&&items.some(item=>item.id===id)&&!order.includes(id)?[...order,id]:order
}
export function moveSequence(draft,id,index){
 const order=Array.isArray(draft)?draft:[],from=order.indexOf(id)
 if(from<0||!Number.isInteger(index)||index<0||index>=order.length||from===index)return order
 const next=[...order];next.splice(from,1);next.splice(index,0,id);return next
}
export function assignPuzzle(draft,itemId,targetId,items,targets){
 const map=draft&&typeof draft==='object'&&!Array.isArray(draft)?draft:{}
 if(!items.some(item=>item.id===itemId)||!targets.some(target=>target.id===targetId))return map
 const oldTarget=map[itemId],other=Object.keys(map).find(id=>id!==itemId&&map[id]===targetId),next={...map,[itemId]:targetId}
 if(other){if(oldTarget)next[other]=oldTarget;else delete next[other]}
 return next
}
export function draftComplete(puzzle,draft){
 if(puzzle.type==='choice'||!puzzle.type)return puzzle.options.some(option=>option.id===draft)
 if(puzzle.type==='sequence'){const required=puzzle.requiredCount??puzzle.items.length;return Number.isInteger(required)&&required>0&&required<=puzzle.items.length&&Array.isArray(draft)&&draft.length===required&&new Set(draft).size===draft.length&&draft.every(id=>puzzle.items.some(item=>item.id===id))}
 if(puzzle.type==='match'||puzzle.type==='assemble')return !!draft&&typeof draft==='object'&&!Array.isArray(draft)&&Object.keys(draft).length===puzzle.items.length&&new Set(Object.values(draft)).size===puzzle.items.length&&puzzle.items.every(item=>puzzle.targets.some(target=>target.id===draft[item.id]))
 return false
}

export function puzzleDrop(gesture,point,targetId,insideBoard=true){
 if(!gesture||!insideBoard||targetId===undefined||targetId===null||![point?.x,point?.y,gesture.x,gesture.y].every(Number.isFinite))return null
 return Math.hypot(point.x-gesture.x,point.y-gesture.y)>10?{id:gesture.id,target:String(targetId)}:null
}
