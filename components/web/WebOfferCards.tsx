'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'

export default function WebOfferCards() {
  const { lang } = useLang()
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const t = {
    en: {
      l1: 'WEBSITE DESIGN', l2: 'COPYWRITING', l3: 'SEO',
      d1: 'Designed from scratch. No templates.', d2: 'Written for your brand and your audience.', d3: 'Found where it matters.',
      l4: 'PHOTO & VIDEO', d4: 'Content from our own productions.',
      l5: 'DEVELOPMENT', d5: 'Custom code. Fast and stable.',
      l6: 'MAINTENANCE', d6: 'We keep it running.',
    },
    da: {
      l1: 'HJEMMESIDE DESIGN', l2: 'TEKST & INDHOLD', l3: 'SEO',
      d1: 'Designet fra bunden. Ingen skabeloner.', d2: 'Ord der arbejder for din virksomhed.', d3: 'Synlig, der hvor det gælder.',
      l4: 'FOTO & VIDEO', d4: 'Indhold fra vores egne produktioner.',
      l5: 'UDVIKLING', d5: 'Skræddersyet kode. Hurtig og stabil.',
      l6: 'VEDLIGEHOLDELSE', d6: 'Vi sørger for at det kører.',
    }
  }

  const cardStyle: React.CSSProperties = { position: 'relative', borderRadius: 14, overflow: 'hidden', padding: isMobile ? '10px 12px 12px' : '36px 32px 40px', background: 'radial-gradient(130% 90% at 18% -10%, rgba(186,238,230,.16), transparent 52%), linear-gradient(180deg, rgba(255,255,255,.045), rgba(10,32,36,.35))', border: '1px solid rgba(255,255,255,.1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14)', transition: 'all .45s ease' }
  const wellStyle: React.CSSProperties = { width: isMobile ? 32 : 64, height: isMobile ? 32 : 64, borderRadius: isMobile ? 8 : 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 40% 35%, rgba(186,238,230,.18), rgba(10,40,42,.5))', boxShadow: 'inset 0 0 18px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.18)' }
  const titleStyle: React.CSSProperties = { margin: isMobile ? '8px 0 0' : '26px 0 0', fontSize: isMobile ? 10 : 13, letterSpacing: '.14em', fontWeight: 300, fontFamily: "var(--font-geist-sans), sans-serif", color: '#eef2f4' }
  const descStyle: React.CSSProperties = { display: isMobile ? 'none' : 'block', margin: isMobile ? '6px 0 0' : '12px 0 0', fontSize: isMobile ? 11 : 14, lineHeight: 1.45, fontFamily: "var(--font-geist-sans), sans-serif", color: 'rgba(238,242,244,.5)' }

  const onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(143,227,216,.5)'
    ;(e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.2), 0 0 44px rgba(143,227,216,.16)'
  }
  const onMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.1)'
    ;(e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.14)'
  }

  return (
    <div style={{
      position: 'relative',
      background: 'transparent',
      padding: '0 0 24px 0',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: isMobile ? '8px' : '26px',
      }}>

        {/* WEBSITE DESIGN */}
        <article style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div style={wellStyle}>
            <svg width="38" height="38" viewBox="0 0 48 48"><polygon points="14,8 24,9.5 23,38.5 12,37" fill="#e6f4f3"/><polygon points="24,9.5 34,11 36,40 23,38.5" fill="#8fc9c4"/><path d="M14,8 L34,11 L36,40 L12,37 Z M24,9.5 L23,38.5" fill="none" stroke="rgba(228,246,243,.6)" strokeWidth=".7" strokeLinejoin="round"/></svg>
          </div>
          <h3 style={titleStyle}>{t[lang].l1}</h3>
          <p style={descStyle}>{t[lang].d1}</p>
        </article>

        {/* COPYWRITING */}
        <article style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div style={wellStyle}>
            <svg width="38" height="38" viewBox="0 0 48 48"><polygon points="24,6 24,42 22,42 18,22" fill="#e6f4f3"/><polygon points="24,6 30,22 26,42 24,42" fill="#8fc9c4"/><path d="M24,6 L30,22 L26,42 L22,42 L18,22 Z M24,6 L24,42" fill="none" stroke="rgba(228,246,243,.6)" strokeWidth=".7" strokeLinejoin="round"/></svg>
          </div>
          <h3 style={titleStyle}>{t[lang].l2}</h3>
          <p style={descStyle}>{t[lang].d2}</p>
        </article>

        {/* SEO */}
        <article style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div style={wellStyle}>
            <svg width="38" height="38" viewBox="0 0 48 48"><polygon points="24,7 10,16 10,32 24,41" fill="#e6f4f3"/><polygon points="24,7 38,16 38,32 24,41" fill="#356f6d"/><path d="M24,7 L38,16 L38,32 L24,41 L10,32 L10,16 Z M24,7 L24,41" fill="none" stroke="rgba(228,246,243,.6)" strokeWidth=".7" strokeLinejoin="round"/></svg>
          </div>
          <h3 style={titleStyle}>{t[lang].l3}</h3>
          <p style={descStyle}>{t[lang].d3}</p>
        </article>

        {/* PHOTO & VIDEO */}
        <article style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div style={wellStyle}>
            <svg width="38" height="38" viewBox="0 0 48 48"><polygon points="24,5 8,24 24,24" fill="#e6f4f3"/><polygon points="24,5 24,24 40,24" fill="#8fc9c4"/><polygon points="8,24 24,24 24,43" fill="#8fc9c4"/><polygon points="40,24 24,24 24,43" fill="#356f6d"/><path d="M24,5 L40,24 L24,43 L8,24 Z M8,24 L40,24 M24,5 L24,43" fill="none" stroke="rgba(228,246,243,.6)" strokeWidth=".7" strokeLinejoin="round"/></svg>
          </div>
          <h3 style={titleStyle}>{t[lang].l4}</h3>
          <p style={descStyle}>{t[lang].d4}</p>
        </article>

        {/* DEVELOPMENT */}
        <article style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div style={wellStyle}>
            <svg width="38" height="38" viewBox="0 0 48 48"><polygon points="20,8 11,24 24,24" fill="#e6f4f3"/><polygon points="11,24 20,40 24,24" fill="#8fc9c4"/><polygon points="28,8 37,24 28,40 24,24" fill="#356f6d"/><path d="M20,8 L11,24 L24,24 Z M28,8 L37,24 L28,40 L24,24 Z" fill="none" stroke="rgba(228,246,243,.6)" strokeWidth=".7" strokeLinejoin="round"/></svg>
          </div>
          <h3 style={titleStyle}>{t[lang].l5}</h3>
          <p style={descStyle}>{t[lang].d5}</p>
        </article>

        {/* MAINTENANCE */}
        <article style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div style={wellStyle}>
            <svg width="38" height="38" viewBox="0 0 48 48"><polygon points="10,16 24,7 38,16 31,19.5 24,15 17,19.5" fill="#e6f4f3"/><path d="M24,7 L38,16 L38,32 L24,41 L10,32 L10,16 Z M24,15 L17,19.5 L17,28.5 L24,33 L31,28.5 L31,19.5 Z" fill="#8fc9c4" fillRule="evenodd"/><polygon points="10,32 24,41 38,32 31,28.5 24,33 17,28.5" fill="#356f6d"/><path d="M24,7 L38,16 L38,32 L24,41 L10,32 L10,16 Z M24,15 L31,19.5 L31,28.5 L24,33 L17,28.5 L17,19.5 Z" fill="none" stroke="rgba(228,246,243,.6)" strokeWidth=".7" strokeLinejoin="round"/></svg>
          </div>
          <h3 style={titleStyle}>{t[lang].l6}</h3>
          <p style={descStyle}>{t[lang].d6}</p>
        </article>

      </div>
    </div>
  )
}
