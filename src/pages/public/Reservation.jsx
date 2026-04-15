import SEO from '../../components/ui/SEO'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { sendConfirmationEmail, sendAdminNotification } from '../../lib/email'
import { CheckCircle, Loader, Shield } from 'lucide-react'

const services = [
  'Protection VIP',
  'Escorte Sécurisée',
  'Sécurité Événementielle',
  'Surveillance & Reconnaissance',
  'Protection Internationale',
  'Intervention Rapide',
  'Autre',
]

export default function Reservation() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    service: '', date_debut: '', date_fin: '',
    lieu: '', nombre_agents: '1', details: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      nombre_agents: parseInt(form.nombre_agents),
      statut: 'en_attente',
    }

    const { error: err } = await supabase.from('reservations').insert([payload])

    if (err) {
      setLoading(false)
      setError('Une erreur est survenue. Veuillez réessayer.')
      return
    }

    await Promise.all([
      sendConfirmationEmail(payload),
      sendAdminNotification(payload),
    ])

    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gold-500/10 border border-gold-500/30 rounded-sm flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-gold-400" />
          </div>
          <h2 className="section-title mb-3">Réservation envoyée</h2>
          <p className="text-gray-400 leading-relaxed">
            Votre demande a bien été reçue. Notre équipe vous contactera dans les plus brefs délais
            pour confirmer votre réservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={() => { setSuccess(false); setForm({ nom: '', prenom: '', email: '', telephone: '', service: '', date_debut: '', date_fin: '', lieu: '', nombre_agents: '1', details: '' }) }}
              className="btn-outline-gold"
            >
              Nouvelle réservation
            </button>
            <a href="/suivi" className="btn-gold inline-flex items-center justify-center gap-2">
              Suivre ma réservation
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Réservation — Demande de Protection"
        description="Réservez votre protection rapprochée avec Turbo Sécurity. Formulaire confidentiel et sécurisé. Réponse sous 2h. Protection VIP, escorte, sécurité événementielle."
        path="/reservation"
      />
      <div className="bg-dark-900">
      <Breadcrumb />
      <section className="py-20 px-4 bg-dark-800 border-b border-dark-600">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold-400 text-sm tracking-widest uppercase font-medium mb-3">Réservation</p>
          <h1 className="section-title text-4xl md:text-5xl mb-4">Réserver une Protection</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Remplissez ce formulaire confidentiel. Notre équipe vous contactera sous 2h.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card-dark p-8">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-dark-500">
              <Shield className="w-5 h-5 text-gold-400" />
              <span className="text-sm text-gray-400">Formulaire confidentiel et sécurisé</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom / Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Nom *</label>
                  <input
                    type="text" name="nom" value={form.nom} onChange={handleChange} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="Dupont"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Prénom *</label>
                  <input
                    type="text" name="prenom" value={form.prenom} onChange={handleChange} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="Jean"
                  />
                </div>
              </div>

              {/* Email / Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Email *</label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Téléphone *</label>
                  <input
                    type="tel" name="telephone" value={form.telephone} onChange={handleChange} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="+33 6 00 00 00 00"
                  />
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Service souhaité *</label>
                <select
                  name="service" value={form.service} onChange={handleChange} required
                  className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                >
                  <option value="">Choisir un service</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Date de début *</label>
                  <input
                    type="date" name="date_debut" value={form.date_debut} onChange={handleChange} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Date de fin</label>
                  <input
                    type="date" name="date_fin" value={form.date_fin} onChange={handleChange}
                    className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Lieu / Agents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Lieu / Ville *</label>
                  <input
                    type="text" name="lieu" value={form.lieu} onChange={handleChange} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="Paris, France"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Nombre d'agents</label>
                  <select
                    name="nombre_agents" value={form.nombre_agents} onChange={handleChange}
                    className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                  >
                    {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} agent{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Détails supplémentaires</label>
                <textarea
                  name="details" value={form.details} onChange={handleChange} rows={4}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors resize-none"
                  placeholder="Décrivez votre besoin en sécurité..."
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Envoi en cours...</>
                ) : (
                  'Envoyer la demande'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
