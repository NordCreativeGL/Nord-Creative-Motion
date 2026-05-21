"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
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

      // 2a. Fast spin — 6 full rotations in 0.8s (ease in, building speed)
      tl.to(iconRef.current, {
        rotation: "+=2160",
        duration: 0.8,
        ease: "power2.in",
        transformOrigin: "50% 50%",
      });

      // 2b. Decelerate — 2 more full rotations in 1.2s (ease out, coming to rest)
      tl.to(iconRef.current, {
        rotation: "+=720",
        duration: 1.2,
        ease: "power2.out",
        transformOrigin: "50% 50%",
      });

      // 3. Pause — icon rests
      tl.to({}, { duration: 0.4 });

      // 4. Wordmark blurs in + compass fades out simultaneously
      tl.to(
        wordmarkRef.current,
        {
          opacity: 1,
          filter: "blur(0px)",
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
        {/* Logo slot — compass and wordmark are both absolutely centred here */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: "clamp(280px, 90vw, 480px)", height: "160px" }}
        >
          {/* Compass icon */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={iconRef}
            src="/logo-icon-transparent.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "140px",
              height: "auto",
              opacity: 0,
              willChange: "transform, opacity",
              transformOrigin: "center center",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          />

          {/* Wordmark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={wordmarkRef}
            src="/logo-wordmark-transparent.png"
            alt="NordCreative"
            style={{
              position: "absolute",
              width: "clamp(280px, 90vw, 480px)",
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
