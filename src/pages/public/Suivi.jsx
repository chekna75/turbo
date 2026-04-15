import SEO from '../../components/ui/SEO'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, Shield, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const statusConfig = {
  en_attente: { label: 'En attente de confirmation', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  confirmee:  { label: 'Réservation confirmée', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  annulee:    { label: 'Réservation annulée', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  terminee:   { label: 'Mission terminée', icon: CheckCircle, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
}

export default function Suivi() {
  const [email, setEmail] = useState('')
  const [reservations, setReservations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async e => {
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase
      .from('reservations')
      .select('id, service, lieu, date_debut, date_fin, statut, nombre_agents, created_at')
      .eq('email', email.trim().toLowerCase())
      .order('created_at', { ascending: false })
    setReservations(data || [])
    setSearched(true)
    setLoading(false)
  }

  return (
    <>
      <SEO title="Suivi de réservation" description="Suivez l'état de votre réservation Turbo Sécurity." path="/suivi" />
      <div className="bg-dark-900">
        <Breadcrumb />
        <section className="py-20 px-4 bg-dark-800 border-b border-dark-600">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold-400 text-sm tracking-widest uppercase font-medium mb-3">Suivi</p>
            <h1 className="section-title text-4xl md:text-5xl mb-4">Votre réservation</h1>
            <p className="text-gray-400 max-w-xl mx-auto">Entrez l'adresse email utilisée lors de votre réservation pour consulter son statut.</p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3 mb-10">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="votre@email.com"
                className="flex-1 bg-dark-700 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
              />
              <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 disabled:opacity-70">
                <Search className="w-4 h-4" />
                {loading ? 'Recherche...' : 'Chercher'}
              </button>
            </form>

            {searched && (
              reservations.length === 0 ? (
                <div className="card-dark p-8 text-center">
                  <AlertCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Aucune réservation trouvée pour cet email.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map(r => {
                    const s = statusConfig[r.statut] || statusConfig.en_attente
                    const Icon = s.icon
                    return (
                      <div key={r.id} className="card-dark p-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm font-medium mb-4 ${s.bg} ${s.color}`}>
                          <Icon className="w-4 h-4" /> {s.label}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {[
                            ['Service', r.service],
                            ['Lieu', r.lieu],
                            ['Date début', r.date_debut ? new Date(r.date_debut).toLocaleDateString('fr-FR') : '—'],
                            ['Date fin', r.date_fin ? new Date(r.date_fin).toLocaleDateString('fr-FR') : '—'],
                            ['Agents', r.nombre_agents],
                            ['Demande le', new Date(r.created_at).toLocaleDateString('fr-FR')],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <p className="text-gray-500 text-xs mb-0.5">{label}</p>
                              <p className="text-gray-200">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </>
  )
}
