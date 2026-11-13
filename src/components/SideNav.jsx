import { useCallback, useEffect, useState } from 'react'
import { SECTIONS, scrollToSection } from '../data/sections'
import NavIcon from './NavIcon'
import { useLanguage } from '../lib/LanguageContext'

export default function SideNav() {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(() =>
    Object.fromEntries(SECTIONS.map((section) => [section.id, 0]))
  )

  const update = useCallback(() => {
    const next = {}
    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id)
      if (!el) {
        next[section.id] = 0
        return
      }
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // seção mais alta que a tela: 0 -> 1 até o fim dela encostar embaixo;
      // seção de uma tela só (ex.: contato, a última): 0 -> 1 conforme ela entra
      const raw =
        rect.height > vh + 2 ? -rect.top / (rect.height - vh) : 1 - rect.top / vh
      next[section.id] = Math.min(1, Math.max(0, raw))
    })
    setProgress(next)
  }, [])

  useEffect(() => {
    update()
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [update])

  return (
    <nav className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 flex-row overflow-hidden rounded-[12px] bg-black/75 backdrop-blur-md md:bottom-auto md:left-5 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:flex-col">
      {SECTIONS.map((section) => {
        const p = progress[section.id] ?? 0

        return (
          <button
            key={section.id}
            type="button"
            aria-label={t(section.label)}
            onClick={() => scrollToSection(section.id)}
            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden bg-white/[0.06] md:h-[70px] md:w-11"
          >
            <span
              className="absolute inset-x-0 top-0 bg-[var(--blue)] transition-[height] duration-150 ease-out"
              style={{ height: `${p * 100}%` }}
            />
            <NavIcon id={section.id} className="relative z-10 h-5 w-5 text-white" />

            <span className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 md:block">
              {t(section.label)}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
