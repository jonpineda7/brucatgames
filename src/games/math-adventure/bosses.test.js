import { solve,toBoss } from './testHelpers.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync,existsSync } from 'node:fs'
import { BOSSES,damageBoss } from './bosses.js'
import { reducer,initialGame,snapshot,PHASES,starsFor } from './engine.js'
import { cleanRun,cleanProgress,loadGame,saveGame,runKey } from './progress.js'
const act=(s,type,more={})=>reducer(s,{type,session:s.session,transition:s.transition,...more})
const start=()=>toBoss(act(act(initialGame(),'start'),'explore',{roll:.3}))
const hit=solve
const restore=s=>{const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};assert.ok(saveGame(storage,s.progress,snapshot(s)));const loaded=loadGame(storage);return act(initialGame(loaded.progress,loaded.run),'resume-run')}
test('all ten bosses have complete, normalized transparent poses with a common baseline',()=>{
 const frames=JSON.parse(readFileSync('public/games/math-adventure/bosses/frames.json'))
 assert.equal(frames.length,30);assert.equal(new Set(BOSSES.map(b=>b.id)).size,10)
 for(const boss of BOSSES){assert.equal(boss.maxEnergy,boss.exercises*boss.damage);for(const path of Object.values(boss.assets)){assert.ok(existsSync(`public/${path}`));const png=readFileSync(`public/${path}`);assert.equal(png.readUInt32BE(16),352);assert.equal(png.readUInt32BE(20),352);assert.equal(png[25],6)}}
 assert.ok(frames.every(f=>f.baseline===336&&f.crop[2]-f.crop[0]<=328&&f.crop[3]-f.crop[1]<=324))
})
test('damage clamps energy and quick duplicate inputs cannot damage or reward twice',()=>{
 const boss=BOSSES[0];assert.equal(damageBoss(-10,boss),0);assert.equal(damageBoss(500,boss),20)
 let s=start();for(let i=0;i<boss.exercises;i++){const before=s.bossEnergy;s=act(s,'answer',{value:s.problem.answer});assert.equal(s.bossEnergy,before-10);for(let j=0;j<10;j++)assert.equal(act(s,'answer',{value:s.problem.answer}),s);s=act(s,'resolved');s=act(s,'impact-ended')}
 assert.equal(s.phase,PHASES.VICTORY);assert.deepEqual(s.completed,['bridge-1']);assert.equal(s.bossEnergy,0)
 assert.equal(act(s,'impact-ended'),s);assert.equal(act(s,'answer',{value:s.problem.answer}),s)
 s=act(s,'next-zone');assert.equal(s.index,1);assert.equal(act(s,'next-zone'),s)
})
test('errors and hints preserve energy, question, coins and the available reward',()=>{
 let s=start(),question=s.problem;const energy=s.bossEnergy
 s=act(s,'help');assert.equal(s.bossEnergy,energy);s=act(s,'answer',{value:question.answer+1});assert.equal(s.bossEnergy,energy);assert.deepEqual(s.completed,[])
 s=act(s,'retry');assert.equal(s.problem,question)
 assert.equal(starsFor(0,100),starsFor(0,0))
})
test('every animated phase pauses, rejects stale callbacks and resumes without repeating damage',()=>{
 for(const phase of [PHASES.RESOLVING,PHASES.IMPACT]){
  let s=act(start(),'answer',{value:start().problem.answer});if(phase===PHASES.IMPACT)s=act(s,'resolved')
  const energy=s.bossEnergy,callback={type:phase===PHASES.IMPACT?'impact-ended':'resolved',session:s.session,transition:s.transition}
  s=act(s,'pause');assert.equal(s.phase,PHASES.PAUSED);assert.equal(reducer(s,callback),s);s=act(s,'resume');assert.equal(s.phase,phase);assert.equal(reducer(s,callback),s);assert.equal(s.bossEnergy,energy)
  const exited=act(s,'menu');assert.equal(reducer(exited,callback),exited)
 }
})
test('stable and interrupted saves round-trip repeatedly, including a final hit before victory',()=>{
 let s=start();s=act(s,'draft',{value:'17'});let loaded=restore(s);assert.deepEqual(loaded.problem,s.problem);assert.equal(loaded.draft,'17')
 s=act(s,'answer',{value:s.problem.answer});loaded=restore(s);assert.equal(loaded.bossEnergy,20);assert.equal(loaded.phase,PHASES.CHALLENGE)
 loaded=restore(loaded);assert.equal(loaded.bossEnergy,20);loaded=act(loaded,'explore');loaded=hit(loaded);loaded=act(loaded,'answer',{value:loaded.problem.answer});loaded=restore(loaded)
 assert.equal(loaded.phase,PHASES.VICTORY);assert.equal(loaded.bossEnergy,0);assert.equal(loaded.completed.length,1);loaded=restore(loaded);assert.equal(loaded.completed.length,1)
})
test('legacy saves preserve settings, exercise, records and completed zones; malformed boss saves fail safely',()=>{
 const s=start(),old=snapshot(s);delete old.version;delete old.bossEnergy;delete old.bossId;delete old.obstacleIndex;delete old.obstaclesCompleted;delete old.stage
 const migrated=cleanRun(old,cleanProgress(s.progress));assert.equal(migrated.bossEnergy,30);assert.deepEqual(migrated.problem,s.problem);assert.equal(migrated.version,3)
 for(const bossEnergy of [-10,31,NaN,Infinity,5])assert.equal(cleanRun({...snapshot(s),bossEnergy},s.progress),null)
 assert.equal(cleanRun({...snapshot(s),bossId:'unknown'},s.progress),null)
})
test('finishing all ten bosses restores exactly ten zones, 50 coins and one record even after reload',()=>{
 let s=start();for(let index=0;index<10;index++){s=toBoss(s);while(s.bossEnergy>0)s=hit(s);assert.equal(s.completed.length,index+1);if(index===9){s=restore(s);assert.equal(s.result.stars,3);s=restore(s)}s=act(s,'next-zone')}
 assert.equal(s.phase,PHASES.RESULT);assert.equal(s.completed.length*5,50);assert.equal(Object.keys(s.progress.records).length,1);assert.equal(s.progress.records[runKey(s.settings)].score,1300)
})
