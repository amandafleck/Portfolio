import SideNav from './components/SideNav'
import CustomCursor from './components/CustomCursor'
import SceneBackground from './components/SceneBackground'
import { CursorProvider } from './lib/CursorContext'
import Amanda from './components/scenes/Amanda'
import About from './components/scenes/About'
import SoftSkills from './components/scenes/SoftSkills'
import Projects from './components/scenes/Projects'
import Work from './components/scenes/Work'
import Finale from './components/scenes/Finale'
import { LanguageProvider, useLanguage } from './lib/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <CursorProvider>
        <SceneBackground />
        <CustomCursor />
        <SideNav />
        <LanguageToggle />
        <main>
          <Amanda />
          <About />
          <SoftSkills />
          <Work />
          <Projects />
          <Finale />
        </main>
      </CursorProvider>
    </LanguageProvider>
  )
}

function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className="fixed right-5 top-5 z-[60] flex rounded-full border border-white/20 bg-black/75 p-1 text-xs backdrop-blur-md"
    >
      {['pt', 'en'].map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={language === option}
          onClick={() => setLanguage(option)}
          className={`rounded-full px-3 py-1.5 font-bold uppercase transition-colors ${
            language === option ? 'bg-[var(--blue)] text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
