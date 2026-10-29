import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CursorContext = createContext(null)

export function CursorProvider({ children }) {
  const [absorbRect, setAbsorbRect] = useState(null)
  const [light, setLight] = useState(false)
  const [color, setColorState] = useState(null)
  // escala forçada do cursor (ex.: 0.2 = bem pequeno); null = tamanho normal
  const [scale, setScaleState] = useState(null)

  const absorb = useCallback((rect) => setAbsorbRect(rect), [])
  const release = useCallback(() => setAbsorbRect(null), [])
  const enterLight = useCallback(() => setLight(true), [])
  const leaveLight = useCallback(() => setLight(false), [])
  const setColor = useCallback((c) => setColorState(c), [])
  const clearColor = useCallback(() => setColorState(null), [])
  const setScale = useCallback((s) => setScaleState(s), [])
  const clearScale = useCallback(() => setScaleState(null), [])

  const value = useMemo(
    () => ({
      absorbRect,
      light,
      color,
      scale,
      absorb,
      release,
      enterLight,
      leaveLight,
      setColor,
      clearColor,
      setScale,
      clearScale,
    }),
    [
      absorbRect,
      light,
      color,
      scale,
      absorb,
      release,
      enterLight,
      leaveLight,
      setColor,
      clearColor,
      setScale,
      clearScale,
    ]
  )

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}

export function useCursor() {
  return useContext(CursorContext)
}
