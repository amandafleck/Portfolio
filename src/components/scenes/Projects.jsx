import { motion, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useCursor } from '../../lib/CursorContext'

// TODO: Amanda — revise as descrições do GraphQL API e do Encriptador (escritas
// de forma genérica) e adicione os vídeos em videoSrc.
const PROJECTS = [
  {
    title: 'Rota — Planejador de viagens',
    description:
      'Base inicial do planejador de viagens com React, Leaflet, Node/Express e Geoapify. Nesta etapa, os lugares salvos ficam apenas na memória do navegador; não há banco de dados conectado. Funcionalidades: pesquisa de destino via Geoapify Geocoding API; busca de atrações, restaurantes, hotéis e parques próximos via Places API; exibição de descrição e endereço para cada lugar; salvamento de favoritos e marcação independente de vários lugares no mapa; mapa interativo com marcadores dos resultados; inclusão de vários pontos manuais clicando no mapa e dando um nome.',
    videoSrc: null,
    color: '#2f6bff',
  },
  {
    title: 'Next.js PopularMovies',
    description:
      'Aplicação simples em Next.js que lista os filmes populares usando uma API GraphQL. Exibe informações como título, sinopse, data de lançamento, diretor e pôster. O projeto é responsivo e possui pequenas animações. Tecnologias: Next.js, TypeScript, TailwindCSS, GraphQL para busca de dados na API e Jest (opcional) para testes automatizados.',
    videoSrc: null,
    color: '#8b5cf6',
  },
  {
    title: 'GraphQL API',
    description:
      'API construída com GraphQL, em que o cliente pede exatamente os campos de que precisa em uma única requisição, evitando excesso ou falta de dados. Define um schema tipado com queries e resolvers, e serve de base de dados para aplicações front-end como o PopularMovies.',
    videoSrc: null,
    color: '#14b8a6',
  },
  {
    title: 'Encriptador em Java',
    description:
      'Programa em Java que criptografa e descriptografa mensagens com dois clássicos da criptografia: a Cifra de César, que desloca cada letra um número fixo de posições no alfabeto, e a Cifra de Vigenère, que usa uma palavra-chave para variar o deslocamento a cada letra. Útil para entender na prática como funcionam substituição, chave e segurança básica de textos, e por que cifras simples são fáceis de quebrar.',
    videoSrc: null,
    color: '#f97316',
  },
]

const LINKEDIN_URL = 'https://www.linkedin.com/in/amanda-fleck-3b14bb340/'

const pad = (i) => String(i + 1).padStart(2, '0')

/* Offset aproximado do cabeçalho fixo — usado tanto pro scrollspy quanto
   pro "top" do número sticky, pra eles ficarem alinhados. */
const HEADER_OFFSET = 110

export default function Projects() {
  const rowRefs = useRef([])
  const [active, setActive] = useState(0)

  const update = useCallback(() => {
    let current = 0
    rowRefs.current.forEach((el, index) => {
      if (!el) return
      if (el.getBoundingClientRect().top <= HEADER_OFFSET + 40) current = index
    })
    setActive(current)
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

  const goTo = (index) => {
    const el = rowRefs.current[index]
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 16
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section id="projects" className="relative snap-start bg-[var(--bg)]">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-[var(--bg)]/90 px-6 py-6 backdrop-blur-sm md:px-16">
        <div className="flex items-center gap-6 md:gap-10">
          <h2 className="font-display text-3xl tracking-tight md:text-5xl">
            PROJECTS
          </h2>

          <nav className="flex items-center gap-5 md:gap-12">
            {PROJECTS.map((p, index) => {
              const isActive = index === active

              return (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`relative pt-3 font-display text-sm transition-colors duration-300 md:text-2xl ${
                    isActive
                      ? 'text-[var(--text)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="projects-nav-line"
                      className="absolute left-0 right-0 top-0 h-px bg-[var(--text)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {pad(index)}
                </button>
              )
            })}
          </nav>
        </div>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full border border-[var(--text)] px-5 py-1.5 text-sm transition-colors hover:bg-[var(--text)] hover:text-[var(--bg)] md:inline-block"
        >
          linkedin
        </a>
      </header>

      {PROJECTS.map((project, index) => (
        <ProjectRow
          key={project.title}
          project={project}
          index={index}
          registerRef={(el) => (rowRefs.current[index] = el)}
        />
      ))}
    </section>
  )
}

function ProjectRow({ project, index, registerRef }) {
  const rowRef = useRef(null)

  /*
   * O número gruda (sticky) no topo enquanto o texto deste projeto está
   * na tela — isso já vem de graça do CSS. O que a gente adiciona aqui é
   * só um empurrãozinho extra, com curva suave (ease-in), nos últimos
   * ~30% do bloco — é o que dá aquela sensação de "bateu no de cima e
   * subiu animado", em vez do solto cru e linear do sticky puro.
   */
  const { scrollYProgress: release } = useScroll({
    target: rowRef,
    offset: ['end 40%', 'end 5%'],
  })
  const extraLift = useTransform(release, [0, 1], [0, -36], {
    ease: (t) => t * t,
  })

  return (
    <div
      ref={(el) => {
        rowRef.current = el
        registerRef(el)
      }}
      className="grid min-h-[50vh] grid-cols-1 items-start gap-8 px-6 py-3 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-8 md:px-16"
    >
      <div className="sticky" style={{ top: HEADER_OFFSET }}>
        <motion.span
          style={{ y: extraLift }}
          className="block font-display text-7xl font-black leading-none md:text-[9.5rem]"
        >
          {pad(index)}
        </motion.span>
      </div>

      <div className="max-w-xl">
        <h3 className="font-display text-2xl leading-tight md:text-4xl">
          {project.title}
        </h3>
        <p className="mt-5 text-sm leading-7 text-[var(--text)] md:ml-5 md:text-[0.95rem]">
          {project.description}
        </p>
      </div>

      <div className="h-[38vh] md:h-[46vh]">
        <VideoPanel project={project} />
      </div>
    </div>
  )
}

function VideoPanel({ project }) {
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const { setColor, clearColor } = useCursor()
  const clearColorRef = useRef(clearColor)
  clearColorRef.current = clearColor

  useEffect(() => () => clearColorRef.current?.(), [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (hovered) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [hovered])

  return (
    <motion.div
      onHoverStart={() => {
        setHovered(true)
        setColor(project.color)
      }}
      onHoverEnd={() => {
        setHovered(false)
        clearColor()
      }}
      animate={{ scale: hovered ? 1.06 : 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full w-full overflow-hidden rounded-2xl transition-colors duration-500"
      style={{
        backgroundColor: hovered ? `${project.color}29` : 'rgba(255,255,255,0.06)',
      }}
    >
      {project.videoSrc ? (
        <video
          ref={videoRef}
          src={project.videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs text-[var(--text-muted)]">
          {/* TODO: Amanda — coloque o vídeo do projeto aqui (videoSrc) */}
          vídeo em breve
        </div>
      )}
    </motion.div>
  )
}
