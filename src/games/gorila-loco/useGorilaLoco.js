import { useEffect, useReducer, useRef, useState } from 'react'
import { createRound, roundReducer } from './engine'
import { readBest, saveBest } from './records'
import { createAudio } from './audio'
import { startClock } from './clock'

function storage() {
  try { return window.localStorage } catch { return null }
}
export default function useGorilaLoco() {
  const [round, dispatch] = useReducer(roundReducer, undefined, () => createRound())
  const [records, setRecords] = useState(() => Object.fromEntries(['easy', 'normal', 'hard'].map(key => [key, readBest(storage(), key)])))
  const [saved, setSaved] = useState(true)
  const [sound, setSound] = useState(false)
  const [audioSupported, setAudioSupported] = useState(true)
  const audio = useRef(null)
  const processedEvent = useRef(null)
  const recorded = useRef(false)
  const [previousBest, setPreviousBest] = useState(0)

  useEffect(() => {
    const sounds = createAudio()
    audio.current = sounds
    return () => { sounds.close(); audio.current = null }
  }, [])
  useEffect(() => {
    if (round.phase !== 'playing') return
    const stopClock = startClock({
      requestFrame: callback => requestAnimationFrame(callback),
      cancelFrame: frame => cancelAnimationFrame(frame),
      onTick: tick => dispatch({ type: 'tick', ...tick }),
    })
    const visibility = () => { if (document.hidden) dispatch({ type: 'pause' }) }
    const key = event => {
      if (event.key === 'Escape') { event.preventDefault(); dispatch({ type: 'pause' }) }
    }
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('keydown', key)
    return () => {
      stopClock()
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('keydown', key)
    }
  }, [round.phase])
  useEffect(() => {
    if (!round.event || processedEvent.current === round.event) return
    processedEvent.current = round.event
    audio.current?.play(round.event.type)
  }, [round.event])
  useEffect(() => {
    if (round.phase !== 'finished' || recorded.current) return
    recorded.current = true
    const record = saveBest(storage(), round.difficulty, round.score)
    setRecords(current => ({ ...current, [round.difficulty]: Math.max(current[round.difficulty], record.best) }))
    setSaved(record.saved)
  }, [round.phase, round.difficulty, round.score])

  function begin(type = 'start') {
    setPreviousBest(records[round.difficulty])
    recorded.current = false
    processedEvent.current = null
    setSaved(true)
    dispatch({ type })
  }
  function toggleSound() {
    if (sound) { audio.current?.mute(); setSound(false) }
    else {
      const unlocked = audio.current?.unlock() || false
      setAudioSupported(unlocked)
      setSound(unlocked)
    }
  }
  return { round, dispatch, sound, toggleSound, audioSupported, saved, begin,
    best: records[round.difficulty], newRecord: round.phase === 'finished' && round.score > previousBest }
}
