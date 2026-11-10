import { generateProblem } from './math.js'
import { CHALLENGES } from './data.js'
import { adaptMastery } from './difficulty.js'
import { cleanProgress, cleanSettings, cleanRun, statKey, rememberResult } from './progress.js'
export const PHASES=Object.freeze({MENU:'MENU',EXPLORE:'EXPLORE',CHALLENGE:'CHALLENGE',FEEDBACK:'FEEDBACK',MOVING:'MOVING',RESULT:'RESULT',PAUSED:'PAUSED'})
export const starsFor=(errors,helps)=>errors<=1&&helps<=1?3:errors<=5&&helps<=5?2:1
export function initialGame(progress,run=null){return {phase:PHASES.MENU,settings:cleanSettings(progress?.settings),progress:cleanProgress(progress),resumeRun:run,index:0,session:0,transition:0,completed:[],problem:null,history:[],errors:0,helps:0,stageErrors:0,helpLevel:0,draft:'',feedback:null,result:null,event:{id:0,sound:null}}}
const event=(state,sound)=>({...state,event:{id:state.event.id+1,sound}})
const phase=(state,next)=>({...state,phase:next,transition:state.transition+1})
export const emptyStats=()=>({correct:0,errors:0,helps:0,tier:0,streak:0,misses:0})
function problemFor(state,roll){
 const operations=state.settings.operation==='mixed'?state.settings.enabled:[state.settings.operation]
 // A balanced cycle guarantees that mixed runs practice only the enabled operations.
 const op=operations[state.index%operations.length],stats=state.progress.stats[statKey(op,state.settings.difficulty)]||emptyStats()
 return generateProblem({op,difficulty:state.settings.difficulty,level:state.index+1,history:state.history,pedagogy:stats,roll})
}
export function snapshot(state){
 if(state.phase===PHASES.MENU)return state.resumeRun
 if(state.phase===PHASES.RESULT)return null
 const moving=state.phase===PHASES.MOVING,index=state.index+(moving?1:0)
 if(index>=10)return null
 return {world:'jungle',settings:state.settings,index,completed:[...state.completed],errors:state.errors,helps:state.helps,stageErrors:moving?0:state.stageErrors,problem:moving?null:state.problem,helpLevel:moving?0:state.helpLevel,history:state.history,draft:moving?'':state.draft}
}
export function reducer(state,action){
 if(action.session!==undefined&&action.session!==state.session)return state
 switch(action.type){
  case 'settings':{
   if(state.phase!==PHASES.MENU)return state
   const settings=cleanSettings({...state.settings,...action.value})
   return {...state,settings,progress:{...state.progress,settings}}
  }
  case 'sound':{const settings={...state.settings,sound:!state.settings.sound};return {...state,settings,progress:{...state.progress,settings}}}
  case 'start':return event({...initialGame({...state.progress,settings:state.settings}),phase:PHASES.EXPLORE,session:state.session+1,transition:state.transition+1},'start')
  case 'resume-run':{
   if(state.phase!==PHASES.MENU)return state
   const run=cleanRun(state.resumeRun,state.progress)
   return run?{...initialGame(state.progress),...run,session:state.session+1,transition:state.transition+1}:state
  }
  case 'menu':return {...phase(state,PHASES.MENU),session:state.session+1,resumeRun:snapshot(state)}
  case 'pause':return [PHASES.EXPLORE,PHASES.CHALLENGE].includes(state.phase)?{...phase(state,PHASES.PAUSED),pausedPhase:state.phase}:state
  case 'resume':return state.phase===PHASES.PAUSED?phase(state,state.pausedPhase):state
  case 'explore':{
   if(state.phase!==PHASES.EXPLORE)return state
   const problem=problemFor(state,action.roll)
   return event({...phase(state,PHASES.CHALLENGE),problem,history:[...state.history,problem.key].slice(-20),stageErrors:0,helpLevel:0,draft:'',feedback:null},'start')
  }
  case 'draft':return state.phase===PHASES.CHALLENGE&&/^\d{0,4}$/.test(String(action.value))?{...state,draft:String(action.value)}:state
  case 'help':{
   if(state.phase!==PHASES.CHALLENGE||state.helpLevel>=2)return state
   const key=statKey(state.problem.op,state.settings.difficulty),record=state.progress.stats[key]||emptyStats()
   return {...state,helps:state.helps+1,helpLevel:state.helpLevel+1,progress:{...state.progress,stats:{...state.progress.stats,[key]:{...record,helps:record.helps+1}}}}
  }
  case 'answer':{
   if(state.phase!==PHASES.CHALLENGE)return state
   const value=action.value??(state.draft===''?null:Number(state.draft))
   if(!Number.isSafeInteger(value)||value<0||value>2000)return state
   const correct=value===state.problem.answer,key=statKey(state.problem.op,state.settings.difficulty),record=state.progress.stats[key]||emptyStats(),mastery=adaptMastery(record,correct)
   const progress={...state.progress,stats:{...state.progress.stats,[key]:{...record,...mastery,correct:record.correct+(correct?1:0),errors:record.errors+(correct?0:1)}}}
   if(!correct)return event({...phase(state,PHASES.FEEDBACK),progress,errors:state.errors+1,stageErrors:state.stageErrors+1,feedback:{value,correct:false},helpLevel:Math.max(state.helpLevel,state.stageErrors>=1?1:0)},'miss')
   const completed=[...state.completed,CHALLENGES[state.index].id],result=completed.length===10?{stars:starsFor(state.errors,state.helps),errors:state.errors,helps:state.helps,score:1000+starsFor(state.errors,state.helps)*100}:null
   return event({...phase(state,PHASES.MOVING),progress:result?rememberResult(progress,state.settings,result):progress,completed,result,feedback:{value,correct:true}},'hit')
  }
  case 'retry':return state.phase===PHASES.FEEDBACK?{...phase(state,PHASES.CHALLENGE),draft:'',feedback:null}:state
  case 'arrived':{
   if(state.phase!==PHASES.MOVING||action.session!==state.session||action.transition!==state.transition)return state
   if(state.index===9)return event(phase(state,PHASES.RESULT),'finish')
   return event({...phase(state,PHASES.EXPLORE),index:state.index+1,problem:null,stageErrors:0,helpLevel:0,draft:''},'combo')
  }
  default:return state
 }
}
