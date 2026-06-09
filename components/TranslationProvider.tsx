'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TranslationContextType {
  locale: string
  setLocale: (locale: string) => void
}

const TranslationContext = createContext<TranslationContextType>({
  locale: 'en',
  setLocale: () => {},
})

export function TranslationProvider({ children }: { children: ReactNode }) {
  // Always start with 'en' on the server — localStorage is read after mount
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('preferred_locale')
    if (saved && saved !== 'en') setLocale(saved)
  }, [])

  function handleSetLocale(newLocale: string) {
    setLocale(newLocale)
    localStorage.setItem('preferred_locale', newLocale)
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useLocale = () => useContext(TranslationContext)