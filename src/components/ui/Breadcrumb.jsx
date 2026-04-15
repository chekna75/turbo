import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const labels = {
  'services': 'Services',
  'a-propos': 'À Propos',
  'reservation': 'Réservation',
  'contact': 'Contact',
  'actualites': 'Actualités',
  'suivi': 'Suivi de réservation',
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0" aria-label="Fil d'Ariane">
      <ol className="flex items-center gap-1.5 text-xs text-gray-500">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-gold-400 transition-colors">
            <Home className="w-3 h-3" /> Accueil
          </Link>
        </li>
        {segments.map((seg, i) => (
          <li key={seg} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-dark-500" />
            {i === segments.length - 1
              ? <span className="text-gold-400">{labels[seg] || seg}</span>
              : <Link to={`/${segments.slice(0, i + 1).join('/')}`} className="hover:text-gold-400 transition-colors">{labels[seg] || seg}</Link>
            }
          </li>
        ))}
      </ol>
    </nav>
  )
}
