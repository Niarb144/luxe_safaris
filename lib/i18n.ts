// i18n.ts (in your project root, same level as next.config.js)
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr', 'de', 'es', 'it', 'nl', 'pl', 'zh', 'ja', 'ru', 'ar', 'pt'],
  defaultLocale: 'en'
})