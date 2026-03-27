import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Shield } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

const navLinks = [
  { path: '/', label: 'Accueil' },
  { path: '/services', label: 'Services' },
  { path: '/a-propos', label: 'À Propos' },
  { path: '/actualites', label: 'Actualités' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { c } = useContent()
  const logoUrl = c('logo_url')

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-900/95 backdrop-blur border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {logoUrl
              ? <img src={logoUrl} alt="Turbo Sécurity" className="h-10 w-auto object-contain" />
              : <img src="/logo.svg" alt="Turbo Sécurity" className="h-10 w-auto object-contain" />
            }
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                  pathname === path
                    ? 'text-gold-400'
                    : 'text-gray-300 hover:text-gold-400'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link to="/reservation" className="btn-gold text-sm">
              Réserver
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-gold-400"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-dark-800 border-t border-dark-600 px-4 py-4 space-y-3">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`block py-2 text-sm font-medium ${
                pathname === path ? 'text-gold-400' : 'text-gray-300'
              }`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/reservation"
            className="block btn-gold text-sm text-center mt-2"
            onClick={() => setOpen(false)}
          >
            Réserver
          </Link>
        </div>
      )}
    </nav>
  )
}
