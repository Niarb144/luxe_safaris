/**
 * backfill-translations.mjs
 * Translates all existing Supabase content into the universal translations table.
 * Uses Azure Translator (2M free chars/month).
 *
 * Supports both string fields and array fields (text[]) — array elements are
 * translated individually and stored as a JSON-encoded array string.
 *
 * Safe to rerun at any time:
 *   - Skips already translated records
 *   - Picks up where it left off if interrupted
 *   - Add new tables/columns to TABLES config and rerun — existing data untouched
 *
 * Usage:
 *   node scripts/backfill-translations.mjs
 *
 * Required env vars (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY      ← service role key, not anon key
 *   AZURE_TRANSLATOR_KEY
 *   AZURE_TRANSLATOR_REGION
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const AZURE_KEY = process.env.AZURE_TRANSLATOR_KEY
const AZURE_REGION = process.env.AZURE_TRANSLATOR_REGION

const LOCALES = ['fr', 'de', 'es', 'it', 'nl', 'pl', 'zh', 'ja', 'ru', 'ar', 'pt']

const AZURE_LANG_MAP = {
  zh: 'zh-Hans',
  pt: 'pt-pt',
}

/**
 * TABLES config — the single source of truth for what gets translated.
 * fields: array of strings — supports both plain text columns and text[] array columns.
 * Array columns are detected automatically at runtime (no config change needed).
 */
const TABLES = [
  {
    name: 'tours',
    fields: ['title', 'description', 'duration', 'why_choose_safari'],
  },
  {
    name: 'accommodations',
    fields: ['accommodation_type', 'description', 'hotel_name', 'location', 'amenities', 'services'],
  },
  {
    name: 'countries',
    fields: ['name'],
  },
  {
    name: 'destination_facts',
    fields: ['fact'],
  },
  {
    name: 'destination_highlights',
    fields: ['highlight'],
  },
  {
    name: 'destinations',
    fields: ['name', 'description', 'country'],
  },
  {
    name: 'holiday_types',
    fields: ['name'],
  },
  {
    name: 'tour_exclusions',
    fields: ['item'],
  },
  {
    name: 'tour_faqs',
    fields: ['question', 'answer'],
  },
  {
    name: 'tour_highlights',
    fields: ['title', 'description'],
  },
  {
    name: 'tour_inclusions',
    fields: ['item'],
  },
  {
    name: 'tour_itinerary',
    fields: ['title', 'description'],
  },
  {
    name: 'tour_pricing',
    fields: ['season'],
  },
]

// ─── Supabase ─────────────────────────────────────────────────────────────────

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local')
  process.exit(1)
}

if (!AZURE_KEY || !AZURE_REGION) {
  console.error('✗ Missing AZURE_TRANSLATOR_KEY or AZURE_TRANSLATOR_REGION in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ─── Translation ──────────────────────────────────────────────────────────────

const delay = (ms) => new Promise(r => setTimeout(r, ms))

async function translateText(text, targetLang, retries = 5) {
  if (!text || text.trim() === '') return text

  const azureLang = AZURE_LANG_MAP[targetLang] || targetLang

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(
        `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${azureLang}`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': AZURE_KEY,
            'Ocp-Apim-Subscription-Region': AZURE_REGION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ Text: text }]),
        }
      )

      if (!res.ok) {
        const errBody = await res.text()

        if (res.status === 401) {
          console.error(`\n✗ Azure 401 Unauthorized — key/region mismatch or invalid credentials.`)
          console.error(`   Double-check AZURE_TRANSLATOR_KEY and AZURE_TRANSLATOR_REGION in .env.local`)
          console.error(`   against the exact values on the Azure portal's Keys and Endpoint page.\n`)
          process.exit(1)
        }

        if (res.status === 403) {
          console.error(`\n⚠  Azure quota exceeded (403). Stopping — already translated records are saved.`)
          console.error(`   Resets monthly on your Azure billing cycle. Rerun this script later.\n`)
          process.exit(1)
        }

        if (res.status === 429) {
          const waitTime = 1000 * attempt
          if (attempt < retries) {
            process.stdout.write(`(rate limited, waiting ${waitTime / 1000}s) `)
            await delay(waitTime)
            continue
          }
        }

        throw new Error(`Azure API error ${res.status}: ${errBody}`)
      }

      const data = await res.json()
      return data[0]?.translations?.[0]?.text ?? text
    } catch (err) {
      if (attempt === retries) {
        console.warn(`  ⚠ Translation failed after ${retries} attempts — keeping original (${err.message})`)
        return text
      }
      await delay(500 * attempt)
    }
  }
  return text
}

/**
 * Translate an array of strings element by element.
 * Returns a JSON-stringified array (matches how it'll be stored/retrieved).
 */
async function translateArray(arr, targetLang) {
  const translated = []
  for (const item of arr) {
    if (typeof item !== 'string' || item.trim() === '') {
      translated.push(item)
      continue
    }
    translated.push(await translateText(item, targetLang))
    await delay(150) // light pacing between array elements
  }
  return translated
}

// ─── Already translated check ─────────────────────────────────────────────────

async function getExistingTranslations(tableName, recordId) {
  const { data } = await supabase
    .from('translations')
    .select('locale, field')
    .eq('table_name', tableName)
    .eq('record_id', recordId)

  return new Set((data ?? []).map(r => `${r.locale}:${r.field}`))
}

// ─── Stats tracker ────────────────────────────────────────────────────────────

const stats = { translated: 0, skipped: 0, failed: 0 }

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n🌍 Luxe Plains — Supabase Translation Backfill (Azure)`)
  console.log(`   Tables:  ${TABLES.length}`)
  console.log(`   Locales: ${LOCALES.join(', ')}`)
  console.log(`   Region:  ${AZURE_REGION}`)
  console.log(`────────────────────────────────────────────────\n`)

  for (const table of TABLES) {
    console.log(`\n📋 Table: ${table.name} (fields: ${table.fields.join(', ')})`)

    const { data: rows, error } = await supabase
      .from(table.name)
      .select(`id, ${table.fields.join(', ')}`)

    if (error) {
      console.error(`  ✗ Could not fetch ${table.name}:`, error.message)
      continue
    }

    if (!rows || rows.length === 0) {
      console.log(`  — No rows found, skipping`)
      continue
    }

    console.log(`  Found ${rows.length} row(s)`)

    for (const row of rows) {
      const existing = await getExistingTranslations(table.name, row.id)

      for (const locale of LOCALES) {
        for (const field of table.fields) {
          const value = row[field]

          // Skip null/undefined
          if (value === null || value === undefined) continue

          // Skip if already translated
          if (existing.has(`${locale}:${field}`)) {
            stats.skipped++
            continue
          }

          // Skip empty strings
          if (typeof value === 'string' && value.trim() === '') continue

          // Skip empty arrays
          if (Array.isArray(value) && value.length === 0) continue

          let translatedValue

          if (Array.isArray(value)) {
            process.stdout.write(`  [${locale}] ${table.name}.${field} (${row.id.slice(0, 8)}..., array of ${value.length}) ... `)
            const translatedArr = await translateArray(value, locale)
            translatedValue = JSON.stringify(translatedArr)
          } else if (typeof value === 'string') {
            process.stdout.write(`  [${locale}] ${table.name}.${field} (${row.id.slice(0, 8)}...) ... `)
            translatedValue = await translateText(value, locale)
          } else {
            console.warn(`  ⚠ Skipping ${table.name}.${field} — unsupported type (${typeof value})`)
            continue
          }

          const { error: insertError } = await supabase
            .from('translations')
            .insert({
              table_name: table.name,
              record_id: row.id,
              locale,
              field,
              translated_text: translatedValue,
            })

          if (insertError) {
            if (insertError.code === '23505') {
              console.log('already exists ⏭')
              stats.skipped++
            } else {
              console.log(`✗ ${insertError.message}`)
              stats.failed++
            }
          } else {
            console.log('✓')
            stats.translated++
          }

          await delay(200)
        }
      }
    }
  }

  console.log(`\n────────────────────────────────────────────────`)
  console.log(`✅ Done!`)
  console.log(`   Translated: ${stats.translated}`)
  console.log(`   Skipped:    ${stats.skipped} (already existed)`)
  console.log(`   Failed:     ${stats.failed}`)
  console.log(`────────────────────────────────────────────────\n`)
}

run()
