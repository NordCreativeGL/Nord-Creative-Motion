"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WORDMARK_WIDTH = "clamp(600px, 80vw, 1100px)";

// Black mask div for each letter region (as % of the 1321px text span).
// preRevealed=true → opacity:0 from the start (O and needle visible immediately).
const MASKS: { id: string; left: string; width: string; preRevealed: boolean }[] = [
  { id: "N",  left: "0%",    width: "11.5%", preRevealed: false },
  { id: "O",  left: "11.5%", width: "12%",   preRevealed: true  }, // O ring visible from start
  { id: "R1", left: "23.5%", width: "12.5%", preRevealed: false },
  { id: "D",  left: "36%",   width: "12%",   preRevealed: false },
  // 48–59% = word gap (transparent in PNG, no mask needed)
  { id: "C",  left: "59%",   width: "11%",   preRevealed: false },
  { id: "R2", left: "70%",   width: "8%",    preRevealed: false },
  { id: "E1", left: "78%",   width: "6%",    preRevealed: false },
  { id: "A",  left: "84%",   width: "6.5%",  preRevealed: false },
  { id: "T",  left: "90.5%", width: "4.5%",  preRevealed: false },
  { id: "I",  left: "95%",   width: "2%",    preRevealed: true  }, // needle visible from start
  { id: "V",  left: "97%",   width: "3%",    preRevealed: false }, // covers V + final E
];

// Stagger reveal order and offsets (seconds from t=3.2)
const REVEAL_ORDER: { id: string; offset: number }[] = [
  { id: "N",  offset: 0.00 },
  { id: "R1", offset: 0.06 },
  { id: "D",  offset: 0.12 },
  { id: "C",  offset: 0.24 },
  { id: "R2", offset: 0.30 },
  { id: "E1", offset: 0.36 },
  { id: "A",  offset: 0.42 },
  { id: "T",  offset: 0.48 },
  { id: "V",  offset: 0.54 },
];

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const compassRef  = useRef<SVGSVGElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
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
      // Wordmark starts hidden and scaled down to tiny (morph from compass)
      gsap.set(wm, { opacity: 0, scale: 0.15, transformOrigin: "center center" });

      const tl = gsap.timeline();

      // ── Phase 1: Compass (t=0 → 2.0) ──────────────────────────────────
      // CSS needleSpin in globals.css: 0.3s delay + 1.5s → done at t=1.8
      // 0.2s natural rest before morph at t=2.0
      tl.to(compass, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);

      // ── Phase 2: Morph compass → wordmark (t=2.0 → 3.2) ───────────────
      // Compass fades out; wordmark scales up from 0.15→1 and fades in.
      // O mask and I mask are already opacity:0, so those letters appear
      // first — creating visual continuity from the compass ring + needle.
      tl.to(compass, { opacity: 0, duration: 0.4, ease: "power2.out" }, 2.0);
      tl.to(wm, {
        opacity: 1,
        scale: 1,
        width: WORDMARK_WIDTH,
        duration: 1.2,
        ease: "power2.inOut",
      }, 2.0);

      // ── Phase 3: Letter reveal — unmask by fading each black div to 0 ──
      REVEAL_ORDER.forEach(({ id, offset }) => {
        const el = wm.querySelector(`[data-mask="${id}"]`);
        if (el) {
          tl.to(el, { opacity: 0, duration: 0.5, ease: "power2.out" }, 3.2 + offset);
        }
      });

      // ── Phase 4: Video, tagline, scroll indicator, navbar ──────────────
      if (video)   tl.to(video,   { opacity: 1, duration: 1.5, ease: "power2.out" }, 4.5);
      if (tagline) tl.to(tagline, { opacity: 1, duration: 0.8, ease: "power2.out" }, 5.5);
      if (scroll)  tl.to(scroll,  { opacity: 1, duration: 0.6, ease: "power2.out" }, 6.0);
      if (navbar)  tl.to(navbar,  { opacity: 1, duration: 0.9, ease: "power2.out" }, 6.5);

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
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Compass + wordmark share the same flex anchor */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: WORDMARK_WIDTH }}
        >
          {/* ── Standalone compass SVG — Phase 1 only ──────────────────── */}
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
            {/* Needle — globals.css #compass-needle drives the CSS spin */}
            <g id="compass-needle">
              <polygon points="50,8 56,50 50,92 44,50" fill="white" />
            </g>
          </svg>

          {/* ── Wordmark: PNG + black mask divs ────────────────────────── */}
          <div
            ref={wordmarkRef}
            style={{
              position: "relative",
              width: WORDMARK_WIDTH,
              opacity: 0,
            }}
          >
            {/* Full-quality PNG wordmark — white text on transparent background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-wordmark-transparent.png"
              alt="NordCreative"
              draggable={false}
              style={{ width: "100%", height: "auto", display: "block" }}
            />

            {/* Black mask divs — cover each letter region.
                GSAP fades each to opacity:0 to reveal the PNG beneath.
                O and I masks start at opacity:0 (pre-revealed from the start). */}
            {MASKS.map(({ id, left, width, preRevealed }) => (
              <div
                key={id}
                data-mask={id}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left,
                  width,
                  backgroundColor: "black",
                  opacity: preRevealed ? 0 : 1,
                }}
              />
            ))}
          </div>
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
