import { getCase, isCaseUnlocked } from './levels.js'
import { validPlacements } from './placements.js'
import { cameraAt } from './geometry.js'
import { buildPuzzle, puzzleStages, stagePuzzle, cleanDraft } from './puzzle.js'
import { placedObjects } from './placements.js'
export const SESSION_KEY='brucatgames:detective:session:v2'
const resumable=['SEARCHING','ALL_OBJECTS_FOUND','SOLVING','CASE_FAILED']
export function cleanRun(value,progress){
 const level=getCase(value?.levelId)
 if(!level||!isCaseUnlocked(progress,level.id)||!validPlacements(level).some(layout=>layout.id===value.placementId)||!resumable.includes(value.phase))return null
 if(!Array.isArray(value.found)||new Set(value.found).size!==value.found.length||value.found.some(id=>!level.objects.some(object=>object.id===id)))return null
 if(![value.hints,value.mistakes].every(number=>Number.isInteger(number)&&number>=0&&number<=1000000))return null
 const complete=level.objects.every(object=>value.found.includes(object.id))
 if(value.phase!=='SEARCHING'&&!complete)return null
 const puzzle=buildPuzzle(level,placedObjects(level,value.placementId)),puzzleStage=value.puzzleStage??0
 if(!Number.isInteger(puzzleStage)||puzzleStage<0||puzzleStage>=puzzleStages(puzzle)||(!complete&&puzzleStage!==0))return null
 const phase=value.phase==='SEARCHING'&&complete?'ALL_OBJECTS_FOUND':value.phase
 return {levelId:level.id,placementId:value.placementId,found:[...value.found],puzzleStage,puzzleDraft:cleanDraft(stagePuzzle(puzzle,puzzleStage),value.puzzleDraft??null),hints:value.hints,mistakes:value.mistakes,phase,camera:cameraAt(value.camera?.zoom,value.camera?.cx,value.camera?.cy),selectedAnswer:typeof value.selectedAnswer==='string'?value.selectedAnswer:null}
}
export function snapshotRun(state){
 if(state.phase==='INTRO')return state.resumeRun
 const phase=state.phase==='PAUSED'?'SEARCHING':state.phase
 if(!resumable.includes(phase))return null
 return {levelId:state.levelId,placementId:state.placementId,found:[...state.found],puzzleStage:state.puzzleStage,puzzleDraft:state.puzzleDraft,hints:state.hints,mistakes:state.mistakes,phase,camera:state.previousCamera||state.camera,selectedAnswer:state.selectedAnswer}
}
export function loadRun(storage,progress){try{return cleanRun(JSON.parse(storage.getItem(SESSION_KEY)),progress)}catch{return null}}
export function writeRun(storage,serialized){try{if(serialized!=='null')storage.setItem(SESSION_KEY,serialized);else storage.removeItem(SESSION_KEY);return true}catch{return false}}
export const persistRun=(storage,state)=>writeRun(storage,JSON.stringify(snapshotRun(state)))
