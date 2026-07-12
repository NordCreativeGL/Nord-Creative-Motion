import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hjemmesider folk husker | Nord Creative',
  description: 'Professionelle hjemmesider til grønlandske virksomheder. Design, udvikling, SEO og copywriting — leveret fra Qaqortoq.',
  alternates: {
    canonical: 'https://nordcreative.gl/web',
  },
}

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
