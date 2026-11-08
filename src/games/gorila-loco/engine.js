export const DURATION = 60_000
export const DIFFICULTIES = {
  easy: { name: 'Fácil', level: 1, visible: 1800, interval: 2050, max: 1, trapChance: .08 },
  normal: { name: 'Normal', level: 2, visible: 1200, interval: 760, max: 2, trapChance: .16 },
  hard: { name: 'Difícil', level: 3, visible: 800, interval: 340, max: 3, trapChance: .24 },
}
export const ANIMALS = [
  { id: 'monkey', name: 'Mono travieso', image: 'images/gorila-loco/monkey.svg' },
  { id: 'cat', name: 'Gato loco', image: 'images/memory/orange-cat.png' },
  { id: 'llama', name: 'Llama divertida', image: 'images/memory/llama.png' },
  { id: 'turtle', name: 'Tortuga sonriente', image: 'images/memory/turtle.png' },
]
export const GOLD = { id: 'gold', name: 'Banana dorada', image: 'images/gorila-loco/golden-banana.svg' }
export const TRAPS = [
  { id: 'bomb', name: 'Bomba: evita tocarla', image: 'images/gorila-loco/bomb.svg' },
  { id: 'skull', name: 'Calavera: evita tocarla', image: 'images/gorila-loco/skull.svg' },
]
export function multiplier(streak) { return streak >= 6 ? 3 : streak >= 3 ? 2 : 1 }
export function rating(score) { return score >= 450 ? 3 : score >= 150 ? 2 : 1 }
export function createRound(difficulty = 'easy', phase = 'ready') {
  const selected = Object.hasOwn(DIFFICULTIES, difficulty) ? difficulty : 'easy'
  return { difficulty: selected, phase, elapsed: 0, nextSpawn: 350, holes: Array(9).fill(null), score: 0,
    hits: 0, errors: 0, streak: 0, bestStreak: 0, serial: 0, eventSerial: 0, event: null }
}
function event(state, type, extra = {}) {
  return { ...state, eventSerial: state.eventSerial + 1, event: { id: state.eventSerial + 1, type, ...extra } }
}
function miss(state) { return event({ ...state, errors: state.errors + 1, streak: 0 }, 'miss') }

// The engine uses active play time, never wall-clock time. Random rolls are
// supplied by the caller so the reducer stays deterministic, including StrictMode.
export function advanceRound(state, delta, rolls = [.5]) {
  if (state.phase !== 'playing' || !Number.isFinite(delta) || delta <= 0) return state
  const config = DIFFICULTIES[state.difficulty]
  const end = Math.min(DURATION, state.elapsed + delta)
  let next = { ...state, holes: [...state.holes] }
  let cursor = 0
  const roll = () => {
    const value = rolls[cursor++ % Math.max(1, rolls.length)] ?? .5
    return Math.min(.999999, Math.max(0, Number.isFinite(value) ? value : .5))
  }
  while (next.elapsed < end) {
    const expiry = Math.min(...next.holes.filter(Boolean).map(hole => hole.expires))
    const time = Math.min(end, next.nextSpawn, expiry)
    next.elapsed = time
    const missed = next.holes.filter(hole => hole && hole.expires <= time && !hole.consumed && hole.kind !== 'trap').length
    next.holes = next.holes.map(hole => hole && hole.expires <= time ? null : hole)
    for (let index = 0; index < missed; index++) next = miss(next)
    if (time >= DURATION) {
      return event({ ...next, phase: 'finished', holes: Array(9).fill(null), streak: 0 }, 'finish')
    }
    if (next.nextSpawn <= time) {
      const available = next.holes.map((hole, index) => hole ? -1 : index).filter(index => index !== -1)
      const count = next.holes.filter(Boolean).length
      if (available.length && count < config.max) {
        const index = available[Math.floor(roll() * available.length)]
        const typeRoll = roll()
        const kind = typeRoll < config.trapChance ? 'trap' : typeRoll < config.trapChance + .12 ? 'gold' : 'animal'
        const options = kind === 'trap' ? TRAPS : kind === 'gold' ? [GOLD] : ANIMALS
        const character = options[Math.floor(roll() * options.length)]
        next.serial++
        next.holes[index] = { id: next.serial, kind, character, born: time, expires: time + config.visible, consumed: false }
        next = event(next, 'spawn')
      }
      next.nextSpawn = time + config.interval
    }
  }
  return next
}
export function roundReducer(state, action) {
  switch (action.type) {
    case 'difficulty': return state.phase === 'ready' ? createRound(action.difficulty) : state
    case 'start': return event(createRound(state.difficulty, 'playing'), 'start')
    case 'restart': return event(createRound(state.difficulty, 'playing'), 'start')
    case 'menu': return createRound(state.difficulty)
    case 'pause': return state.phase === 'playing' ? { ...state, phase: 'paused' } : state
    case 'resume': return state.phase === 'paused' ? { ...state, phase: 'playing' } : state
    case 'tick': return advanceRound(state, action.delta, action.rolls)
    case 'hit': {
      if (state.phase !== 'playing' || !Number.isInteger(action.index) || action.index < 0 || action.index > 8) return state
      const target = state.holes[action.index]
      // A stale input cannot hit a newer spawn, or score the same spawn twice.
      if ((target?.id ?? null) !== action.id || target?.consumed) return state
      if (!target) return miss(state)
      const trap = target.kind === 'trap'
      const streak = trap ? 0 : state.streak + 1
      const points = trap ? -10 : (target.kind === 'gold' ? 30 : 10) * multiplier(streak)
      const actualPoints = Math.max(0, state.score + points) - state.score
      const holes = [...state.holes]
      holes[action.index] = { ...target, consumed: true, expires: state.elapsed + 280, points: actualPoints }
      const next = { ...state, holes, score: Math.max(0, state.score + points), streak,
        hits: state.hits + (trap ? 0 : 1), errors: state.errors + (trap ? 1 : 0), bestStreak: Math.max(state.bestStreak, streak) }
      return event(next, trap ? 'trap' : streak % 3 === 0 ? 'combo' : 'hit', { index: action.index, points: actualPoints })
    }
    default: return state
  }
}
