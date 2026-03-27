import { Link } from 'react-router-dom'
import { Shield, Phone, Mail, MapPin } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

export default function Footer() {
  const { c } = useContent()
  return (
    <footer className="bg-dark-800 border-t border-dark-600 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              {c('logo_url')
                ? <img src={c('logo_url')} alt="Turbo Sécurity" className="h-10 w-auto object-contain" />
                : <img src="/logo.svg" alt="Turbo Sécurity" className="h-10 w-auto object-contain" />
              }
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

        <div className="border-t border-dark-600 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Turbo Sécurity. Tous droits réservés.
          </p>
          <p className="text-gray-600 text-xs">
            Protection rapprochée professionnelle
          </p>
        </div>
      </div>
    </footer>
  )
}
