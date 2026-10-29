import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useCursor } from '../lib/CursorContext'

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor="interactive"]'
const VIOLET = '#b060ff'
const VIOLET_SOFT = '#6d28d9'

export default function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 })
  // Rabo de 2 bolinhas, cada uma mais lenta — só no cursor "blob" da cena inicial (Amanda)
  const trailX = useSpring(x, { stiffness: 140, damping: 18, mass: 0.8 })
  const trailY = useSpring(y, { stiffness: 140, damping: 18, mass: 0.8 })
  const tailX = useSpring(x, { stiffness: 70, damping: 16, mass: 1.1 })
  const tailY = useSpring(y, { stiffness: 70, damping: 16, mass: 1.1 })
  const [enabled, setEnabled] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [heroActive, setHeroActive] = useState(false)
  const { absorbRect, light, color: customColor, scale: forcedScale } = useCursor()

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)')
    setEnabled(mql.matches)
    if (!mql.matches) return

    const move = (event) => {
      if (!absorbRect) {
        x.set(event.clientX)
        y.set(event.clientY)
      }
    }
    const over = (event) => {
      setInteractive(Boolean(event.target.closest?.(INTERACTIVE_SELECTOR)))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [x, y, absorbRect])

  useEffect(() => {
    if (absorbRect) {
      x.set(absorbRect.left + absorbRect.width / 2)
      y.set(absorbRect.top + absorbRect.height / 2)
    }
  }, [absorbRect, x, y])

  useEffect(() => {
    const el = document.getElementById('amanda')
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setHeroActive(entry.intersectionRatio > 0.5),
      { threshold: [0, 0.5, 1] }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!enabled) return null

  const shrink = interactive || Boolean(absorbRect)
  const hero = heroActive && !customColor

  // Mesmo cursor em todo o site: cabeça + rabo de 2 bolinhas grudentas (goo).
  // - cena inicial (A / FULL-STACK): violeta e BEM maior
  // - cor de projeto (hover no vídeo): na cor do projeto, sem inverter
  // - resto: branco em "difference" = o que fica por baixo aparece em negativo
  const size = hero ? 110 : 56
  const headScale = forcedScale ?? (shrink ? 0.45 : light && !hero ? 1.3 : 1)
  const headColor = customColor || (hero ? VIOLET : '#ffffff')
  const tailColor = customColor || (hero ? VIOLET_SOFT : '#ffffff')

  const balls = [
    { key: 'tail', x: tailX, y: tailY, scale: headScale * 0.6, color: tailColor },
    { key: 'trail', x: trailX, y: trailY, scale: headScale * 0.8, color: tailColor },
    { key: 'head', x: springX, y: springY, scale: headScale, color: headColor },
  ]

  return (
    <>
      <svg aria-hidden className="pointer-events-none fixed h-0 w-0">
        <filter id="cursor-goo">
          {/* desfoque proporcional ao tamanho — senão a bolinha bem pequena some */}
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={Math.max(2, Math.min(10, (size * headScale) / 6))}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
          />
        </filter>
      </svg>
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[999] ${
          customColor ? '' : 'mix-blend-difference'
        }`}
        style={{ filter: 'url(#cursor-goo)' }}
      >
        {balls.map((ball) => (
          <motion.div
            key={ball.key}
            style={{ x: ball.x, y: ball.y }}
            animate={{
              scale: ball.scale,
              width: size,
              height: size,
              backgroundColor: ball.color,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
        ))}
      </div>
    </>
  )
}
