// components/LanguageSwitcher.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { routing } from '@/lib/i18n'
import "flag-icons/css/flag-icons.min.css";

const LANGUAGES = [
  { code: 'en', label: 'English',    flag: 'fi fi-gb fis' },
  { code: 'fr', label: 'Français',   flag: 'fi fi-fr fis' },
  { code: 'de', label: 'Deutsch',    flag: 'fi fi-de fis' },
  { code: 'es', label: 'Español',    flag: 'fi fi-es fis' },
  { code: 'it', label: 'Italiano',   flag: 'fi fi-it fis' },
  { code: 'nl', label: 'Nederlands', flag: 'fi fi-nl fis' },
  { code: 'pl', label: 'Polski',     flag: 'fi fi-pl fis' },
  { code: 'zh', label: '中文',        flag: 'fi fi-cn fis' },
  { code: 'ja', label: '日本語',      flag: 'fi fi-jp fis' },
  { code: 'ru', label: 'Русский',    flag: 'fi fi-ru fis' },
  { code: 'ar', label: 'العربية',    flag: 'fi fi-sa fis' },
  { code: 'pt', label: 'Português',  flag: 'fi fi-pt fis' },
]

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const locale = useLocale()                // current locale from next-intl
  const router = useRouter()
  const pathname = usePathname()

  const current = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0]

  function handleLocaleChange(newLocale: string) {
    // Swap the locale segment in the current path
    // e.g. /en/tours/kenya → /fr/tours/kenya
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Select language"
        aria-expanded={open}
        style={{
          fontFamily:'"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 10px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px',
          cursor: 'pointer', fontSize: '14px', color: 'inherit',
        }}

      >
        <span className = {current.flag}></span>
        
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
          style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: '160px',
          zIndex: 1000, overflow: 'hidden',
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '9px 14px',
                background: lang.code === locale ? '#f3f4f6' : 'transparent',
                border: 'none', cursor: 'pointer', fontSize: '14px',
                color: '#111', textAlign: 'left',
              }}
            >
              <span className = {lang.flag}></span>
              <span>{lang.label}</span>
              {lang.code === locale && (
                <svg style={{ marginLeft: 'auto' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}