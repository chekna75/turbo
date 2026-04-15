import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-[9997] w-10 h-10 bg-dark-700 border border-gold-500/40 hover:border-gold-500 hover:bg-gold-500/10 text-gold-400 rounded-sm flex items-center justify-center transition-all duration-300 shadow-lg"
      aria-label="Retour en haut"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}
