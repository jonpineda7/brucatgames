import { draftComplete } from './puzzleInteraction.js'
export { draftComplete } from './puzzleInteraction.js'
// The answer comes from the confirmed placement, never from a random answer roll.
export function buildPuzzle(level,objects){
 if(level.id!==1)return structuredClone(level.puzzle)
 const crown=objects.find(object=>object.kind==='crown')
 if(!crown)return level.riddle
 const zones=level.sceneConfig.zones
 const candidates=['chest','frontBooks','chair','window'].filter(id=>id!==crown.zoneId)
 const choices=[crown.zoneId,...candidates.slice(0,2)]
 const offset=level.sceneConfig.distributions.findIndex(layout=>layout.slots.crown===crown.zoneId)%3
 const options=choices.slice(offset).concat(choices.slice(0,offset)).map(id=>({id,label:zones[id].name,symbol:id==='window'?'▥':id==='chair'?'♧':id==='chest'?'▣':'▤'}))
 return {type:'choice',question:'¿Dónde estaba escondida la corona?',clue:'Recuerda el lugar donde recogiste la corona. Si lo necesitas, consulta tus pruebas.',options,answer:crown.zoneId,evidence:`En tu cuaderno anotaste: la corona estaba ${crown.locationShort}.`,feedback:'La respuesta debe coincidir con el lugar donde apareció la corona. Tus cinco pruebas siguen reunidas.',explanation:`¡Misterio resuelto! La corona estaba ${crown.locationShort}. BruCat la había dejado allí mientras preparaba la fiesta del castillo. ¡No había desaparecido: solo había cambiado de lugar! En el cofre hay una invitación para buscar un libro secreto en la biblioteca antigua.`}
}
/** Pure puzzle contracts shared by the reducer, persistence, UI and content validation. */
export const stagePuzzle=(puzzle,stage=0)=>puzzle?.type==='multi'?puzzle.stages[stage]:puzzle
export const puzzleStages=puzzle=>puzzle?.type==='multi'?puzzle.stages.length:1
export function emptyDraft(puzzle){
 if(puzzle?.type==='sequence')return []
 if(['match','assemble'].includes(puzzle?.type))return {}
 return null
}
export function cleanDraft(puzzle,value){
 if(!puzzle)return null
 if(puzzle.type==='choice')return value===null||puzzle.options.some(option=>option.id===value)?value:null
 if(puzzle.type==='sequence'){
  if(!Array.isArray(value)||new Set(value).size!==value.length||value.some(id=>!puzzle.items.some(item=>item.id===id)))return []
  return [...value]
 }
 if(['match','assemble'].includes(puzzle.type)){
  if(!value||typeof value!=='object'||Array.isArray(value))return {}
  const entries=Object.entries(value)
  if(new Set(entries.map(([,target])=>target)).size!==entries.length||entries.some(([id,target])=>!puzzle.items.some(item=>item.id===id)||!puzzle.targets.some(slot=>slot.id===target)))return {}
  return Object.fromEntries(entries)
 }
 return null
}
export function puzzleAnswer(puzzle,value){
 if(!draftComplete(puzzle,value))return null
 const draft=cleanDraft(puzzle,value)
 if(puzzle.type==='choice'||!puzzle.type)return draft===puzzle.answer
 if(puzzle.type==='sequence')return draft.every((id,index)=>id===puzzle.answer[index])
 return puzzle.items.every(item=>draft[item.id]===puzzle.answer[item.id])
}
export function validatePuzzle(puzzle){
 if(!puzzle||!puzzle.question||!puzzle.clue||!puzzle.evidence||!puzzle.explanation)return false
 if(puzzle.type==='multi')return puzzle.stages.length>=2&&puzzle.stages.every(validatePuzzle)
 if(puzzle.type==='choice')return puzzle.options.length>=3&&new Set(puzzle.options.map(item=>item.id)).size===puzzle.options.length&&puzzleAnswer(puzzle,puzzle.answer)===true
 if(!['sequence','match','assemble'].includes(puzzle.type)||!puzzle.items?.length||new Set(puzzle.items.map(item=>item.id)).size!==puzzle.items.length)return false
 if(puzzle.type!=='sequence'&&(!puzzle.targets||puzzle.targets.length!==puzzle.items.length||new Set(puzzle.targets.map(item=>item.id)).size!==puzzle.targets.length))return false
 return puzzleAnswer(puzzle,puzzle.answer)===true
}
