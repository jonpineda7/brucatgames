import test from 'node:test'
import assert from 'node:assert/strict'
import { CASES, CHAPTERS, isCaseUnlocked } from './levels.js'
import { newGame, gameReducer, PHASES } from './engine.js'
import { validPlacements, validatePlacement, placedObjects, selectPlacement } from './placements.js'
import { buildPuzzle, stagePuzzle, validatePuzzle, puzzleAnswer, cleanDraft } from './puzzle.js'
import { hitTest, objectAnchor, cameraAt, cameraBox, screenToScene } from './geometry.js'
import { loadProgress, persistProgress, chapterProgress, totalStars } from './progress.js'
import { persistRun, loadRun, snapshotRun } from './session.js'
const act=(state,type,data={})=>gameReducer(state,{type,session:state.session,transition:state.transition,...data})
const store=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}}
const wrong=puzzle=>puzzle.type==='choice'?puzzle.options.find(option=>option.id!==puzzle.answer).id:puzzle.type==='sequence'?[...puzzle.answer].reverse():Object.fromEntries(puzzle.items.map(item=>[item.id,puzzle.targets[(puzzle.targets.findIndex(target=>target.id===puzzle.answer[item.id])+1)%puzzle.targets.length].id]))
function solve(state,{mistake=false}={}){
 for(const object of state.objects)state=act(state,'point',{point:objectAnchor(object)})
 assert.equal(state.phase,PHASES.ALL_OBJECTS_FOUND)
 state=act(state,'finish-discovery');assert.equal(state.phase,PHASES.SOLVING)
 let stages=0
 while(state.phase===PHASES.SOLVING){
  const puzzle=stagePuzzle(state.puzzle,state.puzzleStage),stage=state.puzzleStage
  assert.equal(act(state,'answer',{value:null}),state)
  if(mistake){
   state=act(state,'answer',{value:wrong(puzzle)});assert.equal(state.phase,PHASES.CASE_FAILED)
   assert.equal(state.found.length,state.objects.length);assert.equal(state.puzzleStage,stage)
   state=act(state,'retry-puzzle');assert.equal(state.phase,PHASES.SOLVING)
  }
  state=act(state,'puzzle-draft',{value:puzzle.answer});state=act(state,'answer',{value:state.puzzleDraft})
  stages++;assert.ok(stages<10)
 }
 assert.equal(state.phase,PHASES.CASE_SOLVED)
 return act(state,'show-result')
}
for(let world=0;world<5;world++)test(`chapter ${world+1}: three original scenes, every object, four selectable layouts, truthful clues and solvable puzzles`,()=>{
 const chapter=CASES.filter(level=>level.world===world)
 assert.equal(chapter.length,3);assert.equal(CHAPTERS[world].id,world)
 for(const level of chapter){
  assert.equal(level.status,'ready');assert.ok(level.mission&&level.description&&level.outro)
  assert.equal(level.objects.length,level.id<=5?5:level.id<=10?7:9)
  assert.equal(new Set(level.objects.map(object=>object.id)).size,level.objects.length)
  assert.equal(validPlacements(level).length,4)
  for(const layout of level.sceneConfig.distributions){
   assert.equal(validatePlacement(level,layout),true)
   const objects=placedObjects(level,layout.id),puzzle=buildPuzzle(level,objects)
   assert.equal(validatePuzzle(puzzle),true)
   assert.notEqual(selectPlacement(level,layout.id,0).placementId,layout.id)
   for(const object of objects){assert.equal(hitTest(objectAnchor(object),objects),object.id);assert.ok(object.location.includes(level.sceneConfig.zones[object.zoneId].location))}
  }
 }
})
test('all 15 cases complete sequentially, unlock all chapters and finish the actual adventure without placeholders',()=>{
 const storage=store();let state=newGame()
 assert.equal(CASES.length,15);assert.equal(new Set(CASES.map(level=>level.scene)).size,15)
 for(const level of CASES){
  assert.equal(isCaseUnlocked(state.progress,level.id),true)
  if(state.phase===PHASES.INTRO)state=act(state,'start',{id:level.id,roll:.4})
  assert.equal(state.levelId,level.id);assert.equal(state.phase,PHASES.SEARCHING)
  if(level.id<15)assert.equal(isCaseUnlocked(state.progress,level.id+1),false)
  state=solve(state,{mistake:true});assert.equal(state.phase,PHASES.RESULT)
  const record=state.progress.completed[level.id];assert.equal(record.stars,3)
  assert.equal(act(state,'answer',{value:state.puzzle.answer}),state)
  persistProgress(storage,state.progress);assert.deepEqual(loadProgress(storage),state.progress)
  assert.equal(totalStars(state.progress),level.id*3)
  assert.equal(chapterProgress(state.progress,level.world).completed,(level.id-1)%3+1)
  if(level.id<15){state=act(state,'next-case');assert.equal(state.phase,PHASES.NEXT_CASE);state=act(state,'begin-next-case',{roll:.8})}
 }
 assert.equal(Object.keys(state.progress.completed).length,15);assert.equal(state.progress.unlocked,15)
 assert.equal(act(state,'next-case'),state)
 for(let world=0;world<5;world++){assert.deepEqual(chapterProgress(state.progress,world),{total:3,completed:3,stars:9,unlocked:true})}
 const previous=state.progress,state2=act(state,'start',{id:1,roll:.7})
 assert.equal(state2.phase,PHASES.SEARCHING);assert.equal(totalStars(state2.progress),45);assert.deepEqual(state2.progress.completed,previous.completed)
})
test('every case and layout maps artwork coordinates correctly at phone, tablet and desktop sizes with zoom',()=>{
 for(const level of CASES)for(const layout of validPlacements(level)){
  const objects=placedObjects(level,layout.id)
  for(const width of [320,375,768,1440])for(const zoom of [1,1.5,2,3])for(const object of objects){
   const anchor=objectAnchor(object),camera=cameraAt(zoom,anchor.x,anchor.y),box=cameraBox(camera),rect={left:13,top:27,width,height:width}
   const point=screenToScene(rect.left+(anchor.x-box.x)/box.size*width,rect.top+(anchor.y-box.y)/box.size*width,rect,camera)
   assert.equal(hitTest(point,objects),object.id)
  }
 }
})
test('hints, stars and sessions remain correct throughout all cases and puzzle stages',()=>{
 let state=newGame();const storage=store()
 for(const level of CASES){
  state=act(state,'start',{id:level.id,roll:.2})
  const layout=state.placementId,objects=state.objects
  state=act(state,'find',{id:objects[0].id})
  for(const kind of ['description','visual','magic']){
   state=act(state,'hint',{kind});assert.equal(state.hint.target,objects[1].id)
   if(kind==='description')assert.equal(state.message,objects[1].location)
   for(let i=0;i<6;i++)state=act(state,'tick',{delta:1000})
  }
  state=act(state,'zoom',{zoom:2});persistRun(storage,state);persistProgress(storage,state.progress)
  const restored=act(newGame(loadProgress(storage),loadRun(storage,state.progress)),'resume-run')
  assert.equal(restored.placementId,layout);assert.deepEqual(restored.objects,objects);assert.equal(restored.hints,3);assert.equal(restored.camera.zoom,2)
  state=solve(restored);assert.equal(state.progress.completed[level.id].stars,1)
 }
 assert.equal(totalStars(state.progress),15)
})
test('multi-stage puzzles restore at the exact completed stage and reject malformed or duplicate drafts',()=>{
 let state=newGame()
 for(let id=1;id<12;id++){state=act(state,'start',{id,roll:0});state=solve(state)}
 state=act(state,'start',{id:12,roll:.6})
 for(const object of state.objects)state=act(state,'find',{id:object.id})
 state=act(state,'finish-discovery')
 const first=stagePuzzle(state.puzzle,0);state=act(state,'answer',{value:first.answer})
 assert.equal(state.puzzleStage,1);assert.equal(state.phase,PHASES.SOLVING)
 const storage=store();persistRun(storage,state)
 const restored=act(newGame(state.progress,loadRun(storage,state.progress)),'resume-run')
 assert.equal(restored.puzzleStage,1);assert.equal(restored.phase,PHASES.SOLVING);assert.deepEqual(snapshotRun(restored).found,state.found)
 for(const level of CASES){const puzzle=buildPuzzle(level,placedObjects(level,level.sceneConfig.distributions[0].id));for(const stage of puzzle.stages||[puzzle]){
  assert.notEqual(puzzleAnswer(stage,'fake'),true)
  if(stage.type==='sequence')assert.deepEqual(cleanDraft(stage,Array(stage.items.length).fill(stage.items[0].id)),[])
  if(stage.type==='match'||stage.type==='assemble')assert.deepEqual(cleanDraft(stage,Object.fromEntries(stage.items.map(item=>[item.id,stage.targets[0].id]))),{})
 }}
})
