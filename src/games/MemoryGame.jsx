import MemoryResult from './MemoryResult'
import { useEffect, useReducer, useRef, useState } from 'react'
import { createGame, getGameStatus, memoryReducer, symbols } from './memory'

export default function MemoryGame() {
  const [game, dispatch] = useReducer(memoryReducer, undefined, createGame)
  const [sound, setSound] = useState(false)
  const audio = useRef(null)
  const status = getGameStatus(game)
  const finished = status !== 'playing'
  const resultReady = finished && game.flipped.length === 0
  const pairs = game.matched.length / 2

  useEffect(() => {
    if (game.flipped.length !== 2) return
    const timer = setTimeout(() => dispatch({ type: 'resolve' }), 1000)
    return () => clearTimeout(timer)
  }, [game.flipped])
  useEffect(() => () => { audio.current?.close().catch(() => {}) }, [])
  useEffect(() => {
    // Warm the six shared images before the first reveal.
    [...symbols, { image: 'images/results/victory.png' }, { image: 'images/results/game-over.png' }].forEach(symbol => {
      const image = new window.Image()
      image.src = `${import.meta.env.BASE_URL}${symbol.image}`
    })
  }, [])

  function flip(card) {
    if (finished || game.flipped.length === 2 || game.flipped.includes(card.id) || game.matched.includes(card.id)) return
    dispatch({ type: 'flip', id: card.id })
    if (!sound) return
    try {
      const Audio = window.AudioContext || window.webkitAudioContext
      if (!Audio) return
      audio.current ||= new Audio()
      const context = audio.current
      context.resume().catch(() => {})
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.connect(gain); gain.connect(context.destination)
      const match = game.flipped.length === 1 && game.cards.find(item => item.id === game.flipped[0]).pair === card.pair
      oscillator.frequency.value = match ? 660 : 330
      gain.gain.setValueAtTime(.045, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .15)
      oscillator.start(); oscillator.stop(context.currentTime + .16)
    } catch { /* Sound is optional on browsers without audio support. */ }
  }

  return (
    <section className="memory-layout" aria-labelledby="memory-title">
      <div className="game-heading">
        <div><span className="eyebrow">INFANTIL / MEMORIA</span><h1 id="memory-title">Memoria Gorila<span className="cyan">.</span></h1><p>Encuentra las parejas. Juega a tu ritmo.</p></div>
        <button className="icon-button" onClick={() => setSound(previous => !previous)} aria-pressed={sound}>{sound ? '♪ Sonido activado' : '♪ Activar sonido'}</button>
      </div>
      <div className="memory-workspace">
        <aside className="game-guide">
          <span className="guide-icon" aria-hidden="true">🦍</span>
          <h2>¡Pon a prueba tu memoria!</h2>
          <ol><li>Descubre dos cartas.</li><li>Busca sus parejas.</li><li>¡Completa el tablero!</li></ol>
          <p>{game.moveLimit === null ? 'Sin reloj ni vidas. Cada intento cuenta.' : 'Encuentra las seis parejas en 12 movimientos. Cada dos cartas cuentan como un movimiento.'}</p>
          <a className="text-link" href="#/infantil">← Otros juegos</a>
        </aside>
        <div className="board-panel">
          <fieldset className="memory-modes">
            <legend>Elige cómo jugar · Cambiar de modo reinicia la partida</legend>
            <label><input type="radio" name="memory-mode" checked={game.moveLimit === null} onChange={() => dispatch({ type: 'restart', game: createGame() })} /> Sin límite</label>
            <label><input type="radio" name="memory-mode" checked={game.moveLimit !== null} onChange={() => dispatch({ type: 'restart', game: createGame(Math.random, 12) })} /> Desafío · 12 movimientos</label>
          </fieldset>
          <p className="mode-description">{game.moveLimit === null ? 'Explora a tu ritmo. Aquí siempre puedes seguir intentándolo.' : `Te quedan ${Math.max(0, game.moveLimit - game.moves)} movimientos para encontrar las seis parejas.`}</p>
          <div className="game-stats"><span><strong>{pairs}<small> / 6</small></strong> parejas</span><span><strong>{game.moves}</strong> movimientos</span><button className="text-button" onClick={() => dispatch({ type: 'restart', game: createGame(Math.random, game.moveLimit) })}>↻ Reiniciar</button></div>
          <div className="memory-board" aria-label="Tablero de seis parejas">
            {game.cards.map((card, index) => {
              const matched = game.matched.includes(card.id)
              const visible = matched || game.flipped.includes(card.id)
              return <button key={card.id} className={`memory-card ${visible ? 'revealed' : ''} ${matched ? 'matched' : ''}`}
                disabled={matched || game.flipped.includes(card.id) || game.flipped.length === 2 || finished}
                aria-label={visible ? `${card.name}${matched ? ', pareja encontrada' : ''}` : `Descubrir carta ${index + 1}`}
                onClick={() => flip(card)}>
                <span className={`card-face ${visible ? 'card-face-illustration' : ''}`} aria-hidden="true">
                  {visible ? <img src={`${import.meta.env.BASE_URL}${card.image}`} alt="" width="384" height="384" draggable={false} /> : 'B'}
                </span>
                <span className="card-caption">{visible ? card.name : 'BRUCAT'}</span>
                {matched && <span className="match-check" aria-hidden="true">✓</span>}
              </button>
            })}
          </div>
          <p className="board-status" role="status" aria-live="polite">{finished ? status === 'won' ? '¡Lo lograste! Encontraste todas las parejas.' : 'Desafío terminado. ¡Puedes volver a intentarlo!' : game.flipped.length === 2 ? game.matched.includes(game.flipped[0]) ? '¡Una pareja más! Bien hecho.' : 'Mira sus posiciones y vuelve a intentarlo.' : 'Elige dos cartas y encuentra su pareja.'}</p>
          {resultReady && <MemoryResult status={status} moves={game.moves} pairs={pairs}
            onRestart={() => dispatch({ type: 'restart', game: createGame(Math.random, game.moveLimit) })} />}
        </div>
      </div>
    </section>
  )
}
