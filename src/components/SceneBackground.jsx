import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SECTIONS } from '../data/sections'

const IDS = SECTIONS.map((section) => section.id)
const COLORS = SECTIONS.map((section) => section.color)

// Pontos de parada da cor: cada seção tem sua cor no topo e, se for mais alta
// que a tela (seções com scroll "preso", tipo Work), segura a cor até o fim
// dela — a troca pra próxima cor só acontece na última tela de scroll.
function useSectionStops(ids) {
  // Começa com valores estritamente crescentes (necessário pro useTransform)
  // até conseguirmos medir a posição real de cada seção no DOM.
  const [stops, setStops] = useState(() => ({
    input: ids.map((_, index) => index),
    output: COLORS,
  }))

  useEffect(() => {
    const measure = () => {
      const input = []
      const output = []
      ids.forEach((id, index) => {
        const el = document.getElementById(id)
        if (!el) return
        const top = el.offsetTop
        const holdUntil = top + el.offsetHeight - window.innerHeight
        if (input.length && top <= input[input.length - 1]) return
        input.push(top)
        output.push(COLORS[index])
        if (holdUntil > top + 1) {
          input.push(holdUntil)
          output.push(COLORS[index])
        }
      })
      if (input.length >= 2) setStops({ input, output })
    }

    measure()
    window.addEventListener('resize', measure)

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const observer = new ResizeObserver(measure)
    elements.forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [ids])

  return stops
}

export default function SceneBackground() {
  const { input, output } = useSectionStops(IDS)
  const { scrollY } = useScroll()
  const background = useTransform(scrollY, input, output)

  return (
    <motion.div
      aria-hidden
      style={{ backgroundColor: background }}
      className="fixed inset-0 -z-10"
    />
  )
}
