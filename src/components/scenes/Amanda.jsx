import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { playClick, playKeyTick } from '../../lib/sound'
import MorphLetter from '../MorphLetter'

const TYPED_TAIL = 'ELOPER'
const TRACKING = -0.05

const TICKER_ITEMS = Array.from({ length: 8 }, (_, i) => i)

function useFitFontSize(containerRef, texts, active) {
  const [sizes, setSizes] = useState(null)

  useEffect(() => {
    let cancelled = false
    const compute = () => {
      const el = containerRef.current
      if (!el || cancelled) return
      const style = getComputedStyle(el)
      const avail = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      const family = getComputedStyle(document.documentElement).getPropertyValue('--sans') || 'monospace'
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.font = `400 100px ${family}`
      const maxByHeight = window.innerHeight * 0.31
      const next = {}
      texts.forEach((text) => {
        const w = ctx.measureText(text).width + TRACKING * 100 * text.length
        next[text] = Math.max(24, Math.min(maxByHeight, (avail / w) * 97))
      })
      setSizes(next)
    }

    const ready = document.fonts?.load ? document.fonts.load('100px "Fragment Mono"') : Promise.resolve()
    ready.catch(() => {}).then(() => document.fonts?.ready).then(compute)
    window.addEventListener('resize', compute)
    return () => {
      cancelled = true
      window.removeEventListener('resize', compute)
    }
  }, [containerRef, texts, active])

  return sizes
}

const FIT_TEXTS = ['FULL-STACK', 'DEVELOPER']

export default function Amanda() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Fase 1 (0 -> ~0.3): o "A" cresce com o scroll até tomar a tela de azul.
  const letterScale = useTransform(scrollYProgress, [0, 0.26], [1, 22])
  const letterOpacity = useTransform(scrollYProgress, [0.2, 0.28], [1, 0])
  const growOverlayOpacity = useTransform(scrollYProgress, [0.16, 0.28], [0, 1])

  // 'growing' -> 'flash' (transição fixa, não depende mais do scroll — isso
  // evita qualquer resíduo do glifo do "A" aparecendo se o usuário parar de
  // rolar bem no meio da transição) -> 'scene'.
  const [started, setStarted] = useState(false)
  const [scenePhase, setScenePhase] = useState('flash')
  const phase = started ? (scenePhase) : 'growing'
  const fitSizes = useFitFontSize(sceneRef, FIT_TEXTS, started)

  const [showFullStack, setShowFullStack] = useState(false)
  const [showDev, setShowDev] = useState(false)
  const [typedTail, setTypedTail] = useState(0)
  const [showTicker, setShowTicker] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (value > 0.3) setStarted(true)
  })

  useEffect(() => {
    if (scrollYProgress.get() > 0.3) setStarted(true)
  }, [scrollYProgress])

  useEffect(() => {
    if (!started) return
    const timers = []
    const at = (ms, fn) => timers.push(setTimeout(fn, ms))

    at(900, () => setScenePhase('scene'))
    // click quando o FULL-STACK surge
    at(900, () => {
      setShowFullStack(true)
      playClick()
    })
    at(1200, () => setShowDev(true))

    const typingStart = 1600
    TYPED_TAIL.split('').forEach((_, index) => {
      at(typingStart + index * 130, () => {
        setTypedTail(index + 1)
        playKeyTick()
      })
    })

    const afterTyping = typingStart + TYPED_TAIL.length * 130
    // click quando o ticker entra e o bloco todo se realinha (layout)
    at(afterTyping + 400, () => {
      setShowTicker(true)
      playClick()
    })
    at(afterTyping + 900, () => setShowFooter(true))

    return () => timers.forEach(clearTimeout)
  }, [started])


  return (
    <section id="amanda" ref={containerRef} className="relative h-[190vh] md:h-[210vh]">
      <h1 className="sr-only">Amanda Fleck — Full Stack Developer</h1>

      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Fase 1: o A gigante crescendo com o scroll */}
        {phase === 'growing' && (
          <>
            <motion.div
              aria-hidden
              style={{ opacity: letterOpacity }}
              className="pointer-events-none absolute inset-0 z-0"
            >
              <MorphLetter scale={letterScale} />
            </motion.div>
            <motion.div
              aria-hidden
              style={{ opacity: growOverlayOpacity }}
              className="pointer-events-none absolute inset-0 z-10 bg-[var(--blue)]"
            />
          </>
        )}

        {/* Flash: cobre a tela de azul sólido e revela a próxima cena — não
            depende mais de scroll, então sempre termina de forma limpa. */}
        {phase === 'flash' && (
          <motion.div
            aria-hidden
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 z-10 bg-[var(--blue)]"
          />
        )}

        {/* Fase 2: FULL STACK / DEVELOPER */}
        {(phase === 'flash' || phase === 'scene') && (
          <motion.div
            layout
            ref={sceneRef}
            className="absolute inset-0 z-20 flex flex-col justify-center gap-0 px-4 sm:px-6 md:px-20"
          >
            <div className="overflow-hidden">
              {showFullStack && (
                <motion.p
                  layout
                  initial={{ y: 70, opacity: 0, filter: 'blur(14px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontSize: fitSizes?.['FULL-STACK'] ?? 'min(13vw, 23svh)' }}
                  className="font-display font-black leading-none tracking-tighter text-[var(--blue)]"
                >
                  FULL-STACK
                </motion.p>
              )}
            </div>

            <div className="-mt-3 overflow-hidden sm:-mt-6 md:-mt-10">
              {showDev && (
                <motion.h2
                  layout
                  style={{ fontSize: fitSizes?.DEVELOPER ?? 'min(11.5vw, 20svh)' }}
                  className="font-display font-black leading-none tracking-tighter"
                >
                  <motion.span
                    initial={{ y: 70, opacity: 0, filter: 'blur(14px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-[var(--blue)]"
                  >
                    DEV
                  </motion.span>
                  <span className="text-[var(--blue-dim)]">
                    {TYPED_TAIL.slice(0, typedTail)}
                    {typedTail < TYPED_TAIL.length && typedTail > 0 && (
                      <span className="caret text-[var(--blue-dim)]">|</span>
                    )}
                  </span>
                </motion.h2>
              )}
            </div>

            {showTicker && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 overflow-hidden md:mt-10"
              >
                <motion.div
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                  className="flex w-max gap-10 whitespace-nowrap"
                >
                  {[...TICKER_ITEMS, ...TICKER_ITEMS].map((_, index) => (
                    <span
                      key={index}
                      className={`font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl ${
                        index % 3 === 1 ? 'text-[var(--blue)]' : 'text-white/15'
                      }`}
                    >
                      Amanda Fleck
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {showFooter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-x-0 bottom-20 z-20 px-4 sm:px-6 md:bottom-8 md:px-20"
          >
            
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              {/* TODO: Amanda — confirme o e-mail */}
              <a href="mailto:aa.fleck005@gmail.com" className="break-all text-[var(--text-muted)]">
                aa.fleck005@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/amanda-fleck-3b14bb340/"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/30 px-4 py-2 text-xs uppercase tracking-wide text-[var(--text-muted)] transition-colors hover:border-[var(--blue)] hover:text-[var(--blue)]"
              >
                LinkedIn
              </a>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="h-[2px] w-full origin-left bg-white/60"
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
