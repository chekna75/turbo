import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { CalendarCheck, Users, Clock, TrendingUp, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({ reservations: 0, agents: 0, contacts: 0, enAttente: 0, avisEnAttente: 0 })
  const [recentReservations, setRecentReservations] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [serviceData, setServiceData] = useState([])
  const [statusData, setStatusData] = useState([])
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
        { data: allReservations },
      ] = await Promise.all([
        supabase.from('reservations').select('*', { count: 'exact', head: true }),
        supabase.from('agents').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
        supabase.from('avis').select('*', { count: 'exact', head: true }).eq('approuve', false),
        supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('reservations').select('created_at, statut, service').order('created_at', { ascending: true }),
      ])

      setStats({ reservations: reservations || 0, agents: agents || 0, contacts: contacts || 0, enAttente: enAttente || 0, avisEnAttente: avisEnAttente || 0 })
      setRecentReservations(recent || [])

      // Données mensuelles (12 derniers mois)
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
        return { month: d.toLocaleString('fr-FR', { month: 'short' }), year: d.getFullYear(), num: d.getMonth(), total: 0, confirmees: 0 }
      })
      ;(allReservations || []).forEach(r => {
        const d = new Date(r.created_at)
        const idx = months.findIndex(m => m.num === d.getMonth() && m.year === d.getFullYear())
        if (idx !== -1) { months[idx].total++; if (r.statut === 'confirmee') months[idx].confirmees++ }
      })
      setMonthlyData(months)

      // Par service
      const svcMap = {}
      ;(allReservations || []).forEach(r => { svcMap[r.service] = (svcMap[r.service] || 0) + 1 })
      setServiceData(Object.entries(svcMap).map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 18) + '…' : name, value })).sort((a, b) => b.value - a.value).slice(0, 5))

      // Par statut (pie)
      const stMap = { en_attente: 0, confirmee: 0, annulee: 0, terminee: 0 }
      ;(allReservations || []).forEach(r => { if (stMap[r.statut] !== undefined) stMap[r.statut]++ })
      setStatusData([
        { name: 'En attente', value: stMap.en_attente, color: '#eab308' },
        { name: 'Confirmée', value: stMap.confirmee, color: '#22c55e' },
        { name: 'Annulée', value: stMap.annulee, color: '#ef4444' },
        { name: 'Terminée', value: stMap.terminee, color: '#6b7280' },
      ].filter(s => s.value > 0))

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

      {/* Charts */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courbe mensuelle */}
          <div className="card-dark p-6 lg:col-span-2">
            <h3 className="text-white font-semibold mb-6">Réservations — 6 derniers mois</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4971a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4971a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
                <Area type="monotone" dataKey="total" name="Total" stroke="#d4971a" fill="url(#gold)" strokeWidth={2} />
                <Area type="monotone" dataKey="confirmees" name="Confirmées" stroke="#22c55e" fill="none" strokeWidth={2} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie statuts */}
          <div className="card-dark p-6">
            <h3 className="text-white font-semibold mb-6">Répartition statuts</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">Pas encore de données</div>
            )}
          </div>

          {/* Bar services */}
          {serviceData.length > 0 && (
            <div className="card-dark p-6 lg:col-span-3">
              <h3 className="text-white font-semibold mb-6">Réservations par service</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={serviceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
                  <Bar dataKey="value" name="Réservations" fill="#d4971a" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

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
