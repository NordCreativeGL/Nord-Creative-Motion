import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Om Nord Creative',
  description: 'Vi er Nord Creative — foto, video og droneproduktion fra Qaqortoq, Sydgrønland. Lokal ekspertise, direkte kontakt.',
  alternates: {
    canonical: 'https://nordcreative.gl/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
