const prefix = 'brucatgames:gorila-loco:best:'
export function readBest(storage, difficulty) {
  try {
    const score = Number(storage.getItem(prefix + difficulty))
    return Number.isFinite(score) && score >= 0 ? Math.floor(score) : 0
  } catch { return 0 }
}
export function saveBest(storage, difficulty, score) {
  const best = Math.max(readBest(storage, difficulty), Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0)
  try { storage.setItem(prefix + difficulty, String(best)); return { best, saved: true } }
  catch { return { best, saved: false } }
}
