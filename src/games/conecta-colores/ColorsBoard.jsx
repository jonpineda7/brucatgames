import { useEffect, useRef, useState } from 'react'
import { colorInfo, endpoints } from './levels.js'
import { isComplete } from './engine.js'
import { pointerCell } from './interaction.js'
function pathPoints(cells, size) { return cells.map(cell => `${cell % size * 100 + 50},${Math.floor(cell / size) * 100 + 50}`).join(' ') }

export default function ColorsBoard({ level, state, act }) {
  const board = useRef(null)
  const buttons = useRef([])
  const pointer = useRef(null)
  const [focused, setFocused] = useState(0)
  const ends = endpoints(level)
  useEffect(() => {
    buttons.current[0]?.focus({ preventScroll: true })
    pointer.current = null
    if (window.matchMedia('(max-width: 700px)').matches) board.current?.closest('.colors-board-panel')?.scrollIntoView({ block: 'start' })
  }, [level.id])
  const position = event => pointerCell(event.clientX, event.clientY, board.current?.getBoundingClientRect(), level.size)
  function release(event) {
    if (pointer.current !== event.pointerId) return
    pointer.current = null
    if (board.current?.hasPointerCapture(event.pointerId)) board.current.releasePointerCapture(event.pointerId)
    const cell = position(event)
    if (event.type === 'pointerup' && cell !== null) act({ type: 'move', cell })
    act({ type: 'end' })
  }
  function start(event) {
    if (pointer.current !== null || event.button !== 0 || state.pendingHint) return
    const cell = position(event)
    if (cell === null) return
    event.preventDefault()
    setFocused(cell); buttons.current[cell]?.focus({ preventScroll: true })
    act({ type: 'begin', cell })
    if (ends.some(end => end.cell === cell)) { pointer.current = event.pointerId; board.current.setPointerCapture(event.pointerId) }
  }
  function keyDown(event) {
    const directions = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -level.size, ArrowDown: level.size }
    if (event.key in directions) {
      event.preventDefault()
      const next = focused + directions[event.key]
      if (next < 0 || next >= level.size ** 2 || (['ArrowLeft', 'ArrowRight'].includes(event.key) && Math.floor(next / level.size) !== Math.floor(focused / level.size))) return
      setFocused(next); buttons.current[next]?.focus({ preventScroll: true })
      if (state.active) act({ type: 'move', cell: next })
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      act({ type: state.active ? 'move' : 'begin', cell: focused })
    } else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); act({ type: 'end' }) }
    else if (event.key === 'Tab' && state.active) act({ type: 'end' })
  }
  return <div className="colors-board-frame"><div className={`colors-board ${state.event.sound === 'miss' ? 'colors-blocked' : ''}`} style={{ '--size': level.size }} ref={board} role="group" aria-label={`Tablero de ${level.size} por ${level.size}`} aria-describedby={`colors-keyboard${state.hint ? ' colors-hint-instructions' : ''}`} onKeyDown={keyDown} onPointerDown={start} onPointerMove={event => { if (pointer.current === event.pointerId) { const cell = position(event); if (cell !== null) act({ type: 'move', cell }) } }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={event => { if (pointer.current === event.pointerId) { pointer.current = null; act({ type: 'end' }) } }}>
    <svg className="colors-paths" viewBox={`0 0 ${level.size * 100} ${level.size * 100}`} aria-hidden="true">
      {state.hint && <polyline className="colors-hint-route" points={pathPoints(state.hint.cells, level.size)} stroke={colorInfo(state.hint.color).value} />}
      {Object.entries(state.paths).map(([color, cells]) => <polyline key={color} className={isComplete(level, color, cells) ? 'colors-connected' : ''} points={pathPoints(cells, level.size)} stroke={colorInfo(color).value} />)}
    </svg>
    {Array.from({ length: level.size ** 2 }, (_, cell) => {
      const endpoint = ends.find(end => end.cell === cell)
      const owner = Object.keys(state.paths).find(color => state.paths[color].includes(cell))
      const color = colorInfo(endpoint?.color || owner)
      const connected = endpoint && isComplete(level, endpoint.color, state.paths[endpoint.color])
      return <button type="button" key={cell} ref={element => { buttons.current[cell] = element }} tabIndex={focused === cell ? 0 : -1} onFocus={() => setFocused(cell)} className={`colors-cell ${endpoint ? 'has-point' : ''} ${connected ? 'is-connected' : ''} ${state.tutorial && endpoint && !connected ? 'tutorial-point' : ''}`} aria-label={`Fila ${Math.floor(cell / level.size) + 1}, columna ${cell % level.size + 1}: ${endpoint ? `punto ${color.name}, ${color.symbol}${connected ? ', conectado' : ''}` : owner ? `camino ${color.name}` : 'vacía'}`} style={color ? { '--point-color': color.value } : undefined}>{endpoint && <span className="colors-dot" aria-hidden="true">{color.symbol}</span>}</button>
    })}
  </div></div>
}
