"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef         = useRef<HTMLElement>(null);
  const compassRef         = useRef<SVGSVGElement>(null);
  const wordmarkLettersRef = useRef<HTMLImageElement>(null);
  const wordmarkFullRef    = useRef<HTMLImageElement>(null);
  const videoRef           = useRef<HTMLVideoElement>(null);
  const contentRef         = useRef<HTMLDivElement>(null);
  const taglineRef         = useRef<HTMLParagraphElement>(null);
  const scrollRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const navbar  = document.getElementById("site-nav");
    const compass = compassRef.current;
    const video   = videoRef.current;
    const content = contentRef.current;
    const tagline = taglineRef.current;
    const scroll  = scrollRef.current;
    const section = sectionRef.current;

    if (!compass) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // ── Phase 1: Compass (t=0 → 1.9) ──────────────────────────────────
      // CSS #compass-needle in globals.css spins: 0.3s delay + 1.5s = done at t=1.8
      tl.to(compass, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);

      // ── Phase 2: compass splits and scales down to logo positions ─────
      tl.add(() => {
        const compassEl = compassRef.current;
        if (!compassEl) return;

        const wmImg = wordmarkFullRef.current;
        if (!wmImg) return;
        const wmRect = wmImg.getBoundingClientRect();

        const compassRect = compassEl.getBoundingClientRect();
        const compassCX = compassRect.left + compassRect.width / 2;
        const compassCY = compassRect.top + compassRect.height / 2;
        const compassRadius = compassRect.width / 2;

        const oTargetX = wmRect.left + wmRect.width * (310.6 / 2520.80);
        const oTargetY = wmRect.top + wmRect.height * (80 / 200);
        const needleTargetX = wmRect.left + wmRect.width * (2093.8 / 2520.80);
        const needleTargetY = wmRect.top + wmRect.height * (82 / 200);

        const ringScale = (wmRect.width * (71 / 2520.80)) / compassRadius;

        const ringClone = compassEl.cloneNode(true) as HTMLElement;
        ringClone.style.cssText = `position:fixed;left:${compassRect.left}px;top:${compassRect.top}px;width:${compassRect.width}px;height:${compassRect.height}px;margin:0;padding:0;transform:none;pointer-events:none;z-index:50;`;
        const needleInRing = ringClone.querySelector('#compass-needle') as SVGElement;
        if (needleInRing) { needleInRing.style.opacity = '0'; needleInRing.style.animation = 'none'; }
        const ringInRing = ringClone.querySelector('#compass-ring') as SVGElement;
        if (ringInRing) ringInRing.style.animation = 'none';
        document.body.appendChild(ringClone);

        const needleClone = compassEl.cloneNode(true) as HTMLElement;
        needleClone.style.cssText = `position:fixed;left:${compassRect.left}px;top:${compassRect.top}px;width:${compassRect.width}px;height:${compassRect.height}px;margin:0;padding:0;transform:none;pointer-events:none;z-index:50;`;
        const ringInNeedle = needleClone.querySelector('#compass-ring') as SVGElement;
        if (ringInNeedle) { ringInNeedle.style.opacity = '0'; ringInNeedle.style.animation = 'none'; }
        const needleInNeedle = needleClone.querySelector('#compass-needle') as SVGElement;
        if (needleInNeedle) needleInNeedle.style.animation = 'none';
        document.body.appendChild(needleClone);

        gsap.set(compassEl, { opacity: 0 });

        gsap.to(ringClone, {
          x: oTargetX - compassCX,
          y: oTargetY - compassCY,
          scale: ringScale,
          duration: 1.1,
          ease: 'power2.inOut',
          transformOrigin: '50% 50%',
        });

        gsap.to(needleClone, {
          x: needleTargetX - compassCX,
          y: needleTargetY - compassCY,
          scale: ringScale,
          duration: 1.1,
          ease: 'power2.inOut',
          transformOrigin: '50% 50%',
        });

        gsap.to(wordmarkFullRef.current, {
          opacity: 1,
          duration: 1.1,
          delay: 0,
          ease: 'power2.inOut',
        });
      }, 1.9);

      tl.to(compassRef.current, { opacity: 0, duration: 0.01 }, 1.9);
      if (video)   tl.to(video,   { opacity: 1, duration: 1.5, ease: 'power2.out' }, 3.2);
      if (tagline) tl.to(tagline, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 4.4);
      if (navbar)  tl.to(navbar,  { opacity: 1, duration: 0.8, ease: 'power2.out' }, 4.6);
      if (scroll)  tl.to(scroll,  { opacity: 1, duration: 0.6, ease: 'power2.out' }, 4.8);

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
            <g id="compass-ring">
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

          {/* ── Wordmark — Phase 2+ ────────────────────────────────────── */}
          <div style={{ position: "relative", width: "clamp(320px, 72vw, 1100px)", opacity: 1 }}>
            <img
              ref={wordmarkLettersRef}
              src="/logos/final/svg/nord-creative-wordmark-letters-only-white.svg"
              alt="Nord Creative"
              draggable={false}
              style={{ width: "100%", height: "auto", opacity: 0, filter: "blur(12px)", display: "block" }}
            />
            <img
              ref={wordmarkFullRef}
              src="/logos/final/svg/nord-creative-wordmark-needle-white.svg"
              alt=""
              draggable={false}
              aria-hidden="true"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "auto", opacity: 0 }}
            />
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
