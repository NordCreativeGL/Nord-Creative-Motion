"use client";

import { useState, useEffect, useRef } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SideNav from '@/components/SideNav'
import IcebergPackagesSection from '@/components/web/IcebergPackagesSection'
import PackIceCtaSection from '@/components/web/PackIceCtaSection'
import FjordHeroScene from './components/FjordHeroScene'
import WebOfferCards from '@/components/web/WebOfferCards'
import { useLang } from '@/contexts/LanguageContext'

export default function WebPage() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [isStudio, setIsStudio] = useState(false)
  useEffect(() => {
    const check = () => setIsStudio(window.innerWidth >= 1900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [isMedium, setIsMedium] = useState(false)
  useEffect(() => {
    const check = () => setIsMedium(window.innerWidth >= 1024 && window.innerWidth < 1710)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const starCanvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = starCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function rng(seed: number) {
      let s = seed
      return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
    }

    function paint() {
      const dpr = window.devicePixelRatio || 1
      const w = canvas!.offsetWidth
      const h = canvas!.offsetHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const g = ctx!.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#01040a')
      g.addColorStop(0.6, '#040f1d')
      g.addColorStop(1, '#01040a')
      ctx!.fillStyle = g
      ctx!.fillRect(0, 0, w, h)
      const starRng = rng(4801)
      const nStars = Math.round((w * h) / 5200)
      for (let i = 0; i < nStars; i++) {
        const sx = starRng() * w
        const sy = Math.pow(starRng(), 1.35) * h * 0.96
        const big = starRng() < 0.12
        const rad = big ? 0.8 + starRng() * 0.7 : 0.35 + starRng() * 0.5
        const a = (big ? 0.55 : 0.28) + starRng() * 0.35
        ctx!.fillStyle = 'rgba(220,235,244,' + a.toFixed(3) + ')'
        ctx!.beginPath(); ctx!.arc(sx, sy, rad, 0, Math.PI * 2); ctx!.fill()
        if (big && starRng() < 0.5) {
          ctx!.fillStyle = 'rgba(180,222,238,' + (a * 0.4).toFixed(3) + ')'
          ctx!.beginPath(); ctx!.arc(sx, sy, rad * 2.4, 0, Math.PI * 2); ctx!.fill()
        }
      }
    }

    paint()
    window.addEventListener('resize', paint)
    return () => window.removeEventListener('resize', paint)
  }, [])

  const { lang } = useLang()

  const t = {
    en: {
      eyebrow: 'WHAT WE OFFER', heading: 'A website — and everything it needs',
      d1: 'Designed from scratch. No templates.', d2: 'Words that match the visual.', d3: 'Found where it matters.',
      l4: 'PHOTO & VIDEO', d4: 'Content from our own productions.',
      l5: 'DEVELOPMENT', d5: 'Custom code. Fast and stable.',
      l6: 'MAINTENANCE', d6: 'We keep it running.',
      lb1: 'We build websites as a standalone service — designed from scratch, built on clean code, and launched ready to use.',
      lb2: 'Need photo and video content for your site? We handle that too. One team, one brief, one result.',
      rh: 'Already working with us on content?', rb: 'Adding a website to an existing production is seamless — the visual direction is already set.',
      nav1: 'What We Offer', nav2: 'Packages', nav3: 'Work with us',
    },
    da: {
      eyebrow: 'HVAD VI TILBYDER', heading: 'En hjemmeside — og alt der hører til',
      d1: 'Designet fra bunden. Ingen skabeloner.', d2: 'Ord der matcher det visuelle.', d3: 'Fundet, der hvor det gælder.',
      l4: 'FOTO & VIDEO', d4: 'Indhold fra vores egne produktioner.',
      l5: 'UDVIKLING', d5: 'Egentilpasset kode. Hurtig og stabil.',
      l6: 'VEDLIGEHOLDELSE', d6: 'Vi sørger for at det kører.',
      lb1: 'Vi bygger hjemmesider som en selvstændig ydelse — designet fra bunden, udviklet i ren kode og lanceret klar til brug.',
      lb2: 'Har du brug for foto- og videoindhold til din hjemmeside? Det klarer vi også. Ét team, ét brief, ét resultat.',
      rh: 'Er du allerede i gang med en produktion hos os?', rb: 'Tilføjer du en hjemmeside til en eksisterende produktion, er den visuelle retning allerede på plads.',
      nav1: 'Hvad vi tilbyder', nav2: 'Pakker', nav3: 'Arbejd med os',
    }
  }

  const sectionPadding = isMobile
    ? '80px 24px'
    : 'clamp(100px, 10vw, 160px) clamp(160px, 16vw, 220px)'

  return (
    <main style={{ background: '#060606' }}>
      <SideNav items={[
        { label: t[lang].nav1, id: 'web-offer' },
        { label: t[lang].nav2, id: 'web-packages' },
        { label: t[lang].nav3, id: 'web-cta' },
      ]} />
      <Header />

      {/* ── Section 1: Hero ── */}
      <section id="web-offer">
      <FjordHeroScene>
        <div
          id="fj-offer-overlay"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'center',
            zIndex: 10,
            opacity: 0,
            pointerEvents: 'none',
            padding: sectionPadding,
            paddingTop: isMobile ? '72px' : '40px',
            paddingBottom: isMobile ? '32px' : isMedium ? '24px' : '80px',
            fontFamily: "var(--font-geist-sans), sans-serif",
            background: 'linear-gradient(to top, rgba(4,14,22,0.58) 0%, rgba(4,14,22,0.80) 50%, rgba(4,14,22,0) 100%)',
          }}
        >
          <p style={{
            fontSize: 'clamp(11px, 0.7vw, 13px)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(0,215,200,0.85)',
            marginBottom: isMobile ? '10px' : '20px',
          }}>
            {t[lang].eyebrow}
          </p>
          <h2 style={{
            fontSize: 'clamp(28px, 2.78vw, 68px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: isMobile ? '16px' : '40px',
          }}>
            {t[lang].heading}
          </h2>
          <WebOfferCards />
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '20px' : '60px',
            marginTop: '16px',
          }}>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
              margin: 0,
            }}>
              {t[lang].lb1}
            </p>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
              margin: 0,
            }}>
              {t[lang].lb2}
            </p>
          </div>
        </div>
      </FjordHeroScene>
      </section>

      <IcebergPackagesSection id="web-packages" />

      <PackIceCtaSection id="web-cta" />

      <Footer />
      <BackToTop />

      <style jsx global>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .url-cursor { animation: blink 1.1s step-end infinite; }
      `}</style>
    </main>
  );
}
