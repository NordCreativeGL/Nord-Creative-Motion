"use client";

import { useState, useEffect } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SideNav from '@/components/SideNav'
import IcebergPackagesSection from '@/components/web/IcebergPackagesSection'
import PackIceCtaSection from '@/components/web/PackIceCtaSection'
import FjordHeroScene from './components/FjordHeroScene'

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
          WHAT WE OFFER
        </p>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: '40px',
        }}>
          A website — Or everything it needs
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
              description: 'Designed from scratch. No templates.',
              lines: ['6,9 34,9', '6,9 6,31 34,31 34,9', '6,19 34,19', '20,19 20,31'],
              dots: [[6,9],[34,9],[6,31],[34,31],[6,19],[34,19],[20,19],[20,31]]
            },
            {
              label: 'COPYWRITING',
              description: 'Words that match the visual.',
              lines: ['10,30 30,10', '14,26 24,16', '28,8 30,10 32,12'],
              dots: [[10,30],[30,10],[14,26],[24,16],[28,8],[32,12]]
            },
            {
              label: 'SEO',
              description: 'Found where it matters.',
              lines: ['14,10 26,10 30,20 26,30 14,30 10,20 14,10', '27,27 34,34'],
              dots: [[14,10],[26,10],[30,20],[26,30],[14,30],[10,20],[27,27],[34,34]]
            },
            {
              label: 'PHOTO & VIDEO',
              description: 'Content from our own productions.',
              lines: ['20,6 34,20 20,34 6,20 20,6', '20,6 20,20', '34,20 20,20', '20,34 20,20', '6,20 20,20'],
              dots: [[20,6],[34,20],[20,34],[6,20],[20,20]]
            },
            {
              label: 'DEVELOPMENT',
              description: 'Custom code. Fast and stable.',
              lines: ['16,8 8,20 16,32', '24,8 32,20 24,32'],
              dots: [[16,8],[8,20],[16,32],[24,8],[32,20],[24,32]]
            },
            {
              label: 'MAINTENANCE',
              description: 'We keep it running.',
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
              We build websites as a standalone service — designed, developed, and launched. Photography, drone footage, and video are not required.
            </p>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
            }}>
              But if you need content to go with it, we produce that too. One team, one brief, one result.
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
              Already working with us on content?
            </h3>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
            }}>
              Adding a website to an existing production is seamless — the visual direction is already set.
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
