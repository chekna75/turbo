import { useState } from 'react'
import { Star } from 'lucide-react'

export function StarDisplay({ note, size = 'sm' }) {
  const s = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${s} ${i <= note ? 'text-gold-400 fill-gold-400' : 'text-dark-500 fill-dark-500'}`}
        />
      ))}
    </div>
  )
}

export function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              i <= (hovered || value)
                ? 'text-gold-400 fill-gold-400'
                : 'text-dark-500 fill-dark-500'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
