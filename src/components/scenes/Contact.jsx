import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { playKeyTick } from '../../lib/sound'

const EMAIL = 'aa.fleck005@gmail.com'

// TODO: Amanda — troque pelos seus links reais
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'E-mail', href: `mailto:${EMAIL}` },
]

const EASE = [0.16, 1, 0.3, 1]

export default function Contact() {
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const openBubble = () => setBubbleOpen(true)
  const closeBubble = () => setBubbleOpen(false)

  return (
    <section
      id="contact"
      className="relative flex min-h-screen snap-start flex-col justify-center gap-10 overflow-hidden px-6 py-20 md:gap-14 md:px-16"
    >
      {/* título gigante — cada linha entra por um lado */}
      <h2
        onMouseEnter={openBubble}
        onMouseLeave={closeBubble}
        className="font-display text-[15vw] font-black uppercase leading-[0.82] tracking-tighter text-[var(--blue)] md:text-[10.5vw]"
      >
        <motion.span
          initial={{ x: '-70%', opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="block"
        >
          Let&apos;s work
        </motion.span>
        <motion.span
          initial={{ x: '70%', opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.12 }}
          className="block text-right"
        >
          together.
        </motion.span>
      </h2>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
        <ContactInfo />
        <ContactForm onHoverSubmit={openBubble} onLeaveSubmit={closeBubble} />
      </div>

      <AnimatePresence>{bubbleOpen && <MessageBubble />}</AnimatePresence>
    </section>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function ContactInfo() {
  return (
    <div className="flex flex-col justify-between gap-10">
      <Reveal delay={0.2}>
        <p className="font-display text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          Vamos trabalhar juntos?
        </p>
      </Reveal>

      {/* redes em linha, uma do lado da outra */}
      <Reveal delay={0.3}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.15em]">
          {SOCIALS.map((social, index) => (
            <span key={social.label} className="flex items-center gap-4">
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[var(--blue)]"
              >
                {social.label}
              </a>
              {index < SOCIALS.length - 1 && <span className="text-[var(--text-muted)]">—</span>}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

// Sem back-end: o "enviar" abre o app de e-mail já com tudo preenchido.
function ContactForm({ onHoverSubmit, onLeaveSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const subject = form.subject || `Contato pelo portfólio — ${form.name}`
    const body = `${form.message}\n\n${form.name}\n${form.email}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Reveal delay={0.35}>
      <form onSubmit={submit} className="grid grid-cols-2 gap-x-6 gap-y-6">
        <Field label="Nome" value={form.name} onChange={set('name')} required />
        <Field label="Empresa / Assunto" value={form.subject} onChange={set('subject')} />
        <Field label="E-mail" type="email" value={form.email} onChange={set('email')} required className="col-span-2" />
        <Field label="Mensagem" value={form.message} onChange={set('message')} required textarea className="col-span-2" />

        <button
          type="submit"
          onMouseEnter={onHoverSubmit}
          onMouseLeave={onLeaveSubmit}
          className="group col-span-2 mt-2 flex items-center justify-between border-t border-white/20 pt-4 text-left"
        >
          <span className="font-display text-5xl font-black uppercase tracking-tighter transition-colors duration-300 group-hover:text-[var(--blue)] md:text-6xl">
            Enviar
          </span>
          <span className="text-4xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--blue)]">
            ↗
          </span>
        </button>
      </form>
    </Reveal>
  )
}

function Field({ label, textarea, className = '', ...props }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <Tag
        {...props}
        rows={textarea ? 3 : undefined}
        className="resize-none border-b border-white/25 bg-transparent py-1.5 text-sm outline-none transition-colors focus:border-[var(--blue)]"
      />
    </label>
  )
}

// Balãozinho de mensagem "digitando…" que pula no hover (com um tick)
function MessageBubble() {
  useEffect(() => {
    playKeyTick()
  }, [])

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: -6 }}
      exit={{ opacity: 0, scale: 0, rotate: 10 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      style={{ originX: 0, originY: 1 }}
      className="pointer-events-none absolute right-[10%] top-[12%] z-30 hidden md:block"
    >
      <div className="relative flex items-center gap-2 rounded-[2rem] rounded-bl-md bg-[var(--blue)] px-7 py-5 shadow-[0_20px_50px_rgba(47,107,255,0.35)]">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.14 }}
            className="h-3 w-3 rounded-full bg-white"
          />
        ))}
      </div>
    </motion.div>
  )
}
