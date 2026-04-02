import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { defaultContent } from '../lib/defaultContent'

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

// Souscription Realtime globale (une seule pour toute l'app)
let realtimeChannel = null

function ensureRealtimeSubscription() {
  if (realtimeChannel) return
  realtimeChannel = supabase
    .channel('contenu_site_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'contenu_site' }, () => {
      cache = null
      fetchPromise = null
      fetchContent().then(merged => {
        subscribers.forEach(fn => fn(merged))
      })
    })
    .subscribe()
}

export function useContent() {
  const [content, setContent] = useState(cache || defaultContent)
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) {
      setContent(cache)
      setLoading(false)
    } else {
      if (!fetchPromise) fetchContent()
      fetchPromise.then(merged => {
        setContent(merged)
        setLoading(false)
      })
    }

    ensureRealtimeSubscription()

    const refresh = (merged) => setContent(merged)
    subscribers.add(refresh)
    return () => subscribers.delete(refresh)
  }, [])

  const c = key => content[key] ?? defaultContent[key] ?? ''

  return { c, content, loading }
}

export function invalidateContentCache() {
  cache = null
  fetchPromise = null
  fetchContent().then(merged => {
    subscribers.forEach(fn => fn(merged))
  })
}
