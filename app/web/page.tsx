"use client";

import { useState, useEffect } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SideNav from '@/components/SideNav'
import IcebergPackagesSection from '@/components/web/IcebergPackagesSection'
import PackIceCtaSection from '@/components/web/PackIceCtaSection'
import FjordHeroScene from './components/FjordHeroScene'
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
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          background: '#000000',
          padding: sectionPadding,
          paddingTop: isMobile ? '100px' : '120px',
        }}
      >
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '1px',
          background: '#1a1a1a',
          border: '1px solid #1a1a1a',
          marginTop: '80px',
        }}>
          {[
            {
              label: 'WEBSITE DESIGN',
              description: t[lang].d1,
              lines: ['6,9 34,9', '6,9 6,31 34,31 34,9', '6,19 34,19', '20,19 20,31'],
              dots: [[6,9],[34,9],[6,31],[34,31],[6,19],[34,19],[20,19],[20,31]]
            },
            {
              label: 'COPYWRITING',
              description: t[lang].d2,
              lines: ['10,30 30,10', '14,26 24,16', '28,8 30,10 32,12'],
              dots: [[10,30],[30,10],[14,26],[24,16],[28,8],[32,12]]
            },
            {
              label: 'SEO',
              description: t[lang].d3,
              lines: ['14,10 26,10 30,20 26,30 14,30 10,20 14,10', '27,27 34,34'],
              dots: [[14,10],[26,10],[30,20],[26,30],[14,30],[10,20],[27,27],[34,34]]
            },
            {
              label: t[lang].l4,
              description: t[lang].d4,
              lines: ['20,6 34,20 20,34 6,20 20,6', '20,6 20,20', '34,20 20,20', '20,34 20,20', '6,20 20,20'],
              dots: [[20,6],[34,20],[20,34],[6,20],[20,20]]
            },
            {
              label: t[lang].l5,
              description: t[lang].d5,
              lines: ['16,8 8,20 16,32', '24,8 32,20 24,32'],
              dots: [[16,8],[8,20],[16,32],[24,8],[32,20],[24,32]]
            },
            {
              label: t[lang].l6,
              description: t[lang].d6,
              lines: ['20,6 29,9 34,18 32,28 24,34 14,33 7,26 6,16 10,9', '10,9 14,6', '10,9 7,13'],
              dots: [[20,6],[29,9],[34,18],[32,28],[24,34],[14,33],[7,26],[6,16],[10,9]]
            }
          ].map((icon) => (
            <div key={icon.label} style={{
              background: '#000000',
              padding: '40px 32px 36px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px',
            }}>
              <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
                {icon.lines.map((pts, i) => (
                  <polyline key={i} points={pts} stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                ))}
                {icon.dots.map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="2" fill="white" />
                ))}
              </svg>
              <span style={{ fontSize: 'clamp(13px, 0.9vw, 15px)', letterSpacing: '0.1em', color: '#ffffff', fontWeight: 300, textTransform: 'uppercase' as const }}>
                {icon.label}
              </span>
              <p style={{ fontSize: 'clamp(12px, 0.75vw, 13px)', color: '#444', fontWeight: 300, lineHeight: 1.6 }}>
                {icon.description}
              </p>
            </div>
          ))}
        </div>
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
