import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produktion i Grønland — Foto & Film | Nord Creative',
  description: 'Film og fotoproduktion i Grønland. Vi kender stederne, lyset og logistikken — drone, video og foto i hele landet.',
  alternates: {
    canonical: 'https://nordcreative.gl/greenland',
  },
}

export default function GreenlandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
