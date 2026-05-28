"use client";
import { useEffect, useRef } from "react";

const INTENSITY = 0.20;
const SPEED = 0.22;
const NCP = 10;

const SHEET_DEFS = [
  { yBase: 0.08, thickness: 0.65, blur: 48, alphaMul: 0.70, hueOffset:  0 },
  { yBase: 0.28, thickness: 0.72, blur: 36, alphaMul: 0.85, hueOffset: 14 },
  { yBase: 0.48, thickness: 0.68, blur: 44, alphaMul: 0.75, hueOffset: -8 },
  { yBase: 0.65, thickness: 0.70, blur: 52, alphaMul: 0.60, hueOffset:  6 },
  { yBase: 0.82, thickness: 0.62, blur: 40, alphaMul: 0.55, hueOffset: 20 },
  { yBase: 0.95, thickness: 0.58, blur: 32, alphaMul: 0.45, hueOffset: -5 },
];

type NLSection = { id: string; hue1: number; hue2: number; bandHues?: number[] };

const SECTIONS: NLSection[] = [
  { id: "gl-working", hue1: 128, hue2: 152 },
  { id: "gl-process", hue1: 192, hue2: 218 },
  { id: "gl-why",     hue1: 12,  hue2: 22,  bandHues: [8, 228, 18, 232, 12, 225] },
];

function lerpHue(a: number, b: number, t: number): number {
  const diff = ((b - a) % 360 + 540) % 360 - 180;
  return ((a + diff * t) % 360 + 360) % 360;
}
function easeInOut(p: number) { return p < 0.5 ? 2*p*p : -1+(4-2*p)*p; }
function catmull(p0: number, p1: number, p2: number, p3: number, t: number) {
  return 0.5*((2*p1)+(p2-p0)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t);
}

type SheetState = {
  yBase: number; thickness: number; blur: number; alphaMul: number; hueOffset: number;
  pts: Array<{ y: number; ty: number; prog: number; dur: number; cy: number }>;
  tpts: Array<{ v: number; tv: number; prog: number; dur: number; cv: number }>;
};

function makeSheetState(def: typeof SHEET_DEFS[0]): SheetState {
  return {
    ...def,
    pts: Array.from({ length: NCP }, () => ({
      y: def.yBase + (Math.random() - 0.5) * 0.08,
      ty: def.yBase + (Math.random() - 0.5) * 0.14,
      prog: Math.random(), dur: 0.0006 + Math.random() * 0.0012, cy: def.yBase,
    })),
    tpts: Array.from({ length: NCP }, () => ({
      v: 0.5 + Math.random() * 0.8, tv: 0.3 + Math.random() * 1.0,
      prog: Math.random(), dur: 0.0007 + Math.random() * 0.002, cv: 0.7,
    })),
  };
}

export default function NorthernLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, raf = 0;
    let sectionProgress = 0;

    const offCv = document.createElement("canvas");
    const offCx = offCv.getContext("2d")!;
    const sheets: SheetState[] = SHEET_DEFS.map(makeSheetState);

    function resize() {
      if (!canvas) return;
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = devicePixelRatio;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      offCv.width = W * dpr; offCv.height = H * dpr;
      offCx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    const heroEl = document.getElementById("gl-hero");
    const lastEl = document.getElementById("gl-why");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.target === heroEl) canvas.style.opacity = e.isIntersecting ? "0" : "1";
      });
    }, { threshold: 0.05 });
    if (heroEl) observer.observe(heroEl);

    function onScroll() {
      if (!lastEl) return;
      const pastContent = window.scrollY > lastEl.offsetTop + lastEl.offsetHeight - window.innerHeight * 0.3;
      if (pastContent) {
        canvas.style.opacity = "0";
      } else if (!heroEl || window.scrollY > heroEl.offsetHeight * 0.9) {
        canvas.style.opacity = "1";
      }
      const els = SECTIONS.map(s => document.getElementById(s.id));
      if (!els[0]) return;
      const center = window.scrollY + H * 0.5;
      let raw = 0;
      for (let i = 0; i < els.length; i++) {
        const el = els[i]; if (!el) continue;
        const elTop = el.offsetTop, elBot = elTop + el.offsetHeight;
        if (center <= elTop) { raw = i; break; }
        if (center <= elBot) { raw = i + (center - elTop) / el.offsetHeight; break; }
        raw = i + 1;
      }
      sectionProgress = Math.max(0, Math.min(SECTIONS.length - 1, raw));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function updateSheet(s: SheetState) {
      for (const p of s.pts) {
        p.prog += p.dur * SPEED * 60;
        if (p.prog >= 1) { p.y = p.ty; p.ty = s.yBase + (Math.random()-0.5)*0.18; p.prog = 0; p.dur = 0.0006+Math.random()*0.0012; }
        p.cy = p.y + (p.ty - p.y) * easeInOut(Math.min(p.prog, 1));
      }
      for (const p of s.tpts) {
        p.prog += p.dur * SPEED * 60;
        if (p.prog >= 1) { p.v = p.tv; p.tv = 0.15+Math.random()*1.2; p.prog = 0; p.dur = 0.0007+Math.random()*0.002; }
        p.cv = p.v + (p.tv - p.v) * easeInOut(Math.min(p.prog, 1));
      }
    }

    function getSpine(s: SheetState, count: number) {
      const out: Array<{ x: number; y: number; th: number }> = [];
      for (let i = 0; i < count; i++) {
        const fx = -0.18 + (i / (count - 1)) * 1.36;
        const norm = Math.max(0, Math.min(1, (fx + 0.18) / 1.36));
        const seg = (NCP - 1) * norm;
        const si = Math.floor(seg), sf = seg - si;
        const i0 = Math.max(0, si-1), i1 = si, i2 = Math.min(NCP-1, si+1), i3 = Math.min(NCP-1, si+2);
        const py = catmull(s.pts[i0].cy, s.pts[i1].cy, s.pts[i2].cy, s.pts[i3].cy, sf);
        const th = catmull(s.tpts[i0].cv, s.tpts[i1].cv, s.tpts[i2].cv, s.tpts[i3].cv, sf);
        out.push({ x: fx * W, y: py * H, th: Math.max(0.1, th) });
      }
      return out;
    }

    function edgeFade(x: number) {
      const fx = x / W;
      if (fx < 0 || fx > 1) return 0;
      if (fx < 0.10) return fx / 0.10;
      if (fx > 0.90) return (1 - fx) / 0.10;
      return 1;
    }

    function drawSheet(s: SheetState, hue: number) {
      const SPTS = 100;
      const pts = getSpine(s, SPTS);
      const thH = s.thickness * H;
      const sat = hue > 150 && hue < 260 ? 80 : 88;
      const lit = hue > 150 && hue < 260 ? 70 : 72;
      offCx.clearRect(0, 0, W, H);
      offCx.save();
      offCx.filter = `blur(${s.blur}px)`;
      for (let i = 0; i < SPTS - 1; i++) {
        const p = pts[i], pn = pts[i+1];
        const ef = edgeFade((p.x + pn.x) * 0.5);
        if (ef <= 0) continue;
        const sliceA = s.alphaMul * INTENSITY * p.th * ef;
        const topY = p.y - p.th * thH * 0.5;
        const botY = p.y + p.th * thH * 0.5;
        const sliceW = Math.abs(pn.x - p.x) + 1;
        const grad = offCx.createLinearGradient(0, topY, 0, botY);
        grad.addColorStop(0,    `hsla(${hue},${sat}%,${lit}%,0)`);
        grad.addColorStop(0.10, `hsla(${hue},${sat+4}%,${lit+6}%,${sliceA*0.4})`);
        grad.addColorStop(0.38, `hsla(${hue},${sat+6}%,${lit+8}%,${sliceA})`);
        grad.addColorStop(0.62, `hsla(${hue},${sat+6}%,${lit+8}%,${sliceA})`);
        grad.addColorStop(0.90, `hsla(${hue},${sat+3}%,${lit+4}%,${sliceA*0.35})`);
        grad.addColorStop(1,    `hsla(${hue},${sat}%,${lit}%,0)`);
        offCx.fillStyle = grad;
        offCx.fillRect(Math.min(p.x, pn.x), topY - thH*0.08, sliceW, botY - topY + thH*0.16);
      }
      offCx.restore();
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(offCv, 0, 0, W * devicePixelRatio, H * devicePixelRatio, 0, 0, W, H);
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const si = Math.floor(sectionProgress);
      const sf = sectionProgress - si;
      const s0 = SECTIONS[Math.min(si, SECTIONS.length - 1)];
      const s1 = SECTIONS[Math.min(si + 1, SECTIONS.length - 1)];
      const hue1 = lerpHue(s0.hue1, s1.hue1, sf);
      const hue2 = lerpHue(s0.hue2, s1.hue2, sf);
      const nearestIdx = Math.max(0, Math.min(SECTIONS.length - 1, Math.round(sectionProgress)));
      const weight = 1 - Math.abs(sectionProgress - nearestIdx);
      const blendT = Math.max(0, (weight - 0.5) * 2);
      const nearestSection = SECTIONS[nearestIdx];
      const sorted = [...sheets].sort((a, b) => a.alphaMul - b.alphaMul);
      sorted.forEach((s, i) => {
        updateSheet(s);
        let h = lerpHue(hue1, hue2, i / (sheets.length - 1));
        h = ((h + s.hueOffset) % 360 + 360) % 360;
        if (nearestSection.bandHues && i < nearestSection.bandHues.length) {
          h = lerpHue(h, nearestSection.bandHues[i], blendT);
        }
        drawSheet(s, h);
      });
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
        position: "fixed", inset: 0, width: "100vw", height: "100vh",
        zIndex: 0, pointerEvents: "none", opacity: 0, transition: "opacity 0.8s ease",
      }}
    />
  );
}
