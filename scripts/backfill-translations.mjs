/**
 * backfill-translations.mjs
 * Translates all existing Supabase content into the universal translations table.
 *
 * Safe to rerun at any time:
 *   - Skips already translated records
 *   - Picks up where it left off if interrupted
 *   - Add new tables/columns to TABLES config and rerun — existing data untouched
 *
 * Usage:
 *   MYMEMORY_EMAIL=you@email.com node scripts/backfill-translations.mjs
 *
 * Required env vars (in .env.local or passed inline):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY   ← service role key, not anon key
 *   MYMEMORY_EMAIL         ← optional but strongly recommended for 10x quota
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL ?? ''

const LOCALES = ['fr', 'de', 'es', 'it', 'nl', 'pl', 'zh', 'ja', 'ru', 'ar', 'pt']

/**
 * TABLES config — the single source of truth for what gets translated.
 * To add a new table: add an entry below with its translatable fields.
 * To add a new column: add the field name to the existing entry and rerun.
 */
const TABLES = [
  {
    name: 'tours',
    fields: ['title', 'description', 'duration', 'why_choose_safari'],
  },
  {
    name: 'accommodations',
    fields: ['accommodation_type', 'classification', 'description', 'hotel_name', 'location'],
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
    fields: ['classification', 'season'],
  },
]

// ─── Supabase ─────────────────────────────────────────────────────────────────

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ─── Translation ──────────────────────────────────────────────────────────────

const delay = (ms) => new Promise(r => setTimeout(r, ms))

async function translateText(text, targetLang, retries = 3) {
  if (!text || text.trim() === '') return text

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}${MYMEMORY_EMAIL ? `&de=${MYMEMORY_EMAIL}` : ''}`

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.responseData?.translatedText?.includes('MYMEMORY WARNING')) {
        console.error(`\n⚠  Daily quota reached. Rerun tomorrow — already translated records will be skipped.\n`)
        process.exit(1)
      }

      return data.responseData?.translatedText ?? text
    } catch {
      if (attempt === retries) {
        console.warn(`  ⚠ Translation failed after ${retries} attempts — keeping original`)
        return text
      }
      await delay(1000 * attempt) // backoff: 1s, 2s, 3s
    }
  }
  return text
}

// ─── Already translated check ─────────────────────────────────────────────────

async function getExistingTranslations(tableName, recordId) {
  const { data } = await supabase
    .from('translations')
    .select('locale, field')
    .eq('table_name', tableName)
    .eq('record_id', recordId)

  // Return a Set of 'locale:field' strings for fast lookup
  return new Set((data ?? []).map(r => `${r.locale}:${r.field}`))
}

// ─── Stats tracker ────────────────────────────────────────────────────────────

const stats = { translated: 0, skipped: 0, failed: 0 }

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n🌍 Luxe Plains — Supabase Translation Backfill`)
  console.log(`   Tables:  ${TABLES.length}`)
  console.log(`   Locales: ${LOCALES.join(', ')}`)
  console.log(`   Email:   ${MYMEMORY_EMAIL || 'not set — add MYMEMORY_EMAIL for 50k chars/day'}`)
  console.log(`────────────────────────────────────────────────\n`)

  for (const table of TABLES) {
    console.log(`\n📋 Table: ${table.name} (fields: ${table.fields.join(', ')})`)

    // Fetch all rows for this table
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
      // Check what's already translated for this record
      const existing = await getExistingTranslations(table.name, row.id)

      for (const locale of LOCALES) {
        for (const field of table.fields) {
          const value = row[field]

          // Skip empty values
          if (!value || value.trim() === '') continue

          // Skip if already translated
          if (existing.has(`${locale}:${field}`)) {
            stats.skipped++
            continue
          }

          process.stdout.write(`  [${locale}] ${table.name}.${field} (${row.id.slice(0, 8)}...) ... `)

          const translated = await translateText(value, locale)

          const { error: insertError } = await supabase
            .from('translations')
            .insert({
              table_name: table.name,
              record_id: row.id,
              locale,
              field,
              translated_text: translated,
            })

          if (insertError) {
            // Unique constraint violation = already exists, safe to ignore
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

          await delay(350) // respect MyMemory rate limit
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
