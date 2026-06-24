"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useLang } from '@/contexts/LanguageContext'

export default function GreenlandSection() {
  const [btnHover, setBtnHover] = useState(false);
  const [btnHover2, setBtnHover2] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { lang } = useLang()
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const line3Ref   = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);
  const linkRef    = useRef<HTMLAnchorElement>(null);
  const linkRef2 = useRef<HTMLAnchorElement>(null);
  const video1Ref  = useRef<HTMLDivElement>(null);
  const video2Ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let textTl: gsap.core.Timeline;
    let videoTl: gsap.core.Timeline;
    let textFired = false;

    const ctx = gsap.context(() => {
      gsap.set(labelRef.current,  { opacity: 0, rotateY: 360,  x: -60 });
      gsap.set(line1Ref.current,  { opacity: 0, rotateY: -360, x: 80  });
      gsap.set(line2Ref.current,  { opacity: 0, rotateY: 360,  y: 30  });
      gsap.set(line3Ref.current,  { opacity: 0, rotateY: -360, x: -40 });
      gsap.set(bodyRef.current,   { opacity: 0, y: 14 });
      gsap.set([linkRef.current, linkRef2.current], { opacity: 0 });
      gsap.set(video1Ref.current, { opacity: 0, rotateY: -90, x: 0, transformOrigin: 'center center' });
      gsap.set(video2Ref.current, { opacity: 0, rotateY:  90, x: 0, transformOrigin: 'center center' });

      const isMobileAnim = window.innerWidth < 1024;
      textTl = gsap.timeline({ paused: true });

      textTl.to(labelRef.current,  { opacity: 1, rotateY: 0, x: 0, duration: isMobileAnim ? 0.5 : 1.3, ease: 'power2.inOut' }, 0)
        .to(line1Ref.current,  { opacity: 1, rotateY: 0, x: 0, duration: isMobileAnim ? 0.5 : 1.3, ease: 'power2.inOut' }, isMobileAnim ? 0    : 0.20)
        .to(line2Ref.current,  { opacity: 1, rotateY: 0, y: 0, duration: isMobileAnim ? 0.5 : 1.3, ease: 'power2.inOut' }, isMobileAnim ? 0.05 : 0.42)
        .to(line3Ref.current,  { opacity: 1, rotateY: 0, x: 0, duration: isMobileAnim ? 0.5 : 1.3, ease: 'power2.inOut' }, isMobileAnim ? 0.10 : 0.64)
        .to(bodyRef.current,   { opacity: 1, y: 0,             duration: isMobileAnim ? 0.5 : 0.9, ease: 'power2.inOut' }, isMobileAnim ? 0.15 : 1.00)
        .to([linkRef.current, linkRef2.current], { opacity: 1,                   duration: isMobileAnim ? 0.5 : 0.8, ease: 'power2.inOut' }, isMobileAnim ? 0.20 : 1.25);

      videoTl = gsap.timeline({ paused: true });

      videoTl.to(video1Ref.current, { opacity: 1, rotateY: 0, x: 0, duration: isMobileAnim ? 0.7 : 1.4, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' }, isMobileAnim ? 0.05 : 0.50)
        .to(video2Ref.current, { opacity: 1, rotateY: 0, x: 0, duration: isMobileAnim ? 0.7 : 1.4, ease: 'cubic-bezier(0.25, 0.1, 0.15, 1)' }, isMobileAnim ? 0.20 : 1.10);
    }, sectionRef);

    const isMobileForIO = window.innerWidth < 1024

    if (isMobileForIO) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !textFired) {
              textFired = true
              textTl?.play()
              videoTl?.play()
            }
          })
        },
        { threshold: 0.2 }
      )
      const target = sectionRef.current
      if (target) observer.observe(target)
      return () => {
        ctx.revert()
        observer.disconnect()
      }
    }

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;

      if (!textFired && textTl && window.scrollY >= sectionTop - window.innerHeight * 0.5) {
        textFired = true;
        textTl.play();
      }

      if (videoTl) {
        const startScrollY = sectionTop - window.innerHeight;
        const totalRange = el.offsetHeight;
        const raw = (window.scrollY - startScrollY) / totalRange;
        videoTl.progress(Math.max(0, Math.min(1, raw)));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const t = {
    en: { eyebrow: 'Greenland', heading: "Production in Greenland", body: "From town centres to remote sites only reachable by boat or helicopter — we've produced photography, film, and websites across all of Greenland. The distances are long and the weather doesn't always cooperate. We've learned to plan for both.", btnWork: 'Explore our work in Greenland', btnWeb: 'See our website production' },
    da: { eyebrow: 'Grønland', heading: 'Produktion i Grønland', body: 'Fra bycentre til afsides lokaliteter der kun kan nås med båd eller helikopter — vi har produceret fotografering, film og websites i hele Grønland. Afstandene er lange og vejret samarbejder ikke altid. Vi har lært at planlægge for begge dele.', btnWork: 'Se vores arbejde i Grønland', btnWeb: 'Se vores website-produktion' }
  }

  return (
    <div
      id="greenland"
      data-snap="true"
      ref={sectionRef}
      style={{ height: isMobile ? 'auto' : '200vh' }}
    >
      <div
        style={{
          position: isMobile ? 'static' : 'sticky',
          top: 0,
          height: isMobile ? 'auto' : '100vh',
          overflow: isMobile ? 'visible' : 'hidden',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
        }}
      >
        {/* Left: text column */}
        <div
          style={{
            width: isMobile ? '100%' : '46%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            perspective: '900px',
            paddingTop: isMobile ? '0px' : undefined,
            paddingBottom: isMobile ? '8px' : undefined,
          }}
        >
          <div style={{ maxWidth: isMobile ? '100%' : 'clamp(680px, 40vw, 820px)', paddingLeft: isMobile ? '24px' : 'clamp(180px, 18vw, 260px)', paddingRight: isMobile ? '24px' : undefined }}>
          <div ref={labelRef} style={{ fontSize: '0.875rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 24 }}>
            {t[lang].eyebrow}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div ref={line1Ref} style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25, whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
              {t[lang].heading}
            </div>
            <div ref={line2Ref} style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25 }}>
            </div>
            <div ref={line3Ref} style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25 }}>
            </div>
          </div>

          <div ref={bodyRef} style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.625, marginBottom: 28 }}>
            {t[lang].body}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'stretch',
          }}>
          <Link
            ref={linkRef}
            href="/greenland"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: isMobile ? undefined : 'flex-start',
              width: '100%',
              padding: '14px 36px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: btnHover ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              fontWeight: 400,
              letterSpacing: '0.01em',
              textDecoration: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.25s ease, color 0.25s ease',
            }}
          >
            {t[lang].btnWork}
          </Link>
          <Link
            ref={linkRef2}
            href="/web"
            onMouseEnter={() => setBtnHover2(true)}
            onMouseLeave={() => setBtnHover2(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: isMobile ? undefined : 'flex-start',
              width: '100%',
              padding: '14px 36px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: btnHover2 ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              fontWeight: 400,
              letterSpacing: '0.01em',
              textDecoration: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.25s ease, color 0.25s ease',
            }}
          >
            {t[lang].btnWeb}
          </Link>
          </div>
          </div>
        </div>

        <div style={{
          width: isMobile ? '100%' : '54%',
          height: isMobile ? 'auto' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '0 24px 0 24px' : '2.5rem 2rem 2.5rem 6rem',
          gap: '0.75rem',
        }}>
          <div ref={video1Ref} style={{
            position: 'relative',
            flex: isMobile ? undefined : 1,
            height: isMobile ? '170px' : undefined,
            width: '100%',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <video
              src="https://cdn.nordcreative.dk/P18K.mp4"
              preload="none"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
          </div>

          <div ref={video2Ref} style={{
            position: 'relative',
            flex: isMobile ? undefined : 1,
            height: isMobile ? '170px' : undefined,
            width: '100%',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <video
              src="https://cdn.nordcreative.dk/P21.mp4"
              preload="none"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
