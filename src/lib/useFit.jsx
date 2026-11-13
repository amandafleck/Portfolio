import { useEffect, useState } from 'react'

export function useFit(designW, designH, min = 0.55, fromWidth = 768) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < fromWidth) return setScale(1)
      const w = designW ? window.innerWidth / designW : 1
      const h = designH ? window.innerHeight / designH : 1
      setScale(Math.min(1, Math.max(min, Math.min(w, h))))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [designW, designH, min, fromWidth])

  return scale
}

export function Scaled({ scale, className = '', style, children }) {
  return (
    <div
      className={className}
      style={{
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: 'top left',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
