import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, X, ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react'

const typeConfig = {
  disponible:    { label: 'Disponible',    color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  en_mission:    { label: 'En mission',    color: 'bg-gold-500/15 text-gold-400 border-gold-500/30' },
  indisponible:  { label: 'Indisponible',  color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  conge:         { label: 'Congé',         color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
}

const MONTHS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
]
const DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  // 0=dimanche → convertir en lundi=0
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

export default function Planning() {
  const [agents, setAgents] = useState([])
  const [disponibilites, setDisponibilites] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ date_debut: '', date_fin: '', type: 'disponible', note: '' })
  const [saving, setSaving] = useState(false)
  const [today] = useState(new Date())
  const [viewDate, setViewDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() })

  const fetchData = async () => {
    setLoading(true)
    const [{ data: ag }, { data: dispo }] = await Promise.all([
      supabase.from('agents').select('id, nom, prenom, statut, specialite').eq('statut', 'actif').order('nom'),
      supabase.from('disponibilites').select('*').order('date_debut'),
    ])
    setAgents(ag || [])
    setDisponibilites(dispo || [])
    if (ag && ag.length > 0 && !selectedAgent) setSelectedAgent(ag[0])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const agentDispos = disponibilites.filter(d => d.agent_id === selectedAgent?.id)

  const handleAddDispo = async e => {
    e.preventDefault()
    setSaving(true)
    await supabase.from('disponibilites').insert([{ ...form, agent_id: selectedAgent.id }])
    setSaving(false)
    setShowModal(false)
    setForm({ date_debut: '', date_fin: '', type: 'disponible', note: '' })
    fetchData()
  }

  const handleDeleteDispo = async id => {
    await supabase.from('disponibilites').delete().eq('id', id)
    setDisponibilites(prev => prev.filter(d => d.id !== id))
  }

  // Calcul couleur d'un jour dans le calendrier
  const getDayType = (year, month, day) => {
    const date = new Date(year, month, day)
    for (const d of agentDispos) {
      const start = new Date(d.date_debut)
      const end = d.date_fin ? new Date(d.date_fin) : new Date(d.date_debut)
      // normalise les heures
      start.setHours(0,0,0,0)
      end.setHours(23,59,59,999)
      date.setHours(12,0,0,0)
      if (date >= start && date <= end) return d.type
    }
    return null
  }

  const { year, month } = viewDate
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => setViewDate(v => {
    if (v.month === 0) return { year: v.year - 1, month: 11 }
    return { year: v.year, month: v.month - 1 }
  })
  const nextMonth = () => setViewDate(v => {
    if (v.month === 11) return { year: v.year + 1, month: 0 }
    return { year: v.year, month: v.month + 1 }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-2xl font-semibold font-serif">Planning des agents</h2>
        <p className="text-gray-400 text-sm mt-1">Gérez les disponibilités et missions de vos agents.</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 text-sm py-12">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent list */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Agents actifs ({agents.length})</p>
            {agents.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun agent actif.</p>
            ) : agents.map(agent => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full flex items-center gap-3 p-3 rounded-sm text-left transition-all ${
                  selectedAgent?.id === agent.id
                    ? 'bg-gold-500/10 border border-gold-500/30 text-white'
                    : 'bg-dark-700 border border-dark-500 text-gray-300 hover:border-dark-400'
                }`}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-gold-700 to-gold-500 rounded-sm flex items-center justify-center flex-shrink-0">
                  <span className="text-dark-900 font-bold text-xs">
                    {agent.prenom?.[0]}{agent.nom?.[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{agent.prenom} {agent.nom}</p>
                  <p className="text-xs text-gray-500 truncate">{agent.specialite || 'Polyvalent'}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="text-xs text-gold-500">
                    {disponibilites.filter(d => d.agent_id === agent.id).length}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Calendar + planning */}
          <div className="lg:col-span-3 space-y-4">
            {selectedAgent ? (
              <>
                {/* Header agent */}
                <div className="card-dark p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gold-400" />
                    <div>
                      <p className="text-white font-semibold">{selectedAgent.prenom} {selectedAgent.nom}</p>
                      <p className="text-xs text-gray-500">{selectedAgent.specialite}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-gold text-xs inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>

                {/* Mini calendar */}
                <div className="card-dark p-5">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="text-gray-400 hover:text-gold-400 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-white font-semibold text-sm">
                      {MONTHS_FR[month]} {year}
                    </h3>
                    <button onClick={nextMonth} className="text-gray-400 hover:text-gold-400 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 mb-1">
                    {DAYS_FR.map(d => (
                      <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {/* Empty cells */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const type = getDayType(year, month, day)
                      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                      const cfg = type ? typeConfig[type] : null

                      return (
                        <div
                          key={day}
                          className={`aspect-square flex items-center justify-center text-xs rounded-sm transition-all ${
                            cfg
                              ? `${cfg.color} font-medium`
                              : isToday
                              ? 'bg-dark-500 text-white font-semibold ring-1 ring-gold-500'
                              : 'text-gray-400 hover:bg-dark-600'
                          }`}
                          title={cfg ? typeConfig[type].label : ''}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-dark-500">
                    {Object.entries(typeConfig).map(([key, { label, color }]) => (
                      <div key={key} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm border ${color}`}></div>
                        <span className="text-xs text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List of disponibilites */}
                <div className="card-dark overflow-hidden">
                  <div className="px-5 py-3 border-b border-dark-500">
                    <h4 className="text-white font-medium text-sm">Périodes enregistrées</h4>
                  </div>
                  {agentDispos.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      Aucune période enregistrée. Cliquez sur "Ajouter" pour commencer.
                    </div>
                  ) : (
                    <div className="divide-y divide-dark-600">
                      {agentDispos
                        .sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut))
                        .map(d => {
                          const cfg = typeConfig[d.type]
                          return (
                            <div key={d.id} className="flex items-center gap-4 px-5 py-3">
                              <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-xs px-2 py-0.5 rounded-sm border ${cfg.color}`}>
                                    {cfg.label}
                                  </span>
                                  <span className="text-sm text-gray-300">
                                    {new Date(d.date_debut).toLocaleDateString('fr-FR')}
                                    {d.date_fin && d.date_fin !== d.date_debut && (
                                      <> → {new Date(d.date_fin).toLocaleDateString('fr-FR')}</>
                                    )}
                                  </span>
                                </div>
                                {d.note && <p className="text-xs text-gray-500 truncate">{d.note}</p>}
                              </div>
                              <button
                                onClick={() => handleDeleteDispo(d.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card-dark p-12 text-center text-gray-500 text-sm">
                Sélectionnez un agent pour voir son planning.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal ajout disponibilité */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-800 border border-dark-500 rounded-sm max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">
                Ajouter une période — {selectedAgent?.prenom} {selectedAgent?.nom}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDispo} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(typeConfig).map(([key, { label, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm({ ...form, type: key })}
                      className={`py-2 px-3 rounded-sm border text-xs font-medium transition-all ${
                        form.type === key ? color : 'bg-dark-600 border-dark-400 text-gray-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Date début *</label>
                  <input
                    type="date" value={form.date_debut}
                    onChange={e => setForm({ ...form, date_debut: e.target.value })} required
                    className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Date fin</label>
                  <input
                    type="date" value={form.date_fin}
                    onChange={e => setForm({ ...form, date_fin: e.target.value })}
                    min={form.date_debut}
                    className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Note (optionnel)</label>
                <input
                  type="text" value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="ex: Mission Paris VIP, Congé famille..."
                  className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 text-sm disabled:opacity-70">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
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
