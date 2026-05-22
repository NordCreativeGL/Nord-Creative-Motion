"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const wordmarkRef   = useRef<HTMLImageElement>(null);
  const taglineRef    = useRef<HTMLParagraphElement>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);
  const navbarRef     = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    navbarRef.current = document.getElementById("site-nav");

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Compass dimensions
    const compassR = Math.min(W, H) * 0.13; // radius of compass ring

    // Wordmark dimensions — based on SVG viewBox 2520.80 x 200
    // Wordmark display width = 72vw clamped to 1100px
    const wmW = Math.min(W * 0.72, 1100);
    const wmH = wmW * (200 / 2520.80);
    const wmX = (W - wmW) / 2; // left edge of wordmark
    const wmY = cy - wmH / 2;  // top edge of wordmark

    // O position in wordmark (SVG coords: x=310.6, y=80 out of 2520.80x200)
    const oX = wmX + wmW * (310.6 / 2520.80);
    const oY = wmY + wmH * (80 / 200);
    const oR = wmW * (71 / 2520.80); // O radius in final position

    // Needle/I position in wordmark (SVG coords: x=2093.8, y=82)
    const iX = wmX + wmW * (2093.8 / 2520.80);
    const iY = wmY + wmH * (82 / 200);

    // Animation state
    let animFrame: number;

    // Draw split circle (compass ring with gaps at north and south)
    function drawRing(x: number, y: number, r: number, opacity: number) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = "white";
      ctx.lineWidth = r * 0.06;
      ctx.lineCap = "round";
      // Two arcs with small gaps at top and bottom
      const gap = 0.12; // radians
      ctx.beginPath();
      ctx.arc(x, y, r, -Math.PI/2 + gap, Math.PI/2 - gap);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r, Math.PI/2 + gap, Math.PI*1.5 - gap);
      ctx.stroke();
      ctx.restore();
    }

    // Draw compass needle (diamond shape)
    function drawNeedle(x: number, y: number, r: number, angle: number, opacity: number) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "white";
      ctx.translate(x, y);
      ctx.rotate(angle);
      const h = r * 1.8; // needle height
      const w = r * 0.28; // needle width
      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.lineTo(w, 0);
      ctx.lineTo(0, h);
      ctx.lineTo(-w, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw wordmark letters (N_RD CREAT_VE without O and I)
    function drawLetters(opacity: number) {
      if (opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "white";
      ctx.textBaseline = "middle";

      const fontSize = wmH * 0.75;
      ctx.font = `200 ${fontSize}px Montserrat, sans-serif`;
      ctx.letterSpacing = `${wmW * 0.008}px`;

      // Draw N
      const letterY = cy;
      // We use the same x proportions from the SVG
      // N: x starts at 0
      const scale = wmW / 2520.80;

      ctx.textAlign = "left";
      ctx.fillText("N", wmX + 0 * scale, letterY);
      // RD (after O gap)
      ctx.fillText("RD", wmX + 420 * scale, letterY);
      // CREAT (after space)
      ctx.fillText("CREAT", wmX + 1085 * scale, letterY);
      // VE (after needle/I gap)
      ctx.fillText("VE", wmX + 2155 * scale, letterY);

      ctx.restore();
    }

    let startTime: number | null = null;

    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000; // seconds

      ctx.clearRect(0, 0, W, H);

      // === PHASE TIMING ===
      // 0.0 - 0.3s: compass fades in
      // 0.3 - 1.8s: needle spins (2 rotations)
      // 1.8 - 2.2s: pause with needle pointing north
      // 2.2 - 3.3s: split — ring moves to O, needle moves to I
      // 2.9 - 3.8s: letters blur in (opacity)
      // 3.8 - 4.5s: canvas fades out, hero fades in

      // Compass opacity
      const compassOpacity = Math.min(t / 0.3, 1);

      // Needle spin: t=0.3 to t=1.8
      let needleAngle = 0;
      if (t >= 0.3 && t < 1.8) {
        const spinT = (t - 0.3) / 1.5;
        needleAngle = spinT * Math.PI * 4; // 2 full rotations
      }

      // Split progress: t=2.2 to t=3.3
      const splitDur = 1.1;
      const splitStart = 2.2;
      let splitP = 0;
      if (t >= splitStart) {
        splitP = Math.min((t - splitStart) / splitDur, 1);
        // ease inOut
        splitP = splitP < 0.5 ? 2*splitP*splitP : -1+(4-2*splitP)*splitP;
      }

      // Ring position and size
      const ringX = cx + (oX - cx) * splitP;
      const ringY = cy + (oY - cy) * splitP;
      const ringR = compassR + (oR - compassR) * splitP;

      // Needle position
      const nX = cx + (iX - cx) * splitP;
      const nY = cy + (iY - cy) * splitP;

      // Letters opacity: t=2.9 to t=3.8
      const lettersOpacity = t >= 2.9 ? Math.min((t - 2.9) / 0.9, 1) : 0;

      // Canvas opacity: t=3.8 to t=4.5
      const canvasOpacity = t >= 3.8 ? Math.max(1 - (t - 3.8) / 0.7, 0) : 1;

      // Draw everything
      ctx.save();
      ctx.globalAlpha = canvasOpacity;

      drawRing(ringX, ringY, ringR, compassOpacity);
      drawNeedle(nX, nY, ringR, needleAngle, compassOpacity);
      drawLetters(lettersOpacity);

      ctx.restore();

      // Trigger hero fade in at t=3.8
      if (t >= 3.8 && t < 3.85) {
        fadeInHero();
      }

      if (t < 5.0) {
        animFrame = requestAnimationFrame(animate);
      } else {
        canvas.style.display = "none";
      }
    }

    // Load Montserrat font before starting
    document.fonts.load(`200 48px Montserrat`).then(() => {
      animFrame = requestAnimationFrame(animate);
    });

    function fadeInHero() {
      const navbar = navbarRef.current;
      const video = videoRef.current;
      const wordmark = wordmarkRef.current;
      const tagline = taglineRef.current;
      const scroll = scrollRef.current;

      const tl = gsap.timeline();
      if (video)    tl.to(video,    { opacity: 1, duration: 1.5, ease: "power2.out" }, 0);
      if (wordmark) tl.to(wordmark, { opacity: 1, filter: "blur(0px)", duration: 1.0, ease: "power2.out" }, 0.2);
      if (tagline)  tl.to(tagline,  { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.8);
      if (navbar)   tl.to(navbar,   { opacity: 1, duration: 0.8, ease: "power2.out" }, 1.0);
      if (scroll)   tl.to(scroll,   { opacity: 1, duration: 0.6, ease: "power2.out" }, 1.2);

      // Scroll parallax
      const section = sectionRef.current;
      const content = contentRef.current;
      if (content) {
        gsap.to(content, {
          opacity: 0, scale: 0.95, ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "45% top", scrub: 1 },
        });
      }
      if (video) {
        gsap.to(video, {
          scale: 1.08, ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.5 },
        });
      }
    }

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Canvas intro animation */}
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 100, pointerEvents: "none" }}
      />

      {/* Video */}
      <video
        ref={videoRef}
        src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P19(1)A.mp4"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0, willChange: "transform, opacity" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div ref={contentRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5">
        <img
          ref={wordmarkRef}
          src="/logos/final/svg/nord-creative-wordmark-needle-white.svg"
          alt="Nord Creative"
          draggable={false}
          style={{ width: "clamp(320px, 72vw, 1100px)", height: "auto", opacity: 0, filter: "blur(12px)" }}
        />
        <p ref={taglineRef} className="text-xs tracking-[0.3em] uppercase text-white/60" style={{ opacity: 0 }}>
          Video Production · Photography · Arctic Storytelling
        </p>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" style={{ opacity: 0 }}>
        <div className="w-px h-10 bg-white/50" />
        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true" className="animate-bounce">
          <path d="M1 1L6 6L11 1" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
