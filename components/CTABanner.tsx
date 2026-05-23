"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, {
        opacity: 0,
        rotateY: -35,
        scale: 0.88,
        transformPerspective: 900,
      });

      const tl = gsap.timeline({ paused: true });

      tl.to(cardRef.current, {
        opacity: 1,
        rotateY: 0,
        scale: 1,
        duration: 1.6,
        ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)',
      });

      const hasAnimated = { current: false };

      const onScroll = () => {
        if (hasAnimated.current) return;
        const sectionTop = (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
        if (window.scrollY >= sectionTop - window.innerHeight * 0.5) {
          hasAnimated.current = true;
          tl.play();
          window.removeEventListener('scroll', onScroll);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
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
      }}
    >
      <div
        ref={cardRef}
        style={{
          width: 640,
          height: 427,
          borderRadius: 22,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <video
          autoPlay muted loop playsInline
          src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P1%20HEADER.mp4"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <svg
          viewBox="0 0 18 12"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <path
            fill="#2e2e2e"
            d="m0,6h18v6H0zm3,0a4,4 0 0,0 8,0a4,4 0 0,0-8,0"
          />
          <rect
            x="0.06" y="0.06" width="17.88" height="11.88"
            rx="0.72" ry="0.72" fill="none"
            stroke="#2e2e2e" strokeWidth="0.12"
          />
        </svg>
      </div>
    </div>
  );
}
