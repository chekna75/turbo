import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Search, X, Pencil, Trash2, Eye } from 'lucide-react'

const emptyForm = { titre: '', contenu: '', categorie: 'actualite', publie: false }
const categories = ['actualite', 'conseil', 'mission', 'annonce']

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowModal(true) }
  const openEdit = post => { setForm(post); setEditing(post.id); setShowModal(true) }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)

    if (editing) {
      await supabase.from('posts').update(form).eq('id', editing)
    } else {
      await supabase.from('posts').insert([form])
    }

    setSaving(false)
    setShowModal(false)
    fetchPosts()
  }

  const handleDelete = async id => {
    if (!confirm('Supprimer ce contenu ?')) return
    await supabase.from('posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const togglePublished = async (id, current) => {
    await supabase.from('posts').update({ publie: !current }).eq('id', id)
    setPosts(prev => prev.map(p => p.id === id ? { ...p, publie: !current } : p))
  }

  const filtered = posts.filter(p =>
    `${p.titre} ${p.categorie}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl font-semibold font-serif">Contenus</h2>
          <p className="text-gray-400 text-sm mt-1">{posts.length} contenu(s) créé(s)</p>
        </div>
        <button onClick={openAdd} className="btn-gold inline-flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Créer un contenu
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

      {/* Table */}
      <div className="card-dark overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Aucun contenu. Créez votre premier contenu.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-dark-500">
                  <th className="px-4 py-3 text-left">Titre</th>
                  <th className="px-4 py-3 text-left">Catégorie</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id} className="border-b border-dark-600 hover:bg-dark-600/30 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-sm text-white font-medium">{post.titre}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{post.contenu?.substring(0, 60)}...</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs px-2 py-1 rounded-sm border border-dark-400 text-gray-400 capitalize">
                        {post.categorie}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => togglePublished(post.id, post.publie)}
                        className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
                          post.publie
                            ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20'
                        }`}
                      >
                        {post.publie ? 'Publié' : 'Brouillon'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(post)}
                          className="w-8 h-8 flex items-center justify-center rounded-sm bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-gold-400 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-sm bg-dark-600 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-800 border border-dark-500 rounded-sm max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">{editing ? 'Modifier' : 'Créer'} un contenu</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Titre *</label>
                <input type="text" value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} required
                  className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none"
                  placeholder="Titre du contenu" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Catégorie</label>
                <select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none">
                  {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Contenu *</label>
                <textarea value={form.contenu} onChange={e => setForm({...form, contenu: e.target.value})} required rows={8}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-3 py-2 rounded-sm text-sm focus:border-gold-500 focus:outline-none resize-none"
                  placeholder="Contenu de votre article ou annonce..." />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="publie" checked={form.publie}
                  onChange={e => setForm({...form, publie: e.target.checked})}
                  className="w-4 h-4 accent-yellow-400" />
                <label htmlFor="publie" className="text-sm text-gray-300">Publier immédiatement</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 text-sm disabled:opacity-70">
                  {saving ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer')}
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
