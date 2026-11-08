import { LEVELS, getLevel, endpoints } from './levels.js'
import { cleanProgress, rememberResult } from './progress.js'

export const adjacent = (a, b, size) => Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0 && a < size * size && b < size * size && Math.abs(Math.floor(a / size) - Math.floor(b / size)) + Math.abs(a % size - b % size) === 1
export function isComplete(level, color, path = []) {
  const solution = level.solution.find(pair => pair.color === color)
  return !!solution && path.length > 1 && ((path[0] === solution.cells[0] && path.at(-1) === solution.cells.at(-1)) || (path[0] === solution.cells.at(-1) && path.at(-1) === solution.cells[0]))
}
export function validatePaths(level, paths) {
  const used = new Set()
  const ends = endpoints(level)
  return Object.entries(paths).every(([color, path]) => {
    if (!level.solution.some(pair => pair.color === color) || !Array.isArray(path)) return false
    return path.every((cell, index) => {
      if (!Number.isInteger(cell) || cell < 0 || cell >= level.size ** 2 || used.has(cell)) return false
      if (index === 0 && !ends.some(end => end.color === color && end.cell === cell)) return false
      if (index > 0 && !adjacent(path[index - 1], cell, level.size)) return false
      if (ends.some(end => end.cell === cell && end.color !== color)) return false
      if (index > 0 && ends.some(end => end.cell === cell && end.color === color) && index !== path.length - 1) return false
      used.add(cell)
      return true
    })
  })
}
export const connectionCount = (level, paths) => level.solution.filter(pair => isComplete(level, pair.color, paths[pair.color])).length
export const coveredCount = paths => new Set(Object.values(paths).flat()).size
export const isWon = (level, paths) => validatePaths(level, paths) && connectionCount(level, paths) === level.solution.length && (!level.coverAll || coveredCount(paths) === level.size ** 2)
export const starsFor = ({ hints, restarts }) => hints === 0 && restarts <= 1 ? 3 : hints <= 2 && restarts <= 3 ? 2 : 1
const samePaths = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const canonical = (path, cells) => samePaths(path, cells) || samePaths(path, [...cells].reverse())
export function planHint(level, paths) {
  const pair = level.solution.find(pair => !isComplete(level, pair.color, paths[pair.color])) || level.solution.find(pair => !canonical(paths[pair.color], pair.cells))
  if (!pair) return null
  const conflicts = Object.entries(paths).filter(([color, path]) => color !== pair.color && path.some(cell => pair.cells.includes(cell))).map(([color]) => color)
  return { color: pair.color, cells: pair.cells, conflicts }
}
const notice = (state, message, sound = 'spawn') => ({ ...state, message, event: { id: state.event.id + 1, sound } })
const pushHistory = (state, paths) => [...state.history, paths].slice(-100)
function commit(state) {
  if (!state.before) return { ...state, active: null }
  return { ...state, active: null, before: null, history: samePaths(state.before, state.paths) ? state.history : pushHistory(state, state.before) }
}
function settle(state) {
  const level = getLevel(state.levelId)
  if (!isWon(level, state.paths)) return state
  const result = { stars: starsFor(state), hints: state.hints, restarts: state.restarts, moves: state.moves }
  return notice({ ...commit(state), phase: 'won', result, progress: rememberResult(state.progress, state.levelId, result) }, state.levelId === 30 ? '¡Completaste la gran aventura de colores!' : '¡Lo lograste! Cada conexión cuenta.', 'finish')
}
export function newGame(progress) {
  return { phase: 'welcome', levelId: 1, paths: {}, active: null, before: null, history: [], hints: 0, restarts: 0, moves: 0, hint: null, pendingHint: null, tutorial: false, result: null, progress: cleanProgress(progress), message: '¡Une los colores iguales!', event: { id: 0, sound: null } }
}
function step(state, cell) {
  const level = getLevel(state.levelId)
  const color = state.active
  const path = state.paths[color]
  if (!path || cell === path.at(-1)) return state
  if (!adjacent(path.at(-1), cell, level.size)) return notice(state, 'Ve de una casilla a la siguiente, sin diagonales.', 'miss')
  const index = path.indexOf(cell)
  if (index >= 0) return notice({ ...state, paths: { ...state.paths, [color]: path.slice(0, index + 1) } }, 'Puedes retroceder y probar otro camino.')
  if (isComplete(level, color, path)) return state
  if (endpoints(level).some(end => end.cell === cell && end.color !== color) || Object.entries(state.paths).some(([other, cells]) => other !== color && cells.includes(cell))) return notice(state, 'Ese espacio está ocupado. ¡Intenta otro camino!', 'miss')
  const paths = { ...state.paths, [color]: [...path, cell] }
  const connected = isComplete(level, color, paths[color])
  let next = notice({ ...state, paths, hint: state.hint?.color === color && connected ? null : state.hint }, connected ? '¡Excelente conexión!' : '¡Sigue el camino!', connected ? 'hit' : 'spawn')
  if (connected) next = commit(next)
  return settle(next)
}
export function gameReducer(state, action) {
  const level = getLevel(state.levelId)
  switch (action.type) {
    case 'levels': return { ...commit(state), phase: 'levels', pendingHint: null }
    case 'welcome': return { ...commit(state), phase: 'welcome', pendingHint: null }
    case 'sound': return { ...state, progress: { ...state.progress, sound: !state.progress.sound } }
    case 'start': {
      if (!Number.isInteger(action.id) || action.id < 1 || action.id > Math.min(state.progress.unlocked, LEVELS.length)) return state
      return notice({ ...newGame(state.progress), phase: 'playing', levelId: action.id, tutorial: action.tutorial === true || (action.id === 1 && !state.progress.completed[1]), event: state.event }, 'Empieza en un punto y llévalo hasta su pareja.', 'start')
    }
    case 'pause': return state.phase === 'playing' ? { ...commit(state), phase: 'paused' } : state
    case 'resume': return state.phase === 'paused' ? { ...state, phase: 'playing' } : state
    case 'tutorial': return { ...state, tutorial: !state.tutorial }
    default: break
  }
  if (state.phase !== 'playing') return state
  switch (action.type) {
    case 'begin': {
      const end = endpoints(level).find(end => end.cell === action.cell)
      if (!end) return notice(state, 'Empieza en uno de los puntos con símbolo.', 'miss')
      const committed = commit(state)
      return notice({ ...committed, before: committed.paths, paths: { ...committed.paths, [end.color]: [action.cell] }, active: end.color, hint: state.hint?.color === end.color ? state.hint : null, moves: state.moves + 1, pendingHint: null }, '¡Lleva este símbolo hasta su pareja!')
    }
    case 'move': {
      if (!state.active || state.pendingHint) return state
      // Interpolate skipped cells only on a straight row/column; every step is validated.
      const from = state.paths[state.active].at(-1)
      const target = action.cell
      if (!Number.isInteger(target) || target < 0 || target >= level.size ** 2 || (Math.floor(from / level.size) !== Math.floor(target / level.size) && from % level.size !== target % level.size)) return notice(state, 'Sin diagonales: avanza de lado o hacia arriba y abajo.', 'miss')
      const delta = from === target ? 0 : Math.floor(from / level.size) === Math.floor(target / level.size) ? Math.sign(target - from) : Math.sign(target - from) * level.size
      let next = state
      if (!delta) return next
      for (let cell = from + delta; ; cell += delta) {
        const previous = next.paths[next.active]
        next = step(next, cell)
        if (!next.active || next.paths[next.active] === previous || cell === target) break
      }
      return next
    }
    case 'end': return commit(state)
    case 'undo': {
      const current = commit(state)
      const paths = current.history.at(-1)
      return paths ? notice({ ...current, paths, history: current.history.slice(0, -1), hint: null, pendingHint: null }, 'Un paso atrás también ayuda a avanzar.') : current
    }
    case 'erase': {
      if (!state.paths[action.color]) return state
      const current = commit(state)
      const paths = { ...current.paths }; delete paths[action.color]
      return notice({ ...current, paths, history: pushHistory(current, current.paths), hint: null, pendingHint: null }, 'Camino borrado. ¡Prueba una nueva idea!')
    }
    case 'restart': return notice({ ...state, paths: {}, active: null, before: null, history: [], hint: null, pendingHint: null, restarts: state.restarts + 1 }, 'Tablero nuevo, nuevas ideas. ¡Tú puedes!', 'start')
    case 'hint': {
      const current = commit(state)
      const hint = planHint(level, current.paths)
      if (!hint) return notice(current, '¡Todo conectado!')
      if (hint.conflicts.length) return notice({ ...current, pendingHint: hint }, 'Para mostrar esta pista necesitamos cambiar los caminos indicados.')
      return applyHint(current, hint)
    }
    case 'confirm-hint': return state.pendingHint ? applyHint(state, state.pendingHint) : state
    case 'cancel-hint': return { ...state, pendingHint: null }
    default: return state
  }
}
function applyHint(state, hint) {
  const paths = { ...state.paths }
  hint.conflicts.forEach(color => { delete paths[color] })
  paths[hint.color] = [hint.cells[0]]
  return notice({ ...state, paths, history: pushHistory(state, state.paths), hints: state.hints + 1, hint, pendingHint: null }, 'Sigue la línea de puntos desde el símbolo brillante. ¡Tú dibujas la conexión!', 'combo')
}
