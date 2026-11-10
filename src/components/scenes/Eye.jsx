import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { playClick } from '../../lib/sound'
import { useLanguage } from '../../lib/LanguageContext'
import { scrollToSection } from '../../data/sections'

// Últimas palavras do portfólio: um olho que te segue com um feixe de luz.
const LINES = [
  'Se você chegou até aqui, espero que tenha encontrado algo que despertou sua curiosidade. Eu diria que isso é um bom começo para uma conversa.',
]

const LIT_LINE = 'Obrigada por visitar meu portfólio!'

const SPREAD = 0.3 // abertura do feixe (radianos, de cada lado)
const IDLE_AFTER = 2500 // ms sem mexer o mouse até o feixe voltar a passear sozinho

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export default function Eye() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const sizeRef = useRef({ w: 1200, h: 800 })
  const [size, setSize] = useState({ w: 1200, h: 800 })
  const [lit, setLit] = useState(false)
  const [line, setLine] = useState(0)
  const [blink, setBlink] = useState(0)

  const mx = useMotionValue(900)
  const my = useMotionValue(300)
  const sx = useSpring(mx, { stiffness: 110, damping: 20, mass: 0.7 })
  const sy = useSpring(my, { stiffness: 110, damping: 20, mass: 0.7 })

  const cx = size.w / 2
  const cy = size.h * 0.4

  // tamanho real da seção
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const next = { w: entry.contentRect.width, h: entry.contentRect.height }
      sizeRef.current = next
      setSize(next)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // o feixe segue o mouse; parado por um tempo, ele passeia sozinho
  useEffect(() => {
    const target = { x: null, y: null, last: 0 }

    const onMove = (event) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      target.x = event.clientX - rect.left
      target.y = event.clientY - rect.top
      target.last = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf
    const tick = (now) => {
      const { w, h } = sizeRef.current
      if (target.x === null || now - target.last > IDLE_AFTER) {
        const s = now / 1000
        mx.set(w / 2 + Math.cos(s * 0.6) * w * 0.35)
        my.set(h * 0.4 + 120 + Math.sin(s * 0.9) * h * 0.28)
      } else {
        mx.set(target.x)
        my.set(target.y)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [mx, my])

  // piscadas e troca de frases
  useEffect(() => {
    const blinkTimer = setInterval(() => setBlink((b) => b + 1), 4500)
    return () => clearInterval(blinkTimer)
  }, [])
  useEffect(() => {
    if (lit) return
    const lineTimer = setInterval(() => setLine((l) => (l + 1) % LINES.length), 3800)
    return () => clearInterval(lineTimer)
  }, [lit])

  // triângulo do feixe: sai do olho em direção ao mouse
  const beamPoints = (x, y) => {
    const { w, h } = sizeRef.current
    const ox = w / 2
    const oy = h * 0.4
    const angle = Math.atan2(y - oy, x - ox)
    const length = Math.hypot(w, h) * 1.4
    const a = angle - SPREAD
    const b = angle + SPREAD
    return [
      [ox, oy],
      [ox + Math.cos(a) * length, oy + Math.sin(a) * length],
      [ox + Math.cos(b) * length, oy + Math.sin(b) * length],
    ]
  }
  const beam = useTransform([sx, sy], ([x, y]) => beamPoints(x, y).map((pt) => pt.join(",")).join(" "))
  // o texto só existe dentro do feixe: mesma forma, usada como máscara
  const beamClip = useTransform(
    [sx, sy],
    ([x, y]) => `polygon(${beamPoints(x, y).map(([px, py]) => `${px}px ${py}px`).join(", ")})`
  )

  // a pupila também olha pro mouse
  const pupilX = useTransform([sx, sy], ([x, y]) => {
    const { w, h } = sizeRef.current
    const dx = x - w / 2
    const dy = y - h * 0.4
    const dist = Math.hypot(dx, dy) || 1
    return (dx / dist) * clamp(dist / 250, 0, 1) * 22
  })
  const pupilY = useTransform([sx, sy], ([x, y]) => {
    const { w, h } = sizeRef.current
    const dx = x - w / 2
    const dy = y - h * 0.4
    const dist = Math.hypot(dx, dy) || 1
    return (dy / dist) * clamp(dist / 250, 0, 1) * 12
  })

  const scale = clamp(size.w / 900, 0.55, 1.1)
  const length = Math.hypot(size.w, size.h) * 1.4

  const toggleLight = () => {
    playClick()
    setBlink((b) => b + 1)
    setLit((value) => !value)
  }

  return (
    <section
      id="eye"
      ref={ref}
      onClick={toggleLight}
      className="relative isolate flex min-h-screen w-full cursor-pointer flex-col items-center justify-end overflow-hidden bg-[#050506] pb-[12vh] md:h-screen"
    >
      {/* clique: acende tudo */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 z-0 bg-[#f5f6f8]"
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
      >
        <defs>
          <radialGradient
            id="eye-beam"
            gradientUnits="userSpaceOnUse"
            cx={cx}
            cy={cy}
            r={length * 0.75}
          >
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.75" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="eye-shape">
            <path d="M-150 0 Q0 -92 150 0 Q0 92 -150 0Z" />
          </clipPath>
        </defs>

        <motion.polygon points={beam} fill="url(#eye-beam)" />

        <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
          <circle r="118" fill="#f6b8a4" />
          <motion.g
            key={blink}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: [1, 0.06, 1] }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ transformOrigin: '0px 0px' }}
          >
            <path d="M-150 0 Q0 -92 150 0 Q0 92 -150 0Z" fill="#fff" />
            <g clipPath="url(#eye-shape)">
              <motion.g style={{ x: pupilX, y: pupilY }}>
                <circle r="52" fill="#6b9c7d" />
                <circle r="25" fill="#050506" />
                <circle cx="11" cy="-12" r="8" fill="#fff" />
              </motion.g>
            </g>
          </motion.g>
        </g>
      </svg>

      {/* o texto fica escondido: só aparece (escuro) dentro do feixe de luz.
          Com a luz acesa, a máscara some e dá pra ler tudo. */}
      <motion.div
        style={{ clipPath: lit ? "inset(0)" : beamClip }}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end gap-3 px-6 pb-[12vh] text-center"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={lit ? "lit" : line}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl font-display text-base font-black uppercase leading-snug tracking-tight text-[#050506] md:text-2xl"
          >
            {t(lit ? LIT_LINE : LINES[line])}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <p className="pointer-events-none absolute inset-x-0 bottom-[6vh] z-10 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
        {t(lit ? "clique para apagar a luz" : "clique para acender a luz")}
      </p>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          scrollToSection('amanda')
        }}
        className="absolute bottom-6 right-6 z-30 text-[11px] uppercase tracking-[0.25em] text-white/40 transition-colors hover:text-white md:right-16"
      >
        {t('↑ voltar ao topo')}
      </button>
    </section>
  )
}
