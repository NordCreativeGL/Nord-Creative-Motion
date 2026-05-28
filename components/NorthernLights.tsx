"use client";
import { useEffect, useRef } from "react";

const INTENSITY = 0.35;
const BASE_THICKNESS = 0.22;
const SPEED = 0.5;

const BANDS = [
  { yFrac: 0.15, amp: 0.11, freq: 0.70, phase: 0.0, speedMul: 1.40, thickMul: 0.45, alphaMul: 0.90, hueShift:  0, drift: 0.018 },
  { yFrac: 0.38, amp: 0.18, freq: 0.32, phase: 1.6, speedMul: 0.65, thickMul: 2.10, alphaMul: 0.50, hueShift: 10, drift: 0.009 },
  { yFrac: 0.57, amp: 0.14, freq: 0.85, phase: 3.8, speedMul: 1.70, thickMul: 0.60, alphaMul: 0.85, hueShift: -8, drift: 0.022 },
  { yFrac: 0.88, amp: 0.09, freq: 0.44, phase: 5.1, speedMul: 0.45, thickMul: 1.70, alphaMul: 0.28, hueShift: 5, drift: 0.006 },
];

const SECTIONS = [
  { id: "gl-working", hue1: 128, hue2: 152 },
  { id: "gl-process", hue1: 192, hue2: 218 },
  { id: "gl-why",     hue1: 15,  hue2: 28  },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpHue(a: number, b: number, t: number): number {
  const diff = ((b - a) % 360 + 540) % 360 - 180;
  return ((a + diff * t) % 360 + 360) % 360;
}

export default function NorthernLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, t = 0, raf = 0;
    let sectionProgress = 0;
    let canvasVisible = true;

    function resize() {
      if (!canvas) return;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    // Fade out on hero and footer
    const heroEl = document.getElementById("gl-hero");
    const lastEl = document.getElementById("gl-why");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.target === heroEl) {
          canvas.style.opacity = e.isIntersecting ? "0" : "1";
        }
      });
    }, { threshold: 0.05 });
    if (heroEl) observer.observe(heroEl);

    function onScroll() {
      if (!lastEl) return;
      const pastContent = window.scrollY > lastEl.offsetTop + lastEl.offsetHeight - window.innerHeight * 0.3;
      if (pastContent) {
        canvas.style.opacity = "0";
      } else if (!heroEl || window.scrollY > (heroEl.offsetHeight * 0.9)) {
        canvas.style.opacity = "1";
      }

      // Per-section progress — sectionProgress = 2.0 the moment center enters gl-why
      const els = SECTIONS.map(s => document.getElementById(s.id));
      if (!els[0]) return;
      const center = window.scrollY + H * 0.5;
      let raw = 0;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const elTop = el.offsetTop;
        const elBot = elTop + el.offsetHeight;
        if (center <= elTop) { raw = i; break; }
        if (center <= elBot) { raw = i + (center - elTop) / el.offsetHeight; break; }
        raw = i + 1;
      }
      sectionProgress = Math.max(0, Math.min(SECTIONS.length - 1, raw));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function drawBand(b: typeof BANDS[0], hue: number, time: number) {
      const PTS = 220;
      const bH = H * BASE_THICKNESS * b.thickMul;
      const driftY = Math.sin(time * b.drift) * H * 0.035;
      const yBase = H * b.yFrac + driftY;
      const amp = b.amp * H;
      const h = (hue + b.hueShift + 360) % 360;
      const alpha = INTENSITY * b.alphaMul;

      const pts: number[] = [];
      for (let i = 0; i <= PTS; i++) {
        const frac = i / PTS;
        const w1 = Math.sin(frac * Math.PI * 2.0 * b.freq + time * b.speedMul + b.phase);
        const w2 = Math.sin(frac * Math.PI * 3.7 * b.freq + time * b.speedMul * 1.5 + b.phase + 1.1) * 0.42;
        const w3 = Math.sin(frac * Math.PI * 7.1 * b.freq + time * b.speedMul * 2.8 + b.phase + 2.7) * 0.18;
        const curtain = Math.sin(time * b.speedMul * 0.4 + b.phase * 0.5) * amp * 0.30;
        pts.push(yBase + (w1 + w2 + w3) * amp + curtain);
      }

      const midY = pts.reduce((a, c) => a + c, 0) / pts.length;
      const grad = ctx.createLinearGradient(0, midY - bH, 0, midY + bH);
      grad.addColorStop(0.00, `hsla(${h},88%,70%,0)`);
      grad.addColorStop(0.28, `hsla(${h},90%,73%,${alpha * 0.45})`);
      grad.addColorStop(0.50, `hsla(${h},93%,76%,${alpha})`);
      grad.addColorStop(0.72, `hsla(${(h + 10) % 360},82%,63%,${alpha * 0.38})`);
      grad.addColorStop(1.00, `hsla(${(h + 18) % 360},70%,55%,0)`);

      ctx.beginPath();
      ctx.moveTo(0, pts[0] - bH * 0.5);
      for (let i = 1; i <= PTS; i++) ctx.lineTo((i / PTS) * W, pts[i] - bH * 0.5);
      for (let i = PTS; i >= 0; i--) ctx.lineTo((i / PTS) * W, pts[i] + bH * 0.5);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const si = Math.floor(sectionProgress);
      const sf = sectionProgress - si;
      const s0 = SECTIONS[Math.min(si, SECTIONS.length - 1)];
      const s1 = SECTIONS[Math.min(si + 1, SECTIONS.length - 1)];
      const hue1 = lerpHue(s0.hue1, s1.hue1, sf);
      const hue2 = lerpHue(s0.hue2, s1.hue2, sf);
      BANDS.forEach((b, bi) => {
        drawBand(b, lerpHue(hue1, hue2, bi / (BANDS.length - 1)), t);
      });
      t += 0.007 * SPEED;
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.8s ease",
      }}
    />
  );
}
