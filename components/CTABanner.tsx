"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CTABanner() {
  const sectionRef  = useRef<HTMLElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, {
        opacity: 0,
        rotateY: -55,
        scale: 0.72,
        transformPerspective: 900,
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
      </div>
    </section>
  );
}
