"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const compassRef  = useRef<SVGSVGElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const taglineRef  = useRef<HTMLParagraphElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const ctxRef      = useRef<gsap.Context | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let cancelled = false;
    const navbar = document.getElementById("site-nav");

    fetch("/logo-wordmark.svg")
      .then((r) => r.text())
      .then((svgText) => {
        if (cancelled) return;

        // Capture refs at resolve time (guaranteed non-null for static elements)
        const container = wordmarkRef.current;
        const compass   = compassRef.current;
        const video     = videoRef.current;
        const content   = contentRef.current;
        const tagline   = taglineRef.current;
        const scroll    = scrollRef.current;
        const section   = sectionRef.current;

        if (!container || !compass) return;

        // ── Inject wordmark SVG ─────────────────────────────────────────
        container.innerHTML = svgText;

        const svgEl = container.querySelector("svg");
        if (svgEl) {
          svgEl.removeAttribute("width");
          svgEl.removeAttribute("height");
          svgEl.style.width   = "100%";
          svgEl.style.height  = "auto";
          svgEl.style.display = "block";
        }

        // ── Build animation inside a tracked context ────────────────────
        ctxRef.current = gsap.context(() => {
          // Initial states: hide all letters except O and needle
          const hiddenIds = ["N", "R1", "D", "C", "R2", "E1", "A", "T", "V", "E2"];
          hiddenIds.forEach((id) => {
            const el = container.querySelector(`#${id}`);
            if (el) gsap.set(el, { opacity: 0, filter: "blur(6px)" });
          });
          // O_left, O_right, I_needle keep their default opacity:1

          // Wordmark container starts hidden and scaled down
          gsap.set(container, {
            opacity: 0,
            scale: 0.15,
            transformOrigin: "center center",
          });

          const tl = gsap.timeline();

          // ─────────────────────────────────────────────────────────────
          // Phase 1 — Compass (t=0 → 2.0)
          // CSS needleSpin: 0.3s delay + 1.5s spin = done at t=1.8
          // GSAP picks up after a 0.2s natural rest at t=2.0
          // ─────────────────────────────────────────────────────────────
          tl.to(compass, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);

          // ─────────────────────────────────────────────────────────────
          // Phase 2 — Morph compass → wordmark (t=2.0 → 3.2)
          // Compass fades out, wordmark scales in simultaneously.
          // O_left, O_right, I_needle are already opacity:1 inside the
          // container, so they become visible as the container fades in.
          // ─────────────────────────────────────────────────────────────
          tl.to(compass, { opacity: 0, duration: 0.4, ease: "power2.out" }, 2.0);
          tl.to(
            container,
            { opacity: 1, scale: 1, width: "clamp(600px, 80vw, 1100px)", maxWidth: "clamp(600px, 80vw, 1100px)", aspectRatio: "1321 / 79", duration: 1.2, ease: "power2.inOut" },
            2.0
          );

          // ─────────────────────────────────────────────────────────────
          // Phase 3 — Staggered letter reveal (t=3.2 → ~4.5)
          // Letters animate in with blur dissolve, 0.5s each.
          // Offsets match the spec exactly; O + needle stay visible.
          // ─────────────────────────────────────────────────────────────
          const reveals = [
            { id: "N",  o: 0.00 },
            { id: "R1", o: 0.06 },
            { id: "D",  o: 0.12 },
            { id: "C",  o: 0.24 },
            { id: "R2", o: 0.30 },
            { id: "E1", o: 0.36 },
            { id: "A",  o: 0.42 },
            { id: "T",  o: 0.48 },
            { id: "V",  o: 0.54 },
            { id: "E2", o: 0.60 },
          ];
          reveals.forEach(({ id, o }) => {
            const el = container.querySelector(`#${id}`);
            if (el) {
              tl.to(
                el,
                { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
                3.2 + o
              );
            }
          });

          // ─────────────────────────────────────────────────────────────
          // Phase 4 — Video, tagline, scroll indicator, navbar
          // ─────────────────────────────────────────────────────────────
          if (video)  tl.to(video,   { opacity: 1, duration: 1.5, ease: "power2.out" }, 4.5);
          if (tagline) tl.to(tagline, { opacity: 1, duration: 0.8, ease: "power2.out" }, 5.5);
          if (scroll) tl.to(scroll,  { opacity: 1, duration: 0.6, ease: "power2.out" }, 6.0);
          if (navbar) tl.to(navbar,  { opacity: 1, duration: 0.9, ease: "power2.out" }, 6.5);

          // ─────────────────────────────────────────────────────────────
          // Scroll parallax
          // ─────────────────────────────────────────────────────────────
          if (content) {
            gsap.to(content, {
              opacity: 0,
              scale: 0.95,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "45% top",
                scrub: 1,
              },
            });
          }
          if (video) {
            gsap.to(video, {
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
              },
            });
          }
        });
      })
      .catch((err) => console.error("HeroSection: failed to load wordmark SVG", err));

    return () => {
      cancelled = true;
      ctxRef.current?.revert();
    };
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

      {/* ── Content (fades on scroll) ──────────────────────────────────── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Compass + wordmark share the same anchor */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: "clamp(600px, 80vw, 1100px)" }}
        >
          {/* ── Standalone compass SVG (Phase 1 only) ──────────────────── */}
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
            {/* Ring: two 170° arcs with ~10° gap at north and south */}
            <g>
              <path
                d="M 53.9 5.2 A 45 45 0 0 1 53.9 94.8 M 46.1 94.8 A 45 45 0 0 1 46.1 5.2"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            {/* Needle — #compass-needle CSS rule in globals.css drives the spin */}
            <g id="compass-needle">
              <polygon points="50,8 56,50 50,92 44,50" fill="white" />
            </g>
          </svg>

          {/* ── Wordmark container — SVG from /public/logo-wordmark.svg injected here ── */}
          <div
            ref={wordmarkRef}
            style={{
              width: "clamp(600px, 80vw, 1100px)",
              maxWidth: "clamp(600px, 80vw, 1100px)",
              aspectRatio: "1321 / 79",
              padding: "0 40px",
              opacity: 0,
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
