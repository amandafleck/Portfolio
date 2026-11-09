import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// TODO: Amanda — coloque a imagem do savee em /public/work/ (ex.: public/work/tela.jpg)
// e troque `image` por '/work/tela.jpg'. Enquanto for null, aparece um fundo
// "planeta à noite" feito em CSS.
const WORK = {
  image: null,
  company: 'Savee',
  url: 'https://savee.com',
  role: 'Software Developer (Full Stack)',
  period: '2024–2026',
  areas: ['Web', 'iOS', 'Android', 'Backend'],
  regime: 'Tempo integral · Remoto',
  about: 'Plataforma de referências visuais para designers',
  paragraphs: [
    'Atuei como desenvolvedora full stack, trabalhando tanto no front-end (web, iOS e Android) quanto no back-end da plataforma, em regime integral e 100% remoto.',
    'Atuação no desenvolvimento e evolução de uma plataforma utilizada por mais de 1 milhão de usuários, produto em produção, com uso contínuo. Participando do desenvolvimento, revisão e testes de funcionalidades.',
    'Por ser um produto feito para designers, também aprofundei meu olhar para design de produto, UI/UX e construção de interfaces.',
  ],
  stack: ['TypeScript', 'React', 'Next.js', 'Node.js', 'GraphQL', 'PostgreSQL', 'Drizzle', 'Stripe', 'Playwright'],
}

export default function Work() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // o notebook começa de costas, dá a volta e para de frente, crescendo
  const rotateY = useTransform(scrollYProgress, [0, 0.55], [-200, 0])
  const rotateX = useTransform(scrollYProgress, [0, 0.55], [18, 0])
  const scale = useTransform(scrollYProgress, [0, 0.55], [0.55, 1])
  // no desktop ele gira mais pra dentro da tela e desliza pra esquerda até
  // ficar meio escondido
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsDesktop(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])
  const x = useTransform(scrollYProgress, [0, 0.55], isDesktop ? ['24vw', '0vw'] : ['0vw', '0vw'])
  // "SAVEE" gigante no fundo, atravessando a tela conforme o scroll
  const bigX = useTransform(scrollYProgress, [0, 1], ['30%', '-60%'])

  return (
    <section id="work" ref={sectionRef} className="relative h-[260vh] snap-start">
      <h2 className="sr-only">Onde trabalhei</h2>

      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden px-6 md:flex-row md:justify-between md:gap-0 md:px-0">
        <motion.p
          aria-hidden
          style={{ x: bigX }}
          className="pointer-events-none absolute bottom-[-4vw] left-0 -z-0 whitespace-nowrap font-display text-[30vw] font-black leading-none tracking-tighter text-white/[0.07]"
        >
          WORK
        </motion.p>
        {/* no desktop só uns 55% do notebook aparecem — o resto sai pela
            esquerda, deixando espaço pro texto */}
        <div className="relative w-[92vw] shrink-0 md:-ml-[26vw] md:w-[58vw]" style={{ perspective: 2200 }}>
          <motion.div
            style={{ x, rotateY, rotateX, scale, transformStyle: 'preserve-3d' }}
            className="relative"
          >
            <Laptop image={WORK.image} />
          </motion.div>
        </div>

        <div className="relative flex max-w-2xl flex-col gap-5 md:mr-[5vw] md:max-h-screen md:py-6">
          <Reveal index={0} progress={scrollYProgress}>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Onde trabalhei</p>
            <a
              href={WORK.url}
              target="_blank"
              rel="noreferrer"
              className="group mt-3 inline-flex items-center gap-1.5"
            >
              <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                {WORK.company}
              </h3>
              <span className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
            <p className="mt-2 text-base font-medium md:text-lg">
              {WORK.role} <span className="text-white/60">· {WORK.period}</span>
            </p>
            <p className="mt-1 text-xs text-white/60">{WORK.regime} · <span className="uppercase tracking-[0.15em] text-white/80">{WORK.areas.join(" · ")}</span></p>
            <p className="mt-3 text-sm text-white/70 md:text-base">{WORK.about}</p>
          </Reveal>

          <Reveal index={1} progress={scrollYProgress}>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-white/90 md:text-[0.95rem]">
              {WORK.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </Reveal>

          <Reveal index={2} progress={scrollYProgress}>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--blue)]">Tecnologias</p>
            <ul className="flex flex-wrap gap-2.5">
              {WORK.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-[var(--blue)] bg-[var(--blue-soft)] px-3.5 py-1 text-sm font-bold text-white shadow-[0_0_14px_rgba(47,107,255,0.25)] md:text-base"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// cada parte do texto entra depois que o notebook termina de virar, uma de cada vez
function Reveal({ index, progress, children }) {
  const start = 0.5 + index * 0.1
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1])
  const y = useTransform(progress, [start, start + 0.1], [24, 0])

  return <motion.div style={{ opacity, y }}>{children}</motion.div>
}

function Laptop({ image }) {
  return (
    <div style={{ transformStyle: 'preserve-3d' }}>
      {/* tampa: frente (tela) e verso (alumínio com logo) */}
      <div className="relative aspect-[16/10] w-full" style={{ transformStyle: 'preserve-3d' }}>
        <div
          className="absolute inset-0 rounded-t-[1.6vw] border-[3px] border-[#b9bcc4] bg-black p-[1.4%]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute left-1/2 top-[0.6%] h-[1.2%] w-[1.2%] -translate-x-1/2 rounded-full bg-[#1c1d22]" />
          <div className="relative h-full w-full overflow-hidden rounded-[0.4vw]">
            {image ? (
              <img src={image} alt="" className="h-full w-full object-cover" />
            ) : (
              <PlanetPlaceholder />
            )}
          </div>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center rounded-t-[1.6vw] bg-gradient-to-br from-[#d9dce3] via-[#b4b8c1] to-[#8d919b]"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="font-display text-[5vw] font-black text-white/70 [text-shadow:0_1px_0_rgba(0,0,0,0.15)]">
            A
          </span>
        </div>
      </div>

      {/* base */}
      <div className="relative -mx-[6%] h-[3.2%] min-h-2 rounded-b-[2vw] bg-gradient-to-b from-[#e3e5ea] via-[#b9bcc4] to-[#6f737c]">
        <div className="absolute left-1/2 top-0 h-1/2 w-[14%] -translate-x-1/2 rounded-b-md bg-[#9a9ea7]" />
      </div>
    </div>
  )
}

function PlanetPlaceholder() {
  return (
    <div
      className="h-full w-full"
      style={{
        background: [
          'radial-gradient(ellipse 120% 90% at 55% 115%, #0b1a3a 55%, transparent 56%)',
          'radial-gradient(ellipse 125% 95% at 55% 115%, rgba(80,150,255,0.55) 55%, transparent 58%)',
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0.6px, transparent 1px)',
          'radial-gradient(circle at 70% 35%, rgba(255,255,255,0.4) 0.6px, transparent 1px)',
          'linear-gradient(#02040b, #060c1e)',
        ].join(','),
        backgroundSize: '100% 100%, 100% 100%, 90px 90px, 130px 130px, 100% 100%',
      }}
    />
  )
}
