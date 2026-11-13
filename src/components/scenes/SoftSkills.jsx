import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useCursor } from '../../lib/CursorContext'
import { useLanguage } from '../../lib/LanguageContext'
import { Scaled, useFit } from '../../lib/useFit'

const SKILLS = [
  'Trabalho em equipe',
  'Boa comunicação',
  'Dedicação',
  'Facilidade de aprendizado',
  'Proatividade',
  'Curiosidade',
]

// TODO: Amanda — ajuste as categorias e as tecnologias reais que você usa
const TECH_CATEGORIES = [
  {
    title: 'Front-end',
    items: ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Angular', 'React Native'],
  },
  { title: 'Estilos', items: ['HTML', 'CSS', 'Tailwind'] },
  { title: 'Back-end', items: ['Node.js', 'Python', 'Java', 'GraphQL', 'Stripe'] },
  { title: 'Banco de dados', items: ['PostgreSQL', 'MySQL', 'Drizzle'] },
  { title: 'Testes & DevOps', items: ['Jest', 'Playwright', 'Git'] },
]

const FORMACAO = [
  {
    key: 'tecnico',
    title: 'Técnico em Informática',
    period: '2022 — 2024',
    lines: ['Integrado ao Ensino Médio', 'Escola Estadual Monteiro Lobato'],
    from: { y: -60 },
  },
  {
    key: 'faccat',
    title: 'Sistemas de Informação',
    period: '2025 — 2030',
    lines: ['Bacharelado — FACCAT', 'Faculdades Integradas de Taquara', '4º semestre'],
    from: { y: -60 },
  },
  {
    key: 'ingles',
    title: 'Inglês',
    period: '2021 — 2023',
    lines: ['Intermediário', 'Senac — Taquara'],
    from: { y: 60 },
  },
  {
    key: 'ctfl',
    title: 'Certified Tester Foundation Level',
    period: '2025',
    lines: ['BSTQB'],
    from: { y: 60 },
  },
]

const FOLDER_ICON_PATHS = {
  tecnico: (
    <path d="M4 6.5C4 5.67 4.67 5 5.5 5H12v14H5.5A1.5 1.5 0 0 1 4 17.5v-11ZM20 6.5c0-.83-.67-1.5-1.5-1.5H12v14h6.5c.83 0 1.5-.67 1.5-1.5v-11Z" />
  ),
  faccat: (
    <path d="M2 9 12 4l10 5-10 5-10-5Zm4 2.5V16c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5M20 9v6" />
  ),
  ingles: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.4 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.4-3.8-8.5S9.5 5.9 12 3.5Z" />
    </>
  ),
  ctfl: <path d="M12 3.5 19 6v6c0 4.2-2.9 7.4-7 8.5-4.1-1.1-7-4.3-7-8.5V6l7-2.5Zm-3 8.2 2 2 4-4.4" />,
}

// Pilha de pastas físicas (referência: "Service Files" / "Fragments") —
// 00 é a pasta da frente, 04 a mais escondida lá atrás.
// `tab` é a posição horizontal da aba: 0 = encostada à esquerda, 1 = à direita.
const FOLDERS = [
  {
    key: 'faccat',
    num: '00',
    label: 'FACCAT',
    subtitle: 'Bacharelado em Sistemas de Informação',
    period: '2025 — 2030',
    lines: ['Faculdades Integradas de Taquara', '3º semestre'],
    tab: 0,
    fill: '#14205e',
    ink: '#f5f6f8',
  },
  {
    key: 'tecnico',
    num: '01',
    label: 'Técnico em Informática',
    subtitle: 'Ensino Médio Integrado',
    period: '2022 — 2024',
    lines: ['Escola Estadual Monteiro Lobato'],
    tab: 1,
    fill: '#c3d0ff',
    ink: '#0a1440',
  },
  {
    key: 'ingles',
    num: '02',
    label: 'Inglês',
    subtitle: 'Intermediário',
    period: '2021 — 2023',
    lines: ['Senac — Taquara'],
    tab: 0.15,
    fill: '#d8e0ff',
    ink: '#0a1440',
  },
  {
    key: 'cursos',
    num: '03',
    label: 'Tester Foundation Level',
    subtitle: 'Certified Tester Foundation Level — BSTQB',
    period: '2025',
    lines: ['BSTQB'],
    tab: 0.8,
    fill: '#eaefff',
    ink: '#0a1440',
  },
  {
    key: 'udemy',
    num: '04',
    label: 'Cursos',
    subtitle: 'Angular 19 e React 18 / 19 — Udemy',
    period: '2026',
    lines: ['Angular 19, Curso Completo — Douglas Souza', 'Curso de React 18 / 19'],
    tab: 0.4,
    fill: '#f4f6ff',
    ink: '#0a1440',
  },
]

// medidas da pilha (px)
const STACK_H = 460 // altura total da pilha (o que sobra após as abas é a pasta da frente)
const STACK_TOP = 12 // respiro acima da pasta mais de trás
const TAB_H = 30 // altura da aba
const STEP = 56 // distância vertical entre o topo de uma pasta e a próxima
const RADIUS = 20 // cantos do corpo
const SHOULDER = 14 // curva orgânica que liga a aba ao corpo
const LIFT = 34 // quanto a pasta de trás sobe no hover

// Uma pasta = um único path: corpo com cantos arredondados + aba com
// "ombros" em S, igual pasta de arquivo de verdade.
function folderPath(w, h, tx, tw) {
  const t = TAB_H
  const r = RADIUS
  const s = SHOULDER
  return [
    `M0 ${t + r}`,
    `Q0 ${t} ${r} ${t}`,
    `L${tx - s} ${t}`,
    `C${tx} ${t} ${tx} 0 ${tx + s} 0`,
    `L${tx + tw - s} 0`,
    `C${tx + tw} 0 ${tx + tw} ${t} ${tx + tw + s} ${t}`,
    `L${w - r} ${t}`,
    `Q${w} ${t} ${w} ${t + r}`,
    `L${w} ${h - r}`,
    `Q${w} ${h} ${w - r} ${h}`,
    `L${r} ${h}`,
    `Q0 ${h} 0 ${h - r}`,
    'Z',
  ].join(' ')
}

// Largura que a aba precisa pra mostrar "[01] TÉCNICO EM INFORMÁTICA" inteiro
// (mesma fonte/tamanho/espaçamento das classes usadas no texto da aba).
let measureCtx = null
function tabTextWidth(num, label) {
  if (typeof document === 'undefined') return 0
  measureCtx ??= document.createElement('canvas').getContext('2d')
  const family = getComputedStyle(document.documentElement).getPropertyValue('--sans') || 'sans-serif'

  measureCtx.font = `700 11px ${family}`
  const numText = `[${num}]`
  const numW = measureCtx.measureText(numText).width + numText.length * 11 * 0.1

  const labelText = label.toUpperCase()
  measureCtx.font = `700 12px ${family}`
  const labelW = measureCtx.measureText(labelText).width + labelText.length * 12 * 0.12

  const gap = 8
  const padding = 28
  return Math.ceil(numW + gap + labelW + padding)
}

function useWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

export default function SoftSkills() {
  const { t } = useLanguage()
  const fit = useFit(0, 760, 0.65)

  return (
    <section id="softskills" className="relative min-h-screen overflow-x-clip md:min-h-[170vh]">
      <div className="md:sticky md:top-0 md:h-svh md:overflow-hidden">
      <Scaled scale={fit} className="flex min-h-screen flex-col justify-center gap-8 px-4 py-10 sm:px-6 md:min-h-0 md:flex-row md:items-center md:gap-10 md:px-16 md:py-8 lg:pl-24">
        <div className="flex shrink-0 flex-col gap-2 md:w-56">
          <h2 className="mb-1 font-display text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {t('Tecnologias')}
          </h2>
          {TECH_CATEGORIES.map((category) => (
            <TechBox key={category.title} category={category} />
          ))}
        </div>

        <div className="mt-10 flex flex-1 flex-col items-center justify-center gap-12">
          {/* Versão anterior (grade de cards) — comentada a pedido da Amanda,
            substituída pelas "pastinhas" que abrem no hover/clique abaixo.
            FormacaoBox continua definido mais abaixo caso precise voltar.
        <div className="flex flex-wrap items-center justify-center gap-6">
          {FORMACAO.map((item, index) => (
            <FormacaoBox key={item.key} item={item} index={index} />
          ))}
        </div>
        */}
          <FormacaoStack folders={FOLDERS} />

          <div className="mt-2 flex flex-col items-center gap-3 lg:mt-6">
            <h2 className="font-display text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]">
              {t('Soft Skills')}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {SKILLS.map((skill) => (
                <SkillBox key={skill} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </Scaled>
      </div>
    </section>
  )
}

function SkillBox({ skill }) {
  const { enterLight, leaveLight } = useCursor()
  const { t } = useLanguage()

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -3 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={enterLight}
      onMouseLeave={leaveLight}
      className="group cursor-default rounded-lg border border-white/15 px-3 py-2 transition-colors lg:px-4 lg:py-3 duration-300 hover:border-transparent hover:bg-white"
    >
      <span className="text-sm font-medium text-[var(--text-muted)] opacity-60 transition-all duration-300 group-hover:text-black group-hover:opacity-100">
        {t(skill)}
      </span>
    </motion.div>
  )
}

function FormacaoStack({ folders }) {
  const { t } = useLanguage()
  const [ref, width] = useWidth()
  const [lifted, setLifted] = useState(null)
  const { setScale, clearScale } = useCursor()
  const count = folders.length

  // renderiza de trás (04) pra frente (01): a ordem do DOM faz a sobreposição
  const stack = folders.map((folder, index) => ({ folder, index })).reverse()

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[540px] select-none"
      style={{ height: STACK_H }}
      onMouseLeave={() => {
        setLifted(null)
        clearScale()
      }}
    >
      {width > 0 &&
        stack.map(({ folder, index }, order) => {
          const isFront = index === 0
          const top = STACK_TOP + (count - 1 - index) * STEP
          const h = STACK_H - top
          const minX = RADIUS + SHOULDER
          const tw = Math.min(
            Math.max(tabTextWidth(folder.num, folder.label) + SHOULDER, 150),
            width - 2 * minX
          )
          const maxX = width - RADIUS - SHOULDER - tw
          const tx = minX + (maxX - minX) * folder.tab
          const isLifted = lifted === index && !isFront

          return (
            <motion.div
              key={folder.key}
              initial={{ opacity: 0, y: -18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: order * 0.09 }}
              className="absolute inset-x-0"
              style={{ top, height: h }}
            >
              <motion.div
                animate={{ y: isLifted ? -LIFT : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => {
                  setLifted(index)
                  // na capa (bacharelado) o cursor fica normal; nas de trás ele diminui
                  if (isFront) clearScale()
                  else setScale(0.45)
                }}
                onClick={() => setLifted(isLifted ? null : index)}
                className="relative h-full w-full cursor-pointer"
                style={{ color: folder.ink }}
              >
                <svg
                  className="absolute inset-0 overflow-visible"
                  width={width}
                  height={h}
                  style={{ filter: 'drop-shadow(0 -3px 8px rgba(0,0,0,0.28))' }}
                  aria-hidden
                >
                  <path
                    d={folderPath(width, h, tx, tw)}
                    fill={folder.fill}
                    stroke={isFront ? 'rgba(255,255,255,0.14)' : '#0a1440'}
                    strokeWidth={1.25}
                  />
                </svg>

                {/* texto da aba */}
                <div
                  className="absolute top-0 flex items-center gap-2 overflow-hidden"
                  style={{ left: tx + SHOULDER / 2, width: tw - SHOULDER, height: TAB_H }}
                >
                  <span className="shrink-0 text-[11px] font-bold tracking-[0.1em] opacity-60">
                    [{folder.num}]
                  </span>
                  <span className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.12em]">
                    {t(folder.label)}
                  </span>
                </div>

                {isFront ? (
                  <FrontFolderBody folder={folder} />
                ) : (
                  <div
                    className="absolute inset-x-0 px-6"
                    style={{ top: TAB_H + 5 }}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="truncate text-xs font-semibold">{t(folder.subtitle)}</p>
                      <p className="shrink-0 text-[10px] font-bold tracking-[0.15em] opacity-60">
                        {folder.period}
                      </p>
                    </div>
                    {/* aparece quando a pasta sobe (hover/toque) */}
                    <p className="mt-1 truncate text-[11px] opacity-70">
                      {folder.lines.map(t).join(' · ')}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )
        })}
    </div>
  )
}

// conteúdo da pasta da frente — o "Service Files" da referência
function FrontFolderBody({ folder }) {
  const { t } = useLanguage()

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex flex-col px-7 pb-6"
      style={{ top: TAB_H + 10 }}
    >
      <div>
        <h3 className="mb-3 mt-2 font-display text-2xl font-black leading-tight md:text-[1.7rem]">
          {t(folder.subtitle)}
        </h3>
       
      </div>
       <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8fa9ff]">
          {folder.period} · {t(folder.lines[1])}
        </p>

      <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
        {t(folder.lines[0])}
      </p>
    </div>
  )
}

function FormacaoBox({ item, index }) {
  const boxRef = useRef(null)
  const { absorb, release } = useCursor()

  return (
    <motion.div
      ref={boxRef}
      initial={{ opacity: 0, ...item.from }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ scale: 1.03, filter: 'brightness(1.15)' }}
      transition={{ duration: 1, delay: index * 0.15, ease: 'easeOut' }}
      onMouseEnter={() => absorb(boxRef.current.getBoundingClientRect())}
      onMouseLeave={release}
      className="w-60 rounded-2xl bg-white/5 p-5 backdrop-blur-xl"
    >
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--blue)]">
        {item.period}
      </p>
      <h3 className="mb-2 text-base font-bold leading-tight">{item.title}</h3>
      {item.lines.map((line) => (
        <p key={line} className="text-xs text-[var(--text-muted)]">
          {line}
        </p>
      ))}
    </motion.div>
  )
}

// Box de tecnologia: o cursor "pinga" dentro dele — a cor se espalha em
// círculo a partir do ponto onde o mouse entrou (e recolhe pelo ponto
// onde saiu), enquanto o cursor fica bem pequenininho.
function TechBox({ category }) {
  const { setScale, clearScale } = useCursor()
  const [ink, setInk] = useState({ on: false, x: 0, y: 0, r: 0 })

  const inkFrom = (event, on) => {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    const k = el.offsetWidth / rect.width || 1
    const x = (event.clientX - rect.left) * k
    const y = (event.clientY - rect.top) * k
    const r = Math.hypot(Math.max(x, el.offsetWidth - x), Math.max(y, el.offsetHeight - y))
    setInk({ on, x, y, r })
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={(event) => {
        inkFrom(event, true)
        setScale(0.2)
      }}
      onMouseLeave={(event) => {
        inkFrom(event, false)
        clearScale()
      }}
      className="relative overflow-hidden rounded-2xl border border-white/15 px-4 py-3"
    >
      <motion.div
        aria-hidden
        initial={false}
        animate={{
          clipPath: `circle(${ink.on ? ink.r + 2 : 0}px at ${ink.x}px ${ink.y}px)`,
        }}
        transition={{ duration: ink.on ? 0.6 : 0.4, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 bg-white"
      />
      <h4
        className={`relative mb-2 text-sm font-bold transition-colors duration-500 ${
          ink.on ? 'text-[#0a1440]' : 'text-[var(--text)]'
        }`}
      >
        {category.title}
      </h4>
      <p
        className={`relative text-xs leading-relaxed transition-colors duration-500 ${
          ink.on ? 'text-[#0a1440]/75' : 'text-[var(--text-muted)]'
        }`}
      >
        {category.items.join(' / ')}
      </p>
    </motion.div>
  )
}
