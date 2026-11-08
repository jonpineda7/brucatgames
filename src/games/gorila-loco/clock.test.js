import test from 'node:test'
import assert from 'node:assert/strict'
import { startClock } from './clock.js'

function harness() {
  let serial = 0
  const frames = new Map()
  const ticks = []
  const options = { requestFrame: callback => { frames.set(++serial, callback); return serial }, cancelFrame: id => frames.delete(id), onTick: tick => ticks.push(tick), random: () => .5 }
  function frame(time) { const [id, callback] = frames.entries().next().value; frames.delete(id); callback(time) }
  return { options, frames, ticks, frame }
}
test('one clock schedules one frame at a time and cleans up fully on pause/unmount', () => {
  const h = harness()
  const stop = startClock(h.options)
  assert.equal(h.frames.size, 1)
  h.frame(1000)
  h.frame(1050)
  assert.equal(h.ticks.length, 1)
  assert.equal(h.ticks[0].delta, 50)
  assert.equal(h.frames.size, 1)
  const late = [...h.frames.values()][0]
  stop()
  assert.equal(h.frames.size, 0)
  late(2000)
  assert.equal(h.ticks.length, 1)
  assert.equal(h.frames.size, 0)
})
test('a resumed clock uses a new origin and does not count time spent paused', () => {
  const h = harness()
  const first = startClock(h.options)
  h.frame(0); h.frame(50); first()
  const second = startClock(h.options)
  h.frame(40000); h.frame(40050)
  assert.deepEqual(h.ticks.map(tick => tick.delta), [50, 50])
  second()
})
