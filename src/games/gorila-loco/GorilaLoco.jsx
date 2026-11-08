import { useEffect, useId, useRef } from 'react'
import { ANIMALS, DIFFICULTIES, DURATION, GOLD, TRAPS, multiplier, rating } from './engine'
import useGorilaLoco from './useGorilaLoco'
import './GorilaLoco.css'

const base = import.meta.env.BASE_URL
function Artwork({ character, className = '' }) {
  return <img className={className} src={`${base}${character.image}`} alt="" draggable={false} />
}
function GameDialog({ title, children, variant = '' }) {
  const ref = useRef(null)
  const id = useId()
  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return <dialog ref={ref} className={`loco-dialog ${variant}`} aria-labelledby={id} onCancel={event => event.preventDefault()}>
    <h2 id={id}>{title}</h2>{children}
  </dialog>
}
function Rules({ compact = false }) {
  return <div className={`loco-rules ${compact ? 'compact' : ''}`}>
    <div><Artwork character={ANIMALS[0]} /><span><strong>Animales</strong><small>+10 puntos</small></span></div>
    <div><Artwork character={GOLD} /><span><strong>Dorada</strong><small>+30 puntos</small></span></div>
    <div><Artwork character={TRAPS[0]} /><span><strong>¡Evítala!</strong><small>−10 puntos</small></span></div>
  </div>
}
export default function GorilaLoco() {
  const { round, dispatch, sound, toggleSound, audioSupported, saved, begin, best, newRecord } = useGorilaLoco()
  const config = DIFFICULTIES[round.difficulty]
  const seconds = Math.max(0, Math.ceil((DURATION - round.elapsed) / 1000))
  const combo = multiplier(round.streak)
  const board = useRef(null)
  const lastPhase = useRef('ready')
  useEffect(() => {
    if (round.phase === 'playing' && lastPhase.current !== 'playing') board.current?.focus({ preventScroll: true })
    lastPhase.current = round.phase
  }, [round.phase])
  useEffect(() => {
    const assets = [...ANIMALS, GOLD, ...TRAPS]
    assets.forEach(character => { const image = new window.Image(); image.src = `${base}${character.image}` })
  }, [])

  return <section className="loco-game" data-phase={round.phase} aria-labelledby="loco-title">
    <div className="loco-heading">
      <div><span className="eyebrow">INFANTIL / ARCADE · 4–10 AÑOS</span><h1 id="loco-title">Gorila <span>Loco</span><i aria-hidden="true">!</i></h1><p>¡La selva se volvió loca! Atrapa a los animales traviesos.</p></div>
      <div className="loco-toolbar"><a className="text-link" href="#/infantil">← Juegos</a><button className="icon-button" aria-pressed={sound} onClick={toggleSound}>{sound ? '♪ Sonido: sí' : '♪ Sonido: no'}</button></div>
    </div>
    {!audioSupported && <p className="loco-audio-note" role="status">El sonido no está disponible en este navegador. Puedes seguir jugando.</p>}

    {round.phase === 'ready' ? <div className="loco-lobby">
      <div className="loco-lobby-art"><span className="jungle-sticker">60 SEGUNDOS DE AVENTURA</span><img src={`${base}images/categories/gorilla-playing.png`} alt="Gorila albino jugando con su control" width="1109" height="1419" /><span className="lobby-orbit orbit-one">✦</span><span className="lobby-orbit orbit-two">✦</span></div>
      <div className="loco-lobby-copy"><span className="eyebrow">REFLEJOS · COORDINACIÓN · DIVERSIÓN</span><h2>La próxima jugada<br /> está en tus manos.</h2><p>Los animales se esconden en la selva. Tócalos antes de que desaparezcan, busca la banana dorada y evita las trampas.</p><Rules />
        <fieldset className="loco-difficulties"><legend>Elige tu dificultad</legend>{Object.entries(DIFFICULTIES).map(([key, level]) => <label key={key}><input type="radio" name="loco-difficulty" value={key} checked={round.difficulty === key} onChange={() => dispatch({ type: 'difficulty', difficulty: key })} /><span><strong>{level.name}</strong><small>{level.max === 1 ? 'Un animal a la vez' : `Hasta ${level.max} a la vez`}</small></span></label>)}</fieldset>
        <div className="loco-lobby-bottom"><span className="loco-record">🏆 Tu récord <strong>{best}</strong></span><button className="loco-start" onClick={() => begin()}>¡Jugar ahora! <span aria-hidden="true">↗</span></button></div>
        <p className="loco-help">Tres aciertos seguidos activan x2; seis, x3. Una trampa, tocar un hueco vacío o dejar escapar un animal rompe la racha. Puedes pausar en cualquier momento.</p>
      </div>
    </div> : <>
      <div className="loco-hud" aria-label="Marcador de la partida">
        <div><span>PUNTOS</span><strong>{round.score}</strong></div>
        <div className={seconds <= 10 ? 'time-warning' : ''}><span>TIEMPO</span><strong>{seconds}<small>s</small></strong></div>
        <div><span>NIVEL {config.level}</span><strong className="loco-level">{config.name}</strong></div>
        <div className={combo > 1 ? 'combo-active' : ''}><span>COMBO · RACHA {round.streak}</span><strong>×{combo}</strong></div>
        <div><span>RÉCORD</span><strong>{Math.max(best, round.score)}</strong></div>
        <button className="loco-pause" onClick={() => dispatch({ type: 'pause' })} disabled={round.phase !== 'playing'}>Ⅱ Pausa</button>
      </div>
      <div className="loco-time-track" role="progressbar" aria-label="Tiempo de juego restante" aria-valuemin={0} aria-valuemax={60} aria-valuenow={seconds}><span style={{ transform: `scaleX(${Math.max(0, 1 - round.elapsed / DURATION)})` }} /></div>
      <div className="loco-play-layout">
        <aside className="loco-sidekick"><img src={`${base}images/categories/gorilla-playing.png`} alt="Gorila albino animándote a jugar" /><h2>¡Vamos, equipo!</h2><p>Toca con el dedo, usa el mouse o navega con Tab y pulsa Enter.</p><Rules compact /><p className="loco-help">Esc: pausar.<br />Cambiar de pestaña también pausa la partida.</p></aside>
        <div className={`jungle-board-wrap ${round.event?.type === 'trap' ? 'trap-reaction' : ''}`}>
          <div className="jungle-board" ref={board} tabIndex={-1} role="group" aria-label="Selva: nueve agujeros">
            <span className="jungle-leaf leaf-left" aria-hidden="true">❧</span><span className="jungle-leaf leaf-right" aria-hidden="true">❧</span>
            <div className="jungle-board-title"><span aria-hidden="true">✦</span> SELVA BRUCAT <span aria-hidden="true">✦</span></div>
            <div className="loco-holes">{round.holes.map((target, index) => <button type="button" key={index}
              className={`loco-hole ${target ? `occupied kind-${target.kind}` : ''} ${target?.consumed ? 'was-hit' : ''}`}
              onClick={() => dispatch({ type: 'hit', index, id: target?.id ?? null })}
              disabled={round.phase !== 'playing' || !!target?.consumed}
              aria-label={`Agujero ${index + 1}: ${target && !target.consumed ? target.character.name : 'vacío'}`}>
              <span className="hole-shadow" aria-hidden="true" />
              <span className="hole-clip" aria-hidden="true">{target && <span key={target.id} className={`loco-target ${target.consumed ? 'target-hit' : ''}`} style={{ '--visible': `${config.visible}ms` }}><Artwork character={target.character} />{target.kind === 'gold' && <span className="gold-glint">✦</span>}</span>}</span>
              <span className="hole-rim" aria-hidden="true" />
              {target?.consumed && <span className={`floating-score ${target.kind === 'trap' ? 'penalty' : ''}`} aria-hidden="true">{target.points > 0 ? '+' : ''}{target.points}<i>{target.kind === 'trap' ? '✸' : '✦'}</i></span>}
              <span className="hole-number" aria-hidden="true">{index + 1}</span>
            </button>)}</div>
            <div className="loco-combo-message" role="status" aria-live="polite">{round.event?.type === 'combo' ? round.streak >= 6 ? '¡SUPERCOMBO! ×3' : '¡GENIAL! ×2' : round.event?.type === 'trap' ? '¡Era una trampa! Sigue intentándolo.' : round.event?.type === 'miss' ? '¡Vamos por el siguiente!' : '¡Busca los animales y evita las trampas!'}</div>
          </div>
          <p className="loco-mini-rules">Animales +10 · Dorada +30 · Trampa −10 · Combo hasta ×3</p>
        </div>
      </div>
    </>}

    {round.phase === 'paused' && <GameDialog title="Una pausa en la selva" variant="loco-pause-dialog"><span className="pause-symbol" aria-hidden="true">Ⅱ</span><p>El tiempo y los animales están detenidos. Continúa cuando estés listo.</p><div className="result-actions"><button className="loco-start" onClick={() => dispatch({ type: 'resume' })}>Continuar jugando →</button><button className="secondary-button" onClick={() => begin('restart')}>Reiniciar esta partida</button><button className="text-button" onClick={() => dispatch({ type: 'menu' })}>Elegir dificultad</button><a className="text-link" href="#/infantil">Volver a juegos</a></div></GameDialog>}
    {round.phase === 'finished' && <GameDialog title={newRecord ? '¡Nuevo récord de la selva!' : round.score >= 150 ? '¡La selva está de fiesta!' : '¡Cada intento es una aventura!'} variant="loco-results">
      <img className="loco-result-art" src={`${base}images/results/${round.score >= 150 || newRecord ? 'victory' : 'game-over'}.png`} alt={round.score >= 150 || newRecord ? 'Gorila celebrando' : 'Gorila con una expresión cómica'} width="640" height="640" />
      <div className="loco-stars" aria-label={`${rating(round.score)} de 3 estrellas`}>{[1, 2, 3].map(star => <span key={star} className={star <= rating(round.score) ? 'earned' : ''} aria-hidden="true">★</span>)}</div>
      <p>{round.score >= 150 ? '¡Qué buenos reflejos! ¿Listo para otra ronda?' : '¡Buen esfuerzo! Ya conoces la selva. La próxima ronda trae otra oportunidad.'}</p>
      <div className="loco-results-grid"><span>Puntuación<strong>{round.score}</strong></span><span>Récord · {config.name}<strong>{best}</strong></span><span>Aciertos<strong>{round.hits}</strong></span><span>Errores<strong>{round.errors}</strong></span><span>Mejor racha<strong>{round.bestStreak}</strong></span><span>Mejor combo<strong>×{multiplier(round.bestStreak)}</strong></span></div>
      {!saved && <p className="loco-save-note" role="status">Tu navegador no permite guardar el récord. Puedes seguir jugando.</p>}
      <div className="result-actions"><button className="loco-start" onClick={() => begin('restart')}>¡Jugar otra vez! ↗</button><button className="secondary-button" onClick={() => dispatch({ type: 'menu' })}>Cambiar dificultad</button><a className="text-link" href="#/infantil">← Volver a juegos</a></div>
    </GameDialog>}
  </section>
}
