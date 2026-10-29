let ctx = null

// Cria o contexto de áudio já no carregamento e tenta liberar sozinho.
// O navegador só deixa tocar som depois de uma interação "de verdade"
// (clique, tecla, toque) — então além de tentar na hora, a gente tenta de
// novo em qualquer sinal do usuário (inclusive mover o mouse e rolar) e
// logo antes de cada som.
function getCtx() {
  if (ctx) return ctx
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  ctx = new AudioCtx()
  return ctx
}

function tryResume() {
  const c = getCtx()
  if (c && c.state === 'suspended') c.resume().catch(() => {})
}

if (typeof window !== 'undefined') {
  tryResume()
  const events = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll']
  events.forEach((name) =>
    window.addEventListener(name, tryResume, { passive: true, capture: true })
  )
}

function blip({ type = 'square', freq, volume, duration }) {
  const c = getCtx()
  if (!c) return
  if (c.state !== 'running') {
    tryResume()
    if (c.state !== 'running') return
  }

  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + duration)
}

// Pequeno "tick" sintetizado — sem depender de um arquivo de áudio.
export function playKeyTick() {
  blip({ freq: 700 + Math.random() * 250, volume: 0.05, duration: 0.05 })
}

// "Click" mais encorpado — usado quando os textos surgem / se alinham.
export function playClick() {
  blip({ type: 'triangle', freq: 1400, volume: 0.12, duration: 0.035 })
  blip({ type: 'sine', freq: 180, volume: 0.1, duration: 0.08 })
}
