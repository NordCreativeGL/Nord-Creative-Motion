'use client';

import { useEffect } from 'react';

export default function ScrollExpandHero() {
  useEffect(() => {
    document.body.style.overflow = '';
    (window as any).__snapLock = false;
    window.dispatchEvent(new Event('heroExpanded'));
    return () => {
      document.body.style.overflow = '';
      (window as any).__snapLock = false;
    };
  }, []);

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
        src="https://cdn.nordcreative.dk/P1%20HEADER.mp4"
        autoPlay muted loop playsInline preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

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
          <p style={{ fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>GREENLAND</p>
          <h1 style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'white', marginBottom: '20px', maxWidth: '800px' }}>Video production in Greenland</h1>
          <p style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', maxWidth: '560px' }}>Video and photography production across Greenland's diverse landscapes and environments.</p>
        </div>
      </div>
    </section>
  );
}
