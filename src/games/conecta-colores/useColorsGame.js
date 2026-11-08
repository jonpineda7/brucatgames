import { useEffect, useReducer, useRef, useState } from 'react'
import { gameReducer, newGame } from './engine.js'
import { loadProgress, persistProgress } from './progress.js'
import { createAudio } from '../gorila-loco/audio.js'

function storage() { try { return window.localStorage } catch { return null } }
export function useColorsGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => newGame(loadProgress(storage())))
  const [saved, setSaved] = useState(true)
  const [audioAvailable, setAudioAvailable] = useState(true)
  const audio = useRef(null)
  const played = useRef(null)
  useEffect(() => { const player = createAudio(); audio.current = player; return () => { player.close(); audio.current = null } }, [])
  useEffect(() => {
    const stored = persistProgress(storage(), state.progress)
    // Reflect the result of a browser storage operation, not derived game state.
    // oxlint-disable-next-line react/set-state-in-effect
    setSaved(stored)
  }, [state.progress])
  useEffect(() => {
    if (played.current === state.event) return
    played.current = state.event
    if (state.progress.sound) audio.current?.play(state.event.sound)
  }, [state.event, state.progress.sound])
  useEffect(() => {
    if (state.phase !== 'playing') return
    const hidden = () => { if (document.hidden) dispatch({ type: 'pause' }) }
    const escape = event => { if (event.key === 'Escape') dispatch({ type: 'pause' }) }
    document.addEventListener('visibilitychange', hidden)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('visibilitychange', hidden); document.removeEventListener('keydown', escape) }
  }, [state.phase])
  function act(action) {
    if (action.type === 'sound' && state.progress.sound) audio.current?.mute()
    else if ((state.progress.sound && !['move', 'end'].includes(action.type)) || action.type === 'sound') {
      if (audio.current && !audio.current.unlock()) { setAudioAvailable(false); return action.type === 'sound' ? undefined : dispatch(action) }
    }
    dispatch(action)
  }
  return { state, act, saved, audioAvailable }
}
