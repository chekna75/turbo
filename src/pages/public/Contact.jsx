import SEO from '../../components/ui/SEO'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Phone, Mail, MapPin, CheckCircle, Loader } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

export default function Contact() {
  const { c } = useContent()
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('contacts').insert([form])

    setLoading(false)
    if (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } else {
      setSuccess(true)
    }
  }

  return (
    <>
      <SEO
        title="Contact — Disponible 24h/24"
        description="Contactez Turbo Sécurity pour toute demande de protection rapprochée. Notre équipe est disponible 24h/24. Téléphone, email ou formulaire en ligne."
        path="/contact"
      />
      <div className="bg-dark-900">
      {/* Hero */}
      <section className="py-20 px-4 bg-dark-800 border-b border-dark-600">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold-400 text-sm tracking-widest uppercase font-medium mb-3">Contact</p>
          <h1 className="section-title text-4xl md:text-5xl mb-4">{c('contact_titre')}</h1>
          <p className="text-gray-400 max-w-xl mx-auto">{c('contact_sous_titre')}</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-gold-400 text-sm tracking-widest uppercase font-medium mb-4">Informations</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pour toute demande urgente, nous vous recommandons de nous appeler directement.
                Nos opérateurs sont disponibles 24h/24.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Phone,  label: 'Téléphone', value: c('contact_telephone') },
                { icon: Mail,   label: 'Email',     value: c('contact_email') },
                { icon: MapPin, label: 'Adresse',   value: c('contact_adresse') },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="card-dark p-4 flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-500/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-gray-200">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-dark p-4 border-gold-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">Disponible 24/7</span>
              </div>
              <p className="text-xs text-gray-400">Ligne d'urgence opérationnelle en permanence.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {success ? (
              <div className="card-dark p-12 text-center">
                <CheckCircle className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">Message envoyé</h3>
                <p className="text-gray-400 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                <button onClick={() => { setSuccess(false); setForm({ nom: '', email: '', sujet: '', message: '' }) }} className="btn-outline-gold mt-6 text-sm">
                  Nouveau message
                </button>
              </div>
            ) : (
              <div className="card-dark p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Nom *</label>
                      <input
                        type="text" name="nom" value={form.nom} onChange={handleChange} required
                        className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Email *</label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange} required
                        className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                        placeholder="email@exemple.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Sujet *</label>
                    <input
                      type="text" name="sujet" value={form.sujet} onChange={handleChange} required
                      className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                      placeholder="Objet de votre message"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Message *</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange} required rows={5}
                      className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button
                    type="submit" disabled={loading}
                    className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <><Loader className="w-4 h-4 animate-spin" /> Envoi...</> : 'Envoyer le message'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
