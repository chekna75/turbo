import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { StarDisplay } from '../../components/ui/StarRating'
import { Check, X, Trash2, Eye } from 'lucide-react'

export default function Avis() {
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchAvis = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('avis')
      .select('*')
      .order('created_at', { ascending: false })
    setAvis(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchAvis() }, [])

  const approve = async id => {
    await supabase.from('avis').update({ approuve: true }).eq('id', id)
    setAvis(prev => prev.map(a => a.id === id ? { ...a, approuve: true } : a))
  }

  const reject = async id => {
    await supabase.from('avis').update({ approuve: false }).eq('id', id)
    setAvis(prev => prev.map(a => a.id === id ? { ...a, approuve: false } : a))
  }

  const remove = async id => {
    if (!confirm('Supprimer cet avis définitivement ?')) return
    await supabase.from('avis').delete().eq('id', id)
    setAvis(prev => prev.filter(a => a.id !== id))
  }

  const filtered = avis.filter(a => {
    if (filter === 'pending') return !a.approuve
    if (filter === 'approved') return a.approuve
    return true
  })

  const pending = avis.filter(a => !a.approuve).length
  const avg = avis.length
    ? (avis.filter(a => a.approuve).reduce((s, a) => s + a.note, 0) / (avis.filter(a => a.approuve).length || 1)).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl font-semibold font-serif">Avis clients</h2>
          <p className="text-gray-400 text-sm mt-1">
            {avis.length} avis au total · Note moyenne : <span className="text-gold-400 font-semibold">{avg}/5</span>
          </p>
        </div>
        {pending > 0 && (
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm px-3 py-1.5 rounded-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            {pending} avis en attente de modération
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {[
          { value: 'all',      label: `Tous (${avis.length})` },
          { value: 'pending',  label: `En attente (${pending})` },
          { value: 'approved', label: `Approuvés (${avis.length - pending})` },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`text-sm px-4 py-1.5 rounded-sm border transition-colors ${
              filter === value
                ? 'bg-gold-500/10 border-gold-500/30 text-gold-400'
                : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-dark-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center text-gray-400 text-sm py-10">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-10">Aucun avis.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} className={`card-dark p-5 flex flex-col sm:flex-row gap-4 transition-all ${a.approuve ? 'border-green-500/10' : 'border-yellow-500/10'}`}>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <p className="text-white font-semibold text-sm">{a.nom}</p>
                  {a.service && (
                    <span className="text-xs px-2 py-0.5 rounded-sm bg-dark-600 text-gray-400 border border-dark-400">
                      {a.service}
                    </span>
                  )}
                  <StarDisplay note={a.note} />
                  <span className={`text-xs px-2 py-0.5 rounded-sm border ${
                    a.approuve
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {a.approuve ? 'Publié' : 'En attente'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic">"{a.commentaire}"</p>
                <p className="text-gray-600 text-xs mt-2">
                  {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 sm:flex-shrink-0">
                {!a.approuve ? (
                  <button
                    onClick={() => approve(a.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approuver
                  </button>
                ) : (
                  <button
                    onClick={() => reject(a.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/20 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Dépublier
                  </button>
                )}
                <button
                  onClick={() => remove(a.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
