import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { playKeyTick } from '../../lib/sound'

const EMAIL = 'aa.fleck005@gmail.com'

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/amanda-fleck-3b14bb340/' },
  { label: 'GitHub', href: 'https://github.com/amandafleck' },
]

const EASE = [0.16, 1, 0.3, 1]

export default function Contact() {
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const openBubble = () => setBubbleOpen(true)
  const closeBubble = () => setBubbleOpen(false)

  return (
    <section
      id="contact"
      className="relative flex min-h-screen snap-start flex-col gap-6 overflow-hidden px-8 py-8 md:h-screen md:px-24 md:py-7"
    >
      {/* título gigante + texto curto à direita */}
      <motion.div
        initial="hide"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-10"
      >
        <h2
          onMouseEnter={openBubble}
          onMouseLeave={closeBubble}
          className="overflow-hidden font-display text-[24vw] font-black uppercase leading-[0.85] tracking-tighter text-[var(--blue)] md:text-[14vw]"
        >
          <motion.span
            variants={{ hide: { y: "100%" }, show: { y: 0 } }}
            transition={{ duration: 1, ease: EASE }}
            className="block"
          >
            Contact me
          </motion.span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 border-t border-white/20 pt-6 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <ContactInfo />
        <ContactForm onHoverSubmit={openBubble} onLeaveSubmit={closeBubble} />
      </div>

      {/* chamada final: caixa com seta e LET'S TALK */}
      <a
        href={`mailto:${EMAIL}`}
        className="group flex mt-12 items-center gap-6 border border-white/25 px-5 py-2 transition-colors duration-300 hover:border-[var(--blue)] hover:bg-[var(--blue)] md:px-8"
      >
        <span className="text-4xl text-[var(--blue)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-white md:text-6xl">
          →
        </span>
        <span className="font-display text-[11vw] font-black uppercase leading-none tracking-tighter text-[var(--blue)] transition-colors duration-300 group-hover:text-white md:text-[6.5vw]">
          Let's talk
        </span>
      </a>

      <AnimatePresence>{bubbleOpen && <MessageBubble />}</AnimatePresence>
    </section>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function ContactInfo() {
  const label = "mb-1 text-[10px] uppercase tracking-[0.25em] text-[var(--blue)]"
  const value = "text-xs leading-relaxed text-white/80"
  return (
    <Reveal delay={0.15} className=" content-start gap-x-6 gap-y-5 gap-6 md:flex md:flex-col md:gap-x-0 md:gap-y-6">
      <div>
        <p className={label}>E-mail</p>
        <a href={`mailto:${EMAIL}`} className={`${value} break-all transition-colors hover:text-[var(--blue)]`}>
          {EMAIL}
        </a>
      </div>
      <div>
        <p className={label}>Redes</p>
        <div className="flex flex-col gap-1">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className={`${value} w-fit transition-colors hover:text-[var(--blue)]`}
            >
              {social.label} ↗
            </a>
          ))}
        </div>
      </div>
      
    </Reveal>
  )
}

// Sem back-end: o "enviar" abre o app de e-mail já com tudo preenchido.
function ContactForm({ onHoverSubmit, onLeaveSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const subject = `Contato pelo portfólio — ${form.name}`
    const body = `${form.message}

${form.name}
${form.email}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Reveal delay={0.3}>
     
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Field label="Nome" value={form.name} onChange={set("name")} required />
        <Field label="E-mail" type="email" value={form.email} onChange={set("email")} required />
        <Field label="Mensagem" value={form.message} onChange={set("message")} required textarea className="col-span-2" />

        <button
          type="submit"
          onMouseEnter={onHoverSubmit}
          onMouseLeave={onLeaveSubmit}
          className="col-span-2 bg-[var(--blue)] px-4 py-3 text-xs font-bold uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:bg-white hover:text-[var(--blue)]"
        >
          Enviar mensagem
        </button>
      </form>
    </Reveal>
  )
}

function Field({ label, textarea, className = "", ...props }) {
  const Tag = textarea ? "textarea" : "input"
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</span>
      <Tag
        {...props}
        rows={textarea ? 2 : undefined}
        className="resize-none border-b border-white/25 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--blue)]"
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
      className="pointer-events-none absolute right-[8%] top-[8%] z-30 hidden md:block"
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
