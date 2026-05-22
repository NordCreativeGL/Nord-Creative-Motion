"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const compassRef  = useRef<SVGSVGElement>(null);
  const wordmarkRef = useRef<SVGSVGElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const taglineRef  = useRef<HTMLParagraphElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const navbar  = document.getElementById("site-nav");
    const compass = compassRef.current;
    const wm      = wordmarkRef.current;
    const video   = videoRef.current;
    const content = contentRef.current;
    const tagline = taglineRef.current;
    const scroll  = scrollRef.current;
    const section = sectionRef.current;

    if (!compass || !wm) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // ── Phase 1: Compass (t=0 → 2.0) ──────────────────────────────────
      // CSS #compass-needle in globals.css spins: 0.3s delay + 1.5s = done at t=1.8
      tl.to(compass, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);

      // ── Phase 2: Wordmark reveal (t=2.0) ───────────────────────────────
      // Compass fades out, SVG wordmark blurs in simultaneously
      tl.to(compass, { opacity: 0, duration: 0.4, ease: "power2.out" }, 2.0);
      tl.to(wm, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power2.out",
      }, 2.0);

      // ── Phase 3: Video + tagline + navbar + scroll indicator ────────────
      if (video)   tl.to(video,   { opacity: 1, duration: 1.5, ease: "power2.out" }, 3.5);
      if (tagline) tl.to(tagline, { opacity: 1, duration: 0.8, ease: "power2.out" }, 4.5);
      if (navbar)  tl.to(navbar,  { opacity: 1, duration: 0.8, ease: "power2.out" }, 5.5);
      if (scroll)  tl.to(scroll,  { opacity: 1, duration: 0.6, ease: "power2.out" }, 5.5);

      // ── Scroll parallax ────────────────────────────────────────────────
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
        {/* Compass and wordmark are both absolutely centred in this slot */}
        <div className="relative flex items-center justify-center" style={{ width: "100vw", maxWidth: "100vw", overflow: "visible" }}>

          {/* ── Compass SVG — Phase 1 only ─────────────────────────────── */}
          <svg
            ref={compassRef}
            viewBox="0 0 100 100"
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              opacity: 0,
              overflow: "visible",
              zIndex: 2,
            }}
          >
            {/* Ring: two 170° arcs, ~10° gap at north and south */}
            <g>
              <path
                d="M 53.9 5.2 A 45 45 0 0 1 53.9 94.8 M 46.1 94.8 A 45 45 0 0 1 46.1 5.2"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            {/* Needle — #compass-needle in globals.css drives the spin */}
            <g id="compass-needle">
              <polygon points="50,8 56,50 50,92 44,50" fill="white" />
            </g>
          </svg>

          {/* ── Inline SVG wordmark — Phase 2+ ─────────────────────────── */}
          <svg
            ref={wordmarkRef}
            viewBox="0 0 1200 140"
            style={{ width: "clamp(320px, 72vw, 1100px)", opacity: 0, filter: "blur(12px)" }}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="NordCreative"
          >
            <defs>
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap');`}</style>
            </defs>

            {/* NORD */}
            <text fontFamily="Montserrat, sans-serif" fontWeight="200" fontSize="100" fill="white" letterSpacing="14">
              <tspan x="0" y="112">N</tspan>
            </text>
            {/* O as split circle — center cx=220, cy=68, r=46 */}
            <g id="wordmark-o">
              <circle cx="220" cy="68" r="46" stroke="white" strokeWidth="4" fill="none" />
              {/* Gap top */}
              <rect x="208" y="12" width="24" height="12" fill="black" />
              {/* Gap bottom */}
              <rect x="208" y="112" width="24" height="12" fill="black" />
            </g>
            <text fontFamily="Montserrat, sans-serif" fontWeight="200" fontSize="100" fill="white" letterSpacing="14">
              <tspan x="276" y="112">RD</tspan>
            </text>

            {/* CREATIVE */}
            <text fontFamily="Montserrat, sans-serif" fontWeight="200" fontSize="100" fill="white" letterSpacing="14">
              <tspan x="510" y="112">CREAT</tspan>
            </text>
            {/* I as compass needle diamond — center x=955, y=68 */}
            <g id="wordmark-needle">
              <polygon points="955,22 963,68 955,114 947,68" fill="white" />
            </g>
            <text fontFamily="Montserrat, sans-serif" fontWeight="200" fontSize="100" fill="white" letterSpacing="14">
              <tspan x="972" y="112">VE</tspan>
            </text>
          </svg>
        </div>

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
