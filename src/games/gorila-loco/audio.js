// Tiny synthesized effects, generated locally; no network/audio downloads.
export function createAudio() {
  let context = null
  let enabled = false
  function unlock() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return false
      context ||= new AudioContext()
      context.resume().catch(() => {})
      enabled = true
      return true
    } catch { return false }
  }
  function play(type) {
    if (!enabled || !context || context.state !== 'running') return
    const sounds = { spawn: [420], hit: [620, 820], miss: [220, 170], trap: [170, 110], combo: [550, 740, 990], start: [440, 660, 880], finish: [660, 550, 880] }
    const notes = sounds[type] || []
    try {
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const start = context.currentTime + index * .07
        oscillator.type = type === 'trap' ? 'triangle' : 'sine'
        oscillator.frequency.value = frequency
        gain.gain.setValueAtTime(.0001, start)
        gain.gain.exponentialRampToValueAtTime(type === 'spawn' ? .012 : .035, start + .012)
        gain.gain.exponentialRampToValueAtTime(.0001, start + .12)
        oscillator.connect(gain); gain.connect(context.destination)
        oscillator.start(start); oscillator.stop(start + .13)
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
      })
    } catch { /* Audio stays optional when a browser suspends the context. */ }
  }
  return { unlock, play, mute() { enabled = false }, close() { enabled = false; context?.close().catch(() => {}); context = null } }
}
