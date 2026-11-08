import test from 'node:test'
import assert from 'node:assert/strict'
import { LEVELS, endpoints } from './levels.js'
import { gameReducer, newGame, validatePaths, isWon } from './engine.js'

test('collection has 30 distinct predefined layouts and the required progression', () => {
  assert.equal(LEVELS.length,30)
  const layouts=new Set()
  for(const level of LEVELS){
    assert.equal(level.id,LEVELS.indexOf(level)+1)
    const [sizes,min,max]=level.id<=10?[[3,4],2,3]:level.id<=20?[[5],3,5]:[[6,7],4,6]
    assert.ok(sizes.includes(level.size)); assert.ok(level.solution.length>=min&&level.solution.length<=max)
    const signature=JSON.stringify([level.size,endpoints(level)]); assert.ok(!layouts.has(signature)); layouts.add(signature)
    assert.equal(new Set(endpoints(level).map(end=>end.cell)).size,level.solution.length*2)
  }
  assert.ok(LEVELS.slice(20).some(level=>level.coverAll))
})
test('every level has a valid, non-crossing witness solution; all 30 are solvable through the real reducer', () => {
  let state=newGame()
  for(const level of LEVELS){
    const solution=Object.fromEntries(level.solution.map(pair=>[pair.color,pair.cells]))
    assert.equal(validatePaths(level,solution),true,`level ${level.id} solution validity`)
    assert.equal(isWon(level,solution),true,`level ${level.id} solution victory`)
    state=gameReducer(state,{type:'start',id:level.id})
    assert.equal(state.levelId,level.id)
    for(const pair of level.solution){
      state=gameReducer(state,{type:'begin',cell:pair.cells[0]})
      for(const cell of pair.cells.slice(1)) state=gameReducer(state,{type:'move',cell})
      state=gameReducer(state,{type:'end'})
    }
    assert.equal(state.phase,'won',`level ${level.id} replay victory`)
    assert.equal(state.result.stars,3)
  }
  assert.equal(Object.keys(state.progress.completed).length,30); assert.equal(state.progress.unlocked,30)
})
