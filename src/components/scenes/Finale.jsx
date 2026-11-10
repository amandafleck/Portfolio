import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Contact, { ContactProvider } from './Contact'
import Eye from './Eye'

/*
 * "Porão": o olho mora embaixo da página de Contato. No fim do Contato, a
 * página dá uma puxadinha leve (sobe um pouquinho e deixa vazar uma fresta de
 * luz embaixo), segura, e só com mais scroll ela sobe de vez, enquanto o olho
 * vem subindo lá de baixo.
 */
export default function Finale() {
  const wrapRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })

  // lida -> puxadinha -> segura -> sobe de vez
  const times = [0, 0.22, 0.34, 0.56, 0.9, 1]
  const contactY = useTransform(
    scrollYProgress,
    times,
    ['0vh', '0vh', '-9vh', '-9vh', '-100vh', '-100vh']
  )
  // o olho vem de baixo, subindo junto
  const eyeY = useTransform(scrollYProgress, times, ['14vh', '14vh', '8vh', '8vh', '0vh', '0vh'])
  // a fresta de luz só aparece com a puxadinha
  const glow = useTransform(scrollYProgress, [0.22, 0.34], [0, 1])

  return (
    <ContactProvider>
      <div id="contact" ref={wrapRef} className="relative h-[270vh] snap-start">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050506]">
          <motion.div style={{ y: eyeY }} className="absolute inset-0">
            <Eye />
          </motion.div>

          <motion.div
            aria-hidden
            style={{ opacity: glow }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[14vh] bg-gradient-to-t from-white/45 via-white/10 to-transparent"
          />

          <motion.div
            style={{ y: contactY }}
            className="absolute inset-0 z-10 bg-[#0a1440] shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            <Contact />
          </motion.div>
        </div>
      </div>
    </ContactProvider>
  )
}
