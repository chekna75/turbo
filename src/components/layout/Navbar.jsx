import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useContent } from '../../hooks/useContent'
import { useTheme } from '../../context/ThemeContext'

const langs = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
]

const getNavLinks = (t) => [
  { path: '/', label: t('nav.home') },
  { path: '/services', label: t('nav.services') },
  { path: '/a-propos', label: t('nav.about') },
  { path: '/actualites', label: t('nav.news') },
  { path: '/contact', label: t('nav.contact') },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { c } = useContent()
  const logoUrl = c('logo_url')
  const { t, i18n } = useTranslation()
  const { dark, toggle } = useTheme()

  const changeLang = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-900/95 backdrop-blur border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoUrl || '/logo.png'}
              alt="Turbo Sécurity"
              className="h-16 w-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
              onError={(e) => {
                if (e.currentTarget.src.includes('logo.png')) {
                  e.currentTarget.style.mixBlendMode = 'normal'
                  e.currentTarget.className = 'h-16 w-auto object-contain'
                  e.currentTarget.src = '/logo.svg'
                }
              }}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {getNavLinks(t).map(({ path, label }) => (
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

          {/* Lang + Theme + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 border border-dark-500 rounded-sm overflow-hidden">
              {langs.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => changeLang(code)}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    i18n.language === code
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={toggle}
              className="w-8 h-8 border border-dark-500 hover:border-gold-500/40 rounded-sm flex items-center justify-center text-gray-400 hover:text-gold-400 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <Link to="/reservation" className="btn-gold text-sm">
              {t('nav.book')}
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
          {getNavLinks(t).map(({ path, label }) => (
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
          <div className="flex gap-1 pt-1">
            {langs.map(({ code, label }) => (
              <button key={code} onClick={() => { changeLang(code); setOpen(false) }}
                className={`px-3 py-1 text-xs rounded-sm border transition-colors ${i18n.language === code ? 'border-gold-500/40 text-gold-400 bg-gold-500/10' : 'border-dark-500 text-gray-500'}`}>
                {label}
              </button>
            ))}
          </div>
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
