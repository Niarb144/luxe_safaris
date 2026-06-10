/**
 * translate-messages.mjs
 * Generates and updates all language JSON files from en.json
 *
 * First run:    generates all locale files from scratch
 * Subsequent:   only translates new/missing keys, never overwrites existing ones
 *
 * Usage:
 *   node scripts/translate-messages.mjs
 *
 * Recommended (10x free daily limit):
 *   MYMEMORY_EMAIL=you@email.com node scripts/translate-messages.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL ?? ''
const MESSAGES_DIR = path.join(__dirname, '../messages')

const LOCALES = ['fr', 'de', 'es', 'it', 'nl', 'pl', 'zh', 'ja', 'ru', 'ar', 'pt']

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise(r => setTimeout(r, ms))

// Find keys present in `source` but missing or undefined in `target`
function findMissingKeys(source, target) {
  const missing = {}
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'object' && value !== null) {
      const nested = findMissingKeys(value, target[key] ?? {})
      if (Object.keys(nested).length > 0) missing[key] = nested
    } else if (target[key] === undefined) {
      missing[key] = value
    }
  }
  return missing
}

// Deep merge — existing target values are NEVER overwritten
function deepMerge(target, source) {
  const result = { ...target }
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'object' && value !== null && typeof result[key] === 'object') {
      result[key] = deepMerge(result[key], value)
    } else {
      result[key] = value
    }
  }
  return result
}

// Count total string keys in a nested object
function countKeys(obj) {
  return Object.values(obj).reduce(
    (acc, val) => acc + (typeof val === 'object' && val !== null ? countKeys(val) : 1),
    0
  )
}

// ─── Translation ──────────────────────────────────────────────────────────────

async function translateText(text, targetLang, retries = 3) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}${MYMEMORY_EMAIL ? `&de=${MYMEMORY_EMAIL}` : ''}`

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.responseData?.translatedText?.includes('MYMEMORY WARNING')) {
        console.error(`\n⚠  Daily quota reached. Run again tomorrow or set MYMEMORY_EMAIL for 10x limit.\n`)
        process.exit(1)
      }

      return data.responseData?.translatedText ?? text
    } catch {
      if (attempt === retries) return text
      await delay(1000 * attempt) // backoff: 1s, 2s, 3s
    }
  }
  return text
}

// Recursively walk a (missing-keys-only) object and translate all string values
async function translateObject(obj, targetLang, keyPath = '') {
  const result = {}

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = keyPath ? `${keyPath}.${key}` : key

    if (typeof value === 'string') {
      process.stdout.write(`  [${targetLang}] ${currentPath} ... `)
      const translated = await translateText(value, targetLang)
      result[key] = translated
      console.log('✓')
      await delay(350) // stay within MyMemory rate limits
    } else if (typeof value === 'object' && value !== null) {
      result[key] = await translateObject(value, targetLang, currentPath)
    } else {
      result[key] = value
    }
  }

  return result
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const enPath = path.join(MESSAGES_DIR, 'en.json')

  if (!fs.existsSync(enPath)) {
    console.error('✗ messages/en.json not found. Create it first.')
    process.exit(1)
  }

  const enMessages = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
  const totalKeys = countKeys(enMessages)

  console.log(`\n🌍 Luxe Plains — Message Translation Script`)
  console.log(`   Source:    messages/en.json (${totalKeys} strings)`)
  console.log(`   Locales:   ${LOCALES.join(', ')}`)
  console.log(`   Email:     ${MYMEMORY_EMAIL || 'not set (5k chars/day) — add MYMEMORY_EMAIL for 50k'}`)
  console.log(`─────────────────────────────────────────────\n`)

  for (const locale of LOCALES) {
    const outputPath = path.join(MESSAGES_DIR, `${locale}.json`)

    // Load existing file if it exists
    let existing = {}
    if (fs.existsSync(outputPath)) {
      try {
        const raw = fs.readFileSync(outputPath, 'utf-8').trim()
        existing = raw ? JSON.parse(raw) : {}
      } catch {
        console.warn(`⚠  ${locale}.json is corrupt or empty — will recreate it`)
        existing = {}
      }
    }

    // Find only keys missing from existing translation
    const missing = findMissingKeys(enMessages, existing)
    const missingCount = countKeys(missing)

    if (missingCount === 0) {
      console.log(`⏭  ${locale}.json — up to date, skipping`)
      continue
    }

    const isNew = Object.keys(existing).length === 0
    console.log(`\n── ${isNew ? 'Creating' : 'Updating'} ${locale}.json (${missingCount} new string${missingCount === 1 ? '' : 's'}) ──`)

    // Translate only the missing keys
    const translated = await translateObject(missing, locale)

    // Merge into existing — existing values are never touched
    const merged = deepMerge(existing, translated)

    fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8')
    console.log(`✅ ${locale}.json ${isNew ? 'created' : 'updated'}`)
  }

  console.log(`\n🎉 Done! All locale files are up to date.\n`)
}

run()
