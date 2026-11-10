import { ZONES } from './journey.js'
import { BOSSES } from './bosses.js'
import { OPERATIONS, DIFFICULTIES, validProblem, explain } from './math.js'
import { CHALLENGES } from './data.js'
export const STORAGE_KEY='brucatgames:math-adventure:v1'
const integer=(n,max=1000000)=>Number.isInteger(n)&&n>=0&&n<=max
export function cleanSettings(value={}){
 value=value&&typeof value==='object'?value:{}
 const enabled=Array.isArray(value.enabled)?[...new Set(value.enabled)].filter(op=>OPERATIONS[op]):Object.keys(OPERATIONS)
 return {difficulty:DIFFICULTIES[value.difficulty]?value.difficulty:'novato',operation:OPERATIONS[value.operation]||value.operation==='mixed'?value.operation:'add',enabled:enabled.length?enabled:['add'],mode:value.mode==='learn'?'learn':'adventure',sound:value.sound===true}
}
export const runKey=settings=>`jungle:${settings.mode}:${settings.difficulty}:${settings.operation==='mixed'?[...settings.enabled].sort().join(','):settings.operation}`
export const statKey=(op,difficulty)=>`${op}:${difficulty}`
export function cleanProgress(value){
 const settings=cleanSettings(value?.settings),records={},stats={}
 for(const [key,record]of Object.entries(value?.records||{}))if(/^jungle:(learn|adventure):(novato|audaz|guerrero):[a-z,]+$/.test(key)&&record&&integer(record.stars,3)&&record.stars>0&&integer(record.errors)&&integer(record.helps))records[key]={stars:record.stars,errors:record.errors,helps:record.helps,score:1000+record.stars*100}
 for(const op of Object.keys(OPERATIONS))for(const difficulty of Object.keys(DIFFICULTIES)){
  const key=statKey(op,difficulty),record=value?.stats?.[key]
  if(record&&['correct','errors','helps','streak','misses'].every(field=>integer(record[field]))&&integer(record.tier,2))stats[key]={correct:record.correct,errors:record.errors,helps:record.helps,streak:record.streak,misses:record.misses,tier:record.tier}
 }
 return {settings,records,stats}
}
export function cleanRun(value,progress){
 if(!value||value.world!=='jungle'||![undefined,2,3].includes(value.version))return null
 const settings=cleanSettings(value.settings),index=value.index
 if(!integer(index,9)||!integer(value.errors)||!integer(value.helps)||!integer(value.stageErrors)||!Array.isArray(value.completed)||value.completed.some((id,i)=>id!==CHALLENGES[i]?.id))return null
 const boss=BOSSES[index]
 let problem=value.problem,obstacleIndex=0,stage='INTRO',bossEnergy=boss.maxEnergy
 if(problem&&(!validProblem(problem)||problem.difficulty!==settings.difficulty||!(settings.operation==='mixed'?settings.enabled:[settings.operation]).includes(problem.op)))return null
 if(value.version===2||value.version===3){
  if(value.bossId!==boss.id||!integer(value.bossEnergy,boss.maxEnergy)||value.bossEnergy%boss.damage!==0)return null
  bossEnergy=value.bossEnergy
 }
 if(value.version===3){
  obstacleIndex=value.obstacleIndex;stage=value.stage
  if(!integer(obstacleIndex,3)||!['INTRO','OBSTACLE','BOSS_INTRO','COMBAT','VICTORY'].includes(stage)||!Array.isArray(value.obstaclesCompleted)||value.obstaclesCompleted.length!==obstacleIndex||value.obstaclesCompleted.some((id,i)=>id!==ZONES[index].obstacles[i]?.id))return null
  if((stage==='INTRO'&&obstacleIndex!==0)||(['INTRO','OBSTACLE'].includes(stage)&&(obstacleIndex>=3||bossEnergy!==boss.maxEnergy))||(['BOSS_INTRO','COMBAT','VICTORY'].includes(stage)&&obstacleIndex!==3))return null
  if((stage==='VICTORY')!==(bossEnergy===0)||(['OBSTACLE','COMBAT'].includes(stage)&&!problem)||(['INTRO','BOSS_INTRO','VICTORY'].includes(stage)&&problem))return null
 }else if(value.version===2){
  // Old partial boss battles keep earned damage: their route is considered traversed.
  obstacleIndex=problem||bossEnergy<boss.maxEnergy||value.victorious?3:0
  stage=bossEnergy===0?'VICTORY':obstacleIndex===3?(value.pending||!problem?'BOSS_INTRO':'COMBAT'):'INTRO'
  if(value.pending||stage!=='COMBAT')problem=null
  if(value.victorious&&bossEnergy!==0)return null
 }else{stage=problem?'OBSTACLE':'INTRO'}
 const victorious=stage==='VICTORY'
 const oldPendingVictory=value.version===2&&value.pending&&bossEnergy===0&&!value.victorious
 if(value.completed.length!==index+(victorious&&!oldPendingVictory?1:0))return null
 const completed=victorious?CHALLENGES.slice(0,index+1).map(zone=>zone.id):[...value.completed]
 const result=victorious&&index===9?{stars:value.errors<=1?3:value.errors<=5?2:1,errors:value.errors,helps:value.helps}:null
 if(result)result.score=1000+result.stars*100
 const phases={INTRO:'EXPLORE',OBSTACLE:'OBSTACLE',BOSS_INTRO:'BOSS_INTRO',COMBAT:'CHALLENGE',VICTORY:'VICTORY'}
 return {world:'jungle',version:3,stage,obstaclesCompleted:ZONES[index].obstacles.slice(0,obstacleIndex).map(item=>item.id),bossId:boss.id,settings,index,obstacleIndex,completed,bossEnergy,result,errors:value.errors,helps:value.helps,stageErrors:value.stageErrors,phase:phases[stage],problem:problem?{...problem,steps:explain(problem.op,problem.a,problem.b,problem.c)}:null,helpLevel:integer(value.helpLevel,2)?value.helpLevel:0,draft:/^\d{0,4}$/.test(String(value.draft??''))?String(value.draft??''):'0',history:Array.isArray(value.history)?value.history.filter(key=>typeof key==='string').slice(-20):[],progress}
}
export function loadGame(storage){try{const value=JSON.parse(storage.getItem(STORAGE_KEY)),progress=cleanProgress(value);return {progress,run:cleanRun(value?.activeRun,progress)}}catch{return {progress:cleanProgress(),run:null}}}
export function saveGame(storage,progress,activeRun){try{storage.setItem(STORAGE_KEY,JSON.stringify({...cleanProgress(progress),activeRun}));return true}catch{return false}}
export function rememberResult(progress,settings,result){
 const key=runKey(settings),old=progress.records[key]
 const better=!old||result.stars>old.stars||result.stars===old.stars&&(result.errors<old.errors||result.errors===old.errors&&result.helps<old.helps)
 return {...progress,records:{...progress.records,[key]:better?result:old}}
}
