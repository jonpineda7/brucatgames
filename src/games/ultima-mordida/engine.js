import { getLevel } from './levels.js'
import { cleanProgress, rememberResult } from './progress.js'
import { magnifierClue } from './clues.js'
export function validAssignments(level,assignments){
 const entries=Object.entries(assignments)
 return entries.every(([guest,dish])=>level.guests.includes(guest)&&level.dishes.includes(dish))&&new Set(entries.map(([,dish])=>dish)).size===entries.length
}
export const readyToServe=(level,assignments)=>validAssignments(level,assignments)&&Object.keys(assignments).length===level.guests.length
export function assignDish(level,assignments,dish,guest){
 if(!level.dishes.includes(dish)||!level.guests.includes(guest)||!validAssignments(level,assignments))return assignments
 if(assignments[guest]===dish)return assignments
 const previousOwner=Object.keys(assignments).find(id=>assignments[id]===dish)
 const displaced=assignments[guest]
 const next={...assignments,[guest]:dish}
 if(previousOwner){if(displaced)next[previousOwner]=displaced;else delete next[previousOwner]}
 return next
}
export function exchange(level,assignments,a,b){
 if(a===b||!level.guests.includes(a)||!level.guests.includes(b)||!assignments[a]||!assignments[b])return assignments
 return {...assignments,[a]:assignments[b],[b]:assignments[a]}
}
export const starsFor=helps=>helps===0?3:helps===1?2:1
export function resolveBanquet(level,assignments,shield,helps=0,restarts=0){
 if(!readyToServe(level,assignments))return null
 const affected=Object.keys(assignments).find(id=>assignments[id]===level.enchanted)
 const won=affected===level.villain
 return {won,affected,protected:!won&&affected===shield,stars:won?starsFor(helps):0,score:won?Math.max(100,1000+level.stage*100-helps*150-restarts*25):0}
}
const message=(state,text,sound='spawn')=>({...state,message:text,event:{id:state.event.id+1,sound}})
const history=(state,assignments)=>[...state.history,assignments].slice(-100)
export function newGame(progress){
 const saved=cleanProgress(progress)
 return {phase:'welcome',levelId:1,selectedStage:Math.floor((saved.unlocked-1)/5),assignments:{},selectedDish:null,swapFrom:null,tool:null,history:[],powers:{},helps:0,restarts:0,shield:null,extraClues:[],twistDone:false,lastSwap:null,result:null,showHelp:false,progress:saved,message:'¡El castillo está listo para tu gran idea!',event:{id:0,sound:null}}
}
function withAssignments(state,assignments,text){
 if(assignments===state.assignments)return message(state,'Ese plato ya está en su sitio.')
 return message({...state,assignments,history:history(state,state.assignments),selectedDish:null,swapFrom:null,tool:null,lastSwap:null},text,'hit')
}
export function gameReducer(state,action){
 const level=getLevel(state.levelId)
 switch(action.type){
  case 'welcome':return {...state,phase:'welcome',tool:null,selectedDish:null,showHelp:false}
  case 'help':return {...state,showHelp:!state.showHelp}
  case 'sound':return {...state,progress:{...state.progress,sound:!state.progress.sound}}
  case 'stage':return Number.isInteger(action.stage)&&action.stage>=0&&action.stage<=Math.floor((state.progress.unlocked-1)/5)?{...state,selectedStage:action.stage}:state
  case 'start':{
   if(!Number.isInteger(action.id)||action.id<1||action.id>state.progress.unlocked||action.id>20)return state
   const next=getLevel(action.id)
   return message({...newGame(state.progress),phase:'playing',levelId:next.id,selectedStage:next.stage,powers:{...next.powers},event:state.event},'Lee las pistas, elige un plato y después un invitado.','start')
  }
  case 'cancel-serve':return state.phase==='confirm'?{...state,phase:'playing'}:state
  case 'confirm-serve':return state.phase==='confirm'&&readyToServe(level,state.assignments)?message({...state,phase:'revealing'},'Un bocado… ¡y un poquito de magia!','start'):state
  case 'reveal':{
   if(state.phase!=='revealing')return state
   const result=resolveBanquet(level,state.assignments,state.shield,state.helps,state.restarts)
   if(!result)return {...state,phase:'playing'}
   return message({...state,phase:'result',result,progress:result.won?rememberResult(state.progress,level.id,result):state.progress},result.won?'¡Misterio resuelto! El travieso quedó dentro de una burbuja.':result.protected?'¡El escudo funcionó! Nadie se convirtió en rana. Prueba otro reparto.':'¡Croac! La magia solo dura un ratito. ¡Vamos a intentarlo otra vez!',result.won?'finish':'miss')
  }
  case 'acknowledge-twist':return state.phase==='twist'?message({...state,phase:'playing'},'Viste el cambio: revisa los platos y corrige el reparto antes de servir.','combo'):state
  default:break
 }
 if(state.phase!=='playing'||state.showHelp)return state
 switch(action.type){
  case 'select':return level.dishes.includes(action.dish)?message({...state,selectedDish:state.selectedDish===action.dish?null:action.dish,tool:null,swapFrom:null},'Ahora toca el invitado que recibirá este plato.'):state
  case 'assign':return withAssignments(state,assignDish(level,state.assignments,action.dish,action.guest),'¡Plato entregado! Si ya estaba servido, intercambiamos los dos sin duplicarlos.')
  case 'guest':{
   if(!level.guests.includes(action.guest))return state
   if(state.tool==='shield'){
    if(!state.powers.shield)return state
    return message({...state,shield:action.guest,tool:null,helps:state.helps+1,powers:{...state.powers,shield:state.powers.shield-1}},'Escudo colocado. Protege a un inocente; al travieso no le hace efecto.','combo')
   }
   if(state.tool==='exchange'){
    if(!state.assignments[action.guest])return message(state,'Elige a alguien que ya tenga un plato.')
    if(!state.swapFrom)return message({...state,swapFrom:action.guest},'Elige al segundo invitado para intercambiar.')
    return withAssignments(state,exchange(level,state.assignments,state.swapFrom,action.guest),'¡Intercambio listo!')
   }
   return state.selectedDish?withAssignments(state,assignDish(level,state.assignments,state.selectedDish,action.guest),'¡Qué buena pinta! Puedes seguir cambiando los platos.'):message(state,'Primero elige un plato de la cocina.')
  }
  case 'exchange':return message({...state,tool:state.tool==='exchange'?null:'exchange',swapFrom:null,selectedDish:null},'Elige dos invitados que tengan plato. El intercambio normal es gratis.')
  case 'undo':{
   const assignments=state.history.at(-1)
   return assignments?message({...state,assignments,history:state.history.slice(0,-1),selectedDish:null,tool:null,swapFrom:null,lastSwap:null},'Reparto anterior recuperado. Las ayudas usadas siguen contando.'):state
  }
  case 'restart':return message({...state,assignments:{},selectedDish:null,history:[],tool:null,swapFrom:null,lastSwap:null,restarts:state.restarts+1},'Mesa despejada. Conservas las pistas, el escudo y las ayudas ya utilizadas.','start')
  case 'magnifier':return state.powers.magnifier?message({...state,helps:state.helps+1,extraClues:[...state.extraClues,magnifierClue(level)],powers:{...state.powers,magnifier:state.powers.magnifier-1}},'La lupa confirma una propiedad verdadera de la receta.','combo'):state
  case 'shield':return state.powers.shield?message({...state,tool:state.tool==='shield'?null:'shield',selectedDish:null,swapFrom:null},'Toca a un invitado para protegerlo. El escudo no convierte un reparto incorrecto en victoria.'):state
  case 'magic-swap':{
   if(!state.powers.swap||!readyToServe(level,state.assignments))return message(state,'Reparte todos los platos antes de usar el intercambio mágico.')
   // A paid-in-stars assist, not a random action: it swaps the enchanted dish to the villain.
   const owner=Object.keys(state.assignments).find(id=>state.assignments[id]===level.enchanted)
   const assignments=exchange(level,state.assignments,owner,level.villain)
   return message({...state,assignments,history:history(state,state.assignments),helps:state.helps+1,powers:{...state.powers,swap:state.powers.swap-1},selectedDish:null,tool:null,swapFrom:null},'El intercambio mágico llevó la receta encantada al travieso. Revisa cualquier cambio posterior.','combo')
  }
  case 'request-serve':{
   if(!readyToServe(level,state.assignments))return state
   if(level.twist&&!state.twistDone){
    const assignments=exchange(level,state.assignments,...level.twist)
    return message({...state,phase:'twist',assignments,history:history(state,state.assignments),twistDone:true,lastSwap:level.twist,tool:null,selectedDish:null},'¡Cambia-Platos! El travieso intercambió dos platos a la vista de todos.','trap')
   }
   return {...state,phase:'confirm',selectedDish:null,tool:null,swapFrom:null}
  }
  default:return state
 }
}
