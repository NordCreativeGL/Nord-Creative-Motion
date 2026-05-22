"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef         = useRef<HTMLElement>(null);
  const compassRef         = useRef<SVGSVGElement>(null);
  const wordmarkLettersRef = useRef<HTMLImageElement>(null);
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

      // ── Phase 2: Compass splits — ring → O position, needle → I position ─
      tl.add(() => {
        const wmEl = wordmarkLettersRef.current?.parentElement;
        if (!wmEl) return;
        const wmRect      = wmEl.getBoundingClientRect();
        const compassEl   = compassRef.current;
        if (!compassEl) return;
        const compassRect = compassEl.getBoundingClientRect();

        const oTargetX      = wmRect.left + wmRect.width * 0.1233;
        const oTargetY      = wmRect.top  + wmRect.height * 0.40;
        const needleTargetX = wmRect.left + wmRect.width * 0.8306;
        const needleTargetY = wmRect.top  + wmRect.height * 0.41;

        const compassCX = compassRect.left + compassRect.width  / 2;
        const compassCY = compassRect.top  + compassRect.height / 2;

        // Scale compass ring to match O radius in rendered wordmark
        const oRadiusPx       = wmRect.width * (71 / 2520.80);
        const compassRadiusPx = compassRect.width / 2;
        const ringScale       = oRadiusPx / compassRadiusPx;

        gsap.to("#compass-ring", {
          x: oTargetX - compassCX,
          y: oTargetY - compassCY,
          scale: ringScale,
          duration: 1.0,
          ease: "power2.inOut",
          transformOrigin: "50% 50%",
        });

        gsap.to("#compass-needle", {
          x: needleTargetX - compassCX,
          y: needleTargetY - compassCY,
          scale: ringScale * 0.85,
          duration: 1.0,
          ease: "power2.inOut",
          transformOrigin: "50% 50%",
        });

        // Fade out ring and needle after they reach position
        gsap.to(["#compass-ring", "#compass-needle"], {
          opacity: 0,
          duration: 0.4,
          delay: 0.8,
          ease: "power1.in",
        });

        // Wordmark letters blur in once compass elements are in place
        gsap.to(wordmarkLettersRef.current, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          delay: 0.6,
          ease: "power2.out",
        });
      }, 1.9);

      // ── Phase 3: Clean up compass container, fade in rest of page ──────
      tl.to(compass,  { opacity: 0, duration: 0.3 }, 3.2);
      if (video)   tl.to(video,   { opacity: 1, duration: 1.5, ease: "power2.out" }, 3.0);
      if (tagline) tl.to(tagline, { opacity: 1, duration: 0.8, ease: "power2.out" }, 4.2);
      if (navbar)  tl.to(navbar,  { opacity: 1, duration: 0.8, ease: "power2.out" }, 4.4);
      if (scroll)  tl.to(scroll,  { opacity: 1, duration: 0.6, ease: "power2.out" }, 4.6);

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
              src="/logos/final/svg/nord-creative-wordmark-needle-white.svg"
              alt="Nord Creative"
              draggable={false}
              style={{ width: "100%", height: "auto", opacity: 0, filter: "blur(12px)", display: "block" }}
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
