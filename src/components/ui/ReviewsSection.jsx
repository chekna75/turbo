import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { StarDisplay, StarPicker } from './StarRating'
import ScrollReveal from './ScrollReveal'
import { CheckCircle, Loader, MessageSquare, Quote } from 'lucide-react'

const services = [
  'Protection VIP', 'Escorte Sécurisée', 'Sécurité Événementielle',
  'Surveillance & Reconnaissance', 'Protection Internationale', 'Intervention Rapide',
]

function ReviewForm({ onSubmitted }) {
  const [form, setForm] = useState({ nom: '', service: '', note: 5, commentaire: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.note) { setError('Veuillez sélectionner une note.'); return }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('avis').insert([{
      ...form,
      approuve: false,
    }])

    setLoading(false)
    if (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } else {
      onSubmitted()
    }
  }

  return (
    <div className="card-dark p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 rounded-sm flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Laisser un avis</h3>
          <p className="text-gray-500 text-xs">Votre avis sera publié après modération</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Votre nom *</label>
            <input
              type="text" value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })} required
              placeholder="Jean Dupont"
              className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-2.5 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Service utilisé</label>
            <select
              value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
              className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-2.5 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
            >
              <option value="">Choisir</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-3">Votre note *</label>
          <StarPicker value={form.note} onChange={note => setForm({ ...form, note })} />
          <p className="text-xs text-gray-500 mt-1.5">
            {['', 'Très insatisfait', 'Insatisfait', 'Correct', 'Satisfait', 'Excellent'][form.note]}
          </p>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Votre avis *</label>
          <textarea
            value={form.commentaire}
            onChange={e => setForm({ ...form, commentaire: e.target.value })}
            required rows={4}
            placeholder="Partagez votre expérience avec Turbo Sécurity..."
            className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-2.5 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading
            ? <><Loader className="w-4 h-4 animate-spin" /> Envoi...</>
            : 'Soumettre mon avis'
          }
        </button>
      </form>
    </div>
  )
}

export default function ReviewsSection() {
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    supabase
      .from('avis')
      .select('*')
      .eq('approuve', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setAvis(data || [])
        setLoading(false)
      })
  }, [])

  // Moyenne des notes
  const avg = avis.length
    ? (avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1)
    : null

  return (
    <section className="relative py-24 px-4 bg-dark-800 border-t border-dark-600 overflow-hidden">
      {/* Orb décoratif */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 opacity-10 animate-orb-float-slow"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,151,26,0.6) 0%, transparent 70%)', filter: 'blur(50px)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal direction="fade">
            <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">Témoignages</p>
            <h2 className="section-title mb-3">Ce que disent nos clients</h2>

            {avg && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <StarDisplay note={Math.round(avg)} size="lg" />
                <span className="font-serif text-3xl font-bold text-gold-400">{avg}</span>
                <span className="text-gray-400 text-sm">/ 5 — {avis.length} avis</span>
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Cards avis */}
        {loading ? (
          <div className="text-center text-gray-400 text-sm py-8">Chargement des avis...</div>
        ) : avis.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            Soyez le premier à laisser un avis.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {avis.map((a, i) => (
              <ScrollReveal key={a.id} direction="up" delay={`${(i % 3) * 100}ms`}>
                <div className="card-dark glowing-card p-6 flex flex-col h-full">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-gold-500/20 mb-4 flex-shrink-0" />

                  <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-5 italic">
                    "{a.commentaire}"
                  </p>

                  <div className="border-t border-dark-500 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">{a.nom}</p>
                      {a.service && (
                        <p className="text-gold-500/70 text-xs mt-0.5">{a.service}</p>
                      )}
                    </div>
                    <StarDisplay note={a.note} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* CTA ou formulaire */}
        <ScrollReveal direction="up" delay="100ms">
          {submitted ? (
            <div className="text-center">
              <div className="inline-flex flex-col items-center gap-3 bg-dark-700 border border-gold-500/20 rounded-sm px-10 py-8">
                <CheckCircle className="w-10 h-10 text-gold-400" />
                <p className="text-white font-semibold">Merci pour votre avis !</p>
                <p className="text-gray-400 text-sm">Il sera publié après validation.</p>
              </div>
            </div>
          ) : showForm ? (
            <ReviewForm onSubmitted={() => { setSubmitted(true); setShowForm(false) }} />
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="btn-gold inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Laisser un avis
              </button>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}
