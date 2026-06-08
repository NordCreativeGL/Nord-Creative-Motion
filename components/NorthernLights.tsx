"use client";
import { useEffect, useRef } from "react";

// ── Seeded RNG ────────────────────────────────────────────────────────────────
let _rng = 98321;
function sRng(): number {
  _rng = (_rng ^ (_rng << 13)) ^ (_rng >> 17) ^ (_rng << 5);
  return ((_rng >>> 0) / 4294967296);
}

// ── Patch types ───────────────────────────────────────────────────────────────
interface AuroraPatch {
  x: number; yc: number; rxF: number; ryF: number;
  br: number; ph: number; phY: number; sp: number; spY: number;
  dr: number; hs: number; tilt: number;
}
interface PinkPatch {
  x: number; yc: number; rxF: number; ryF: number;
  br: number; ph: number; sp: number; dr: number; tilt: number;
}

// ── Patch arrays (seeded — stable layout on every load) ───────────────────────
_rng = 98321;
const AURORA_MAIN: AuroraPatch[] = Array.from({ length: 34 }, (_, i) => ({
  x:   ((i / 34) + sRng() * 0.04 - 0.02 + 1) % 1,
  yc:  0.24 + sRng() * 0.12,
  rxF: 0.065 + sRng() * 0.095,
  ryF: 1.6  + sRng() * 2.2,
  br:  0.30 + sRng() * 0.65,
  ph:  sRng() * Math.PI * 2,
  phY: sRng() * Math.PI * 2,
  sp:  0.28 + sRng() * 0.55,
  spY: 0.35 + sRng() * 0.50,
  dr:  (sRng() - 0.5) * 0.00016,
  hs:  (sRng() - 0.5) * 18,
  tilt:(sRng() - 0.5) * 0.20,
}));

const AURORA_UPPER: AuroraPatch[] = Array.from({ length: 16 }, (_, i) => ({
  x:   ((i / 16) + sRng() * 0.06 - 0.03 + 1) % 1,
  yc:  0.14 + sRng() * 0.08,
  rxF: 0.045 + sRng() * 0.065,
  ryF: 1.2  + sRng() * 1.8,
  br:  0.12 + sRng() * 0.28,
  ph:  sRng() * Math.PI * 2,
  phY: sRng() * Math.PI * 2,
  sp:  0.35 + sRng() * 0.60,
  spY: 0.40 + sRng() * 0.55,
  dr:  (sRng() - 0.5) * 0.00012,
  hs:  (sRng() - 0.5) * 14,
  tilt:(sRng() - 0.5) * 0.15,
}));

const AURORA_PINK: PinkPatch[] = Array.from({ length: 10 }, (_, i) => ({
  x:   ((i / 10) + sRng() * 0.08 - 0.04 + 1) % 1,
  yc:  0.36 + sRng() * 0.07,
  rxF: 0.040 + sRng() * 0.060,
  ryF: 0.6  + sRng() * 1.0,
  br:  0.12 + sRng() * 0.30,
  ph:  sRng() * Math.PI * 2,
  sp:  0.32 + sRng() * 0.55,
  dr:  (sRng() - 0.5) * 0.00014,
  tilt:(sRng() - 0.5) * 0.25,
}));

// ── Section colour config ─────────────────────────────────────────────────────
type NLSection = { id: string; mainHue: number; upperHue: number; upperScale: number; fringeHue: number; fringeScale: number };
const SECTIONS: NLSection[] = [
  { id: "gl-working", mainHue: 135, upperHue: 358, upperScale: 0.35, fringeHue: 215, fringeScale: 0.75 },
  { id: "gl-process", mainHue: 215, upperHue: 270, upperScale: 0.40, fringeHue: 282, fringeScale: 0.45 },
  { id: "gl-why",     mainHue: 358, upperHue: 135, upperScale: 0.32, fringeHue: 215, fringeScale: 0.68 },
];

function lerpHue(a: number, b: number, t: number): number {
  const diff = ((b - a) % 360 + 540) % 360 - 180;
  return ((a + diff * t) % 360 + 360) % 360;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NorthernLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let W = 0, H = 0, tp = 0, raf = 0;
    let sectionProgress = 0;

    function resize() {
      if (!canvas) return;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    const lastEl = document.getElementById("gl-why");

    function onScroll() {
      if (!lastEl) return;
      const pastContent =
        window.scrollY > lastEl.offsetTop + lastEl.offsetHeight - window.innerHeight * 0.3;
      if (pastContent) {
        canvas.style.opacity = "0";
      } else if (window.scrollY > 100) {
        canvas.style.opacity = "1";
      }
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

    function drawPatches(
      mainHue: number, mainFade: number,
      upperHue: number, upperScale: number,
      fringeHue: number, fringeScale: number
    ) {
      const masterBase = 0.72 + 0.28 * Math.sin(tp * 0.22);
      function patch(p: AuroraPatch | PinkPatch, pHue: number, layerScale: number) {
        p.x = ((p.x + p.dr + 1) % 1);
        const phY = (p as AuroraPatch).phY ?? 0;
        const spY = (p as AuroraPatch).spY ?? 0.4;
        const cy  = (p.yc + 0.016 * Math.sin(tp * spY + phY)) * H;
        const rx  = p.rxF * W;
        const raw = 0.52 + 0.48 * Math.sin(tp * p.sp + p.ph);
        const br  = p.br * raw * masterBase * layerScale;
        if (br < 0.018) return;
        ctx.save();
        ctx.translate(p.x * W, cy);
        if (p.tilt) ctx.rotate(p.tilt);
        ctx.scale(1, p.ryF);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        g.addColorStop(0,    `hsla(${pHue},92%,72%,${Math.min(1, br * 0.88)})`);
        g.addColorStop(0.28, `hsla(${pHue},90%,70%,${Math.min(1, br * 0.55)})`);
        g.addColorStop(0.58, `hsla(${pHue},88%,68%,${Math.min(1, br * 0.22)})`);
        g.addColorStop(0.82, `hsla(${pHue},85%,65%,${Math.min(1, br * 0.06)})`);
        g.addColorStop(1,    `hsla(${pHue},82%,62%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      AURORA_MAIN.forEach(p  => patch(p, mainHue  + ((p as AuroraPatch).hs ?? 0), mainFade));
      AURORA_UPPER.forEach(p => patch(p, upperHue + ((p as AuroraPatch).hs ?? 0), upperScale));
      AURORA_PINK.forEach(p  => patch(p, fringeHue, fringeScale));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const si = Math.floor(sectionProgress);
      const sf = sectionProgress - si;
      const s0 = SECTIONS[Math.min(si,     SECTIONS.length - 1)];
      const s1 = SECTIONS[Math.min(si + 1, SECTIONS.length - 1)];
      const rawExit   = Math.max(0, Math.min(1, (sf - 0.40) / 0.60));
      const exitBlendT = rawExit * rawExit * (3 - 2 * rawExit);
      const upperHue   = lerpHue(s0.upperHue,  s1.upperHue,  exitBlendT);
      const upperScale = s0.upperScale  + (s1.upperScale  - s0.upperScale)  * exitBlendT;
      const fringeHue  = lerpHue(s0.fringeHue, s1.fringeHue, exitBlendT);
      const fringeScale = s0.fringeScale + (s1.fringeScale - s0.fringeScale) * exitBlendT;
      (window as any).__nlHue = exitBlendT <= 0.5 ? s0.mainHue : s1.mainHue;
      if (exitBlendT > 0) {
        drawPatches(s0.mainHue, 1 - exitBlendT, upperHue, upperScale * 0.5, fringeHue, fringeScale * 0.5);
        drawPatches(s1.mainHue, exitBlendT,     upperHue, upperScale * 0.5, fringeHue, fringeScale * 0.5);
      } else {
        drawPatches(s0.mainHue, 1.0, upperHue, upperScale, fringeHue, fringeScale);
      }
      tp  += 0.007;
      raf  = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        width:         "100vw",
        height:        "100vh",
        zIndex:        0,
        pointerEvents: "none",
        opacity:       0,
        transition:    "opacity 0.8s ease",
      }}
    />
  );
}
