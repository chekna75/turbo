import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Search, X, Pencil, Trash2, User } from 'lucide-react'

const emptyForm = {
  nom: '', prenom: '', email: '', telephone: '',
  specialite: '', statut: 'actif', experience: '', notes: '',
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

export default function Agents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchAgents = async () => {
    setLoading(true)
    const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: false })
    setAgents(data || [])
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

  const filtered = agents.filter(a =>
    `${a.nom} ${a.prenom} ${a.specialite}`.toLowerCase().includes(search.toLowerCase())
  )

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
          {filtered.map(agent => (
            <div key={agent.id} className="card-dark p-5 hover:border-dark-400 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-700 to-gold-500 rounded-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-dark-900 font-bold text-sm">
                      {(agent.prenom?.[0] || '')}{(agent.nom?.[0] || '')}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{agent.prenom} {agent.nom}</p>
                    <p className="text-gray-500 text-xs">{agent.specialite}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-sm border ${statusStyles[agent.statut] || statusStyles.actif}`}>
                  {agent.statut}
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-400 mb-4">
                {agent.email && <p>{agent.email}</p>}
                {agent.telephone && <p>{agent.telephone}</p>}
                {agent.experience && <p>Expérience : {agent.experience}</p>}
              </div>

              {agent.notes && (
                <p className="text-xs text-gray-500 italic mb-4 line-clamp-2">{agent.notes}</p>
              )}

              <div className="flex gap-2 pt-3 border-t border-dark-500">
                <button
                  onClick={() => openEdit(agent)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-sm bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-gold-400 text-xs transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Modifier
                </button>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="flex items-center justify-center px-3 py-1.5 rounded-sm bg-dark-600 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-xs transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
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
