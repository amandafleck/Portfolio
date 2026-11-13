import { motion } from 'framer-motion'
import { useLanguage } from '../../lib/LanguageContext'
import { Scaled, useFit } from '../../lib/useFit'

const WORK = {
  company: 'Savee',
  url: 'https://savee.com',
  role: 'Software Developer (Full Stack)',
  period: '2024–2026',
  areas: ['Web', 'iOS', 'Android', 'Back-end'],
  regime: 'Tempo integral · Remoto',
  about: 'Plataforma de referências visuais para designers',
  // cada item vira uma linha numerada, no estilo "01 / TÍTULO + texto"
  items: [
    {
      title: 'Desenvolvimento full stack',
      text: 'Atuei como desenvolvedora full stack, trabalhando tanto no front-end (web, iOS e Android) quanto no back-end da plataforma.',
    },
    {
      title: 'Plataforma em produção',
      text: 'Atuação no desenvolvimento e evolução de uma plataforma utilizada por mais de 1 milhão de usuários. Participando do desenvolvimento, revisão e testes de funcionalidades.',
    },
    {
      title: 'Design de produto',
      text: 'Por ser um produto feito para designers, também aprofundei meu olhar para design de produto, UI/UX e construção de interfaces.',
    },
  ],
  stack: ['TypeScript', 'React', 'Next.js', 'Node.js', 'GraphQL', 'PostgreSQL', 'Drizzle', 'Stripe', 'Playwright'],
}

const EASE = [0.16, 1, 0.3, 1]
const pad = (i) => String(i + 1).padStart(2, '0')

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Work() {
  const { t } = useLanguage()
  const fit = useFit(0, 740, 0.65)

  return (
    <section id="work" className="relative min-h-screen overflow-x-clip md:min-h-[170vh]">
      <h2 className="sr-only">{t('Onde trabalhei')}</h2>
      <div className="md:sticky md:top-0 md:h-svh md:overflow-hidden">
      <Scaled
        scale={fit}
        className="flex min-h-screen items-center px-4 py-20 sm:px-6 md:min-h-0 md:py-8 md:pl-24 md:pr-12 lg:pl-28 lg:pr-24"
      >

      <div className="mx-auto grid w-full max-w-6xl min-w-0 grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 lg:gap-20">
        {/* esquerda: título, empresa e tecnologias */}
        <div className="flex flex-col justify-between gap-8">
          <Reveal>
            <p className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              {t('Onde trabalhei')}
            </p>
            <a
              href={WORK.url}
              target="_blank"
              rel="noreferrer"
              className="group mt-5 inline-flex items-center gap-2"
            >
              <span className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                {WORK.company}
              </span>
              <span className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
            <p className="mt-2 text-sm font-medium md:text-base">
              {WORK.role} <span className="text-white/60">· {WORK.period}</span>
            </p>
            <p className="mt-1 text-xs text-white/60">
              {t(WORK.regime)} ·{' '}
              <span className="uppercase tracking-[0.15em] text-white/80">
                {WORK.areas.map(t).join(' · ')}
              </span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-white/70">{t(WORK.about)}</p>
          </Reveal>

          {/* linguagens e tecnologias: grade de botões, intercalando cheio e vazado */}
          <Reveal delay={0.15}>
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-white/70">
              {t('Tecnologias')}
            </p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {WORK.stack.map((tech, index) => {
                const filled = (index + Math.floor(index / 3)) % 2 === 0
                return (
                  <li
                    key={tech}
                    className={`flex items-center justify-center border px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 md:text-xs ${
                      filled
                        ? 'border-[#050506] bg-[#050506] bg-white text-[#050506] hover:bg-transparent hover:text-white hover:border-white/70'
                        : 'border-white/70 bg-transparent text-white hover:bg-white hover:text-[#050506]'
                    }`}
                  >
                    {tech}
                  </li>
                )
              })}
            </ul>
          </Reveal>

          
        </div>

        {/* direita: lista numerada */}
        <ol className="flex flex-col justify-center">
          {WORK.items.map((item, index) => (
            <Reveal key={item.title} delay={0.1 + index * 0.12}>
              <li className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-white/30 py-5 first:border-t-0 md:py-6">
                <span className="text-xs text-white/60">[{pad(index)}]</span>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.1em] md:text-base">
                    {t(item.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{t(item.text)}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
      </Scaled>
      </div>
    </section>
  )
}
