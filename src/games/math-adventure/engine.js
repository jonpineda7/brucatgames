import { ZONES, effectivePhase, isAnswering } from './journey.js'
import { BOSSES, damageBoss } from './bosses.js'
import { generateProblem } from './math.js'
import { CHALLENGES } from './data.js'
import { adaptMastery } from './difficulty.js'
import { cleanProgress, cleanSettings, cleanRun, statKey, rememberResult } from './progress.js'
export const PHASES=Object.freeze({MENU:'MENU',EXPLORE:'EXPLORE',OBSTACLE:'OBSTACLE',OBSTACLE_RESOLVING:'OBSTACLE_RESOLVING',ARENA_MOVING:'ARENA_MOVING',BOSS_INTRO:'BOSS_INTRO',CHALLENGE:'CHALLENGE',FEEDBACK:'FEEDBACK',MOVING:'MOVING',RESOLVING:'RESOLVING',IMPACT:'IMPACT',VICTORY:'VICTORY',RESULT:'RESULT',PAUSED:'PAUSED'})
export const starsFor=(errors)=>errors<=1?3:errors<=5?2:1
export function initialGame(progress,run=null){return {phase:PHASES.MENU,settings:cleanSettings(progress?.settings),progress:cleanProgress(progress),resumeRun:run,index:0,obstacleIndex:0,cameraMove:false,nextProblem:null,retryPhase:null,bossEnergy:BOSSES[0].maxEnergy,session:0,transition:0,completed:[],problem:null,history:[],errors:0,helps:0,stageErrors:0,helpLevel:0,draft:'',feedback:null,result:null,event:{id:0,sound:null}}}
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
 const current=effectivePhase(state)
 const routePending=[PHASES.OBSTACLE_RESOLVING,PHASES.MOVING,PHASES.ARENA_MOVING].includes(current)
 const combatPending=[PHASES.RESOLVING,PHASES.IMPACT].includes(current)
 const obstacleIndex=state.obstacleIndex+(routePending?1:0)
 const victorious=current===PHASES.VICTORY||combatPending&&state.bossEnergy===0
 const completed=victorious?CHALLENGES.slice(0,state.index+1).map(zone=>zone.id):[...state.completed]
 const stage=victorious?'VICTORY':routePending?(obstacleIndex===3?'BOSS_INTRO':'OBSTACLE'):current===PHASES.EXPLORE?'INTRO':current===PHASES.BOSS_INTRO?'BOSS_INTRO':obstacleIndex<3?'OBSTACLE':'COMBAT'
 return {world:'jungle',version:3,stage,settings:state.settings,index:state.index,obstacleIndex,obstaclesCompleted:ZONES[state.index].obstacles.slice(0,obstacleIndex).map(item=>item.id),bossId:BOSSES[state.index].id,bossEnergy:state.bossEnergy,completed,errors:state.errors,helps:state.helps,stageErrors:routePending||combatPending?0:state.stageErrors,problem:['OBSTACLE','COMBAT'].includes(stage)?(routePending||combatPending?state.nextProblem:state.problem):null,helpLevel:routePending||combatPending?0:state.helpLevel,history:routePending||combatPending?(state.nextProblem?[...state.history,state.nextProblem.key].slice(-20):state.history):state.history,draft:routePending||combatPending?'0':state.draft}
}
const question=(state,problem)=>({...state,problem,nextProblem:null,history:[...state.history,problem.key].slice(-20),stageErrors:0,helpLevel:0,draft:'0',feedback:null})

export function reducer(state,action){
 if(action.session!==undefined&&action.session!==state.session)return state
 switch(action.type){
  case 'settings':{
   if(state.phase!==PHASES.MENU)return state
   const settings=cleanSettings({...state.settings,...action.value})
   return {...state,settings,progress:{...state.progress,settings}}
  }
  case 'sound':{const settings={...state.settings,sound:!state.settings.sound};return {...state,settings,progress:{...state.progress,settings}}}
  case 'play':{
   const started=reducer(state,{type:'start',session:state.session})
   return reducer(started,{type:'explore',session:started.session,roll:action.roll})
  }
  case 'start':return event({...initialGame({...state.progress,settings:state.settings}),phase:PHASES.EXPLORE,session:state.session+1,transition:state.transition+1},'start')
  case 'resume-run':{
   if(state.phase!==PHASES.MENU)return state
   const run=cleanRun(state.resumeRun,state.progress)
   return run?{...initialGame(state.progress),...run,progress:run.result?rememberResult(state.progress,run.settings,run.result):state.progress,session:state.session+1,transition:state.transition+1}:state
  }
  case 'menu':return {...phase(state,PHASES.MENU),session:state.session+1,resumeRun:snapshot(state)}
  case 'pause':return [PHASES.EXPLORE,PHASES.OBSTACLE,PHASES.OBSTACLE_RESOLVING,PHASES.MOVING,PHASES.ARENA_MOVING,PHASES.BOSS_INTRO,PHASES.CHALLENGE,PHASES.FEEDBACK,PHASES.RESOLVING,PHASES.IMPACT,PHASES.VICTORY].includes(state.phase)?{...phase(state,PHASES.PAUSED),pausedPhase:state.phase}:state
  case 'resume':return state.phase===PHASES.PAUSED?phase(state,state.pausedPhase):state
  case 'explore':{
   if(state.phase!==PHASES.EXPLORE)return state
   const problem=problemFor(state,action.roll)
   return event(question(phase(state,PHASES.OBSTACLE),problem),'start')
  }
  case 'draft':return isAnswering(state)&&/^\d{0,4}$/.test(String(action.value))?{...state,draft:String(action.value)}:state
  case 'help':{
   if(!isAnswering(state)||state.helpLevel>=2)return state
   const key=statKey(state.problem.op,state.settings.difficulty),record=state.progress.stats[key]||emptyStats()
   return {...state,helps:state.helps+1,helpLevel:state.helpLevel+1,progress:{...state.progress,stats:{...state.progress.stats,[key]:{...record,helps:record.helps+1}}}}
  }
  case 'answer':{
   if(!isAnswering(state))return state
   const value=action.value??(state.draft===''?null:Number(state.draft))
   if(!Number.isSafeInteger(value)||value<0||value>2000)return state
   const correct=value===state.problem.answer,key=statKey(state.problem.op,state.settings.difficulty),record=state.progress.stats[key]||emptyStats(),mastery=adaptMastery(record,correct)
   const progress={...state.progress,stats:{...state.progress.stats,[key]:{...record,...mastery,correct:record.correct+(correct?1:0),errors:record.errors+(correct?0:1)}}}
   if(!correct)return event({...phase(state,PHASES.FEEDBACK),progress,retryPhase:state.phase,errors:state.errors+1,stageErrors:state.stageErrors+1,feedback:{value,correct:false},helpLevel:Math.max(state.helpLevel,state.stageErrors>=1?1:0)},'miss')
   if(state.phase===PHASES.OBSTACLE){
    const nextProblem=state.obstacleIndex<2?problemFor({...state,progress},action.roll):null
    return event({...phase(state,PHASES.OBSTACLE_RESOLVING),progress,nextProblem,feedback:{value,correct:true}},'hit')
   }
   const bossEnergy=damageBoss(state.bossEnergy,BOSSES[state.index]),nextProblem=bossEnergy>0?problemFor({...state,progress},action.roll):null
   return event({...phase(state,PHASES.RESOLVING),progress,bossEnergy,nextProblem,feedback:{value,correct:true},draft:'0'},'hit')
  }
  case 'obstacle-resolved':return state.phase===PHASES.OBSTACLE_RESOLVING&&action.transition===state.transition?phase(state,state.obstacleIndex===2?PHASES.ARENA_MOVING:PHASES.MOVING):state
  case 'arrived':{
   if(![PHASES.MOVING,PHASES.ARENA_MOVING].includes(state.phase)||action.transition!==state.transition)return state
   const obstacleIndex=state.obstacleIndex+1
   return obstacleIndex===3?event({...phase(state,PHASES.BOSS_INTRO),obstacleIndex,problem:null,nextProblem:null,feedback:null},'combo'):question({...phase(state,PHASES.OBSTACLE),obstacleIndex,cameraMove:true},state.nextProblem)
  }
  case 'fight':return state.phase===PHASES.BOSS_INTRO?event(question(phase(state,PHASES.CHALLENGE),problemFor(state,action.roll)),'start'):state

  case 'resolved':return state.phase===PHASES.RESOLVING&&action.transition===state.transition?phase(state,PHASES.IMPACT):state
  case 'impact-ended':{
   if(state.phase!==PHASES.IMPACT||action.transition!==state.transition)return state
   if(state.bossEnergy>0)return question(phase(state,PHASES.CHALLENGE),state.nextProblem)
   const completed=[...state.completed,CHALLENGES[state.index].id],result=completed.length===10?{stars:starsFor(state.errors,state.helps),errors:state.errors,helps:state.helps,score:1000+starsFor(state.errors,state.helps)*100}:null
   return event({...phase(state,PHASES.VICTORY),completed,result,progress:result?rememberResult(state.progress,state.settings,result):state.progress},'combo')
  }

  case 'retry':return state.phase===PHASES.FEEDBACK?{...phase(state,state.retryPhase),draft:'0',feedback:null}:state
  case 'next-zone':{
   if(state.phase!==PHASES.VICTORY)return state
   if(state.index===9)return event(phase(state,PHASES.RESULT),'finish')
   return event({...phase(state,PHASES.EXPLORE),index:state.index+1,obstacleIndex:0,cameraMove:false,nextProblem:null,bossEnergy:BOSSES[state.index+1].maxEnergy,problem:null,stageErrors:0,helpLevel:0,draft:''},'combo')
  }
  default:return state
 }
}
