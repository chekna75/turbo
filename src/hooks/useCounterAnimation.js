import { useEffect, useRef, useState } from 'react'

export function useCounterAnimation(target, duration = 1800, isActive = false) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (!isActive || target === null) return

    startRef.current = null

    const easeOutQuart = t => 1 - Math.pow(1 - t, 4)

    const step = timestamp => {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      setCount(Math.floor(easeOutQuart(progress) * target))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, target, duration])

  return count
}
