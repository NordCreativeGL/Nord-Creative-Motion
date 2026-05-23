"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CTABanner() {
  const sectionRef  = useRef<HTMLElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const labelRef    = useRef<HTMLDivElement>(null);
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

      gsap.set([labelRef.current, headingRef.current, bodyRef.current, btnRef.current], {
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
          const textDelays = [1.3, 1.5, 1.7, 1.9];
          const textRefs = [labelRef, headingRef, bodyRef, btnRef];
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
          width: '70vw',
          aspectRatio: '3/2',
          borderRadius: 22,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.10), 0 20px 120px rgba(0,0,0,0.95), 0 0 140px rgba(0,0,0,0.8)',
        }}
      >
        <video
          autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P69%20N.mp4"
        />
        <svg
          viewBox="0 0 18 12"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <path
            fill="rgba(0,0,0,0.85)"
            d="m0,6h18v6H0zm3,0a4,4 0 0,0 8,0a4,4 0 0,0-8,0"
          />
        </svg>
        <div style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '39%',
          height: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 2rem 1.5rem 1rem',
        }}>
          <div ref={labelRef} style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', marginBottom: '0.6rem', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            NÆSTE SKRIDT
          </div>
          <div ref={headingRef} style={{ fontSize: 'clamp(14px,1.8vw,22px)', fontWeight: 300, color: '#fff', lineHeight: 1.2, marginBottom: '0.5rem', textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
            Planning a project<br />in Greenland?
          </div>
          <div ref={bodyRef} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', lineHeight: 1.6, textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Tell us about your project — we'll help<br />define what's possible.
          </div>
          <div ref={btnRef} style={{ display: 'inline-flex', width: 'fit-content', padding: '9px 22px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.88)', fontSize: '11px', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}>
            Work with us
          </div>
        </div>
      </div>
    </section>
  );
}
