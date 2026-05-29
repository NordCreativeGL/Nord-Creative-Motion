'use client';

import { useEffect, useState } from 'react';

export default function ScrollExpandHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const update = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setIsExpanded(false);
        e.preventDefault();
        return;
      }
      if (!isExpanded) {
        e.preventDefault();
        setScrollProgress(prev => {
          const next = Math.min(Math.max(prev + e.deltaY * 0.001, 0), 1);
          if (next >= 1) setIsExpanded(true);
          return next;
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (isExpanded && dy < -20 && window.scrollY <= 5) {
        setIsExpanded(false);
        e.preventDefault();
        return;
      }
      if (!isExpanded) {
        e.preventDefault();
        setScrollProgress(prev => {
          const next = Math.min(Math.max(prev + dy * (dy < 0 ? 0.006 : 0.004), 0), 1);
          if (next >= 1) setIsExpanded(true);
          return next;
        });
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);

    const handleScroll = () => {
      if (!isExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isExpanded, touchStartY]);

  const startW = 360;
  const startH = 540;
  const cardW = vw ? startW + scrollProgress * (vw - startW) : startW;
  const cardH = vh ? startH + scrollProgress * (vh - startH) : startH;
  const borderR = Math.round(16 * (1 - scrollProgress));
  const textSpread = scrollProgress * (vw ? Math.max(180, vw * 0.35) : 180);
  const textOpacity = Math.max(0, 1 - scrollProgress * 2.5);
  const overlayOpacity = Math.max(0, 0.5 - scrollProgress * 0.5);
  const heroTextOpacity = Math.max(0, (scrollProgress - 0.85) / 0.15);

  return (
    <section
      id="gl-hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#060606',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Expanding video card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${cardW}px`,
          height: `${cardH}px`,
          borderRadius: `${borderR}px`,
          overflow: 'hidden',
          boxShadow: scrollProgress < 0.9 ? '0 24px 80px rgba(0,0,0,0.7)' : 'none',
        }}
      >
        <video
          src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P1%20HEADER.mp4"
          autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${overlayOpacity})` }} />

        {/* Hero text — fades in when fully expanded */}
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: 0,
            right: 0,
            opacity: heroTextOpacity,
          }}
        >
          <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
            <p style={{ fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>GREENLAND</p>
            <h1 style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'white', marginBottom: '20px', maxWidth: '800px' }}>Video production in Greenland</h1>
            <p style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', maxWidth: '560px' }}>Video and photography production across Greenland's diverse landscapes and environments.</p>
          </div>
        </div>
      </div>

      {/* Title lines — spread apart on scroll */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10,
          gap: '0.4rem',
        }}
      >
        <div style={{
          fontSize: 'clamp(28px, 2.78vw, 68px)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '-0.02em',
          transform: `translateX(-${textSpread}px)`,
          opacity: textOpacity,
          whiteSpace: 'nowrap',
        }}>
          Video production
        </div>
        <div style={{
          fontSize: 'clamp(28px, 2.78vw, 68px)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '-0.02em',
          transform: `translateX(${textSpread}px)`,
          opacity: textOpacity,
          whiteSpace: 'nowrap',
        }}>
          in Greenland
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute',
          bottom: '12%',
          fontSize: '12px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          opacity: Math.max(0, 1 - scrollProgress * 5),
        }}>
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
