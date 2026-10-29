import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// TODO: Amanda — troque pelo texto real definitivo, se for diferente deste.
const TEXT =
  'BUSCO OPORTUNIDADES NA ÁREA DE DESENVOLVIMENTO DE SOFTWARE, COM INTERESSE EM ATUAR NO DESENVOLVIMENTO DE APLICAÇÕES WEB OU MOBILE, ONDE POSSA APLICAR MINHA EXPERIÊNCIA E CONTINUAR DESENVOLVENDO MINHAS HABILIDADES. TENHO INTERESSE EM APRENDER NOVAS TECNOLOGIAS, ASSUMIR NOVOS DESAFIOS E CONTRIBUIR PARA O DESENVOLVIMENTO DE PRODUTOS.'

const WORDS = TEXT.split(' ')

export default function About() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="about" ref={containerRef} className="relative h-[220vh] snap-start">
      <div className="sticky top-0 flex h-screen flex-col items-center gap-10 px-6 py-24 md:flex-row md:items-center md:justify-center md:gap-20 md:px-24">
        {/* TODO: Amanda — troque pela sua foto real */}
        <div className="aspect-[3/4] w-48 shrink-0 rounded-2xl bg-white/10 md:w-72" />

        <p className="font-display max-w-2xl text-xl font-medium leading-relaxed tracking-tight md:text-3xl">
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
      </div>
    </section>
  )
}

function RevealWord({ word, index, total, scrollYProgress }) {
  const start = index / total
  const end = start + 1 / total
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1])

  return <motion.span style={{ opacity }}> {word}</motion.span>
}
