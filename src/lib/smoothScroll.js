import Lenis from 'lenis'

let lenis = null

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({
    lerp: 0.055,
    wheelMultiplier: 0.45,
    smoothWheel: true,
  })

  let raf
  const loop = (time) => {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToY(y, { duration = 1.4 } = {}) {
  if (lenis) {
    lenis.scrollTo(y, { duration, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

export function scrollToElement(el, offset = 0) {
  if (!el) return
  scrollToY(el.getBoundingClientRect().top + window.scrollY + offset)
}
