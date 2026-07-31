'use client'
import { useEffect, useRef, useState } from 'react'
import { usePricingModal } from '@/contexts/PricingModalContext'
import { useLang } from '@/contexts/LanguageContext'

export default function PricingModal() {
  const { isPricingModalOpen, closePricingModal } = usePricingModal()
  const { lang } = useLang()
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<'photoVideo' | 'web'>('photoVideo')
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const t = {
    en: {
      eyebrow: 'PRICING',
      title: 'Pricing',
      subtitle: 'Indicative pricing — the final quote depends on your project.',
      close: 'Close',
      tabs: { photoVideo: 'Photo & Video', web: 'Website & App' },
      photoVideo: {
        photoLabel: 'PHOTOGRAPHY',
        photoTiers: [
          { name: 'Essential', desc: '10-40 edited photos', price: 'from 3,500 DKK' },
          { name: 'Extended', desc: '50-60 edited photos', price: 'from 6,500 DKK' },
        ],
        videoLabel: 'VIDEO',
        videoTiers: [
          { name: 'Social', desc: '3-5 short clips for social media', price: 'from 8,000 DKK' },
          { name: 'Brand', desc: 'Main film plus short clips, audio and color grading', price: 'from 15,000 DKK' },
          { name: 'Signature', desc: 'Cinematic film, interviews, advanced color and sound design', price: 'from 38,000 DKK' },
        ],
      },
      web: {
        tiers: [
          { name: 'Starter', price: 'from 12,000 DKK', features: ['Professional design', 'Up to 2 pages', 'Contact form', 'Mobile-optimized', '2 rounds of revisions', 'Text & content'] },
          { name: 'Business', price: 'from 22,000 DKK', features: ['Everything in Starter', 'Up to 5 pages', 'SEO setup', 'Bilingual (2 languages)', 'Support', '5 rounds of revisions'] },
          { name: 'Full Production', price: 'from 35,000 DKK', features: ['Everything in Business', 'Up to 8 pages', 'Advanced animations', 'Effects', 'Multilingual (3+ languages)', 'Advanced analytics', 'Priority support', '10 rounds of revisions'] },
        ],
      },
    },
    da: {
      eyebrow: 'PRISER',
      title: 'Priser',
      subtitle: 'Vejledende priser — det endelige tilbud afhænger af opgaven.',
      close: 'Luk',
      tabs: { photoVideo: 'Foto & Video', web: 'Website & App' },
      photoVideo: {
        photoLabel: 'FOTOGRAFERING',
        photoTiers: [
          { name: 'Basis', desc: '10-40 redigerede billeder', price: 'fra 3.500 kr.' },
          { name: 'Udvidet', desc: '50-60 redigerede billeder', price: 'fra 6.500 kr.' },
        ],
        videoLabel: 'VIDEO',
        videoTiers: [
          { name: 'Social', desc: '3-5 korte klip til SoMe', price: 'fra 8.000 kr.' },
          { name: 'Brand', desc: 'Hovedfilm og korte klip, lyd og farvekorrektion', price: 'fra 15.000 kr.' },
          { name: 'Signature', desc: 'Cinematisk film, interviews, avanceret farve/lyddesign', price: 'fra 38.000 kr.' },
        ],
      },
      web: {
        tiers: [
          { name: 'Starter', price: 'fra 12.000 kr.', features: ['Professionelt design', 'Op til 2 sider', 'Kontaktformular', 'Mobiloptimeret', '2 revisionsrunder', 'Tekst & indhold'] },
          { name: 'Business', price: 'fra 22.000 kr.', features: ['Alt i Starter', 'Op til 5 sider', 'SEO-opsætning', 'Flersproget (2 sprog)', 'Support', '5 revisionsrunder'] },
          { name: 'Full Production', price: 'fra 35.000 kr.', features: ['Alt i Business', 'Op til 8 sider', 'Avancerede animationer', 'Effekter', 'Flersproget (3+ sprog)', 'Avanceret statistik', 'Prioriteret support', '10 revisionsrunder'] },
        ],
      },
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
    fontSize: '20px',
    letterSpacing: '.14em',
    fontWeight: 300,
    fontFamily: 'var(--font-geist-sans), sans-serif',
    color: '#eef2f4',
    textTransform: 'uppercase',
  }
  const tierNameStyle: React.CSSProperties = {
    margin: isMobile ? '8px 0 0' : '10px 0 0',
    fontSize: '17px',
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
  const descStyle: React.CSSProperties = {
    margin: isMobile ? '6px 0 0' : '8px 0 0',
    fontSize: '14px',
    lineHeight: 1.45,
    fontWeight: 300,
    fontFamily: 'var(--font-geist-sans), sans-serif',
    color: 'rgba(238,242,244,.5)',
  }
  const compactPriceStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '14px',
    fontWeight: 300,
    fontFamily: 'var(--font-geist-sans), sans-serif',
    color: 'rgba(238,242,244,.7)',
    letterSpacing: '-0.01em',
  }
  const pillButtonStyle = (active: boolean): React.CSSProperties => ({
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: active ? '#ffffff' : 'transparent',
    color: active ? '#000000' : '#ffffff',
    fontFamily: 'var(--font-geist-sans), sans-serif',
    fontSize: isMobile ? '13px' : 'clamp(13px, 0.85vw, 15px)',
    fontWeight: 300,
    padding: isMobile ? '8px 16px' : '10px 20px',
    cursor: 'pointer',
    transition: 'background 0.2s ease, color 0.2s ease',
  })

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

        <h2 style={{
          fontSize: isMobile ? '22px' : 'clamp(28px, 2.78vw, 68px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: isMobile ? '8px' : '10px',
          fontFamily: 'var(--font-geist-sans), sans-serif',
        }}>
          {t[lang].title}
        </h2>

        <p style={{
          margin: 0,
          marginBottom: isMobile ? '24px' : '36px',
          fontSize: '15px',
          lineHeight: 1.45,
          fontWeight: 300,
          fontFamily: 'var(--font-geist-sans), sans-serif',
          color: 'rgba(238,242,244,.5)',
        }}>
          {t[lang].subtitle}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: isMobile ? '24px' : '36px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            width: '100%',
            maxWidth: 460,
            height: 56,
            border: '1px solid rgba(255,255,255,.9)',
            borderRadius: 8,
            padding: 4,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14)',
          }}>
            <div style={{
              position: 'absolute',
              top: 4,
              left: 4,
              width: 'calc(50% - 4px)',
              height: 'calc(100% - 8px)',
              background: '#ffffff',
              borderRadius: 6,
              transition: 'transform 0.35s cubic-bezier(0.25, 0.1, 0.15, 1)',
              transform: activeTab === 'photoVideo' ? 'translateX(0%)' : 'translateX(100%)',
            }} />
            <button
              onClick={() => setActiveTab('photoVideo')}
              style={{
                flex: 1,
                position: 'relative',
                zIndex: 2,
                background: 'transparent',
                border: 'none',
                fontSize: isMobile ? '13px' : 'clamp(13px, 0.85vw, 15px)',
                fontWeight: 300,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                color: activeTab === 'photoVideo' ? '#000' : '#fff',
              }}
            >
              {t[lang].tabs.photoVideo}
            </button>
            <button
              onClick={() => setActiveTab('web')}
              style={{
                flex: 1,
                position: 'relative',
                zIndex: 2,
                background: 'transparent',
                border: 'none',
                fontSize: isMobile ? '13px' : 'clamp(13px, 0.85vw, 15px)',
                fontWeight: 300,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                color: activeTab === 'web' ? '#000' : '#fff',
              }}
            >
              {t[lang].tabs.web}
            </button>
          </div>
        </div>

        {activeTab === 'photoVideo' ? (
          <div>
            <p style={tierLabelStyle}>{t[lang].photoVideo.photoLabel}</p>
            {t[lang].photoVideo.photoTiers.map((tier) => (
              <div key={tier.name}>
                <h3 style={{ ...tierNameStyle, marginTop: isMobile ? '14px' : '18px' }}>{tier.name}</h3>
                <p style={descStyle}>{tier.desc}</p>
                <p style={{ ...descStyle, color: '#ffffff' }}>{tier.price}</p>
              </div>
            ))}

            <div style={dividerStyle} />

            <p style={tierLabelStyle}>{t[lang].photoVideo.videoLabel}</p>
            {t[lang].photoVideo.videoTiers.map((tier) => (
              <div key={tier.name}>
                <h3 style={{ ...tierNameStyle, marginTop: isMobile ? '14px' : '18px' }}>{tier.name}</h3>
                <p style={descStyle}>{tier.desc}</p>
                <p style={{ ...descStyle, color: '#ffffff' }}>{tier.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {t[lang].web.tiers.map((tier, i) => (
              <div key={tier.name}>
                {i > 0 && <div style={dividerStyle} />}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: isMobile ? '10px 0' : '14px 0',
                }}>
                  <h3 style={tierLabelStyle}>{tier.name}</h3>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  columnGap: '16px',
                  rowGap: '4px',
                  margin: isMobile ? '6px 0 0' : '8px 0 0',
                }}>
                  {tier.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(238,242,244,.5)', flexShrink: 0 }} />
                      <span style={{ ...descStyle, margin: 0 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <p style={{ ...compactPriceStyle, color: '#ffffff', marginTop: isMobile ? '10px' : '14px' }}>{tier.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
