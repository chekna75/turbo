import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { defaultContent } from '../lib/defaultContent'

// Cache global pour éviter de refetcher entre les composants
let cache = null
let fetchPromise = null
const subscribers = new Set()

function fetchContent() {
  fetchPromise = supabase
    .from('contenu_site')
    .select('cle, valeur')
    .then(({ data }) => {
      const merged = { ...defaultContent }
      if (data) data.forEach(row => { merged[row.cle] = row.valeur })
      cache = merged
      return merged
    })
  return fetchPromise
}

export function useContent() {
  const [content, setContent] = useState(cache || defaultContent)
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    const load = () => {
      if (cache) { setContent(cache); setLoading(false); return }
      if (!fetchPromise) fetchContent()
      fetchPromise.then(merged => {
        setContent(merged)
        setLoading(false)
      })
    }

    load()

    // S'abonner aux invalidations de cache
    const refresh = () => {
      setLoading(true)
      fetchContent().then(merged => {
        setContent(merged)
        setLoading(false)
      })
    }
    subscribers.add(refresh)
    return () => subscribers.delete(refresh)
  }, [])

  const c = key => content[key] ?? defaultContent[key] ?? ''

  return { c, content, loading }
}

// Invalider le cache et notifier tous les composants montés
export function invalidateContentCache() {
  cache = null
  fetchPromise = null
  subscribers.forEach(fn => fn())
}
