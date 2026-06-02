"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CTABanner() {
  const [btnHover, setBtnHover] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const sectionRef  = useRef<HTMLElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const bodyRef     = useRef<HTMLDivElement>(null);
  const btnRef      = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, {
        opacity: 0,
        rotateY: -55,
        scale: 0.72,
        transformPerspective: 900,
      });

      gsap.set([headingRef.current, bodyRef.current, btnRef.current], {
        opacity: 0,
        y: 10,
      });

      const onScroll = () => {
        if (hasAnimated.current) return;
        const sectionTop = (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
        if (window.scrollY >= sectionTop - window.innerHeight * 0.5) {
          hasAnimated.current = true;
          gsap.to(cardRef.current, {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: 2.6,
            ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)',
          });

          const textEase = 'cubic-bezier(0.25, 0.1, 0.15, 1)';
          const textDelays = [0.8, 1.0, 1.2];
          const textRefs = [headingRef, bodyRef, btnRef];
          textRefs.forEach((ref, i) => {
            gsap.to(ref.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: textEase,
              delay: textDelays[i],
            });
          });

          window.removeEventListener('scroll', onScroll);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      data-snap="true"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        background: '#060606',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
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
            Planning a project<br />in Greenland?
          </div>
          <div ref={bodyRef} style={{ fontSize: 'clamp(1.125rem,1.15vw,1.5rem)', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', lineHeight: 1.6, textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Tell us about your project — we'll help define what's possible and how to approach it.
          </div>
          <div
            ref={btnRef}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'inline-flex',
              width: isMobile ? '100%' : 'fit-content',
              justifyContent: isMobile ? 'center' : undefined,
              padding: '13px 30px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.22)',
              background: btnHover ? '#ffffff' : 'transparent',
              color: btnHover ? '#000000' : 'rgba(255,255,255,0.88)',
              fontSize: 'clamp(15px,0.9vw,19px)',
              cursor: 'pointer',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
              transition: 'background 0.25s ease, color 0.25s ease',
            }}
          >
            Work with us
          </div>
        </div>
      </div>
    </section>
  );
}
