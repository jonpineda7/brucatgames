import { CHARACTERS, VILLAIN_ID } from './data.js'
import { getLevel } from './levels.js'
import { createRound } from './rounds.js'
import { cleanProgress, rememberResult } from './progress.js'
export const PHASES=Object.freeze({READY:'READY',SELECTING:'SELECTING',EATING:'EATING',REVEALING:'REVEALING',ROUND_END:'ROUND_END',VICTORY:'VICTORY',GAME_OVER:'GAME_OVER'})
export const activeParticipants=state=>CHARACTERS.filter(character=>state.characters[character.id]==='active')
export const survivingInnocents=state=>activeParticipants(state).filter(character=>character.innocent)
export const heartsLeft=state=>survivingInnocents(state).length
export const dishAvailable=(state,dishId)=>!!state.round&&state.round.dishes.includes(dishId)
export const guestAvailable=(state,guestId)=>!!state.round&&state.characters[guestId]==='active'
export function validRoundAssignments(state){
 if(!state.round)return true
 const characters=state.resolution?.beforeCharacters||state.characters
 const entries=Object.entries(state.round.assignments)
 return new Set(entries.map(([,dish])=>dish)).size===entries.length&&entries.every(([guest,dish])=>characters[guest]==='active'&&state.round.dishes.includes(dish))
}
export const readyToEat=state=>state.phase===PHASES.SELECTING&&!state.showHelp&&validRoundAssignments(state)&&Object.keys(state.round.assignments).length===activeParticipants(state).length
export const starsFor=survivors=>survivors===4?3:survivors===3?2:survivors>0?1:0
export function resolveDelivery(poisonedDish,dishId,guestId){
 if(dishId!==poisonedDish)return 'safe'
 return guestId===VILLAIN_ID?'villain-defeated':'innocent-poisoned'
}
// Called only after the full draft is confirmed. Animation never evaluates food.
export function resolveRound(state){
 const assignments=Object.freeze({...state.round.assignments})
 const participants=activeParticipants(state).map(character=>character.id)
 const outcomes=Object.freeze(Object.fromEntries(participants.map(guest=>[guest,resolveDelivery(state.round.poisonedDish,assignments[guest],guest)])))
 const poisonedGuest=participants.find(guest=>outcomes[guest]!=='safe')
 const characters={...state.characters,[poisonedGuest]:poisonedGuest===VILLAIN_ID?'defeated':'poisoned'}
 const after=poisonedGuest===VILLAIN_ID?PHASES.VICTORY:heartsLeft({characters})===0?PHASES.GAME_OVER:PHASES.ROUND_END
 return Object.freeze({id:state.serial+1,token:state.round.token,round:state.round.number,assignments,participants:Object.freeze(participants),beforeCharacters:Object.freeze({...state.characters}),characters:Object.freeze(characters),outcomes,poisonedGuest,safeCount:participants.length-1,after})
}
export function summarize(state,won){
 const survivors=heartsLeft(state),rounds=state.round.number
 return {won,stars:won?starsFor(survivors):0,score:won?500+survivors*250+Math.max(0,100-(rounds-1)*25):0,survivors,rounds,safeServed:state.stats.safeServed,poisonedServed:state.stats.poisonedServed}
}
const initialCharacters=()=>Object.fromEntries(CHARACTERS.map(character=>[character.id,'active']))
const notice=(state,message,sound='spawn')=>({...state,message,event:{id:state.event.id+1,sound}})
export function newGame(progress){
 const saved=cleanProgress(progress)
 return {phase:PHASES.READY,levelId:1,selectedStage:Math.floor((saved.unlocked-1)/5),characters:initialCharacters(),round:null,selectedDish:null,resolution:null,result:null,session:0,serial:0,history:[],stats:{safeServed:0,poisonedServed:0,hintsUsed:0},showHelp:false,progress:saved,message:'¡Cuatro amigos cuentan contigo!',event:{id:0,sound:null}}
}
function beginSession(state,id,action){
 const level=getLevel(id),session=state.session+1
 return notice({...newGame(state.progress),phase:PHASES.SELECTING,levelId:id,selectedStage:level.stage,session,serial:state.serial,round:createRound(level,1,session,action.roll,5,action.shuffleRolls),event:state.event},'Lee las pistas, reparte un plato a cada participante y pulsa “¡A comer!” para descubrir el resultado.','start')
}
function assignDish(state,dishId,guestId){
 if(!dishAvailable(state,dishId)||!guestAvailable(state,guestId))return state
 const assignments={...state.round.assignments},previous=assignments[guestId]
 if(previous===dishId)return {...state,selectedDish:null}
 const owner=Object.keys(assignments).find(guest=>assignments[guest]===dishId)
 // Moving an assigned dish swaps plates if both recipients already have one.
 if(owner){if(previous)assignments[owner]=previous;else delete assignments[owner]}
 assignments[guestId]=dishId
 return notice({...state,round:{...state.round,assignments},selectedDish:null},owner&&previous?'Platos intercambiados. Puedes seguir cambiando el reparto.':'Plato asignado. Puedes retirarlo o cambiarlo antes de pulsar «¡A comer!».')
}
export function gameReducer(state,action){
 switch(action.type){
  case 'sound':return {...state,progress:{...state.progress,sound:!state.progress.sound}}
  case 'help':return [PHASES.EATING,PHASES.REVEALING].includes(state.phase)?state:{...state,showHelp:!state.showHelp}
  // Reset/level changes are allowed during presentation; tokens invalidate old timers.
  case 'welcome':return {...state,phase:PHASES.READY,selectedDish:null,showHelp:false}
  case 'stage':return state.phase===PHASES.READY&&Number.isInteger(action.stage)&&action.stage>=0&&action.stage<=Math.floor((state.progress.unlocked-1)/5)?{...state,selectedStage:action.stage}:state
  case 'start':return Number.isInteger(action.id)&&action.id>=1&&action.id<=Math.min(20,state.progress.unlocked)?beginSession(state,action.id,action):state
  case 'restart':return beginSession(state,state.levelId,action)
  case 'eat':{
   if(!readyToEat(state))return state
   const resolution=resolveRound(state)
   const stats={safeServed:state.stats.safeServed+resolution.safeCount,poisonedServed:state.stats.poisonedServed+1,hintsUsed:state.stats.hintsUsed+(state.round.hintUsed?1:0)}
   const next={...state,characters:resolution.characters,stats,resolution,serial:resolution.id,selectedDish:null,phase:PHASES.EATING}
   const result=[PHASES.VICTORY,PHASES.GAME_OVER].includes(resolution.after)?summarize(next,resolution.after===PHASES.VICTORY):null
   return notice({...next,result,history:[...state.history,resolution].slice(-4),progress:result?.won?rememberResult(state.progress,state.levelId,result):state.progress},'¡Todos a comer! El reparto está cerrado.','hit')
  }
  case 'finish-eating':return state.phase===PHASES.EATING&&action.id===state.resolution?.id&&action.token===state.resolution?.token?notice({...state,phase:PHASES.REVEALING},state.resolution.after===PHASES.VICTORY?'¡El cocodrilo recibió el plato envenenado!':`Un amigo queda mareado. Pierdes exactamente una oportunidad.`,state.resolution.after===PHASES.VICTORY?'finish':'miss'):state
  case 'finish-reveal':return state.phase===PHASES.REVEALING&&action.id===state.resolution?.id&&action.token===state.resolution?.token?{...state,phase:state.resolution.after}:state
  case 'next-round':return state.phase===PHASES.ROUND_END?notice({...state,phase:PHASES.SELECTING,round:createRound(getLevel(state.levelId),state.round.number+1,state.session,action.roll,activeParticipants(state).length,action.shuffleRolls),selectedDish:null,resolution:null},'Nuevo reparto: un plato por participante activo, nuevas pistas y un solo plato envenenado.','start'):state
  default:break
 }
 if(state.phase!==PHASES.SELECTING||state.showHelp)return state
 switch(action.type){
  case 'select':return dishAvailable(state,action.dish)?notice({...state,selectedDish:state.selectedDish===action.dish?null:action.dish},'Elige a quién servir. Si ambos tienen plato, se intercambian.'):state
  case 'guest':return state.selectedDish?assignDish(state,state.selectedDish,action.guest):state
  case 'assign':return assignDish(state,action.dish,action.guest)
  case 'remove-assignment':{
   if(!guestAvailable(state,action.guest)||!state.round.assignments[action.guest])return state
   const assignments={...state.round.assignments};delete assignments[action.guest]
   return notice({...state,round:{...state.round,assignments}},'Plato retirado. Puedes repartirlo de nuevo.')
  }
  case 'clear-selection':return {...state,selectedDish:null}
  case 'hint':return !state.round.hintUsed?notice({...state,round:{...state.round,hintUsed:true,hintRevealed:true}},'La lupa ha revelado el plato envenenado. Repartir no consume oportunidades.','combo'):state
  default:return state
 }
}
