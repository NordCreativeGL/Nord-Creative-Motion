"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLang } from '@/contexts/LanguageContext'

export default function CTABanner() {
  const [btnHover, setBtnHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false)
  const { lang } = useLang()
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const sectionRef  = useRef<HTMLElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const coverRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const bodyRef     = useRef<HTMLDivElement>(null);
  const btnRef      = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let tl: gsap.core.Timeline

    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, {
        rotateY: -55,
        scale: 0.72,
        transformPerspective: 900,
      });

      gsap.set(coverRef.current, { opacity: 1 });

      gsap.set([headingRef.current, bodyRef.current, btnRef.current], {
        opacity: 0,
        y: 10,
      });

      tl = gsap.timeline({ paused: true })
        .to(cardRef.current, { rotateY: 0, scale: 1, duration: 2.6, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' })
        .to(coverRef.current, { opacity: 0, duration: 2.6, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' }, 0)
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' }, 0.8)
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' }, 1.0)
        .to(btnRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' }, 1.2)
    }, sectionRef);

    const onScroll = () => {
      const el = sectionRef.current
      if (!el || !tl) return
      const sectionTop = el.getBoundingClientRect().top + window.scrollY
      const startScrollY = sectionTop - window.innerHeight
      const totalRange = el.offsetHeight
      if (totalRange <= 0) return
      const raw = (window.scrollY - startScrollY) / totalRange
      tl.progress(Math.max(0, Math.min(1, raw)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      ctx.revert()
      window.removeEventListener('scroll', onScroll)
    }
  }, []);

  const t = {
    en: { heading: 'Planning a project in Greenland?', body: "Tell us about your project — we'll come back with a plan." },
    da: { heading: 'Planlægger du et projekt i Grønland?', body: 'Fortæl os om dit projekt — vi vender tilbage med en plan.' }
  }

  return (
    <section
      id="cta"
      data-snap="true"
      ref={sectionRef}
      style={{ height: isMobile ? '200dvh' : '200vh' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: isMobile ? '100dvh' : '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: isMobile ? '0px' : '48px 0px',
        }}
      >
      <div
        ref={cardRef}
        style={{
          width: isMobile ? '90vw' : '70vw',
          aspectRatio: isMobile ? '9/16' : '3/2',
          borderRadius: 22,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#060606',
          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.10), 0 20px 120px rgba(0,0,0,0.95), 0 0 140px rgba(0,0,0,0.8)',
        }}
      >
        <video
          preload="none"
          autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          src="https://cdn.nordcreative.dk/P69%20N.mp4"
        />
        <svg
          viewBox="0 0 18 12"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: isMobile ? 'none' : 'block' }}
        >
          <path
            fill="rgba(0,0,0,0.85)"
            d="m0,6h18v6H0zm3,0a4,4 0 0,0 8,0a4,4 0 0,0-8,0"
          />
        </svg>
        <div style={{
          position: 'absolute',
          right: isMobile ? undefined : 0,
          bottom: isMobile ? 0 : '3%',
          left: isMobile ? 0 : undefined,
          width: isMobile ? '100%' : '39%',
          height: isMobile ? 'auto' : '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'flex-end' : 'center',
          padding: isMobile ? '48px 24px 32px 24px' : '0 2rem 1.5rem 1rem',
          background: isMobile ? 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)' : undefined,
        }}>
          <div ref={headingRef} style={{ fontSize: 'clamp(28px,2.78vw,68px)', fontWeight: 300, color: '#fff', lineHeight: 1.2, marginBottom: '0.5rem', textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
            {t[lang].heading}
          </div>
          <div ref={bodyRef} style={{ fontSize: 'clamp(1.125rem,1.15vw,1.5rem)', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', lineHeight: 1.6, textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            {t[lang].body}
          </div>
          <div
            ref={btnRef}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'inline-flex',
              width: isMobile ? '100%' : 'fit-content',
              justifyContent: isMobile ? 'center' : undefined,
              padding: '16px 40px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.22)',
              background: btnHover ? '#ffffff' : 'transparent',
              color: btnHover ? '#000000' : 'rgba(255,255,255,0.88)',
              fontSize: 16,
              cursor: 'pointer',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
              transition: 'background 0.25s ease, color 0.25s ease',
            }}
          >
            Work with us
          </div>
        </div>
        <div
          ref={coverRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#060606',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />
      </div>
      </div>
    </section>
  );
}
