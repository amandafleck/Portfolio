import { motion, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { scrollToY } from '../../lib/smoothScroll'
import { useCursor } from '../../lib/CursorContext'
import { useLanguage } from '../../lib/LanguageContext'

// TODO: Amanda — revise as descrições do GraphQL API e do Encriptador (escritas
// de forma genérica).
const PROJECTS = [
  {
    title: 'Next.js PopularMovies',
    description:
      'Aplicação simples em Next.js que lista os filmes populares usando uma API GraphQL. Exibe informações como título, sinopse, data de lançamento, diretor e pôster. O projeto é responsivo e possui pequenas animações. Tecnologias: Next.js, TypeScript, TailwindCSS, GraphQL para busca de dados na API e Jest (opcional) para testes automatizados.',
    tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'GraphQL', 'Jest'],
    github: 'https://github.com/amandafleck/PopularMovies',
    demo: 'https://popular-movies-bab7.vercel.app',
    color: '#8b5cf6',
  },
  {
    title: 'Rota — Planejador de viagens',
    description:
      'Base inicial do planejador de viagens com React, Leaflet, Node/Express e Geoapify. Nesta etapa, os lugares salvos ficam apenas na memória do navegador; não há banco de dados conectado. Funcionalidades: pesquisa de destino via Geoapify Geocoding API; busca de atrações, restaurantes, hotéis e parques próximos via Places API; exibição de descrição e endereço para cada lugar; salvamento de favoritos e marcação independente de vários lugares no mapa; mapa interativo com marcadores dos resultados; inclusão de vários pontos manuais clicando no mapa e dando um nome.',
    tags: ['React', 'Leaflet', 'Node / Express', 'Geoapify API'],
    github: 'https://github.com/amandafleck/ProjectMaps',
    demo: 'https://projectmaps.vercel.app',
    color: '#2f6bff',
  },
  {
    title: 'GraphQL API',
    description:
      'API construída com GraphQL, em que o cliente pede exatamente os campos de que precisa em uma única requisição, evitando excesso ou falta de dados. Define um schema tipado com queries e resolvers, e serve de base de dados para aplicações front-end como o PopularMovies.',
    tags: ['GraphQL', 'Schema tipado', 'Queries', 'Resolvers'],
    github: 'https://github.com/amandafleck/graphqlAP',
    demo: 'https://graphql-api-opal-eight.vercel.app',
    color: '#14b8a6',
  },
  {
    title: 'Encriptador em Java',
    description:
      'Programa em Java que criptografa e descriptografa mensagens com dois clássicos da criptografia: a Cifra de César, que desloca cada letra um número fixo de posições no alfabeto, e a Cifra de Vigenère, que usa uma palavra-chave para variar o deslocamento a cada letra. Útil para entender na prática como funcionam substituição, chave e segurança básica de textos, e por que cifras simples são fáceis de quebrar.',
    tags: ['Java', 'Cifra de César', 'Cifra de Vigenère'],
    color: '#f97316',
  },
]

const LINKEDIN_URL = 'https://www.linkedin.com/in/amanda-fleck-3b14bb340/'

const pad = (i) => String(i + 1).padStart(2, '0')

/* Offset aproximado do cabeçalho fixo — usado tanto pro scrollspy quanto
   pro "top" do número sticky, pra eles ficarem alinhados. */
const HEADER_OFFSET = 110

export default function Projects() {
  const { t } = useLanguage()
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
    scrollToY(top)
  }

  return (
    <section id="projects" className="relative snap-start bg-[var(--bg)]">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[var(--bg)]/90 px-4 py-4 pr-24 backdrop-blur-sm sm:px-6 sm:pr-28 md:px-16 md:py-6 lg:pr-48">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 md:gap-x-10">
          <h2 className="font-display text-2xl tracking-tight sm:text-3xl lg:text-5xl">
            {t('PROJETOS')}
          </h2>

          <nav className="flex shrink-0 items-center gap-3 sm:gap-5 lg:gap-12">
            {PROJECTS.map((p, index) => {
              const isActive = index === active

              return (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`relative pt-3 font-display text-sm transition-colors duration-300 sm:text-base lg:text-2xl ${
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
          className="absolute right-28 hidden rounded-full border border-[var(--text)] px-5 py-1.5 text-sm transition-colors hover:bg-[var(--text)] hover:text-[var(--bg)] lg:inline-block"
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
  const { t } = useLanguage()
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
      className="grid min-h-[50svh] grid-cols-1 items-start gap-6 px-4 py-8 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-8 md:px-16 md:pl-24 xl:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:pl-28"
    >
      <div className="md:sticky" style={{ top: HEADER_OFFSET }}>
        <motion.span
          style={{ y: extraLift }}
          className="block font-display text-6xl font-black leading-none sm:text-7xl md:text-8xl lg:text-[9.5rem]"
        >
          {pad(index)}
        </motion.span>
      </div>

      <div className="max-w-xl">
        <h3 className="font-display text-2xl leading-tight md:text-3xl lg:text-4xl">
          {project.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-[var(--text)] md:ml-5 md:mt-5 md:text-[0.95rem]">
          {t(project.description)}
        </p>
      </div>

      <div className="h-64 sm:h-72 md:col-start-2 xl:col-start-auto xl:h-[min(46svh,24rem)] xl:min-h-64">
        <ProjectPanel project={project} index={index} />
      </div>
    </div>
  )
}

function ProjectPanel({ project, index }) {
  const { t } = useLanguage()
  const [hovered, setHovered] = useState(false)

  const { setColor, clearColor } = useCursor()
  const clearColorRef = useRef(clearColor)
  clearColorRef.current = clearColor

  useEffect(() => () => clearColorRef.current?.(), [])

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
      animate={{ scale: hovered ? 1.03 : 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border transition-colors duration-500"
      style={{
        borderColor: hovered ? project.color : 'rgba(255,255,255,0.12)',
        backgroundColor: hovered ? `${project.color}26` : 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span
          className="h-2.5 w-2.5 rounded-full transition-colors duration-500"
          style={{ backgroundColor: hovered ? project.color : 'rgba(255,255,255,0.25)' }}
        />
        <span className="ml-2 min-w-0 truncate text-[11px] text-[var(--text-muted)]">
          projeto-{pad(index)}.stack
        </span>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-2 select-none font-display text-[9rem] font-black leading-none transition-colors duration-500"
        style={{ color: hovered ? `${project.color}55` : 'rgba(255,255,255,0.05)' }}
      >
        {pad(index)}
      </span>

      <div className="relative flex flex-1 flex-col justify-center gap-3 px-5 py-4 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
          {t('Tecnologias')}
        </p>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border px-3 py-1 text-xs transition-colors duration-500"
              style={{
                borderColor: hovered ? project.color : 'rgba(255,255,255,0.25)',
                color: hovered ? '#fff' : 'rgba(245,246,248,0.8)',
              }}
            >
              {t(tag)}
            </li>
          ))}
        </ul>

        {(project.github || project.demo) && (
          <div className="relative mt-1 flex flex-wrap gap-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/70 bg-white px-4 py-1.5 text-xs font-bold text-[#050506] transition-opacity hover:opacity-80"
              >
                {t('Ver online ↗')}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/70 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#050506]"
              >
                GitHub ↗
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
