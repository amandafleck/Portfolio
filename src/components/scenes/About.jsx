import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

// TODO: Amanda — troque pelo texto real definitivo, se for diferente deste.
const TEXT =
  'SOU DESENVOLVEDORA FULL STACK E ESTUDANTE DE SISTEMAS DE INFORMAÇÃO. SEMPRE TIVE CURIOSIDADE EM ENTENDER COMO AS COISAS FUNCIONAM E ENCONTREI NA PROGRAMAÇÃO UMA MANEIRA DE UNIR CRIATIVIDADE E LÓGICA, TRANSFORMANDO IDEIAS EM SOLUÇÕES REAIS. \n TENHO EXPERIÊNCIA COM DIFERENTES ÁREAS DO DESENVOLVIMENTO, ESPECIALMENTE APLICAÇÕES WEB E MOBILE. GOSTO DE APRENDER COISAS NOVAS, EXPERIMENTAR TECNOLOGIAS E PARTICIPAR DA CRIAÇÃO DE PRODUTOS. BUSCO NOVOS DESAFIOS QUE ME PERMITAM COLOCAR MEUS CONHECIMENTOS EM PRÁTICA, TROCAR EXPERIÊNCIAS E CONTINUAR EVOLUINDO COMO DESENVOLVEDORA'

const WORDS = TEXT.split(' ')

// O texto se revela nos primeiros 32% do scroll da seção; depois disso os
// recortes começam a ser "colados" no mural, um por vez.
const TEXT_END = 0.32

// ---- Textos e mídias editáveis ------------------------------------------
const HACKATHON_TEXT =
  'Organizado pela Sicredi Caminho das Águas, com apoio do Instituto Taquara Mais e da Faccat. Durante dois dias, os participei de mentorias e palestras sobre: Validação do Problema / Design Thinking, Validação da Solução / Canva, MVP / Prototipação e Pitch.'
const ELAS_TEXT =
  'Um evento feito para mulheres que querem conhecer, entrar ou crescer na área da tecnologia. Participei como palestrante.'
const ELAS_POST = 'https://www.instagram.com/p/DY68Q4bET5_/'
// TODO: Amanda — coloque o vídeo da palestra em public/mural/ (mp4 leve) e
// troque por '/mural/palestra.mp4'. Enquanto for null, o espaço do vídeo some.
const ELAS_VIDEO = null

const TORN =
  'polygon(0 0, 100% 0, 100% 94%, 94% 98%, 86% 94%, 78% 99%, 69% 95%, 60% 99%, 51% 95%, 42% 99%, 33% 94%, 24% 99%, 15% 95%, 7% 99%, 0 95%)'

const OLD_PAPER_EDGE =
  'polygon(1% 2%, 8% 0, 17% 2%, 29% 0, 41% 2%, 55% 0, 68% 2%, 80% 0, 92% 2%, 100% 1%, 99% 14%, 100% 27%, 98% 41%, 100% 55%, 99% 69%, 100% 83%, 98% 100%, 88% 98%, 76% 100%, 63% 98%, 50% 100%, 37% 98%, 24% 100%, 12% 98%, 0 100%, 1% 86%, 0 72%, 2% 58%, 0 44%, 1% 30%, 0 16%)'

// contorno branco de "adesivo recortado" em volta de PNGs com fundo transparente
const CUTOUT =
  'drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(0 10px 12px rgba(0,0,0,0.55))'

function Tape({ className = '' }) {
  return (
    <span
      aria-hidden
      className={`absolute left-1/2 z-10 h-5 w-20 -translate-x-1/2 bg-[#ffe9a3]/80 shadow-sm ${className}`}
      style={{
        clipPath:
          'polygon(0 10%, 4% 0, 8% 12%, 12% 0, 92% 0, 96% 12%, 100% 0, 100% 90%, 96% 100%, 92% 88%, 88% 100%, 12% 100%, 8% 88%, 4% 100%, 0 90%)',
      }}
    />
  )
}

function Paperclip({ className = '' }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 64"
      className={`absolute z-10 h-16 w-6 ${className}`}
      fill="none"
      stroke="#9aa1ad"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M8 40V12a5 5 0 0 1 10 0v38a8 8 0 0 1-16 0V18" />
    </svg>
  )
}


/* Espaço de foto: mostra a imagem se `src` existir, senão um quadro pontilhado. */
function PhotoSlot({ src, alt, label, className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`pointer-events-none w-full object-cover ${className}`}
      />
    )
  }
  return (
    <div
      className={`flex w-full items-center justify-center border-2 border-dashed border-[#1b2240]/30 bg-[#1b2240]/5 text-center text-[0.65rem] uppercase text-[#1b2240]/50 md:text-xs ${className}`}
    >
      {label}
    </div>
  )
}

/* Vídeo curto em loop e sem som; toque/clique alterna play e pause. */
function VideoSlot({ src, className = '' }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => {})
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Tocar ou pausar o vídeo da palestra"
      className={`relative block w-full overflow-hidden bg-black ${className}`}
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="pointer-events-none h-full w-full object-cover"
      />
      {!playing && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-3xl text-white">
          ▶
        </span>
      )}
    </button>
  )
}

/* Conteúdo de cada recorte — cada um com um jeito diferente de papel. */
function CriatividadeLogica() {
  return (
    <div className="relative w-64 md:w-96">
      <Tape className="-top-2 rotate-[-4deg]" />
      <div
        className="px-6 pb-9 pt-8 text-[#1b2240] shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
        style={{
          clipPath: TORN,
          backgroundColor: '#f4efe1',
          backgroundImage:
            'linear-gradient(rgba(47,107,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(47,107,255,0.18) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      >
        <p className="text-xs uppercase text-[var(--blue)] md:text-sm">criatividade + lógica</p>
        <p className="mt-2 text-sm leading-6 md:text-base md:leading-7">
          Sempre fui uma pessoa criativa e sempre gostei de matemática, lógica e de
          encontrar soluções para problemas.
        </p>
        {/* TODO: Amanda — foto aqui (passe src="/sua-foto.jpg") */}
        <PhotoSlot label="sua foto aqui" className="mt-4 aspect-[4/3]" />
      
      </div>
    </div>
  )
}

// Folha antiga: papel amarelado e manchado, pautado, com carimbo vermelho.
function Hackathon() {
  return (
    <div className="relative w-72 md:w-[25rem]">
      <Paperclip className="-top-5 left-6 rotate-[8deg]" />
      <div
        className="relative px-6 pb-8 pt-8 text-[#4a3720] shadow-[0_10px_24px_rgba(0,0,0,0.5)] md:px-8"
        style={{
          clipPath: OLD_PAPER_EDGE,
          backgroundColor: '#e8d5a1',
          backgroundImage:
            'radial-gradient(ellipse at 85% 12%, rgba(120,72,20,0.28) 0 7%, transparent 14%), radial-gradient(ellipse at center, transparent 55%, rgba(110,70,20,0.38) 100%), linear-gradient(90deg, transparent 2.4rem, rgba(190,60,60,0.45) 2.4rem calc(2.4rem + 1px), transparent calc(2.4rem + 1px)), repeating-linear-gradient(transparent 0 1.7rem, rgba(70,90,150,0.3) 1.7rem calc(1.7rem + 1px))',
        }}
      >
        <p className="pl-6 text-xs uppercase text-[#8a2d1f] md:text-sm">
          hackatime taquara · 2º lugar
        </p>

        <div className="relative ml-6 mt-4 rotate-[-2deg] border-[6px] border-[#fbf6e6] shadow-md">
          <img
            src="/mural/hackatime-time.png"
            alt="Participantes do Hackatime Taquara reunidos no auditório"
            draggable={false}
            className="pointer-events-none aspect-[4/3] w-full object-cover sepia-[0.35]"
          />
        </div>

        <p className="mt-4 pl-6 text-xs leading-[1.7rem] md:text-sm md:leading-[1.7rem]">
          {HACKATHON_TEXT}
        </p>

     
      </div>
    </div>
  )
}

// Troféu: PNG com fundo transparente, recortado como adesivo.
function Trofeu() {
  return (
    <img
      src="/mural/premio-hackatime.png"
      alt="Troféu de 2º lugar do Hackatime"
      draggable={false}
      className="pointer-events-none w-40 md:w-56"
      style={{ filter: CUTOUT }}
    />
  )
}

function ElasNaTI() {
  return (
    <div className="relative w-60 md:w-80">
      <span
        aria-hidden
        className="absolute left-1/2 top-1 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      />
      <div className="bg-[#fbfbf8] p-3 pb-5 shadow-[0_10px_24px_rgba(0,0,0,0.5)] md:p-4 md:pb-6">
        <img
          src="/mural/palestra.jpg"
          alt="Amanda palestrando no Elas na TI"
          draggable={false}
          className="pointer-events-none aspect-[3/4] w-full object-cover object-[30%_30%]"
        />

        {ELAS_VIDEO && <VideoSlot src={ELAS_VIDEO} className="mt-3 aspect-video" />}

        <p className="mt-3 text-sm font-bold leading-5 text-[#1b2240] md:text-base">
          Palestrante no Elas na TI
        </p>
        <p className="text-xs leading-4 text-[#1b2240]/70 md:text-sm">13 de junho · FACCAT</p>

        <p className="mt-3 border-t border-dashed border-[#1b2240]/25 pt-3 text-xs leading-5 text-[#1b2240]/85 md:text-sm md:leading-6">
          {ELAS_TEXT}
        </p>

        <a
          href={ELAS_POST}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block border-b border-[#1b2240] text-xs font-bold text-[#1b2240] md:text-sm"
        >
          Ver o post no Instagram ↗
        </a>
      </div>
    </div>
  )
}

// Crachá de palestrante: PNG transparente, solto no mural como um recorte.
function Cracha() {
  return (
    <img
      src="/mural/cracha-palestrante.png"
      alt="Crachá de palestrante do Elas na TI — Faccat, 13 de junho"
      draggable={false}
      className="pointer-events-none w-36 md:w-52"
      style={{ filter: CUTOUT }}
    />
  )
}

// start = ponto do scroll (0..1) em que o recorte começa a ser colado.
// Posições soltas, com sobreposição e rotações variadas, como num mural de verdade.
const SCRAPS = [
  {
    id: 'logica',
    start: 0.4,
    rotate: -7,
    pos: 'left-[1%] top-[4%] md:left-[3%] md:top-[9%]',
    node: <CriatividadeLogica />,
  },
  {
    id: 'hackathon',
    start: 0.5,
    rotate: 3,
    pos: 'right-[1%] top-[24%] md:left-[27%] md:right-auto md:top-[2%]',
    node: <Hackathon />,
  },
  {
    id: 'trofeu',
    start: 0.6,
    rotate: 11,
    pos: 'left-[2%] bottom-[18%] md:left-[44%] md:bottom-[2%]',
    node: <Trofeu />,
  },
  {
    id: 'elas',
    start: 0.7,
    rotate: -4,
    pos: 'right-[3%] bottom-[2%] md:right-[14%] md:top-[5%] md:bottom-auto',
    node: <ElasNaTI />,
  },
  {
    id: 'cracha',
    start: 0.82,
    rotate: 9,
    pos: 'left-[30%] top-[2%] md:right-[2%] md:left-auto md:bottom-[5%] md:top-auto',
    node: <Cracha />,
  },
]

export default function About() {
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Depois que o texto termina, ele e a foto recuam pra dar lugar ao mural.
  const baseOpacity = useTransform(scrollYProgress, [TEXT_END + 0.02, 0.44], [1, 0.16])
  const baseBlur = useTransform(scrollYProgress, [TEXT_END + 0.02, 0.44], [0, 3])
  const baseFilter = useTransform(baseBlur, (b) => `blur(${b}px)`)
  const hintOpacity = useTransform(scrollYProgress, [0.93, 0.98], [0, 1])

  // Ordem de empilhamento: o último recorte tocado fica por cima.
  const [order, setOrder] = useState(() => SCRAPS.map((s) => s.id))
  const bringToFront = (id) =>
    setOrder((prev) => (prev[prev.length - 1] === id ? prev : [...prev.filter((x) => x !== id), id]))

  return (
    <section id="about" ref={containerRef} className="relative h-[560vh] snap-start">
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          style={{ opacity: baseOpacity, filter: baseFilter }}
          className="flex h-full flex-col items-center gap-10 px-6 py-24 md:flex-row md:items-center md:justify-center md:gap-20 md:px-24"
        >
          <img
            src="/perfil.jpg"
            alt="Amanda Fleck"
            draggable={false}
            className="aspect-[3/4] w-48 shrink-0 rounded-2xl object-cover object-[40%_40%] md:w-72"
          />

          <p className="whitespace-pre-line font-display max-w-3xl text-xl font-medium leading-relaxed tracking-tight md:text-[1.7rem]">
            {WORDS.map((word, index) => (
              <RevealWord
                key={`${word}-${index}`}
                word={word}
                index={index}
                total={WORDS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </p>
        </motion.div>

        {SCRAPS.map((scrap) => (
          <Scrap
            key={scrap.id}
            scrap={scrap}
            z={10 + order.indexOf(scrap.id)}
            scrollYProgress={scrollYProgress}
            constraintsRef={stageRef}
            onGrab={() => bringToFront(scrap.id)}
          />
        ))}

      </div>
    </section>
  )
}

/*
 * Dois níveis: o externo cuida da posição inicial e da
 * animação de "colar" (dirigida pelo scroll); o interno cuida do arrastar,
 * assim os transforms de um não brigam com os do outro.
 */
function Scrap({ scrap, z, scrollYProgress, constraintsRef, onGrab }) {
  const { start, rotate, pos, node } = scrap
  const appear = useTransform(scrollYProgress, [start, start + 0.07], [0, 1])
  const opacity = useTransform(appear, [0, 0.4], [0, 1])
  const scale = useTransform(appear, [0, 1], [1.6, 1])
  const y = useTransform(appear, [0, 1], [-60, 0])
  const rot = useTransform(appear, [0, 1], [rotate - 14, rotate])

  return (
    <motion.div
      style={{ opacity, scale, y, rotate: rot, zIndex: z }}
      className={`absolute ${pos}`}
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.08}
        dragMomentum={false}
        onPointerDown={onGrab}
        onDragStart={onGrab}
        whileDrag={{ scale: 1.06, rotate: rotate > 0 ? 2 : -2 }}
        whileHover={{ scale: 1.03 }}
        className="cursor-grab touch-none select-none active:cursor-grabbing"
      >
        {node}
      </motion.div>
    </motion.div>
  )
}

function RevealWord({ word, index, total, scrollYProgress }) {
  const start = (index / total) * TEXT_END
  const end = start + TEXT_END / total
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1])

  return <motion.span style={{ opacity }}> {word}</motion.span>
}
