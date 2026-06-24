'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
type Lang = 'en' | 'da'
const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'da', setLang: () => {} })
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('da')
  useEffect(() => {
    const saved = localStorage.getItem('nc-lang') as Lang
    if (saved === 'en' || saved === 'da') setLang(saved)
  }, [])
  const handleSetLang = (l: Lang) => { setLang(l); localStorage.setItem('nc-lang', l) }
  return <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>{children}</LanguageContext.Provider>
}
export const useLang = () => useContext(LanguageContext)
