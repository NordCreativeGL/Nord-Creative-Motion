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
    en: { eyebrow: 'GREENLAND', heading: 'Production in Greenland', sub: 'Photography and film, produced across Greenland.' },
    da: { eyebrow: 'GRØNLAND', heading: 'Produktion i Grønland', sub: 'Fotografering og film, produceret i hele Grønland.' }
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
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: 1,
          padding: '0 24px',
        }}
      >
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <p style={{ fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textAlign: 'center' }}>{t[lang].eyebrow}</p>
          <h1 style={{ fontSize: isMobile ? 'clamp(20px, 6vw, 26px)' : 'clamp(36px, 3.5vw, 80px)', fontWeight: 300, letterSpacing: '.04em', textTransform: 'uppercase', color: 'white', margin: '0 auto', marginBottom: '10px', maxWidth: '800px', whiteSpace: 'normal', textAlign: 'center' }}>{t[lang].heading}</h1>
          <p style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', maxWidth: '560px', textAlign: 'center', margin: '0 auto' }}>{t[lang].sub}</p>
        </div>
      </div>
    </section>
  );
}
