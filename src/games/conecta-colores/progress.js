export const STORAGE_KEY = 'brucatgames:conecta-colores:v1'
const bounded = (value, max) => Number.isInteger(value) && value >= 0 && value <= max
export function cleanProgress(value) {
  const completed = {}
  for (let id = 1; id <= 30; id++) {
    const result = value?.completed?.[id]
    if (result && bounded(result.stars, 3) && result.stars > 0) {
      completed[id] = { stars: result.stars, hints: bounded(result.hints, 10000) ? result.hints : 0, restarts: bounded(result.restarts, 10000) ? result.restarts : 0, moves: bounded(result.moves, 10000) ? result.moves : 0 }
    }
  }
  let unlocked = 1
  while (unlocked < 30 && completed[unlocked]) unlocked++
  return { completed, unlocked, sound: value?.sound === true }
}
export function loadProgress(storage) {
  try { return cleanProgress(JSON.parse(storage.getItem(STORAGE_KEY))) } catch { return cleanProgress(null) }
}
export function persistProgress(storage, progress) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(cleanProgress(progress))); return true } catch { return false }
}
export function rememberResult(progress, id, result) {
  const previous = progress.completed[id]
  const better = !previous || result.stars > previous.stars || (result.stars === previous.stars && (result.hints < previous.hints || (result.hints === previous.hints && (result.restarts < previous.restarts || (result.restarts === previous.restarts && result.moves < previous.moves)))))
  return cleanProgress({ ...progress, completed: { ...progress.completed, [id]: better ? result : previous } })
}
