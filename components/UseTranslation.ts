import { useState, useEffect } from 'react'

// In-memory cache persists for the session
const cache = new Map<string, string>()

// Persist across hot reloads in development
function getCached(key: string): string | undefined {
  if (cache.has(key)) return cache.get(key)
  try {
    const val = sessionStorage.getItem(key)
    if (val) { cache.set(key, val); return val }
  } catch {}
  return undefined
}

function setCached(key: string, value: string) {
  cache.set(key, value)
  try { sessionStorage.setItem(key, value) } catch {}
}

// ─── Add your email here — bumps limit from 5k to 50k chars/day, no signup needed
const MYMEMORY_EMAIL = 'luxeplainsafricasafaris@gmail.com'

async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'en') return texts

  const results: string[] = new Array(texts.length)
  const uncachedIndexes: number[] = []
  const uncachedTexts: string[] = []

  // Pull everything possible from cache first
  texts.forEach((text, i) => {
    const key = `${targetLang}:${text}`
    const cached = getCached(key)
    if (cached) {
      results[i] = cached
    } else {
      uncachedIndexes.push(i)
      uncachedTexts.push(text)
    }
  })

  if (uncachedTexts.length === 0) return results

  // Translate uncached texts via MyMemory — one at a time to respect rate limits
  await Promise.all(
    uncachedTexts.map(async (text, i) => {
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}&de=${MYMEMORY_EMAIL}`
        )
        const data = await res.json()

        // Detect the quota warning and return original text gracefully
        if (data.responseStatus === 429 || data.responseData?.translatedText?.includes('MYMEMORY WARNING')) {
          console.warn('[Translation] Daily quota reached — showing original text')
          results[uncachedIndexes[i]] = text
          return
        }

        const translated = data.responseData?.translatedText ?? text
        const key = `${targetLang}:${text}`
        setCached(key, translated)
        results[uncachedIndexes[i]] = translated
      } catch {
        results[uncachedIndexes[i]] = text // show original on failure, never break the UI
      }
    })
  )

  return results
}

// ─── Single text hook ────────────────────────────────────────────────────────

export function useTranslation(text: string, locale: string) {
  const [translated, setTranslated] = useState(text)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (locale === 'en' || !text) { setTranslated(text); return }

    const key = `${locale}:${text}`
    const cached = getCached(key)
    if (cached) { setTranslated(cached); return }

    setLoading(true)
    translateBatch([text], locale)
      .then(([result]) => setTranslated(result))
      .finally(() => setLoading(false))
  }, [text, locale])

  return { translated, loading }
}

// ─── Object hook (translate multiple fields at once) ─────────────────────────

export function useTranslateObject<T extends Record<string, string>>(
  obj: T,
  fields: (keyof T)[],
  locale: string
): { translated: T; loading: boolean } {
  const [translated, setTranslated] = useState<T>(obj)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (locale === 'en') { setTranslated(obj); return }

    const texts = fields.map(f => obj[f])
    setLoading(true)

    translateBatch(texts, locale).then(results => {
      const updated = { ...obj }
      fields.forEach((field, i) => {
        updated[field] = results[i] as T[keyof T]
      })
      setTranslated(updated)
      setLoading(false)
    })
  }, [locale, ...fields.map(f => obj[f])])

  return { translated, loading }
}

export { translateBatch }