import { useEffect, useId, useRef } from 'react'

export default function MemoryResult({ status, moves, pairs, onRestart }) {
  const dialog = useRef(null)
  const title = useId()
  const description = useId()
  const won = status === 'won'
  useEffect(() => {
    const element = dialog.current
    element.showModal()
    return () => element.close()
  }, [])
  return (
    <dialog ref={dialog} className={`memory-result ${won ? 'result-victory' : 'result-defeat'}`}
      aria-labelledby={title} aria-describedby={description} onCancel={event => event.preventDefault()}>
      <img className="result-art" src={`${import.meta.env.BASE_URL}images/results/${won ? 'victory' : 'game-over'}.png`}
        alt={won ? 'Gorila gamer celebrando la victoria' : 'Gorila gamer noqueado: Game Over'} width="640" height="640" />
      <span className="eyebrow">{won ? 'MISIÓN COMPLETADA' : 'FIN DEL DESAFÍO'}</span>
      <h2 id={title}>{won ? '¡Memoria de gorila!' : '¡Esta ronda terminó!'}</h2>
      <p id={description}>{won ? `Encontraste las 6 parejas en ${moves} movimientos. ¡Bien hecho!`
        : `Encontraste ${pairs} de 6 parejas en ${moves} movimientos. Prueba otra vez o juega sin límite.`}</p>
      <div className="result-actions">
        <button className="primary-button" onClick={onRestart}>{won ? 'Jugar otra vez ↗' : 'Volver a intentarlo ↗'}</button>
        <a className="secondary-button" href="#/infantil">Volver a Infantil</a>
      </div>
    </dialog>
  )
}
