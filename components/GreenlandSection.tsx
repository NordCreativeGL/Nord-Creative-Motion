"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function GreenlandSection() {
  const [btnHover, setBtnHover] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const line3Ref   = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);
  const linkRef    = useRef<HTMLAnchorElement>(null);
  const video1Ref  = useRef<HTMLDivElement>(null);
  const video2Ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(labelRef.current,  { opacity: 0, rotateY: 360,  x: -60 });
      gsap.set(line1Ref.current,  { opacity: 0, rotateY: -360, x: 80  });
      gsap.set(line2Ref.current,  { opacity: 0, rotateY: 360,  y: 30  });
      gsap.set(line3Ref.current,  { opacity: 0, rotateY: -360, x: -40 });
      gsap.set(bodyRef.current,   { opacity: 0, y: 14 });
      gsap.set(linkRef.current,   { opacity: 0 });
      gsap.set(video1Ref.current, { opacity: 0, rotateY: -90, x: 0, transformOrigin: 'center center' });
      gsap.set(video2Ref.current, { opacity: 0, rotateY:  90, x: 0, transformOrigin: 'center center' });

      const tl = gsap.timeline({ paused: true });

      tl.to(labelRef.current,  { opacity: 1, rotateY: 0, x: 0, duration: 1.3, ease: 'power2.inOut' }, 0.10)
        .to(line1Ref.current,  { opacity: 1, rotateY: 0, x: 0, duration: 1.3, ease: 'power2.inOut' }, 0.40)
        .to(line2Ref.current,  { opacity: 1, rotateY: 0, y: 0, duration: 1.3, ease: 'power2.inOut' }, 0.70)
        .to(line3Ref.current,  { opacity: 1, rotateY: 0, x: 0, duration: 1.3, ease: 'power2.inOut' }, 1.00)
        .to(bodyRef.current,   { opacity: 1, y: 0,       duration: 0.9, ease: 'power2.inOut' }, 1.50)
        .to(linkRef.current,   { opacity: 1,             duration: 0.8, ease: 'power2.inOut' }, 1.80)
        .to(video1Ref.current, { opacity: 1, rotateY: 0, x: 0, duration: 1.4, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' }, 0.80)
        .to(video2Ref.current, { opacity: 1, rotateY: 0, x: 0, duration: 1.4, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' }, 1.60);

      const hasAnimated = { current: false };

      const onScroll = () => {
        if (hasAnimated.current) return;
        const sectionTop = (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
        if (window.scrollY >= sectionTop - window.innerHeight * 1.2) {
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
      id="greenland"
      data-snap="true"
      ref={sectionRef}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative',
        background: 'black',
        overflow: 'hidden',
      }}
    >
        {/* Left: text column */}
        <div
          style={{
            width: '46%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: 'clamp(180px, 18vw, 260px)',
            perspective: '900px',
          }}
        >
          <div ref={labelRef} style={{ fontSize: '0.875rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 24 }}>
            Greenland
          </div>

          <div style={{ marginBottom: 24 }}>
            <div ref={line1Ref} style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25 }}>
              Visual work made
            </div>
            <div ref={line2Ref} style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25 }}>
              for atmosphere,
            </div>
            <div ref={line3Ref} style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25 }}>
              trust and attention
            </div>
          </div>

          <div ref={bodyRef} style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.625, marginBottom: 28 }}>
            Commercial visuals and Arctic environments, created for companies and brands in Greenland.
          </div>

          <Link
            ref={linkRef}
            href="/greenland"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-start',
              width: 'fit-content',
              marginTop: '1.2rem',
              padding: '14px 36px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: btnHover ? '#ffffff' : 'transparent',
              color: btnHover ? '#000000' : 'rgba(255,255,255,0.85)',
              fontSize: '15px',
              fontWeight: 400,
              letterSpacing: '0.01em',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.25s ease, color 0.25s ease',
            }}
          >
            Explore our work in Greenland
          </Link>
        </div>

        <div style={{
          width: '54%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '2.5rem 2rem 2.5rem 1rem',
          gap: '0.75rem',
        }}>
          <div ref={video1Ref} style={{
            position: 'relative',
            flex: 1,
            width: '100%',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <video
              src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P18K.mp4"
              preload="none"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
          </div>

          <div ref={video2Ref} style={{
            position: 'relative',
            flex: 1,
            width: '100%',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <video
              src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P21.mp4"
              preload="none"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
          </div>
        </div>
    </div>
  );
}
