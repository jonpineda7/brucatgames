import test from 'node:test'
import assert from 'node:assert/strict'
import { ANIMALS, GOLD, TRAPS, DURATION, DIFFICULTIES, createRound, advanceRound, roundReducer, multiplier, rating } from './engine.js'

function playing(difficulty = 'easy') { return roundReducer(createRound(difficulty), { type: 'start' }) }
function withTarget(state, kind = 'animal', index = 0) {
  const holes = [...state.holes]
  holes[index] = { id: state.serial + 1, kind, character: kind === 'trap' ? TRAPS[0] : kind === 'gold' ? GOLD : ANIMALS[0], born: state.elapsed, expires: state.elapsed + 1000, consumed: false }
  return { ...state, holes, serial: state.serial + 1 }
}
function hit(state, index = 0) { return roundReducer(state, { type: 'hit', index, id: state.holes[index]?.id ?? null }) }

test('start, restart and changing difficulty do not inherit a previous round', () => {
  let state = roundReducer(createRound(), { type: 'difficulty', difficulty: 'hard' })
  state = roundReducer(state, { type: 'start' })
  state = hit(withTarget(state))
  assert.equal(state.score, 10)
  assert.equal(roundReducer(state, { type: 'difficulty', difficulty: 'easy' }), state)
  state = roundReducer(state, { type: 'restart' })
  assert.equal(state.difficulty, 'hard')
  assert.equal(state.elapsed, 0)
  assert.equal(state.score, 0)
  assert.equal(state.hits, 0)
  assert.equal(state.phase, 'playing')
  state = roundReducer(state, { type: 'menu' })
  state = roundReducer(state, { type: 'difficulty', difficulty: 'normal' })
  assert.equal(state.difficulty, 'normal')
  assert.equal(createRound('invalid').difficulty, 'easy')
})
test('normal and golden characters award base points; trap penalties never make score negative', () => {
  assert.equal(hit(withTarget(playing())).score, 10)
  assert.equal(hit(withTarget(playing(), 'gold')).score, 30)
  let state = hit(withTarget(playing(), 'trap'))
  assert.equal(state.score, 0)
  assert.equal(state.errors, 1)
  state = hit(withTarget({ ...playing(), score: 25 }, 'trap'))
  assert.equal(state.score, 15)
})
test('the third hit starts x2 and the sixth starts x3, capped thereafter', () => {
  let state = playing()
  for (let i = 0; i < 9; i++) state = hit(withTarget(state))
  assert.equal(state.streak, 9)
  assert.equal(state.bestStreak, 9)
  assert.equal(state.hits, 9)
  assert.equal(state.score, 20 + 60 + 120)
  assert.equal(multiplier(99), 3)
  state = hit(withTarget(state, 'gold'))
  assert.equal(state.event.points, 90)
  state = hit(withTarget(state, 'trap'))
  assert.equal(state.streak, 0)
  assert.equal(state.bestStreak, 10)
})
test('a spawn can score only once, even on rapid duplicate or stale clicks', () => {
  let state = withTarget(playing())
  const id = state.holes[0].id
  state = hit(state)
  assert.equal(roundReducer(state, { type: 'hit', index: 0, id }), state)
  state = withTarget(state)
  assert.equal(roundReducer(state, { type: 'hit', index: 0, id }), state)
  assert.equal(roundReducer(state, { type: 'hit', index: 0, id: null }), state)
  assert.equal(roundReducer(state, { type: 'hit', index: 99, id }), state)
})
test('missing a positive target or tapping an empty hole breaks streak; avoiding a trap is safe', () => {
  const initial = { ...playing(), streak: 4, bestStreak: 4, nextSpawn: 5000 }
  let state = advanceRound(withTarget(initial), 1000)
  assert.equal(state.streak, 0)
  assert.equal(state.errors, 1)
  state = advanceRound(withTarget(initial, 'trap'), 1000)
  assert.equal(state.streak, 4)
  assert.equal(state.errors, 0)
  state = hit(initial)
  assert.equal(state.streak, 0)
  assert.equal(state.errors, 1)
})
test('pause freezes time, expiry, spawning and input; resume continues from active time', () => {
  let state = advanceRound(playing(), 350, [.1, .8, .2])
  const target = state.holes.find(Boolean)
  assert.ok(target)
  state = roundReducer(state, { type: 'pause' })
  assert.equal(advanceRound(state, 30000), state)
  assert.equal(hit(state, state.holes.findIndex(Boolean)), state)
  state = roundReducer(state, { type: 'resume' })
  state = advanceRound(state, 500)
  assert.equal(state.elapsed, 850)
  assert.equal(state.holes.find(Boolean).expires, target.expires)
})
test('every difficulty respects visibility and capacity over a complete 60-second round', () => {
  for (const [difficulty, config] of Object.entries(DIFFICULTIES)) {
    let state = playing(difficulty)
    const seenIds = new Set()
    for (let tick = 0; tick < 600; tick++) {
      state = advanceRound(state, 100, [(tick % 9) / 9, .8, (tick % 4) / 4])
      assert.ok(state.holes.filter(Boolean).length <= config.max)
      assert.equal(state.holes.length, 9)
      for (const hole of state.holes.filter(Boolean)) {
        assert.equal(hole.expires - hole.born, config.visible)
        seenIds.add(hole.id)
      }
    }
    assert.ok(seenIds.size > 10)
    assert.equal(state.elapsed, DURATION)
    assert.equal(state.phase, 'finished')
    assert.equal(state.holes.filter(Boolean).length, 0)
    assert.equal(advanceRound(state, 1000), state)
    assert.equal(hit(state), state)
  }
})
test('random rolls choose different available holes and gold/trap types without overlaps', () => {
  const left = advanceRound(playing(), 350, [0, .8, 0])
  const right = advanceRound(playing(), 350, [.999, .8, .99])
  assert.ok(left.holes[0])
  assert.ok(right.holes[8])
  assert.equal(advanceRound(playing(), 350, [0, 0, 0]).holes[0].kind, 'trap')
  assert.equal(advanceRound(playing(), 350, [0, .1, 0]).holes[0].kind, 'gold')
  let state = playing('hard')
  for (let i = 0; i < 3; i++) state = advanceRound(state, 350, [0, .8, 0])
  assert.ok(state.holes[0] && state.holes[1])
  assert.equal(new Set(state.holes.filter(Boolean).map(hole => hole.id)).size, state.holes.filter(Boolean).length)
})
test('long frames finish exactly once and invalid frame times leave state untouched', () => {
  const state = playing()
  assert.equal(advanceRound(state, NaN), state)
  assert.equal(advanceRound(state, -10), state)
  const end = advanceRound(state, 120000)
  assert.equal(end.elapsed, DURATION)
  assert.equal(end.phase, 'finished')
  assert.equal(advanceRound(end, 1000), end)
  assert.deepEqual([rating(0), rating(150), rating(450)], [1, 2, 3])
})
test('engine never mutates the previous state or occupied slots', () => {
  const state = advanceRound(playing(), 350, [0, .8, 0])
  const snapshot = structuredClone(state)
  hit(state)
  advanceRound(state, 2000)
  assert.deepEqual(state, snapshot)
})
