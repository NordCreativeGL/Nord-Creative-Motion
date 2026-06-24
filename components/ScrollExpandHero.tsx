'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/contexts/LanguageContext'

export default function ScrollExpandHero() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { lang } = useLang()
  useEffect(() => {
    document.body.style.overflow = '';
    (window as any).__snapLock = false;
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('heroExpanded'))
    }, 0)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = '';
      (window as any).__snapLock = false;
    };
  }, []);

  const t = {
    en: { heading: 'Production in Greenland', sub: 'Photography and film, produced across Greenland.' },
    da: { heading: 'Produktion i Grønland', sub: 'Fotografering og film, produceret i hele Grønland.' }
  }

  return (
    <section
      id="gl-hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      <video
        src="https://cdn.nordcreative.dk/P3%202.mp4"
        autoPlay muted loop playsInline preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />

      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: 0,
          right: 0,
          opacity: 1,
        }}
      >
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <p style={{ fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>GREENLAND</p>
          <h1 style={{ fontSize: isMobile ? 'clamp(24px, 6.5vw, 34px)' : 'clamp(36px, 3.5vw, 80px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'white', marginBottom: '10px', maxWidth: '800px', whiteSpace: isMobile ? 'nowrap' : 'normal' }}>{t[lang].heading}</h1>
          <p style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', maxWidth: '560px' }}>{t[lang].sub}</p>
        </div>
      </div>
    </section>
  );
}
