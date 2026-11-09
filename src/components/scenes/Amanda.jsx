import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { playClick, playKeyTick } from '../../lib/sound'
import MorphLetter from '../MorphLetter'

const TYPED_TAIL = 'ELOPER'
const TICKER_ITEMS = Array.from({ length: 8 }, (_, i) => i)

export default function Amanda() {
  const containerRef = useRef(null)
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
  const [phase, setPhase] = useState('growing')
  const startedRef = useRef(false)

  const [showFullStack, setShowFullStack] = useState(false)
  const [showDev, setShowDev] = useState(false)
  const [typedTail, setTypedTail] = useState(0)
  const [showTicker, setShowTicker] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const timeoutsRef = useRef([])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (value > 0.3 && !startedRef.current) {
      startedRef.current = true
      setPhase('flash')

      const t = timeoutsRef.current
      t.push(setTimeout(() => setPhase('scene'), 900))

      // click quando o FULL-STACK surge
      t.push(
        setTimeout(() => {
          setShowFullStack(true)
          playClick()
        }, 900)
      )
      t.push(setTimeout(() => setShowDev(true), 1200))

      const typingStart = 1600
      TYPED_TAIL.split('').forEach((_, index) => {
        t.push(
          setTimeout(() => {
            setTypedTail(index + 1)
            playKeyTick()
          }, typingStart + index * 130)
        )
      })

      const afterTyping = typingStart + TYPED_TAIL.length * 130
      // click quando o ticker entra e o bloco todo se realinha (layout)
      t.push(
        setTimeout(() => {
          setShowTicker(true)
          playClick()
        }, afterTyping + 400)
      )
      t.push(setTimeout(() => setShowFooter(true), afterTyping + 900))
    }
  })

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), [])


  return (
    <section id="amanda" ref={containerRef} className="relative h-[170vh] snap-start">
      <h1 className="sr-only">Amanda Fleck — Desenvolvedora Full Stack</h1>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
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
            className="absolute inset-0 z-20 flex flex-col justify-center gap-0 px-6 md:px-20"
          >
            <div className="overflow-hidden">
              {showFullStack && (
                <motion.p
                  layout
                  initial={{ y: 70, opacity: 0, filter: 'blur(14px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-[11rem] font-black leading-none tracking-tighter text-[var(--blue)]"
                >
                  FULL-STACK
                </motion.p>
              )}
            </div>

            <div className="-mt-10 overflow-hidden">
              {showDev && (
                <motion.h2
                  layout
                  className="ml-40 font-display text-9xl font-black leading-none tracking-tighter md:text-[13rem]"
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
                className="mt-10 overflow-hidden"
              >
                <motion.div
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                  className="flex w-max gap-10 whitespace-nowrap"
                >
                  {[...TICKER_ITEMS, ...TICKER_ITEMS].map((_, index) => (
                    <span
                      key={index}
                      className={`font-display text-3xl font-bold tracking-tight md:text-5xl ${
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
            className="absolute inset-x-0 bottom-8 z-20 px-6 md:px-20"
          >
            
            <div className="mb-4 flex items-center justify-between text-sm">
              {/* TODO: Amanda — confirme o e-mail */}
              <a href="mailto:aa.fleck005@gmail.com" className="text-[var(--text-muted)]">
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
