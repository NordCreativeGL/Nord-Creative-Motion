"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const wordmarkRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const navbar = document.getElementById("site-nav");

    const ctx = gsap.context(() => {
      // ─── Main intro timeline ───────────────────────────────────────────────

      const tl = gsap.timeline();

      // 1. Compass icon fades in on pure black
      tl.to(iconRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // 2–3. Needle CSS animation: 0.3s delay + 2.5s spin = done at 2.8s. GSAP waits to t=3.1
      tl.to({}, { duration: 2.8 });

      // 4. Wordmark blurs in + compass fades out simultaneously
      tl.to(
        wordmarkRef.current,
        {
          opacity: 1,
          filter: "blur(0px)",
          width: "clamp(320px, 78vw, 860px)",
          duration: 1.4,
          ease: "power2.out",
        },
        "<"
      );
      tl.to(
        iconRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "<"
      );

      // 5. Wordmark sits sharp — 0.8s pause
      tl.to({}, { duration: 0.8 });

      // 6. Hero video fades in behind wordmark
      tl.to(videoRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      });

      // 7. Tagline fades in (overlaps with tail of video fade)
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      );

      // 8. Scroll indicator appears
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Navbar fades in — after the full sequence settles
      if (navbar) {
        tl.to(
          navbar,
          {
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      // ─── Scroll behaviour ─────────────────────────────────────────────────

      // Hero content (wordmark + tagline) fades out and scales slightly down
      gsap.to(contentRef.current, {
        opacity: 0,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "45% top",
          scrub: 1,
        },
      });

      // Video slowly zooms in — parallax "pulling into the world" feeling
      gsap.to(videoRef.current, {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* ── Video layer (starts invisible, GSAP reveals it) ───────────────── */}
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

      {/* Dark overlay sits on top of video */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ── Centered content: compass → wordmark → tagline ───────────────── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Logo slot — compass SVG and wordmark are both absolutely centred here */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: "clamp(320px, 78vw, 860px)", height: "300px" }}
        >
          {/* SVG compass — ring stays still, only needle rotates via CSS */}
          <svg
            ref={iconRef}
            viewBox="0 0 100 100"
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              opacity: 0,
              willChange: "opacity",
              overflow: "visible",
            }}
          >
            {/* Ring: two 170° arcs with ~10° gaps at top and bottom */}
            <g id="compass-ring">
              <path
                d="M 53.9 5.2 A 45 45 0 0 1 53.9 94.8 M 46.1 94.8 A 45 45 0 0 1 46.1 5.2"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            {/* Needle: diamond centred at (50,50) — CSS needleSpin rotates only this */}
            <g id="compass-needle">
              <polygon points="50,8 56,50 50,92 44,50" fill="white" />
            </g>
          </svg>

          {/* Wordmark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={wordmarkRef}
            src="/logo-wordmark-transparent.png"
            alt="NordCreative"
            style={{
              position: "absolute",
              width: "clamp(320px, 78vw, 860px)",
              height: "auto",
              opacity: 0,
              filter: "blur(20px)",
              willChange: "opacity, filter",
            }}
          />
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

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <div
        ref={scrollIndicatorRef}
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
