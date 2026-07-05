import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BackToTop from "@/components/BackToTop";
import { Providers } from "@/components/Providers";
import ContactModal from "@/components/ContactModal";
import { Analytics } from '@vercel/analytics/react';

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Nord Creative — Mediebureau i Grønland",
  description:
    "Nord Creative er et mediebureau i Qaqortoq, Sydgrønland. Videoproduktion, fotografi, droneoptagelser og webudvikling for virksomheder i Grønland.",

  alternates: {
    canonical: "https://nordcreative.dk",
  },

  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className={`${geist.variable} antialiased`}>
      <head>
        <link rel="prefetch" href="/mtn-front.json" />
        <link rel="prefetch" href="/mtn-sea.json" />
        <link rel="prefetch" href="/mtn-fjord.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Nord Creative",
              "description": "Mediebureau i Qaqortoq, Sydgrønland. Videoproduktion, fotografi, droneoptagelser og webudvikling.",
              "url": "https://nordcreative.dk",
              "telephone": "+299245441",
              "email": "contact@nordcreative.dk",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Qaqortoq",
                "addressRegion": "Sydgrønland",
                "addressCountry": "GL"
              },
              "areaServed": "GL",
              "image": "https://nordcreative.dk/logo-icon.png"
            })
          }}
        />
      </head>
      <body className="bg-black text-white"><Providers><Header />{children}<BackToTop /><ContactModal /></Providers></body>
      <Analytics />
    </html>
  );
}
