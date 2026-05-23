"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function GreenlandSection() {
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
      gsap.set(video1Ref.current, { opacity: 0, rotateY: -360, x: 80,  transformOrigin: 'right center' });
      gsap.set(video2Ref.current, { opacity: 0, rotateY: 360,  x: -60, transformOrigin: 'left center'  });

      const tl = gsap.timeline({ paused: true });

      tl.to(labelRef.current,  { opacity: 1, rotateY: 0, x: 0, duration: 1.3, ease: 'power2.inOut' }, 0.10)
        .to(line1Ref.current,  { opacity: 1, rotateY: 0, x: 0, duration: 1.3, ease: 'power2.inOut' }, 0.40)
        .to(line2Ref.current,  { opacity: 1, rotateY: 0, y: 0, duration: 1.3, ease: 'power2.inOut' }, 0.70)
        .to(line3Ref.current,  { opacity: 1, rotateY: 0, x: 0, duration: 1.3, ease: 'power2.inOut' }, 1.00)
        .to(bodyRef.current,   { opacity: 1, y: 0,       duration: 0.9, ease: 'power2.inOut' }, 1.50)
        .to(linkRef.current,   { opacity: 1,             duration: 0.8, ease: 'power2.inOut' }, 1.80)
        .to(video1Ref.current, { opacity: 1, rotateY: 0, x: 0, duration: 2.2, ease: 'power2.inOut' }, 0.80)
        .to(video2Ref.current, { opacity: 1, rotateY: 0, x: 0, duration: 2.2, ease: 'power2.inOut' }, 1.60);

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
            flex: '0 0 auto',
            width: 380,
            paddingLeft: '4rem',
            perspective: '900px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div ref={labelRef} style={{ fontSize: 9, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            Greenland
          </div>

          <div style={{ marginBottom: 24 }}>
            <div ref={line1Ref} style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 300, color: 'rgba(255,255,255,0.92)', lineHeight: 1.28 }}>
              Visual work made
            </div>
            <div ref={line2Ref} style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 300, color: 'rgba(255,255,255,0.92)', lineHeight: 1.28 }}>
              for atmosphere,
            </div>
            <div ref={line3Ref} style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 300, color: 'rgba(255,255,255,0.92)', lineHeight: 1.28 }}>
              trust and attention
            </div>
          </div>

          <div ref={bodyRef} style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 28, maxWidth: 260 }}>
            Commercial visuals and Arctic environments, created for companies and brands in Greenland.
          </div>

          <Link
            ref={linkRef}
            href="/greenland"
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'underline', textUnderlineOffset: 4 }}
          >
            Explore our work in Greenland
          </Link>
        </div>

        {/* Right: two 16:9 video cards */}
        <div style={{ flex: 1, position: 'relative', height: '100vh' }}>

          {/* Top card */}
          <div
            ref={video1Ref}
            style={{
              position: 'absolute',
              top: '2.5rem',
              right: '2.5rem',
              width: '310px',
              height: '174px',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <video
              src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P10.mp4"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              display: 'flex', alignItems: 'flex-end', padding: '0 12px 10px',
            }}>
              <span style={{ fontSize: 8, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Photography</span>
            </div>
          </div>

          {/* Bottom card */}
          <div
            ref={video2Ref}
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              right: '2.5rem',
              width: '310px',
              height: '174px',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <video
              src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P21.mp4"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              display: 'flex', alignItems: 'flex-end', padding: '0 12px 10px',
            }}>
              <span style={{ fontSize: 8, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Drone & Aerial</span>
            </div>
          </div>

        </div>
    </div>
  );
}
