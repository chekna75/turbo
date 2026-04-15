import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Search, X, Pencil, Trash2, CheckCircle, Clock, XCircle, Calendar, ChevronDown } from 'lucide-react'

const emptyForm = {
  nom: '', prenom: '', email: '', telephone: '',
  specialite: '', statut: 'actif', experience: '', notes: '',
  disponibilite_debut: '', disponibilite_fin: '',
}

const specialites = [
  'Protection VIP', 'Escorte', 'Sécurité événementielle',
  'Intervention rapide', 'Renseignement', 'Conduite sécurisée',
]

const statusStyles = {
  actif: 'bg-green-500/10 text-green-400 border-green-500/20',
  indisponible: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  inactif: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusIcons = {
  actif: CheckCircle,
  indisponible: Clock,
  inactif: XCircle,
}

const FILTER_OPTIONS = ['tous', 'actif', 'indisponible', 'inactif']

export default function Agents() {
  const [agents, setAgents] = useState([])
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [showModal, setShowModal] = useState(false)
  const [detailAgent, setDetailAgent] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchAgents = async () => {
    setLoading(true)
    const [{ data: agentsData }, { data: missionsData }] = await Promise.all([
      supabase.from('agents').select('*').order('created_at', { ascending: false }),
      supabase.from('reservations').select('id, prenom, nom, service, date_debut, date_fin, statut, agent_id').not('agent_id', 'is', null),
    ])
    setAgents(agentsData || [])
    setMissions(missionsData || [])
    setLoading(false)
  }

  useEffect(() => { fetchAgents() }, [])

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowModal(true) }
  const openEdit = agent => { setForm(agent); setEditing(agent.id); setShowModal(true) }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)

    if (editing) {
      await supabase.from('agents').update(form).eq('id', editing)
    } else {
      await supabase.from('agents').insert([form])
    }

    setSaving(false)
    setShowModal(false)
    fetchAgents()
  }

  const handleDelete = async id => {
    if (!confirm('Supprimer cet agent ?')) return
    await supabase.from('agents').delete().eq('id', id)
    setAgents(prev => prev.filter(a => a.id !== id))
  }

  const filtered = agents.filter(a => {
    const matchSearch = `${a.nom} ${a.prenom} ${a.specialite}`.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'tous' || a.statut === filterStatut
    return matchSearch && matchStatut
  })

  const agentMissions = (agentId) => missions.filter(m => m.agent_id === agentId)

  const counts = {
    actif: agents.filter(a => a.statut === 'actif').length,
    indisponible: agents.filter(a => a.statut === 'indisponible').length,
    inactif: agents.filter(a => a.statut === 'inactif').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl font-semibold font-serif">Agents</h2>
          <p className="text-gray-400 text-sm mt-1">{agents.length} agent(s) enregistré(s)</p>
        </div>
        <button onClick={openAdd} className="btn-gold inline-flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Ajouter un agent
        </button>
      </div>

      {/* Statut summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'actif', label: 'Actifs', icon: CheckCircle, color: 'text-green-400' },
          { key: 'indisponible', label: 'Indisponibles', icon: Clock, color: 'text-yellow-400' },
          { key: 'inactif', label: 'Inactifs', icon: XCircle, color: 'text-red-400' },
        ].map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => setFilterStatut(filterStatut === key ? 'tous' : key)}
            className={`card-dark p-4 text-left transition-all hover:border-dark-400 ${filterStatut === key ? 'border-gold-500/30' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className={`text-2xl font-bold font-serif ${color}`}>{counts[key]}</span>
            </div>
            <p className="text-gray-500 text-xs">{label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full bg-dark-700 border border-dark-500 text-white pl-10 pr-4 py-2.5 rounded-sm text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center text-gray-400 text-sm py-8">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-8">Aucun agent trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(agent => {
            const StatusIcon = statusIcons[agent.statut] || CheckCircle
            const agentMissionList = agentMissions(agent.id)
            const activeMissions = agentMissionList.filter(m => m.statut === 'confirmee').length
            return (
              <div key={agent.id} className="card-dark p-5 hover:border-dark-400 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-gold-600/30 to-gold-400/10 border border-gold-500/40" />
                      <div className="absolute inset-[2px] rounded-sm bg-dark-600 flex items-center justify-center">
                        <span className="text-gold-400 font-bold text-sm">{(agent.prenom?.[0] || '')}{(agent.nom?.[0] || '')}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{agent.prenom} {agent.nom}</p>
                      <p className="text-gray-500 text-xs">{agent.specialite}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm border ${statusStyles[agent.statut] || statusStyles.actif}`}>
                    <StatusIcon className="w-3 h-3" /> {agent.statut}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-400 mb-3">
                  {agent.email && <p>{agent.email}</p>}
                  {agent.telephone && <p>{agent.telephone}</p>}
                  {agent.experience && <p>Expérience : {agent.experience}</p>}
                  {agent.disponibilite_debut && (
                    <p className="flex items-center gap-1 text-gold-400/70">
                      <Calendar className="w-3 h-3" />
                      Dispo : {new Date(agent.disponibilite_debut).toLocaleDateString('fr-FR')}
                      {agent.disponibilite_fin && ` → ${new Date(agent.disponibilite_fin).toLocaleDateString('fr-FR')}`}
                    </p>
                  )}
                </div>

                {activeMissions > 0 && (
                  <div className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-sm px-2 py-1 mb-3">
                    {activeMissions} mission(s) active(s)
                  </div>
                )}

                {agent.notes && (
                  <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">{agent.notes}</p>
                )}

                <div className="flex gap-2 pt-3 border-t border-dark-500">
                  <button onClick={() => setDetailAgent(agent)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-sm bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-gold-400 text-xs transition-colors">
                    Détails
                  </button>
                  <button onClick={() => openEdit(agent)}
                    className="flex items-center justify-center px-3 py-1.5 rounded-sm bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-gold-400 text-xs transition-colors">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDelete(agent.id)}
                    className="flex items-center justify-center px-3 py-1.5 rounded-sm bg-dark-600 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-xs transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      {detailAgent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-800 border border-dark-500 rounded-sm max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">{detailAgent.prenom} {detailAgent.nom}</h3>
              <button onClick={() => setDetailAgent(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm mb-6">
              {[
                ['Spécialité', detailAgent.specialite],
                ['Email', detailAgent.email],
                ['Téléphone', detailAgent.telephone],
                ['Expérience', detailAgent.experience],
                ['Statut', detailAgent.statut],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-dark-600">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-200">{value}</span>
                </div>
              ))}
            </div>
            <h4 className="text-gold-400 text-xs uppercase tracking-widest font-medium mb-3">Missions assignées</h4>
            {agentMissions(detailAgent.id).length === 0 ? (
              <p className="text-gray-500 text-xs">Aucune mission assignée.</p>
            ) : (
              <div className="space-y-2">
                {agentMissions(detailAgent.id).map(m => (
                  <div key={m.id} className="bg-dark-700 rounded-sm p-3 text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-medium">{m.prenom} {m.nom}</span>
                      <span className={`px-1.5 py-0.5 rounded-sm border text-xs ${m.statut === 'confirmee' ? 'text-green-400 border-green-500/20 bg-green-500/10' : 'text-gray-400 border-gray-500/20 bg-gray-500/10'}`}>{m.statut}</span>
                    </div>
                    <p className="text-gray-400">{m.service} — {m.date_debut ? new Date(m.date_debut).toLocaleDateString('fr-FR') : '—'}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setDetailAgent(null)} className="btn-outline-gold w-full text-sm mt-6">Fermer</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-800 border border-dark-500 rounded-sm max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">{editing ? 'Modifier' : 'Ajouter'} un agent</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Nom *</label>
                  <input type="text" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Prénom *</label>
                  <input type="text" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Téléphone</label>
                <input type="tel" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Spécialité</label>
                <select value={form.specialite} onChange={e => setForm({...form, specialite: e.target.value})}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none">
                  <option value="">Choisir</option>
                  {specialites.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Statut</label>
                  <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})}
                    className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none">
                    <option value="actif">Actif</option>
                    <option value="indisponible">Indisponible</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Expérience</label>
                  <input type="text" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}
                    placeholder="ex: 10 ans"
                    className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Disponible du</label>
                  <input type="date" value={form.disponibilite_debut || ''} onChange={e => setForm({...form, disponibilite_debut: e.target.value})}
                    className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Disponible au</label>
                  <input type="date" value={form.disponibilite_fin || ''} onChange={e => setForm({...form, disponibilite_fin: e.target.value})}
                    className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 text-sm disabled:opacity-70">
                  {saving ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Ajouter')}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline-gold text-sm px-4">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
