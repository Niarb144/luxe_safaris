/**
 * lib/translations.ts
 * Utility to fetch translations from the universal translations table.
 * Used in server components — call alongside your existing Supabase fetches.
 */

import { supabase } from '@/lib/supabase'

/**
 * Fetch translations for a single record and merge them into the record.
 * Falls back to original English values if no translation exists.
 *
 * @example
 * const tour = await applyTranslation('tours', tourData, ['title', 'description'], locale)
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
    .in('field', fields as string[])

  if (!data || data.length === 0) return record

  const merged = { ...record }
  data.forEach(({ field, translated_text }) => {
    if (translated_text) {
      (merged as any)[field] = translated_text
    }
  })

  return merged
}

/**
 * Fetch translations for multiple records at once (batch — one query for all records).
 * Much more efficient than calling applyTranslation in a loop.
 *
 * @example
 * const translatedTours = await applyTranslations('tours', tours, ['title', 'description'], locale)
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
    .in('field', fields as string[])

  if (!data || data.length === 0) return records

  // Group translations by record_id for fast lookup
  const translationMap = new Map<string, Record<string, string>>()
  data.forEach(({ record_id, field, translated_text }) => {
    if (!translationMap.has(record_id)) translationMap.set(record_id, {})
    translationMap.get(record_id)![field] = translated_text
  })

  // Merge translations into each record
  return records.map(record => {
    const translations = translationMap.get(record.id)
    if (!translations) return record
    return { ...record, ...translations }
  })
}

/**
 * Fetch translations for related sub-records (e.g. tour_itinerary, tour_faqs).
 * Pass the parent records array and the sub-record key to translate.
 *
 * @example
 * const tour = await applySubRecordTranslations(tour, 'tour_itinerary', 'tour_itinerary', ['title', 'description'], locale)
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