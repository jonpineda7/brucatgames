import { getCase, hintLimit, isCaseUnlocked, nextImplementedCase } from './levels.js'
import { objectName } from './evidence.js'
import { cameraAt, panCamera, objectAnchor, hitTest } from './geometry.js'
import { cleanProgress, rememberResult } from './progress.js'
import { selectPlacement, placedObjects } from './placements.js'
import { buildPuzzle, puzzleAnswer, stagePuzzle, puzzleStages, emptyDraft, cleanDraft } from './puzzle.js'
import { cleanRun, snapshotRun } from './session.js'
export const PHASES=Object.freeze(Object.fromEntries(['INTRO','SEARCHING','ALL_OBJECTS_FOUND','SOLVING','CASE_SOLVED','CASE_FAILED','RESULT','NEXT_CASE','PAUSED'].map(phase=>[phase,phase])))
export const starsFor=hints=>hints===0?3:hints<=2?2:1
const notice=(state,message,sound=null)=>({...state,message,event:{id:state.event.id+1,sound}})
const phase=(state,next)=>({...state,phase:next,transition:state.transition+1})
export function newGame(progress,run=null){return {phase:PHASES.INTRO,levelId:1,session:0,transition:0,placementId:null,objects:[],puzzle:null,puzzleStage:0,puzzleDraft:null,found:[],hints:0,mistakes:0,cooldown:0,hint:null,camera:cameraAt(),previousCamera:null,selectedAnswer:null,result:null,overlay:null,nextCaseId:null,resumeRun:run,progress:cleanProgress(progress),message:'Cada detalle cuenta. ¡Investiguemos juntos!',event:{id:0,sound:null}}}
export const activeCase=state=>{const level=getCase(state.levelId);return {...level,objects:state.objects.length?state.objects:level.objects,riddle:state.puzzle||level.riddle}}
export function allObjectsFound(state){
 const required=state.objects.map(object=>object.id),found=new Set(state.found)
 return required.length>0&&found.size===required.length&&state.found.length===required.length&&required.every(id=>found.has(id))
}
function start(state,id,roll){
 const level=getCase(id)
 if(!isCaseUnlocked(state.progress,id))return state
 const previous=id===state.levelId?state.placementId||state.progress.lastPlacements[id]:state.progress.lastPlacements[id]
 const placement=selectPlacement(level,previous,roll)
 if(!placement)return notice(state,'Este escenario necesita una distribución válida antes de poder jugar.')
 return notice({...newGame(state.progress),...placement,phase:PHASES.SEARCHING,levelId:id,session:state.session+1,transition:state.transition+1,puzzle:buildPuzzle(level,placement.objects),event:state.event,progress:{...state.progress,lastPlacements:{...state.progress.lastPlacements,[id]:placement.placementId}}},`Busca los ${level.objects.length} objetos y reúne sus pistas. Al encontrarlos, BruCat te presentará el misterio.`,'start')
}
function endHint(state){return {...state,hint:null,camera:state.previousCamera||state.camera,previousCamera:null}}
function findObject(state,id){
 const object=state.objects.find(object=>object.id===id)
 if(!object||state.found.includes(id))return state
 const found=[...state.found,id],complete=allObjectsFound({...state,found})
 const next=state.hint?.target===id||complete?endHint(state):state
 const updated={...next,found}
 return notice(complete?phase(updated,PHASES.ALL_OBJECTS_FOUND):updated,complete?'¡Reunimos todas las pruebas! Ahora vamos a resolver el misterio.':`¡Encontraste ${objectName(object).toLowerCase()} ${object.locationShort}!`,'hit')
}
const validTransition=(state,action)=>!state.overlay&&action.session===state.session&&action.transition===state.transition
export function gameReducer(state,action){
 if(action.session!==undefined&&action.session!==state.session)return state
 switch(action.type){
  case 'sound':return {...state,progress:{...state.progress,sound:!state.progress.sound}}
  case 'start':return start(state,action.id,action.roll)
  case 'restart':return start(state,state.levelId,action.roll)
  case 'resume-run':{
   if(state.phase!==PHASES.INTRO)return state
   const run=cleanRun(state.resumeRun,state.progress)
   if(!run)return state
   const objects=Object.freeze(placedObjects(getCase(run.levelId),run.placementId).map(object=>Object.freeze(object)))
   return notice({...newGame(state.progress),...run,objects,puzzle:buildPuzzle(getCase(run.levelId),objects),session:state.session+1,transition:state.transition+1,event:state.event},'Continuamos tu investigación con los mismos objetos y sus ubicaciones.','start')
  }
  case 'welcome':return {...phase(endHint(state),PHASES.INTRO),session:state.session+1,overlay:null,resumeRun:snapshotRun(state)}
  case 'open-help':
  case 'open-restart':{
   if([PHASES.ALL_OBJECTS_FOUND,PHASES.CASE_SOLVED,PHASES.NEXT_CASE].includes(state.phase)||state.overlay)return state
   const resume=state.phase===PHASES.SEARCHING
   return {...phase(state,resume?PHASES.PAUSED:state.phase),overlay:{type:action.type==='open-help'?'help':'restart',resume}}
  }
  case 'close-overlay':return state.overlay?{...phase(state,state.overlay.resume?PHASES.SEARCHING:state.phase),overlay:null}:state
  case 'pause':return state.phase===PHASES.SEARCHING?phase(state,PHASES.PAUSED):state
  case 'resume':return state.phase===PHASES.PAUSED&&!state.overlay?phase(state,PHASES.SEARCHING):state
  case 'finish-discovery':return state.phase===PHASES.ALL_OBJECTS_FOUND&&allObjectsFound(state)&&validTransition(state,action)?notice(phase(state,PHASES.SOLVING),'Usa tus pruebas para responder a BruCat.','combo'):state
  case 'retry-puzzle':return state.phase===PHASES.CASE_FAILED&&!state.overlay?notice(phase(state,PHASES.SOLVING),'Mira tus pruebas y vuelve a intentarlo.'):state
  case 'puzzle-draft':{
   if(state.phase!==PHASES.SOLVING||state.overlay)return state
   return {...state,puzzleDraft:cleanDraft(stagePuzzle(state.puzzle,state.puzzleStage),action.value)}
  }
  case 'answer':{
   if(state.phase!==PHASES.SOLVING||state.overlay||!allObjectsFound(state))return state
   const puzzle=stagePuzzle(state.puzzle,state.puzzleStage)
   const value=Object.hasOwn(action,'value')?action.value:action.id??state.puzzleDraft
   const correct=puzzleAnswer(puzzle,value)
   if(correct===null)return state
   if(!correct)return notice({...phase(state,PHASES.CASE_FAILED),mistakes:state.mistakes+1,selectedAnswer:typeof value==='string'?value:null,puzzleDraft:cleanDraft(puzzle,value)},puzzle.feedback||'Revisa las pruebas: puedes volver a intentarlo.','miss')
   if(state.puzzleStage+1<puzzleStages(state.puzzle))return notice({...phase(state,PHASES.SOLVING),puzzleStage:state.puzzleStage+1,puzzleDraft:emptyDraft(stagePuzzle(state.puzzle,state.puzzleStage+1))},'¡Deducción correcta! Vamos con la siguiente parte del misterio.','combo')
   const result={stars:starsFor(state.hints),hints:state.hints,mistakes:state.mistakes,score:state.objects.length*100+starsFor(state.hints)*100}
   // This is the sole completion commit. Result/animation events cannot award it again.
   return notice({...phase(state,PHASES.CASE_SOLVED),result,selectedAnswer:action.id,progress:rememberResult(state.progress,state.levelId,result)},state.puzzle.explanation,'finish')
  }
  case 'show-result':return state.phase===PHASES.CASE_SOLVED&&validTransition(state,action)?phase(state,PHASES.RESULT):state
  case 'next-case':{
   if(state.phase!==PHASES.RESULT||state.overlay)return state
   const next=nextImplementedCase(state.levelId)
   return next&&isCaseUnlocked(state.progress,next.id)?{...phase(state,PHASES.NEXT_CASE),nextCaseId:next.id}:state
  }
  case 'begin-next-case':return state.phase===PHASES.NEXT_CASE&&validTransition(state,action)?start(state,state.nextCaseId,action.roll):state
  default:break
 }
 if(state.phase!==PHASES.SEARCHING||state.overlay)return state
 const level=activeCase(state)
 switch(action.type){
  case 'point':{
   const id=hitTest(action.point,state.objects)
   return id?findObject(state,id):notice({...state,mistakes:state.mistakes+1},'Todavía no. Mira con calma; no pierdes objetos ni progreso.','miss')
  }
  case 'find':return findObject(state,action.id)
  case 'hint':{
   if(state.cooldown>0||state.hints>=hintLimit(level)||!['visual','description','magic'].includes(action.kind))return state
   const target=state.objects.find(object=>!state.found.includes(object.id))
   if(!target)return state
   const point=objectAnchor(target),magic=action.kind==='magic'
   return notice({...state,hints:state.hints+1,cooldown:6000,hint:{kind:action.kind,target:target.id,remaining:5000},previousCamera:magic?state.camera:null,camera:magic?cameraAt(2.7,point.x,point.y):action.kind==='visual'?cameraAt(state.camera.zoom,point.x,point.y):state.camera},action.kind==='description'?target.location:magic?'Lupa mágica: he ampliado la zona actual de un objeto pendiente durante cinco segundos.':'Sigue el círculo dorado: señala la ubicación actual de un objeto pendiente.','combo')
  }
  case 'end-hint':return state.hint?endHint(state):state
  case 'tick':{
   if(!Number.isFinite(action.delta)||action.delta<=0||action.delta>1000)return state
   if(!state.cooldown&&!state.hint)return state
   const next={...state,cooldown:Math.max(0,state.cooldown-action.delta),hint:state.hint?{...state.hint,remaining:Math.max(0,state.hint.remaining-action.delta)}:null}
   return next.hint?.remaining===0?endHint(next):next
  }
  case 'zoom':return state.hint?.kind==='magic'||!Number.isFinite(action.zoom)?state:{...state,camera:cameraAt(action.zoom,state.camera.cx,state.camera.cy)}
  case 'pan':return state.hint?.kind==='magic'?state:{...state,camera:panCamera(state.camera,action.dx,action.dy,action.rect)}
  case 'center':return state.hint?.kind==='magic'?state:{...state,camera:cameraAt()}
  default:return state
 }
}
