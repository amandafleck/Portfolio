// As cores precisam ser valores literais (não var(--...)) porque o
// framer-motion interpola a cor do fundo numericamente entre elas.
const BLACK = '#050506'
const NAVY = '#0a1440'
const BLUE = '#1f4fe0'

export const SECTIONS = [
  { id: 'amanda', short: 'A', label: 'Amanda', color: BLACK },
  { id: 'about', short: 'A', label: 'Sobre', color: NAVY },
  { id: 'softskills', short: 'SS', label: 'Soft Skills', color: BLACK },
  { id: 'work', short: 'W', label: 'Experiência', color: BLUE },
  { id: 'projects', short: 'P', label: 'Projetos', color: BLACK },
  { id: 'contact', short: 'C', label: 'Contato', color: NAVY },
]

export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
