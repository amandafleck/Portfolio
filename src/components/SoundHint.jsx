import { useEffect, useState } from 'react'
import { subscribeAudioLocked, unlockAudio } from '../lib/sound'
import { useLanguage } from '../lib/LanguageContext'

export default function SoundHint() {
  const { t } = useLanguage()
  const [locked, setLocked] = useState(false)

  useEffect(() => subscribeAudioLocked(setLocked), [])

  if (!locked) return null

  return (
    <button
      type="button"
      onClick={unlockAudio}
      className="fixed right-[7.25rem] top-3 z-[60] rounded-full border border-white/20 bg-black/75 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md hover:text-white sm:bottom-5 sm:left-5 sm:right-auto sm:top-auto"
    >
      {t('ativar som')}
    </button>
  )
}
