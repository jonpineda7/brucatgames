import test from 'node:test'
import assert from 'node:assert/strict'
import { getLevel } from './levels.js'
import { gameReducer as reduce, newGame, adjacent, isComplete, validatePaths, connectionCount, coveredCount, isWon, starsFor, planHint } from './engine.js'
import { pointerCell } from './interaction.js'
const start = () => reduce(newGame(), { type: 'start', id: 1 })
const action = (state, type, data = {}) => reduce(state, { type, ...data })
function draw(state, cells) { state = action(state, 'begin', { cell: cells[0] }); for (const cell of cells.slice(1)) state = action(state, 'move', { cell }); return action(state, 'end') }

test('orthogonal movement accepts rows and columns, rejecting diagonals, wrapping and out-of-bounds', () => {
  assert.equal(adjacent(0, 1, 3), true); assert.equal(adjacent(0, 3, 3), true)
  for (const [a,b] of [[0,4],[2,3],[-1,0],[8,9],[0,0],[0,1.5]]) assert.equal(adjacent(a,b,3),false)
  let state = action(start(),'begin',{cell:0})
  state = action(state,'move',{cell:4}); assert.deepEqual(state.paths.coral,[0])
  state = action(state,'move',{cell:1}); assert.deepEqual(state.paths.coral,[0,1])
})
test('drawing starts only at an endpoint and cannot traverse other colors or existing paths', () => {
  const initial = start()
  assert.deepEqual(action(initial,'begin',{cell:4}).paths,{})
  let state = action(initial,'begin',{cell:0})
  state = action(state,'move',{cell:3}); state = action(state,'move',{cell:6})
  assert.deepEqual(state.paths.coral,[0,3])
  state = action(state,'end'); state = action(state,'begin',{cell:6}); state = action(state,'move',{cell:3})
  assert.deepEqual(state.paths.sky,[6])
  assert.equal(validatePaths(getLevel(1),state.paths),true)
})
test('continuous straight drags interpolate every cell and stop at an obstacle', () => {
  let state = action(start(),'begin',{cell:0}); state = action(state,'move',{cell:2})
  assert.deepEqual(state.paths.coral,[0,1,2]); assert.equal(isComplete(getLevel(1),'coral',state.paths.coral),true)
  state = action(start(),'begin',{cell:0}); state = action(state,'move',{cell:6})
  assert.deepEqual(state.paths.coral,[0,3])
  assert.equal(action(state,'move',{cell:99}).paths,state.paths)
})
test('backtracking truncates a path and an endpoint can redraw a complete connection in reverse', () => {
  let state=action(start(),'begin',{cell:0}); state=action(state,'move',{cell:1}); state=action(state,'move',{cell:4}); state=action(state,'move',{cell:1})
  assert.deepEqual(state.paths.coral,[0,1]); state=action(state,'end'); state=draw(state,[0,1,2])
  state=action(state,'begin',{cell:2}); assert.deepEqual(state.paths.coral,[2]); state=action(state,'move',{cell:0})
  assert.deepEqual(state.paths.coral,[2,1,0]); assert.equal(connectionCount(getLevel(1),state.paths),1)
})
test('undo restores a whole gesture, erase is undoable, and restart clears all paths', () => {
  let state=draw(start(),[0,1,2]); const paths=state.paths
  state=action(state,'erase',{color:'coral'}); assert.deepEqual(state.paths,{})
  state=action(state,'undo'); assert.deepEqual(state.paths,paths)
  state=action(state,'undo'); assert.deepEqual(state.paths,{})
  state=draw(state,[0,1]); state=action(state,'restart')
  assert.deepEqual(state.paths,{}); assert.equal(state.active,null); assert.equal(state.history.length,0); assert.equal(state.restarts,1)
})
test('completion and victory are distinct; advanced levels also require full coverage', () => {
  let state=draw(start(),[0,1,2]); assert.equal(state.phase,'playing')
  state=draw(state,[6,7,8]); assert.equal(state.phase,'won'); assert.equal(state.result.stars,3); assert.equal(state.progress.unlocked,2)
  const level={size:3,coverAll:true,solution:[{color:'coral',cells:[0,1,2]},{color:'sky',cells:[3,4,5,8,7,6]}]}
  assert.equal(connectionCount(level,{coral:[0,1,2],sky:[3,6]}),2)
  assert.equal(isWon(level,{coral:[0,1,2],sky:[3,6]}),false)
  assert.equal(isWon(level,{coral:[0,1,2],sky:[3,4,5,8,7,6]}),true)
  assert.equal(coveredCount({coral:[0,1,2],sky:[3,6]}),5)
})
test('hint preserves compatible routes, counts help and reveals a real solution', () => {
  let state=draw(start(),[6,7,8]); state=action(state,'hint')
  assert.deepEqual(state.paths.sky,[6,7,8]); assert.deepEqual(state.hint.cells,[0,1,2]); assert.equal(state.hints,1)
  state=draw(state,[0,1,2]); assert.equal(state.phase,'won'); assert.equal(state.result.stars,2)
})
test('conflicting hints request confirmation before replacing paths; cancel is non-destructive', () => {
  let state=draw(start(),[6,3,4,1]); const paths=state.paths
  assert.deepEqual(planHint(getLevel(1),paths).conflicts,['sky'])
  state=action(state,'hint'); assert.equal(state.hints,0); assert.deepEqual(state.paths,paths)
  state=action(state,'cancel-hint'); assert.deepEqual(state.paths,paths)
  state=action(state,'hint'); state=action(state,'confirm-hint')
  assert.equal(state.paths.sky,undefined); assert.deepEqual(state.paths.coral,[0]); assert.equal(state.hints,1)
  assert.equal(validatePaths(getLevel(1),state.paths),true)
  state=action(state,'undo'); assert.deepEqual(state.paths,paths); assert.equal(state.hints,1)
})
test('pause freezes drawing, resume restores state, new levels clear history, and locks cannot be bypassed', () => {
  let state=draw(start(),[0,1]); const paths=state.paths
  state=action(state,'pause'); assert.equal(state.phase,'paused')
  assert.equal(action(state,'begin',{cell:0}),state); assert.equal(action(state,'restart'),state)
  state=action(state,'resume'); assert.deepEqual(state.paths,paths)
  assert.equal(action(state,'start',{id:30}),state)
  state=action(state,'start',{id:1}); assert.deepEqual(state.paths,{}); assert.equal(state.history.length,0)
})
test('star rules are deterministic and never penalize time', () => {
  assert.equal(starsFor({hints:0,restarts:0}),3); assert.equal(starsFor({hints:0,restarts:1}),3)
  assert.equal(starsFor({hints:0,restarts:2}),2); assert.equal(starsFor({hints:2,restarts:3}),2)
  assert.equal(starsFor({hints:3,restarts:0}),1); assert.equal(starsFor({hints:0,restarts:4}),1)
})
test('validation rejects collisions, discontinuities, repeated cells, unknown colors and traversed endpoints', () => {
  const level=getLevel(1)
  for (const paths of [{coral:[0,4,2]},{coral:[0,1,0]},{alien:[0]},{coral:[0,3,6]},{coral:[0,1,2,5]},{coral:[0,3,4],sky:[6,3]},{coral:[4]},{coral:[-1]},{coral:[0,9]}]) assert.equal(validatePaths(level,paths),false,JSON.stringify(paths))
})
test('pointer coordinates map to exact cells, exclude off-board releases and all four boundaries', () => {
  const rect={left:10,top:20,width:300,height:300}
  assert.equal(pointerCell(11,21,rect,3),0); assert.equal(pointerCell(160,170,rect,3),4); assert.equal(pointerCell(309,319,rect,3),8)
  for(const [x,y] of [[9,20],[10,19],[310,20],[10,320],[NaN,25]]) assert.equal(pointerCell(x,y,rect,3),null)
})
test('reducers preserve previous states and do not mutate stored paths',()=>{
  const state=start(); const snapshot=JSON.stringify(state); const next=draw(state,[0,1,2]); assert.equal(JSON.stringify(state),snapshot)
  const paths=next.paths; action(next,'erase',{color:'coral'}); assert.deepEqual(paths,{coral:[0,1,2]})
})
