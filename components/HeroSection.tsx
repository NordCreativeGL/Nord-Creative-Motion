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
  const compassRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGGElement>(null)
  const needleRef = useRef<SVGPolygonElement>(null)

  useEffect(() => {
    if (!compassRef.current) return
    setTimeout(() => {
      gsap.to(compassRef.current, {
        rotation: 720,
        duration: 1.5,
        ease: 'none',
        transformOrigin: '50% 50%',
        onComplete: () => console.log('trin-1-complete'),
      })
    }, 100)
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

      if (content) {
        gsap.to(content, {
          opacity: 0, scale: 0.95, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top top", end: "45% top", scrub: 1,
          },
        });
      }
      if (video) {
        gsap.to(video, {
          scale: 1.08, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top top", end: "bottom top", scrub: 1.5,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 100, pointerEvents: 'none' }}>
        <div
          ref={compassRef}
          style={{ width: '160px', height: '160px', marginLeft: '-80px', marginTop: '-80px' }}
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="160" height="160">
            <g ref={ringRef}>
              <path d="M 44.956 2.015 A 48.25 48.25 0 0 0 44.956 97.985" fill="none" stroke="#ffffff" strokeWidth="3.5" />
              <path d="M 55.044 2.015 A 48.25 48.25 0 0 1 55.044 97.985" fill="none" stroke="#ffffff" strokeWidth="3.5" />
            </g>
            <polygon
              ref={needleRef}
              points="50,3.5 61.5,50 50,96.5 38.5,50"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* ── Video ──────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P19(1)A.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0, willChange: "transform, opacity" }}
      />

      {/* ── Dark overlay ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ── Content (fades/scales on scroll) ───────────────────────────── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5"
        style={{ willChange: "transform, opacity" }}
      >
        <img
          ref={wordmarkImgRef}
          src="/logos/final/svg/nord-creative-wordmark-needle-white.svg"
          style={{ width: 'clamp(320px, 72vw, 1100px)', height: 'auto', opacity: 0 }}
          alt="Nord Creative"
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-xs tracking-[0.3em] uppercase text-white/60"
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
