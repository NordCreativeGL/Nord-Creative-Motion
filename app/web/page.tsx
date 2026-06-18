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
      g.addColorStop(1, '#06182a')
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
      eyebrow: 'WHAT WE OFFER', heading: 'A website — Or everything it needs',
      d1: 'Designed from scratch. No templates.', d2: 'Words that match the visual.', d3: 'Found where it matters.',
      l4: 'PHOTO & VIDEO', d4: 'Content from our own productions.',
      l5: 'DEVELOPMENT', d5: 'Custom code. Fast and stable.',
      l6: 'MAINTENANCE', d6: 'We keep it running.',
      lb1: 'We build websites as a standalone service — designed, developed, and launched. Photography, drone footage, and video are not required.',
      lb2: 'But if you need content to go with it, we produce that too. One team, one brief, one result.',
      rh: 'Already working with us on content?', rb: 'Adding a website to an existing production is seamless — the visual direction is already set.',
    },
    da: {
      eyebrow: 'HVAD VI TILBYDER', heading: 'Et website — eller alt det, det kræver',
      d1: 'Designet fra bunden. Ingen skabeloner.', d2: 'Ord der matcher det visuelle.', d3: 'Fundet, der hvor det gælder.',
      l4: 'FOTO & VIDEO', d4: 'Indhold fra vores egne produktioner.',
      l5: 'UDVIKLING', d5: 'Egentilpasset kode. Hurtig og stabil.',
      l6: 'VEDLIGEHOLDELSE', d6: 'Vi sørger for at det kører.',
      lb1: 'Vi bygger websites som en selvstændig ydelse — designet, udviklet og lanceret. Fotografering, dronefilm og video er ikke påkrævet.',
      lb2: 'Men har du brug for indhold til det, producerer vi det også. Ét team, ét brief, ét resultat.',
      rh: 'Arbejder du allerede med os om indhold?', rb: 'At tilføje et website til en eksisterende produktion er gnidningsfrit — den visuelle retning er allerede fastlagt.',
    }
  }

  const sectionPadding = isMobile
    ? '80px 24px'
    : 'clamp(100px, 10vw, 160px) clamp(160px, 16vw, 220px)'

  return (
    <main style={{ background: '#060606' }}>
      <SideNav items={[
        { label: 'The Offer', id: 'web-offer' },
        { label: 'Packages', id: 'web-packages' },
        { label: 'Work with us', id: 'web-cta' },
      ]} />
      <Header />

      {/* ── Section 1: Hero ── */}
      <FjordHeroScene />

      {/* ── Section 3: The Offer ── */}
      <section
        id="web-offer"
        style={{
          position: 'relative',
          isolation: 'isolate',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          background: 'transparent',
          padding: sectionPadding,
          paddingTop: isMobile ? '100px' : '120px',
        }}
      >
        <canvas
          ref={starCanvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
        <p style={{
          fontSize: 'clamp(11px, 0.7vw, 13px)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '20px',
        }}>
          {t[lang].eyebrow}
        </p>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: '40px',
        }}>
          {t[lang].heading}
        </h2>
        <WebOfferCards />
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '60px',
        }}>
          <div style={{ width: isMobile ? '100%' : '66%' }}>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '20px',
            }}>
              {t[lang].lb1}
            </p>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
            }}>
              {t[lang].lb2}
            </p>
          </div>
          <div style={{ width: isMobile ? '100%' : '33%' }}>
            <h3 style={{
              fontSize: 'clamp(20px, 1.3vw, 28px)',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: 'white',
              marginBottom: '16px',
            }}>
              {t[lang].rh}
            </h3>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
            }}>
              {t[lang].rb}
            </p>
          </div>
        </div>
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
