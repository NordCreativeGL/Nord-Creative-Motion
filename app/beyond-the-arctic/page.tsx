"use client";

import { useRef, useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollManager from "@/components/ScrollManager";
import SideNav from "@/components/SideNav";
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const GRID_VIDEOS = [
  "https://cdn.nordcreative.dk/P33%20MALLORCA.mp4",
  "https://cdn.nordcreative.dk/P61%20SOUTH%20AFRICA.mp4",
  "https://cdn.nordcreative.dk/P35%20INDONESIA.mp4",
];

export default function BeyondTheArcticPage() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState<boolean[]>([false, false, false]);
  const [isStudio, setIsStudio] = useState(false)
  useEffect(() => {
    const check = () => setIsStudio(window.innerWidth >= 1900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const section4Ref = useRef<HTMLElement>(null)
  const ring4Ref = useRef<HTMLDivElement>(null)
  const card4Refs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])
  const hasEntered4 = useRef(false)

  useEffect(() => {
    const section = section4Ref.current
    const ringEl = ring4Ref.current
    if (!section || !ringEl) return

    const VH = window.innerHeight
    const N = 5
    const BIG_H = Math.round(VH * 0.70)
    const BIG_W = Math.round(BIG_H * 9 / 16)
    const CARD_ASPECTS = [
      { w: Math.round(BIG_W * 16 / 9), h: BIG_W },
      { w: BIG_W, h: BIG_H },
      { w: BIG_W, h: BIG_H },
      { w: BIG_W, h: BIG_H },
      { w: Math.round(BIG_W * 16 / 9), h: BIG_W },
    ]
    const RX = Math.round(ringEl.offsetWidth * 0.38)
    const RY = Math.round(BIG_H * 0.14)
    const CX = Math.round(ringEl.offsetWidth / 2)
    const CY = Math.round(VH / 2)

    card4Refs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0 }) })

    const handleScroll = () => {
      if (!hasEntered4.current) return
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const p = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / (VH * 4)))
      const ringP = p * (N - 1)
      card4Refs.current.forEach((el, i) => {
        if (!el) return
        const rawOffset = ((i - ringP) % N + N) % N
        const norm = rawOffset <= N / 2 ? rawOffset / N : (rawOffset - N) / N
        const theta = norm * Math.PI * 2
        const depth = (Math.cos(theta) + 1) / 2
        const s = 0.22 + 0.78 * (depth * depth)
        const w = CARD_ASPECTS[i].w * s, h = CARD_ASPECTS[i].h * s
        gsap.set(el, {
          x: CX + Math.sin(theta) * RX - w / 2,
          y: CY + Math.cos(theta) * RY - h / 2,
          width: w, height: h,
          opacity: 0.10 + 0.90 * depth * depth,
          zIndex: Math.round(depth * 100),
          borderRadius: Math.round(14 * s),
        })
      })
      const activeIndex = Math.round(ringP) % N
      card4Refs.current.forEach((el, i) => {
        const video = el?.querySelector('video') as HTMLVideoElement | null
        if (!video) return
        if (i === activeIndex) {
          if (video.paused) video.play()
        } else {
          if (!video.paused) video.pause()
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isStudio])

  useEffect(() => {
    const section = section4Ref.current
    const ringEl = ring4Ref.current
    if (!section || !ringEl) return

    const VH = window.innerHeight
    const N = 5
    const BIG_H = Math.round(VH * 0.70)
    const BIG_W = Math.round(BIG_H * 9 / 16)
    const CARD_ASPECTS = [
      { w: Math.round(BIG_W * 16 / 9), h: BIG_W },
      { w: BIG_W, h: BIG_H },
      { w: BIG_W, h: BIG_H },
      { w: BIG_W, h: BIG_H },
      { w: Math.round(BIG_W * 16 / 9), h: BIG_W },
    ]
    const RX = Math.round(ringEl.offsetWidth * 0.38)
    const RY = Math.round(BIG_H * 0.14)
    const CX = Math.round(ringEl.offsetWidth / 2)
    const CY = Math.round(VH / 2)

    const playEntry = () => {
      if (hasEntered4.current) return
      hasEntered4.current = true
      card4Refs.current.forEach((el, i) => {
        if (!el) return
        const rawOffset = i % N
        const norm = rawOffset <= N / 2 ? rawOffset / N : (rawOffset - N) / N
        const theta = norm * Math.PI * 2
        const depth = (Math.cos(theta) + 1) / 2
        const s = 0.22 + 0.78 * (depth * depth)
        const w = CARD_ASPECTS[i].w * s, h = CARD_ASPECTS[i].h * s
        const finalX = CX + Math.sin(theta) * RX - w / 2
        const finalY = CY + Math.cos(theta) * RY - h / 2
        gsap.set(el, { x: finalX, y: finalY - 360, width: w, height: h, opacity: 0, zIndex: Math.round(depth * 100), borderRadius: Math.round(14 * s) })
        gsap.to(el, {
          y: finalY,
          opacity: 0.10 + 0.90 * depth * depth,
          duration: 0.85,
          delay: i * 0.08,
          ease: 'power3.out',
          ...(i === 4 ? {
            onComplete: () => {
              const video = card4Refs.current[0]?.querySelector('video') as HTMLVideoElement | null
              if (video) video.play()
            }
          } : {}),
        })
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        const videoElements = document.querySelectorAll('#adventure video');
        const firstVideo = videoElements[0] as HTMLVideoElement;
        if (!firstVideo) { playEntry(); return; }
        if (firstVideo.readyState >= 3) {
          playEntry();
        } else {
          firstVideo.addEventListener('canplay', () => playEntry(), { once: true });
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [isStudio])

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(prev => prev.map((v, i) => (i === index ? true : v)));
    } else {
      video.pause();
      setPlaying(prev => prev.map((v, i) => (i === index ? false : v)));
    }
  };

  return (
    <main style={{ background: '#000000' }}>
      <ScrollManager />
      {!isMobile && (
        <SideNav items={[
          { label: 'Our work', id: 'bta-work' },
          { label: 'The journey', id: 'bta-quote' },
          { label: 'Adventure', id: 'adventure' },
        ]} />
      )}
      <Header />

      {/* ── Section 1: Hero ── */}
      <section id="bta-hero" data-snap="true" style={{ position: 'relative', minHeight: isMobile ? '100dvh' : '100vh', overflow: 'hidden' }}>
        <video
          src="https://cdn.nordcreative.dk/P60%20HEADER.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />

        <div style={{ position: 'absolute', bottom: '20%', left: 0, right: 0 }}>
          <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
            <p style={{
              fontSize: '13px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '16px',
            }}>
              BEYOND THE ARCTIC
            </p>
            <h1 style={{
              fontSize: 'clamp(28px, 2.78vw, 68px)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'white',
              marginBottom: '20px',
              maxWidth: '800px',
            }}>
              Beyond the Arctic
            </h1>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '600px',
            }}>
              While Greenland is at the core of our work, we also collaborate with companies and organizations on projects in other locations.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: Our work ── */}
      <section id="bta-work" data-snap="true" style={{
          height: isMobile ? 'auto' : '100vh',
          minHeight: isMobile ? '100dvh' : undefined,
          background: '#000',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          overflow: 'hidden',
          paddingTop: isMobile ? '80px' : undefined,
          paddingBottom: isMobile ? '60px' : undefined,
        }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <p style={{
            fontSize: '13px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '16px',
          }}>
            OUR WORK
          </p>

          {/* H2 + body two-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '1rem' : '3rem',
            alignItems: 'start',
            marginBottom: isMobile ? '1.5rem' : '1rem',
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 2.78vw, 68px)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'white',
              marginBottom: 0,
            }}>
              Productions beyond Greenland
            </h2>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.625,
              color: 'rgba(255,255,255,0.65)',
            }}>
              While Greenland is at the core of our work, we also collaborate with companies and organizations on projects in other locations. This portfolio presents a selection of photography and film productions created beyond Greenland.
            </p>
          </div>

          {/* Interactive 3-column portrait grid */}
          <div style={isMobile ? {
            display: 'flex',
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            gap: '12px',
            paddingRight: '24px',
          } : {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}>
            {GRID_VIDEOS.map((src, i) => (
              <div
                key={i}
                onClick={() => togglePlay(i)}
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '9/16',
                  background: '#111',
                  cursor: 'pointer',
                  ...(isMobile ? { flex: '0 0 76vw', scrollSnapAlign: 'start' } : {}),
                }}
              >
                <video
                  ref={el => { videoRefs.current[i] = el; }}
                  src={src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Play overlay — visible when paused */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: playing[i] ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    border: '1px solid rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <polygon points="6,3 17,10 6,17" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Quote + mixed layout ── */}
      <section id="bta-quote" data-snap="true" style={{
          height: isMobile ? 'auto' : '100vh',
          minHeight: isMobile ? '100dvh' : undefined,
          background: '#000',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          overflow: 'hidden',
          paddingTop: isMobile ? '80px' : undefined,
          paddingBottom: isMobile ? '60px' : undefined,
        }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : (isStudio ? '900fr 590fr' : '813fr 395fr'),
            gap: '1.5rem',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
          }}>
            {/* Left col: quote + landscape video */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
              <p style={{
                fontSize: 'clamp(1.25rem, 1.4vw, 1.75rem)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.5,
                marginBottom: '1.5rem',
                fontStyle: 'italic',
              }}>
                "Strong visuals capture attention and enhance understanding. Good storytelling starts with observation."
              </p>
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 14,
                overflow: 'hidden',
                display: isMobile ? 'none' : undefined,
              }}>
                <video
                  src="https://cdn.nordcreative.dk/P22.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>

            {/* Right col: portrait video */}
            <div style={{
              aspectRatio: '9/16',
              borderRadius: 14,
              overflow: 'hidden',
              ...(isMobile ? {
                order: -1,
                width: '72vw',
                maxHeight: '55vh',
                margin: '0 auto 2rem',
              } : {}),
            }}>
              <video
                src="https://cdn.nordcreative.dk/P23.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

        {/* ── Section 4: Adventure ── */}
        <section ref={section4Ref} id="adventure" style={{ height: '500vh', background: '#000', position: 'relative' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16 w-full" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <div ref={ring4Ref} style={{ flex: 1, position: 'relative', height: '100%' }}>
                {[
                  'https://cdn.nordcreative.dk/P59.mp4',
                  'https://cdn.nordcreative.dk/P24.mp4',
                  'https://cdn.nordcreative.dk/P25.mp4',
                  'https://cdn.nordcreative.dk/P26.mp4',
                  'https://cdn.nordcreative.dk/P53A.mp4',
                ].map((src, i) => (
                  <div key={i} ref={el => { card4Refs.current[i] = el }} style={{ position: 'absolute', overflow: 'hidden', opacity: 0 }}>
                    <video src={src} muted loop playsInline preload="auto" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
              </div>
              <div style={{ flex: '0 0 28%', paddingLeft: '2rem', zIndex: 300, position: 'relative' }}>
                <p style={{ fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>ADVENTURE</p>
                <h2 style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.1, marginBottom: '1.5rem' }}>Adventure is in our DNA</h2>
                <p style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>Attention to detail, subtle nuances, and layered storytelling define our work.</p>
              </div>
            </div>
          </div>
        </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
