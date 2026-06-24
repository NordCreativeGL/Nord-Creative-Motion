'use client'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ContactModalProvider } from '@/contexts/ContactModalContext'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ContactModalProvider>{children}</ContactModalProvider>
    </LanguageProvider>
  )
}
