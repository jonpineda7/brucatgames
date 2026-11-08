// Pure mapping shared by pointer input and tests. Border is excluded by the caller.
export function pointerCell(x, y, rect, size) {
  if (!Number.isFinite(x) || !Number.isFinite(y) || !rect || rect.width <= 0 || rect.height <= 0) return null
  const column = Math.floor((x - rect.left) / rect.width * size)
  const row = Math.floor((y - rect.top) / rect.height * size)
  return column < 0 || row < 0 || column >= size || row >= size ? null : row * size + column
}
