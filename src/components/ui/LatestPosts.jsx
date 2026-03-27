import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ScrollReveal from './ScrollReveal'
import GlowOrb from './GlowOrb'
import { Calendar, ChevronRight } from 'lucide-react'

const categoryColors = {
  actualite: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  conseil:   'bg-green-500/10 text-green-400 border-green-500/20',
  mission:   'bg-gold-500/10 text-gold-400 border-gold-500/20',
  annonce:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

const categoryLabels = {
  actualite: 'Actualité', conseil: 'Conseil', mission: 'Mission', annonce: 'Annonce',
}

export default function LatestPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('publie', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  if (!loading && posts.length === 0) return null

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <GlowOrb className="w-80 h-80 top-0 left-0 opacity-8" slow />
      <GlowOrb className="w-72 h-72 bottom-0 right-0 opacity-8" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-12">
          <ScrollReveal direction="left">
            <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-2">Publications</p>
            <h2 className="section-title">Dernières actualités</h2>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <Link to="/actualites" className="btn-outline-gold text-sm inline-flex items-center gap-1.5">
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="card-dark p-6 h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <ScrollReveal key={post.id} direction="up" delay={`${i * 100}ms`}>
                <div className="card-dark glowing-card p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm border ${categoryColors[post.categorie] || categoryColors.actualite}`}>
                      {categoryLabels[post.categorie] || post.categorie}
                    </span>
                    <span className="text-gray-600 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h3 className="text-white font-serif font-semibold mb-2 leading-snug">{post.titre}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">{post.contenu}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
