'use client'
import { useEffect, useRef, useState } from 'react'
import { usePricingModal } from '@/contexts/PricingModalContext'
import { useLang } from '@/contexts/LanguageContext'

export default function PricingModal() {
  const { isPricingModalOpen, closePricingModal } = usePricingModal()
  const { lang } = useLang()
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const t = {
    en: {
      eyebrow: 'PACKAGES',
      title: 'Three ways to work with us',
      close: 'Close',
      tiers: [
        {
          tierLabel: 'TIER I', name: 'Starter', price: 'from 12,000 DKK',
          features: ['Professional design', 'Up to 2 pages', 'Contact form', 'Mobile-optimized', '2 rounds of revisions', 'Text & content'],
        },
        {
          tierLabel: 'TIER II', name: 'Business', price: 'from 22,000 DKK',
          features: ['Everything in Starter', 'Up to 5 pages', 'SEO setup', 'Bilingual (2 languages)', 'Support', '5 rounds of revisions'],
        },
        {
          tierLabel: 'TIER III', name: 'Full Production', price: 'from 35,000 DKK',
          features: ['Everything in Business', 'Up to 8 pages', 'Advanced animations', 'Effects', 'Multilingual (3+ languages)', 'Advanced analytics', 'Priority support', '10 rounds of revisions'],
        },
      ],
    },
    da: {
      eyebrow: 'PAKKER',
      title: 'Tre måder at arbejde med os',
      close: 'Luk',
      tiers: [
        {
          tierLabel: 'TIER I', name: 'Starter', price: 'fra 12.000 kr.',
          features: ['Professionelt design', 'Op til 2 sider', 'Kontaktformular', 'Mobiloptimeret', '2 revisionsrunder', 'Tekst & indhold'],
        },
        {
          tierLabel: 'TIER II', name: 'Business', price: 'fra 22.000 kr.',
          features: ['Alt i Starter', 'Op til 5 sider', 'SEO-opsætning', 'Flersproget (2 sprog)', 'Support', '5 revisionsrunder'],
        },
        {
          tierLabel: 'TIER III', name: 'Full Production', price: 'fra 35.000 kr.',
          features: ['Alt i Business', 'Op til 8 sider', 'Avancerede animationer', 'Effekter', 'Flersproget (3+ sprog)', 'Avanceret statistik', 'Prioriteret support', '10 revisionsrunder'],
        },
      ],
    },
  }

  useEffect(() => {
    if (isPricingModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isPricingModalOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePricingModal()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closePricingModal])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closePricingModal()
  }

  const tierLabelStyle: React.CSSProperties = {
    margin: 0,
    fontSize: isMobile ? 11 : 'clamp(12px, 0.85vw, 14px)',
    letterSpacing: '.14em',
    fontWeight: 300,
    fontFamily: 'var(--font-geist-sans), sans-serif',
    color: '#eef2f4',
    textTransform: 'uppercase',
  }
  const tierNameStyle: React.CSSProperties = {
    margin: isMobile ? '8px 0 0' : '10px 0 0',
    fontSize: 'clamp(22px, 1.8vw, 32px)',
    fontWeight: 300,
    fontFamily: 'var(--font-geist-sans), sans-serif',
    color: 'white',
    letterSpacing: '-0.01em',
  }
  const dividerStyle: React.CSSProperties = {
    width: '100%',
    height: 1,
    background: 'rgba(255,255,255,.14)',
    margin: isMobile ? '18px 0' : '28px 0',
  }
  const featureListStyle: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '10px' : '12px',
  }
  const featureItemStyle: React.CSSProperties = {
    fontSize: isMobile ? 13 : 'clamp(14px, 0.95vw, 16px)',
    lineHeight: 1.45,
    fontFamily: 'var(--font-geist-sans), sans-serif',
    color: 'rgba(238,242,244,.5)',
  }
  const priceStyle: React.CSSProperties = {
    margin: 0,
    marginTop: isMobile ? '16px' : '20px',
    fontSize: 'clamp(20px, 1.6vw, 26px)',
    fontWeight: 300,
    fontFamily: 'var(--font-geist-sans), sans-serif',
    color: 'white',
    letterSpacing: '-0.01em',
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        opacity: isPricingModalOpen ? 1 : 0,
        pointerEvents: isPricingModalOpen ? 'all' : 'none',
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: 'calc(100dvh - 48px)',
          overflowY: 'auto',
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: isMobile ? '24px' : '40px',
          position: 'relative',
          transform: isPricingModalOpen ? 'translateY(0)' : 'translateY(16px)',
          transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.15, 1)',
        }}
      >
        <button
          onClick={closePricingModal}
          aria-label={t[lang].close}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '20px',
            lineHeight: 1,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          ✕
        </button>

        <p style={{
          fontSize: 'clamp(11px, 0.7vw, 13px)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(0,215,200,0.85)',
          marginBottom: isMobile ? '10px' : '20px',
          fontFamily: 'var(--font-geist-sans), sans-serif',
        }}>
          {t[lang].eyebrow}
        </p>
        <h2 style={{
          fontSize: isMobile ? '22px' : 'clamp(28px, 2.78vw, 68px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: isMobile ? '16px' : '32px',
          fontFamily: 'var(--font-geist-sans), sans-serif',
        }}>
          {t[lang].title}
        </h2>

        {t[lang].tiers.map((tier, i) => (
          <div key={tier.name}>
            {i > 0 && <div style={dividerStyle} />}
            <p style={tierLabelStyle}>{tier.tierLabel}</p>
            <h3 style={tierNameStyle}>{tier.name}</h3>
            <ul style={{ ...featureListStyle, marginTop: isMobile ? '14px' : '18px' }}>
              {tier.features.map(f => (
                <li key={f} style={featureItemStyle}>{f}</li>
              ))}
            </ul>
            <p style={priceStyle}>{tier.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
