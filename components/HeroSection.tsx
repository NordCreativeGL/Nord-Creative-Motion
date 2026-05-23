"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef      = useRef<HTMLElement>(null);
  const wordmarkImgRef  = useRef<HTMLImageElement>(null);
  const videoRef        = useRef<HTMLVideoElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const taglineRef      = useRef<HTMLParagraphElement>(null);
  const scrollRef       = useRef<HTMLDivElement>(null);
  const ringDivRef = useRef<HTMLDivElement>(null)
  const needleDivRef = useRef<HTMLDivElement>(null)
  const wordmarkLettersRef = useRef<HTMLImageElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ringDiv = ringDivRef.current
    const needleDiv = needleDivRef.current
    if (!ringDiv || !needleDiv) return

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const ringScale = 61.79 / 231.6
    const needleScale = 64.58 / 223.2

    const tl = gsap.timeline({ delay: 0.1 })

    tl.to(needleDiv, {
      rotation: 720,
      duration: 1.5,
      ease: 'none',
      transformOrigin: '50% 50%',
    })

    tl.addLabel('spinEnd')

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: 'power1.inOut',
    }, 'spinEnd')

    tl.to(ringDiv, {
      x: 440.54 - centerX,
      y: 462.27 - centerY,
      scale: ringScale,
      duration: 1.5,
      ease: 'power2.inOut',
      transformOrigin: '50% 50%',
    }, 'spinEnd+=0.3')

    tl.to(needleDiv, {
      x: 1218.67 - centerX,
      y: 463.14 - centerY,
      scale: needleScale,
      duration: 1.5,
      ease: 'power2.inOut',
      transformOrigin: '50% 50%',
    }, 'spinEnd+=0.3')

    tl.to(wordmarkLettersRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power1.inOut',
    }, 'spinEnd+=0.3')
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const navbar  = document.getElementById("site-nav");
    const video   = videoRef.current;
    const content = contentRef.current;
    const tagline = taglineRef.current;
    const scroll  = scrollRef.current;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      gsap.to(wordmarkImgRef.current, {
        opacity: 1,
        duration: 1,
        delay: 0.5,
      });

      if (video)   gsap.to(video,   { opacity: 1, duration: 1.5, delay: 1.0, ease: 'power2.out' });
      if (tagline) gsap.to(tagline, { opacity: 1, duration: 0.8, delay: 1.8, ease: 'power2.out' });
      if (navbar)  gsap.to(navbar,  { opacity: 1, duration: 0.8, delay: 2.0, ease: 'power2.out' });
      if (scroll)  gsap.to(scroll,  { opacity: 1, duration: 0.6, delay: 2.2, ease: 'power2.out' });

    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 100, pointerEvents: 'none' }}>
        <div ref={ringDivRef} style={{ width: '240px', height: '240px', marginLeft: '-120px', marginTop: '-120px' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="240" height="240">
            <path d="M 44.956 2.015 A 48.25 48.25 0 0 0 44.956 97.985" fill="none" stroke="#ffffff" strokeWidth="3.5" />
            <path d="M 55.044 2.015 A 48.25 48.25 0 0 1 55.044 97.985" fill="none" stroke="#ffffff" strokeWidth="3.5" />
          </svg>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 100, pointerEvents: 'none' }}>
        <div ref={needleDivRef} style={{ width: '240px', height: '240px', marginLeft: '-120px', marginTop: '-120px' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="240" height="240">
            <polygon points="50,3.5 61.5,50 50,96.5 38.5,50" fill="#ffffff" />
          </svg>
        </div>
      </div>

      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'black',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      />

      {/* ── Video ──────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P19%20Header%20Boomerang.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0, willChange: "transform, opacity" }}
      />

      <div className="absolute inset-0 bg-black/20" />

      {/* ── Content (fades/scales on scroll) ───────────────────────────── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5"
        style={{ willChange: "transform, opacity" }}
      >
        <img
          ref={wordmarkLettersRef}
          src="/logos/final/svg/nord-creative-wordmark-letters-only-white.svg"
          style={{ width: 'clamp(320px, 72vw, 1100px)', height: 'auto', opacity: 0 }}
          alt="Nord Creative"
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-base tracking-[0.3em] uppercase text-white/60"
          style={{ opacity: 0 }}
        >
          Video Production · Photography · Arctic Storytelling
        </p>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <div className="w-px h-10 bg-white/50" />
        <svg
          width="12"
          height="7"
          viewBox="0 0 12 7"
          fill="none"
          aria-hidden="true"
          className="animate-bounce"
        >
          <path
            d="M1 1L6 6L11 1"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
