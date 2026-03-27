import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { defaultContent, } from '../../lib/defaultContent'
import { invalidateContentCache } from '../../hooks/useContent'
import { Save, Check, ChevronDown, ChevronUp, Globe } from 'lucide-react'

const sections = [
  {
    id: 'hero',
    label: 'Page d\'accueil — Hero',
    fields: [
      { key: 'hero_badge',      label: 'Badge',        type: 'text' },
      { key: 'hero_titre',      label: 'Titre',        type: 'text' },
      { key: 'hero_sous_titre', label: 'Sous-titre',   type: 'textarea' },
      { key: 'hero_cta1',       label: 'Bouton 1',     type: 'text' },
      { key: 'hero_cta2',       label: 'Bouton 2',     type: 'text' },
    ],
  },
  {
    id: 'stats',
    label: 'Statistiques',
    fields: [
      { key: 'stat1_valeur', label: 'Stat 1 — Valeur', type: 'text' },
      { key: 'stat1_label',  label: 'Stat 1 — Label',  type: 'text' },
      { key: 'stat2_valeur', label: 'Stat 2 — Valeur', type: 'text' },
      { key: 'stat2_label',  label: 'Stat 2 — Label',  type: 'text' },
      { key: 'stat3_valeur', label: 'Stat 3 — Valeur', type: 'text' },
      { key: 'stat3_label',  label: 'Stat 3 — Label',  type: 'text' },
      { key: 'stat4_valeur', label: 'Stat 4 — Valeur', type: 'text' },
      { key: 'stat4_label',  label: 'Stat 4 — Label',  type: 'text' },
    ],
  },
  {
    id: 'services',
    label: 'Services (Accueil)',
    fields: [
      { key: 'service1_titre', label: 'Service 1 — Titre',       type: 'text' },
      { key: 'service1_desc',  label: 'Service 1 — Description', type: 'textarea' },
      { key: 'service2_titre', label: 'Service 2 — Titre',       type: 'text' },
      { key: 'service2_desc',  label: 'Service 2 — Description', type: 'textarea' },
      { key: 'service3_titre', label: 'Service 3 — Titre',       type: 'text' },
      { key: 'service3_desc',  label: 'Service 3 — Description', type: 'textarea' },
      { key: 'service4_titre', label: 'Service 4 — Titre',       type: 'text' },
      { key: 'service4_desc',  label: 'Service 4 — Description', type: 'textarea' },
    ],
  },
  {
    id: 'cta',
    label: 'Bloc d\'appel à l\'action',
    fields: [
      { key: 'cta_titre', label: 'Titre', type: 'text' },
      { key: 'cta_texte', label: 'Texte', type: 'textarea' },
    ],
  },
  {
    id: 'apropos',
    label: 'Page À Propos',
    fields: [
      { key: 'apropos_titre',       label: 'Titre principal',  type: 'text' },
      { key: 'apropos_sous_titre',  label: 'Sous-titre',       type: 'textarea' },
      { key: 'apropos_histoire_p1', label: 'Histoire — §1',    type: 'textarea' },
      { key: 'apropos_histoire_p2', label: 'Histoire — §2',    type: 'textarea' },
      { key: 'apropos_histoire_p3', label: 'Histoire — §3',    type: 'textarea' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact & Coordonnées',
    fields: [
      { key: 'contact_titre',      label: 'Titre',       type: 'text' },
      { key: 'contact_sous_titre', label: 'Sous-titre',  type: 'textarea' },
      { key: 'contact_telephone',  label: 'Téléphone',   type: 'text' },
      { key: 'contact_email',      label: 'Email',       type: 'text' },
      { key: 'contact_adresse',    label: 'Adresse',     type: 'text' },
    ],
  },
  {
    id: 'footer',
    label: 'Pied de page',
    fields: [
      { key: 'footer_description', label: 'Description', type: 'textarea' },
    ],
  },
]

function SectionEditor({ section, values, onChange, onSave, saving, saved }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card-dark overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-dark-600/50 transition-colors"
      >
        <span className="text-white font-medium text-sm">{section.label}</span>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <Check className="w-3.5 h-3.5" /> Sauvegardé
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-dark-500 p-6 space-y-5">
          {section.fields.map(field => (
            <div key={field.key}>
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={values[field.key] ?? defaultContent[field.key] ?? ''}
                  onChange={e => onChange(field.key, e.target.value)}
                  rows={3}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-2.5 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={values[field.key] ?? defaultContent[field.key] ?? ''}
                  onChange={e => onChange(field.key, e.target.value)}
                  className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-2.5 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSave(section.id, section.fields.map(f => f.key))}
              disabled={saving}
              className="btn-gold inline-flex items-center gap-2 text-sm disabled:opacity-70"
            >
              {saving
                ? <><Save className="w-4 h-4 animate-pulse" /> Sauvegarde...</>
                : <><Save className="w-4 h-4" /> Sauvegarder</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Contenu() {
  const [values, setValues] = useState({ ...defaultContent })
  const [saving, setSaving] = useState(null)   // section id en cours
  const [saved, setSaved]   = useState({})     // { sectionId: true }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('contenu_site').select('cle, valeur').then(({ data }) => {
      if (data) {
        const merged = { ...defaultContent }
        data.forEach(row => { merged[row.cle] = row.valeur })
        setValues(merged)
      }
      setLoading(false)
    })
  }, [])

  const handleChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }))

  const handleSave = async (sectionId, keys) => {
    setSaving(sectionId)

    const upserts = keys.map(key => ({ cle: key, valeur: values[key] ?? '' }))

    await supabase
      .from('contenu_site')
      .upsert(upserts, { onConflict: 'cle' })

    invalidateContentCache()
    setSaving(null)
    setSaved(prev => ({ ...prev, [sectionId]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [sectionId]: false })), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-white text-2xl font-semibold font-serif">Contenu du site</h2>
          <p className="text-gray-400 text-sm mt-1">
            Modifiez les textes de chaque section — les changements sont visibles immédiatement.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-gold text-sm inline-flex items-center gap-2"
        >
          <Globe className="w-4 h-4" /> Voir le site
        </a>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12 text-sm">Chargement du contenu...</div>
      ) : (
        <div className="space-y-3">
          {sections.map(section => (
            <SectionEditor
              key={section.id}
              section={section}
              values={values}
              onChange={handleChange}
              onSave={handleSave}
              saving={saving === section.id}
              saved={!!saved[section.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
