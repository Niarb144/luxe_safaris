/**
 * lib/translations.ts
 * Utility to fetch translations from the universal translations table.
 * Used in server components — call alongside your existing Supabase fetches.
 */

import { supabase } from '@/lib/supabase'

/**
 * Array fields are stored as JSON-stringified arrays in translated_text.
 * Detect and parse them back into real arrays when merging into records.
 */
function parseTranslatedValue(value: string): any {
  if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
    try {
      return JSON.parse(value)
    } catch {
      return value // not valid JSON, treat as plain string
    }
  }
  return value
}

/**
 * Fetch translations for a single record and merge them into the record.
 * Falls back to original English values if no translation exists.
 */
export async function applyTranslation<T extends Record<string, any>>(
  tableName: string,
  record: T,
  fields: string[],
  locale: string
): Promise<T> {
  if (locale === 'en' || !record) return record

  const { data } = await supabase
    .from('translations')
    .select('field, translated_text')
    .eq('table_name', tableName)
    .eq('record_id', record.id)
    .eq('locale', locale)
    .in('field', fields)

  if (!data || data.length === 0) return record

  const merged = { ...record } as Record<string, any>
  data.forEach(({ field, translated_text }) => {
    if (translated_text) merged[field] = parseTranslatedValue(translated_text)
  })

  return merged as T
}

/**
 * Fetch translations for multiple records at once (batch — one query for all records).
 * Much more efficient than calling applyTranslation in a loop.
 */
export async function applyTranslations<T extends Record<string, any>>(
  tableName: string,
  records: T[],
  fields: string[],
  locale: string
): Promise<T[]> {
  if (locale === 'en' || !records.length) return records

  const recordIds = records.map(r => r.id)

  const { data } = await supabase
    .from('translations')
    .select('record_id, field, translated_text')
    .eq('table_name', tableName)
    .eq('locale', locale)
    .in('record_id', recordIds)
    .in('field', fields)

  if (!data || data.length === 0) return records

  // Group translations by record_id for fast lookup
  const translationMap = new Map<string, Record<string, any>>()
  data.forEach(({ record_id, field, translated_text }) => {
    if (!translationMap.has(record_id)) translationMap.set(record_id, {})
    translationMap.get(record_id)![field] = parseTranslatedValue(translated_text)
  })

  return records.map(record => {
    const translations = translationMap.get(record.id)
    if (!translations) return record
    return { ...record, ...translations }
  })
}

/**
 * Fetch translations for related sub-records (e.g. tour_itinerary, tour_faqs).
 * Identical to applyTranslations — named separately for readability at call sites.
 */
export async function applySubRecordTranslations<T extends Record<string, any>>(
  records: T[],
  tableName: string,
  fields: string[],
  locale: string
): Promise<T[]> {
  if (locale === 'en' || !records.length) return records
  return applyTranslations(tableName, records, fields, locale)
}