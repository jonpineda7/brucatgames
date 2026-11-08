// One scheduler per running round. The first frame establishes a fresh time
// origin, so resuming never charges the time spent paused.
export function startClock({ requestFrame, cancelFrame, onTick, random = Math.random }) {
  let frame = null
  let previous = null
  let stopped = false
  const update = now => {
    if (stopped) return
    if (previous === null) previous = now
    const delta = now - previous
    if (delta >= 40) {
      previous = now
      onTick({ delta, rolls: Array.from({ length: 6 }, random) })
    }
    if (!stopped) frame = requestFrame(update)
  }
  frame = requestFrame(update)
  return () => { stopped = true; if (frame !== null) cancelFrame(frame) }
}
