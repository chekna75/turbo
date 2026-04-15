import { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1400)
    const t2 = setTimeout(() => onDone(), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`fixed inset-0 z-[9999] bg-dark-900 flex flex-col items-center justify-center transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-20 h-20 rounded-full border border-gold-500/20 animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className="absolute w-14 h-14 rounded-full border border-gold-500/40 animate-pulse" />
        <svg className="w-10 h-10 text-gold-400 relative z-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-500" />
        <p className="text-shimmer font-serif text-xl font-semibold tracking-widest uppercase">Turbo Sécurity</p>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-500" />
      </div>
      <p className="text-gray-600 text-xs tracking-widest uppercase">Protection d'élite</p>
      <div className="mt-10 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  )
}
