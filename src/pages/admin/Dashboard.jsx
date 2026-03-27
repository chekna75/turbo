import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { CalendarCheck, Users, MessageSquare, Clock, TrendingUp, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({ reservations: 0, agents: 0, contacts: 0, enAttente: 0, avisEnAttente: 0 })
  const [recentReservations, setRecentReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [
        { count: reservations },
        { count: agents },
        { count: contacts },
        { count: enAttente },
        { count: avisEnAttente },
        { data: recent },
      ] = await Promise.all([
        supabase.from('reservations').select('*', { count: 'exact', head: true }),
        supabase.from('agents').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
        supabase.from('avis').select('*', { count: 'exact', head: true }).eq('approuve', false),
        supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        reservations: reservations || 0,
        agents: agents || 0,
        contacts: contacts || 0,
        enAttente: enAttente || 0,
        avisEnAttente: avisEnAttente || 0,
      })
      setRecentReservations(recent || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Réservations', value: stats.reservations, icon: CalendarCheck, color: 'text-gold-400', link: '/admin/reservations' },
    { label: 'Réserv. en attente', value: stats.enAttente, icon: Clock, color: 'text-yellow-400', link: '/admin/reservations' },
    { label: 'Agents Actifs', value: stats.agents, icon: Users, color: 'text-blue-400', link: '/admin/agents' },
    { label: 'Avis à modérer', value: stats.avisEnAttente, icon: Star, color: 'text-gold-400', link: '/admin/avis' },
  ]

  const statusColors = {
    en_attente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmee: 'bg-green-500/10 text-green-400 border-green-500/20',
    annulee: 'bg-red-500/10 text-red-400 border-red-500/20',
    terminee: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }

  const statusLabels = {
    en_attente: 'En attente',
    confirmee: 'Confirmée',
    annulee: 'Annulée',
    terminee: 'Terminée',
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-white text-2xl font-semibold font-serif">Tableau de bord</h2>
        <p className="text-gray-400 text-sm mt-1">Bienvenue dans votre espace d'administration.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="card-dark p-6 hover:border-gold-500/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center bg-dark-600`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
            <div className={`text-3xl font-bold font-serif ${color} mb-1`}>
              {loading ? '—' : value}
            </div>
            <div className="text-gray-400 text-sm">{label}</div>
          </Link>
        ))}
      </div>

      {/* Recent reservations */}
      <div className="card-dark overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-500">
          <h3 className="text-white font-semibold">Réservations récentes</h3>
          <Link to="/admin/reservations" className="text-gold-400 text-sm hover:text-gold-300 transition-colors">
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Chargement...</div>
        ) : recentReservations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Aucune réservation pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-dark-500">
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Service</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map(r => (
                  <tr key={r.id} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{r.prenom} {r.nom}</div>
                      <div className="text-xs text-gray-500">{r.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{r.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(r.date_debut).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-sm border ${statusColors[r.statut] || statusColors.en_attente}`}>
                        {statusLabels[r.statut] || r.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
