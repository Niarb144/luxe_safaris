// components/T.tsx
'use client'
import { useLocale } from '@/components/TranslationProvider'
import { useTranslation } from '@/components/UseTranslation'

export function T({ text }: { text: string }) {
  const { locale } = useLocale()
  const { translated } = useTranslation(text, locale)
  return <>{translated}</>
}