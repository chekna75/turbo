import { Link } from 'react-router-dom'
import { Shield, Phone, Mail, MapPin } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

export default function Footer() {
  const { c } = useContent()
  return (
    <footer className="bg-dark-800 border-t border-gold-500/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img
                src={c('logo_url') || '/logo.png'}
                alt="Turbo Sécurity"
                className="h-14 w-auto object-contain"
                style={{ mixBlendMode: 'screen' }}
                onError={(e) => {
                  if (e.currentTarget.src.includes('logo.png')) {
                    e.currentTarget.style.mixBlendMode = 'normal'
                    e.currentTarget.className = 'h-10 w-auto object-contain'
                    e.currentTarget.src = '/logo.svg'
                  }
                }}
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">{c('footer_description')}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gold-400 font-semibold text-sm tracking-widest uppercase mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/services', label: 'Services' },
                { to: '/a-propos', label: 'À Propos' },
                { to: '/actualites', label: 'Actualités' },
                { to: '/reservation', label: 'Réservation' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold-400 font-semibold text-sm tracking-widest uppercase mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                {c('contact_telephone')}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                {c('contact_email')}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                {c('contact_adresse')}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-600 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Turbo Sécurity. Tous droits réservés.
          </p>
          <div className="flex items-center gap-3">
            {[
              { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
            ].map(({ label, path }) => (
              <a key={label} href="#" aria-label={label} className="w-8 h-8 border border-dark-500 hover:border-gold-500/40 rounded-sm flex items-center justify-center text-gray-500 hover:text-gold-400 transition-colors duration-200">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={path} /></svg>
              </a>
            ))}
          </div>
          <p className="text-gray-600 text-xs">Protection rapprochée professionnelle</p>
        </div>
      </div>
    </footer>
  )
}
