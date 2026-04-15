import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { defaultContent } from '../lib/defaultContent'
import i18n from '../i18n/index.js'

const cache = {}
const fetchPromises = {}
const subscribers = new Set()

async function fetchContent(langue) {
  const langs = langue === 'fr' ? ['fr'] : ['fr', langue]
  const { data } = await supabase
    .from('traductions')
    .select('cle, langue, valeur')
    .in('langue', langs)

  const merged = { ...defaultContent }
  if (data) {
    data.filter(r => r.langue === 'fr').forEach(r => { merged[r.cle] = r.valeur })
    if (langue !== 'fr') {
      data.filter(r => r.langue === langue && r.valeur).forEach(r => { merged[r.cle] = r.valeur })
    }
  }
  cache[langue] = merged
  return merged
}

let realtimeChannel = null

function ensureRealtimeSubscription() {
  if (realtimeChannel) return
  realtimeChannel = supabase
    .channel('traductions_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'traductions' }, () => {
      Object.keys(cache).forEach(k => delete cache[k])
      Object.keys(fetchPromises).forEach(k => delete fetchPromises[k])
      const lang = i18n.language || 'fr'
      fetchContent(lang).then(merged => subscribers.forEach(fn => fn(merged)))
    })
    .subscribe()
}

export function useContent() {
  const [lang, setLang] = useState(() => i18n.language || 'fr')
  const [content, setContent] = useState(() => cache[i18n.language || 'fr'] || defaultContent)
  const [loading, setLoading] = useState(() => !cache[i18n.language || 'fr'])

  // Setup: language listener + realtime + subscriber — runs once
  useEffect(() => {
    const onLangChange = (lng) => setLang(lng)
    i18n.on('languageChanged', onLangChange)
    ensureRealtimeSubscription()
    const refresh = (merged) => setContent(merged)
    subscribers.add(refresh)
    return () => {
      i18n.off('languageChanged', onLangChange)
      subscribers.delete(refresh)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch when lang changes — always [lang], never changes size
  useEffect(() => {
    if (cache[lang]) {
      setContent(cache[lang])
      setLoading(false)
      return
    }
    setLoading(true)
    if (!fetchPromises[lang]) fetchPromises[lang] = fetchContent(lang)
    fetchPromises[lang].then(merged => {
      setContent(merged)
      setLoading(false)
    })
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const c = key => content[key] ?? defaultContent[key] ?? ''
  return { c, content, loading }
}

export function invalidateContentCache() {
  Object.keys(cache).forEach(k => delete cache[k])
  Object.keys(fetchPromises).forEach(k => delete fetchPromises[k])
  const lang = i18n.language || 'fr'
  fetchContent(lang).then(merged => subscribers.forEach(fn => fn(merged)))
}

export async function saveTranslation(cle, langue, valeur) {
  return supabase
    .from('traductions')
    .upsert([{ cle, langue, valeur }], { onConflict: 'cle,langue' })
}
