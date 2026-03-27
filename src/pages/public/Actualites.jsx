import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ScrollReveal from '../../components/ui/ScrollReveal'
import GlowOrb from '../../components/ui/GlowOrb'
import { Calendar, Tag } from 'lucide-react'

const categoryColors = {
  actualite: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  conseil:   'bg-green-500/10 text-green-400 border-green-500/20',
  mission:   'bg-gold-500/10 text-gold-400 border-gold-500/20',
  annonce:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

const categoryLabels = {
  actualite: 'Actualité',
  conseil:   'Conseil',
  mission:   'Mission',
  annonce:   'Annonce',
}

function PostCard({ post, delay }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = post.contenu.length > 220

  return (
    <ScrollReveal direction="up" delay={delay}>
      <div className="card-dark glowing-card p-7 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded-sm border ${categoryColors[post.categorie] || categoryColors.actualite}`}>
            {categoryLabels[post.categorie] || post.categorie}
          </span>
          <span className="text-gray-600 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h3 className="text-white font-serif font-semibold text-lg mb-3 leading-snug">
          {post.titre}
        </h3>

        <p className={`text-gray-400 text-sm leading-relaxed flex-1 ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
          {post.contenu}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-gold-400 hover:text-gold-300 text-xs font-medium transition-colors self-start"
          >
            {expanded ? 'Voir moins ↑' : 'Lire la suite →'}
          </button>
        )}
      </div>
    </ScrollReveal>
  )
}

export default function Actualites() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('publie', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  const categories = ['all', ...new Set(posts.map(p => p.categorie))]

  const filtered = filter === 'all' ? posts : posts.filter(p => p.categorie === filter)

  return (
    <div className="bg-dark-900">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-dark-800 border-b border-dark-600 overflow-hidden">
        <GlowOrb className="w-96 h-96 -top-20 -right-20 opacity-15" />
        <GlowOrb className="w-64 h-64 bottom-0 -left-10 opacity-10" slow />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="fade">
            <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">Actualités</p>
            <h1 className="section-title text-4xl md:text-5xl mb-4">Nos publications</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Conseils, actualités et informations de Turbo Sécurity.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Filtres catégories */}
          {!loading && posts.length > 0 && (
            <ScrollReveal direction="fade">
              <div className="flex flex-wrap gap-2 mb-10">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`text-sm px-4 py-1.5 rounded-sm border transition-colors capitalize ${
                      filter === cat
                        ? 'bg-gold-500/10 border-gold-500/30 text-gold-400'
                        : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-dark-400'
                    }`}
                  >
                    {cat === 'all' ? 'Tous' : (categoryLabels[cat] || cat)}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          )}

          {loading ? (
            <div className="text-center text-gray-400 py-16">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="w-10 h-10 text-dark-500 mx-auto mb-3" />
              <p className="text-gray-500">Aucune publication pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <PostCard key={post.id} post={post} delay={`${(i % 3) * 100}ms`} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
