import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { defaultContent } from '../lib/defaultContent'

// Cache global pour éviter de refetcher entre les composants
let cache = null
let fetchPromise = null

export function useContent() {
  const [content, setContent] = useState(cache || defaultContent)
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) { setContent(cache); setLoading(false); return }

    if (!fetchPromise) {
      fetchPromise = supabase
        .from('contenu_site')
        .select('cle, valeur')
        .then(({ data }) => {
          const merged = { ...defaultContent }
          if (data) data.forEach(row => { merged[row.cle] = row.valeur })
          cache = merged
          return merged
        })
    }

    fetchPromise.then(merged => {
      setContent(merged)
      setLoading(false)
    })
  }, [])

  // Helper : c(clé) retourne la valeur ou le défaut
  const c = key => content[key] ?? defaultContent[key] ?? ''

  return { c, content, loading }
}

// Invalider le cache après une sauvegarde admin
export function invalidateContentCache() {
  cache = null
  fetchPromise = null
}
