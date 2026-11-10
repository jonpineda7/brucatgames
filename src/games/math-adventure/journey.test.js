import test from 'node:test'
import assert from 'node:assert/strict'
import { initialGame,reducer,PHASES,snapshot } from './engine.js'
import { ZONES,inCombat,interactionFor,zoneStatus } from './journey.js'
import { BOSSES } from './bosses.js'
import { cleanRun,loadGame,saveGame } from './progress.js'
import { validProblem } from './math.js'
import { act,solve,toBoss } from './testHelpers.js'
const start=()=>act(initialGame(),'play',{roll:.3})
function restore(state){const storage={getItem(){return this.data},setItem(k,v){this.data=v}};assert.ok(saveGame(storage,state.progress,snapshot(state)));const loaded=loadGame(storage);assert.ok(loaded.run);return act(initialGame(loaded.progress,loaded.run),'resume-run')}
test('ten routes configure three distinct obstacles, grounded destinations, their own boss and unchanged rewards',()=>{
 assert.equal(ZONES.length,10)
 for(const [i,zone]of ZONES.entries()){
  assert.equal(zone.obstacles.length,3);assert.equal(new Set(zone.obstacles.map(o=>o.kind)).size,3);assert.equal(zone.supports.length,4)
  assert.equal(zone.boss,BOSSES[i]);assert.equal(zone.coins,5)
  zone.obstacles.forEach((o,j)=>{assert.equal(o.from,j);assert.equal(o.to,j+1);assert.ok(o.goal&&o.change&&o.action);assert.ok(zone.supports[j].x<zone.supports[j+1].x);assert.ok(['jump','lift'].includes(o.movement));assert.ok(zone.supports[j].y>=48&&zone.supports[j].y<=78)})
 }
})
test('entrance, three repairs and three real destination changes precede the boss; traversal never damages its shield',()=>{
 let state=act(initialGame(),'start');assert.equal(state.phase,PHASES.EXPLORE);assert.equal(inCombat(state),false)
 state=act(state,'explore')
 for(let step=0;step<3;step++){
  assert.equal(state.obstacleIndex,step);assert.equal(state.phase,PHASES.OBSTACLE);assert.equal(inCombat(state),false)
  const support=ZONES[0].supports[step],problem=state.problem
  state=act(state,'answer',{value:problem.answer,roll:.6});assert.equal(state.phase,PHASES.OBSTACLE_RESOLVING);assert.equal(state.bossEnergy,30)
  for(let click=0;click<6;click++)assert.equal(act(state,'answer',{value:problem.answer}),state)
  state=act(state,'obstacle-resolved');assert.equal(state.phase,step===2?PHASES.ARENA_MOVING:PHASES.MOVING)
  const callback={type:'arrived',session:state.session,transition:state.transition};state=reducer(state,callback);assert.equal(reducer(state,callback),state)
  assert.notDeepEqual(ZONES[0].supports[state.obstacleIndex],support);assert.equal(state.bossEnergy,30);assert.equal(state.completed.length,0)
 }
 assert.equal(state.phase,PHASES.BOSS_INTRO);assert.equal(inCombat(state),true);assert.equal(state.problem,null);assert.equal(zoneStatus(state,0),'jefe pendiente')
 state=act(state,'fight');assert.equal(state.phase,PHASES.CHALLENGE);assert.equal(interactionFor(state).action,'Lanzar respuesta')
 state=solve(state);assert.equal(state.bossEnergy,20);assert.equal(state.completed.length,0)
})
test('errors and hints keep the same obstacle, point, exercise, energy and reward',()=>{
 let state=start(),question=state.problem
 state=act(state,'help');state=act(state,'answer',{value:question.answer+1})
 assert.equal(state.phase,PHASES.FEEDBACK);assert.equal(state.obstacleIndex,0);assert.equal(state.bossEnergy,30);assert.equal(state.completed.length,0)
 state=act(state,'retry');assert.equal(state.phase,PHASES.OBSTACLE);assert.deepEqual(state.problem,question)
 state=toBoss(state);assert.equal(state.obstacleIndex,3);assert.equal(state.bossEnergy,30)
})
test('every movement, repair and impact can pause/resume without stale events or duplicated progress',()=>{
 for(const [phase,event]of [[PHASES.OBSTACLE_RESOLVING,'obstacle-resolved'],[PHASES.MOVING,'arrived'],[PHASES.ARENA_MOVING,'arrived'],[PHASES.RESOLVING,'resolved'],[PHASES.IMPACT,'impact-ended']]){
  let state=start();if(phase===PHASES.ARENA_MOVING){state=solve(solve(state))}else if([PHASES.RESOLVING,PHASES.IMPACT].includes(phase))state=toBoss(state)
  state=act(state,'answer',{value:state.problem.answer})
  if([PHASES.MOVING,PHASES.ARENA_MOVING].includes(phase))state=act(state,'obstacle-resolved')
  if(phase===PHASES.IMPACT)state=act(state,'resolved')
  assert.equal(state.phase,phase);const energy=state.bossEnergy,callback={type:event,session:state.session,transition:state.transition}
  state=act(state,'pause');assert.equal(reducer(state,callback),state);assert.equal(act(state,'answer',{value:0}),state)
  state=act(state,'resume');assert.equal(state.phase,phase);assert.equal(reducer(state,callback),state);assert.equal(state.bossEnergy,energy)
  const next=act(state,event);assert.notEqual(next,state);const exited=act(state,'menu');assert.equal(act(exited,event),exited)
  assert.equal(reducer(act(state,'start'),callback).obstacleIndex,0)
 }
})
test('snapshots restore exact stable exercises, repair destinations and arena entry without replaying a solved obstacle',()=>{
 let state=start();state=act(state,'draft',{value:'19'});state=act(state,'help');let loaded=restore(state)
 assert.deepEqual(loaded.problem,state.problem);assert.equal(loaded.draft,'19');assert.equal(loaded.helpLevel,1)
 for(let step=0;step<3;step++){
  state=act(state,'answer',{value:state.problem.answer,roll:.29});loaded=restore(state)
  assert.equal(loaded.obstacleIndex,step+1);assert.equal(loaded.bossEnergy,30);assert.equal(loaded.completed.length,0)
  assert.equal(snapshot(loaded).stage,step===2?'BOSS_INTRO':'OBSTACLE')
  assert.deepEqual(snapshot(restore(loaded)),snapshot(loaded));state=loaded
 }
 state=act(state,'fight');state=act(state,'answer',{value:state.problem.answer,roll:.65});loaded=restore(state)
 assert.equal(loaded.phase,PHASES.CHALLENGE);assert.equal(loaded.bossEnergy,20);assert.deepEqual(loaded.problem,state.nextProblem)
})
test('version-2 partial boss battles retain shield, question and previous completed zones; introductions gain a route',()=>{
 let state=toBoss(start());state=solve(state)
 const old={...snapshot(state),version:2,victorious:false,pending:false};delete old.stage;delete old.obstacleIndex;delete old.obstaclesCompleted
 const migrated=cleanRun(old,state.progress);assert.equal(migrated.obstacleIndex,3);assert.equal(migrated.bossEnergy,20);assert.equal(migrated.phase,PHASES.CHALLENGE);assert.deepEqual(migrated.problem,state.problem);assert.deepEqual(migrated.completed,[])
 const intro=cleanRun({...old,problem:null,bossEnergy:30},state.progress);assert.equal(intro.obstacleIndex,0);assert.equal(intro.phase,PHASES.EXPLORE)
 const pending=cleanRun({...old,pending:true},state.progress);assert.equal(pending.phase,PHASES.BOSS_INTRO);assert.equal(pending.bossEnergy,20)
 const victory=cleanRun({...old,pending:true,bossEnergy:0},state.progress);assert.equal(victory.phase,PHASES.VICTORY);assert.equal(victory.completed.length,1)
})
test('malformed or inconsistent route saves are rejected without clearing persistent records',()=>{
 const state=start(),run=snapshot(state)
 for(const altered of [{obstacleIndex:4},{stage:'MOVING'},{bossEnergy:20},{obstaclesCompleted:['unknown']},{stage:'COMBAT'},{version:99}])assert.equal(cleanRun({...run,...altered},state.progress),null)
})
test('all four operations, mixed subsets, difficulties and modes finish three valid obstacles and every boss in all ten zones',()=>{
 for(const mode of ['learn','adventure'])for(const difficulty of ['novato','audaz','guerrero'])for(const operation of ['add','subtract','multiply','divide','mixed']){
  let state=act(act(initialGame(),'settings',{value:{mode,difficulty,operation,enabled:['subtract','divide']}}),'start')
  for(let zone=0;zone<10;zone++){
   state=act(state,'explore')
   for(let step=0;step<3;step++){assert.equal(validProblem(state.problem),true);assert.equal(state.problem.difficulty,difficulty);assert.ok((operation==='mixed'?['subtract','divide']:[operation]).includes(state.problem.op));state=solve(state)}
   assert.equal(state.phase,PHASES.BOSS_INTRO);state=act(state,'fight')
   for(let hit=0;hit<BOSSES[zone].exercises;hit++){assert.equal(validProblem(state.problem),true);state=solve(state)}
   assert.equal(state.phase,PHASES.VICTORY);assert.equal(zoneStatus(state,zone),'completada');assert.equal(state.completed.length,zone+1)
   const complete=restore(state);assert.equal(complete.completed.length,zone+1);state=act(complete,'next-zone');assert.equal(act(state,'next-zone'),state)
  }
  assert.equal(state.phase,PHASES.RESULT);assert.equal(state.completed.length*5,50);assert.equal(state.result.stars,3)
 }
})

test('migration preserves every previously completed zone and pending boss damage at each of the ten legacy positions',()=>{
 const reference=toBoss(start()),template={...snapshot(reference),version:2,victorious:false,pending:false}
 delete template.stage;delete template.obstacleIndex;delete template.obstaclesCompleted
 for(let index=0;index<10;index++){
  const completed=ZONES.slice(0,index).map(zone=>zone.id),boss=BOSSES[index]
  const legacy={...template,index,completed,bossId:boss.id,bossEnergy:boss.maxEnergy-10}
  const run=cleanRun(legacy,reference.progress)
  assert.equal(run.obstacleIndex,3);assert.equal(run.bossEnergy,boss.maxEnergy-10);assert.deepEqual(run.completed,completed);assert.deepEqual(run.problem,reference.problem);assert.equal(run.progress,reference.progress)
  assert.deepEqual(cleanRun(run,reference.progress).completed,completed)
  const won=cleanRun({...legacy,bossEnergy:0,pending:true},reference.progress)
  assert.equal(won.phase,PHASES.VICTORY);assert.equal(won.completed.length,index+1)
  assert.equal(cleanRun(won,reference.progress).completed.length,index+1)
 }
})
