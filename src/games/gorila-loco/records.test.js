import test from 'node:test'
import assert from 'node:assert/strict'
import { readBest, saveBest } from './records.js'

test('records are independent by difficulty and can only improve', () => {
  const data = new Map()
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  assert.equal(readBest(storage, 'easy'), 0)
  assert.deepEqual(saveBest(storage, 'easy', 100), { best: 100, saved: true })
  saveBest(storage, 'normal', 240)
  saveBest(storage, 'easy', 50)
  assert.equal(readBest(storage, 'easy'), 100)
  assert.equal(readBest(storage, 'normal'), 240)
  assert.equal(readBest(storage, 'hard'), 0)
})
test('blocked storage, malformed records and invalid scores never crash the game', () => {
  const blocked = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
  assert.equal(readBest(blocked, 'easy'), 0)
  assert.deepEqual(saveBest(blocked, 'hard', 330), { best: 330, saved: false })
  assert.deepEqual(saveBest(null, 'easy', 120), { best: 120, saved: false })
  for (const invalid of ['NaN', '-100', 'Infinity', 'bad']) assert.equal(readBest({ getItem: () => invalid }, 'easy'), 0)
})
