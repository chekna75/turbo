import { useState, useEffect } from 'react'
import { Cookie, X, Check } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      const t = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const refuse = () => {
    localStorage.setItem('cookie_consent', 'refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9998] animate-slide-up">
      <div className="bg-dark-800 border border-dark-500 rounded-sm p-5 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-gold-500/10 border border-gold-500/20 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
            <Cookie className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-1">Cookies & Confidentialité</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience. Conformément au RGPD, votre consentement est requis.
            </p>
          </div>
          <button onClick={refuse} className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={accept} className="flex-1 btn-gold text-xs py-2 flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Accepter
          </button>
          <button onClick={refuse} className="flex-1 btn-outline-gold text-xs py-2">
            Refuser
          </button>
        </div>
      </div>
    </div>
  )
}
