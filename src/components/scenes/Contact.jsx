import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useContext, useEffect, useState } from 'react'
import { playKeyTick } from '../../lib/sound'
import { useLanguage } from '../../lib/LanguageContext'

const EMAIL = 'aa.fleck005@gmail.com'

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/amanda-fleck-3b14bb340/' },
  { label: 'GitHub', href: 'https://github.com/amandafleck' },
]

const EASE = [0.16, 1, 0.3, 1]

// A página de contato é renderizada duas vezes (metade esquerda e metade
// direita, que se abrem como portas no Finale). O estado do formulário e do
// balãozinho fica aqui em cima, compartilhado pelas duas cópias.
const ContactContext = createContext(null)

export function ContactProvider({ children }) {
  const { language } = useLanguage()
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("idle") // idle | sending | sent | error
  const [bubbleOpen, setBubbleOpen] = useState(false)

  // Envia pelo Web3Forms (a chave fica em .env -> VITE_WEB3FORMS_KEY).
  const submit = async (event) => {
    event.preventDefault()
    setStatus("sending")
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `${language === "pt" ? "Contato pelo portfólio" : "Portfolio contact"} — ${form.name}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message)
      setStatus("sent")
      setForm({ name: "", email: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  const value = { form, setForm, status, submit, bubbleOpen, setBubbleOpen }
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}

export default function Contact({ side }) {
  const { t } = useLanguage()
  const { bubbleOpen, setBubbleOpen } = useContext(ContactContext)
  const openBubble = () => setBubbleOpen(true)
  const closeBubble = () => setBubbleOpen(false)

  return (
    <section
      className="relative flex min-h-screen flex-col gap-6 overflow-hidden px-8 py-8 md:h-screen md:px-24 md:py-7"
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
            {t('Contato')}
          </motion.span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 border-t border-white/20 pt-6 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <ContactInfo />
        <ContactForm onHoverSubmit={openBubble} onLeaveSubmit={closeBubble} />
      </div>

      {/* chamada final: caixa com seta e convite para conversar */}
      <a
        href={`mailto:${EMAIL}`}
        className="group flex mt-12 items-center gap-6 border border-white/25 px-5 py-2 transition-colors duration-300 hover:border-[var(--blue)] hover:bg-[var(--blue)] md:px-8"
      >
        <span className="text-4xl text-[var(--blue)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-white md:text-6xl">
          →
        </span>
        <span className="font-display text-[11vw] font-black uppercase leading-none tracking-tighter text-[var(--blue)] transition-colors duration-300 group-hover:text-white md:text-[6.5vw]">
          {t('Vamos conversar')}
        </span>
      </a>

      <AnimatePresence>{bubbleOpen && side !== "left" && <MessageBubble />}</AnimatePresence>
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
  const { t } = useLanguage()
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
        <p className={label}>{t('Redes')}</p>
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

function ContactForm({ onHoverSubmit, onLeaveSubmit }) {
  const { form, setForm, status, submit } = useContext(ContactContext)
  const { t } = useLanguage()
  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  return (
    <Reveal delay={0.3}>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Field label={t("Nome")} value={form.name} onChange={set("name")} required />
        <Field label={t("E-mail")} type="email" value={form.email} onChange={set("email")} required />
        <Field label={t("Sua mensagem")} value={form.message} onChange={set("message")} required textarea className="col-span-2" />

        <button
          type="submit"
          disabled={status === "sending"}
          onMouseEnter={onHoverSubmit}
          onMouseLeave={onLeaveSubmit}
          className="col-span-2 bg-[var(--blue)] px-4 py-3 text-xs font-bold uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:bg-white hover:text-[var(--blue)] disabled:opacity-60"
        >
          {status === "sending" ? t("Enviando…") : t("Enviar mensagem")}
        </button>

        <p
          role="status"
          className={`col-span-2 min-h-5 text-xs ${status === "error" ? "text-red-400" : "text-[var(--blue)]"}`}
        >
          {status === "sent" && t("Mensagem enviada ✓ Obrigada pelo contato!")}
          {status === "error" && t("Não foi possível enviar. Tente de novo ou escreva direto para o e-mail ao lado.")}
        </p>
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
