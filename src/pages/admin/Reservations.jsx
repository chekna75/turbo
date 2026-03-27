import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, Eye, X, ChevronDown } from 'lucide-react'

const statusOptions = [
  { value: 'en_attente', label: 'En attente', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { value: 'confirmee', label: 'Confirmée', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { value: 'annulee', label: 'Annulée', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  { value: 'terminee', label: 'Terminée', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
]

const getStatusStyle = v => statusOptions.find(s => s.value === v)?.color || 'bg-gray-500/10 text-gray-400'
const getStatusLabel = v => statusOptions.find(s => s.value === v)?.label || v

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)

  const fetchReservations = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })

    setReservations(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchReservations() }, [])

  const updateStatus = async (id, statut) => {
    await supabase.from('reservations').update({ statut }).eq('id', id)
    setReservations(prev => prev.map(r => r.id === id ? { ...r, statut } : r))
    if (selected?.id === id) setSelected(prev => ({ ...prev, statut }))
  }

  const filtered = reservations.filter(r => {
    const matchSearch = `${r.nom} ${r.prenom} ${r.email} ${r.service}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.statut === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl font-semibold font-serif">Réservations</h2>
          <p className="text-gray-400 text-sm mt-1">{reservations.length} réservation(s) au total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, service..."
            className="w-full bg-dark-700 border border-dark-500 text-white pl-10 pr-4 py-2.5 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none bg-dark-700 border border-dark-500 text-white px-4 py-2.5 pr-10 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
          >
            <option value="all">Tous les statuts</option>
            {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="card-dark overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Aucune réservation trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-dark-500">
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Lieu</th>
                  <th className="px-4 py-3 text-left">Date début</th>
                  <th className="px-4 py-3 text-left">Agents</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-dark-600 hover:bg-dark-600/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-sm text-white">{r.prenom} {r.nom}</div>
                      <div className="text-xs text-gray-500">{r.telephone}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">{r.service}</td>
                    <td className="px-4 py-4 text-sm text-gray-400">{r.lieu}</td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {r.date_debut ? new Date(r.date_debut).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400 text-center">{r.nombre_agents}</td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <select
                          value={r.statut}
                          onChange={e => updateStatus(r.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-sm border appearance-none cursor-pointer bg-transparent ${getStatusStyle(r.statut)}`}
                        >
                          {statusOptions.map(s => <option key={s.value} value={s.value} className="bg-dark-700 text-white">{s.label}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelected(r)}
                        className="w-8 h-8 flex items-center justify-center rounded-sm bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-gold-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-800 border border-dark-500 rounded-sm max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Détail de la réservation</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                ['Client', `${selected.prenom} ${selected.nom}`],
                ['Email', selected.email],
                ['Téléphone', selected.telephone],
                ['Service', selected.service],
                ['Lieu', selected.lieu],
                ['Date début', selected.date_debut ? new Date(selected.date_debut).toLocaleDateString('fr-FR') : '—'],
                ['Date fin', selected.date_fin ? new Date(selected.date_fin).toLocaleDateString('fr-FR') : '—'],
                ['Agents demandés', selected.nombre_agents],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-dark-600">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-200">{value}</span>
                </div>
              ))}

              {selected.details && (
                <div className="pt-2">
                  <p className="text-gray-500 mb-1">Détails</p>
                  <p className="text-gray-300 leading-relaxed bg-dark-700 rounded-sm p-3">{selected.details}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <select
                value={selected.statut}
                onChange={e => updateStatus(selected.id, e.target.value)}
                className="bg-dark-700 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none"
              >
                {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button onClick={() => setSelected(null)} className="btn-outline-gold text-sm px-4 py-2">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
