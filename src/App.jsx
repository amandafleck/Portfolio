import SideNav from './components/SideNav'
import CustomCursor from './components/CustomCursor'
import SceneBackground from './components/SceneBackground'
import { CursorProvider } from './lib/CursorContext'
import Amanda from './components/scenes/Amanda'
import About from './components/scenes/About'
import SoftSkills from './components/scenes/SoftSkills'
import Projects from './components/scenes/Projects'
import Work from './components/scenes/Work'
import Contact from './components/scenes/Contact'

export default function App() {
  return (
    <CursorProvider>
      <SceneBackground />
      <CustomCursor />
      <SideNav />
      <main>
        <Amanda />
        <About />
        <SoftSkills />
        <Work />
        <Projects />
        <Contact />
      </main>
    </CursorProvider>
  )
}
