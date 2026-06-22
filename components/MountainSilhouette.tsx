"use client";
import { useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Pt = [number, number];
interface MLayer { p: number; c: [number,number,number]; rs: number; pts: Pt[]; }
interface Couloir { sx:number; sy:number; mx:number; my:number; ex:number; ey:number; al:number; w:number; }
interface Stratum { x1:number; y1:number; x2:number; y2:number; al:number; w:number; }
interface LayerTex { couloirs: Couloir[]; strata: Stratum[]; }

// ── Seeded RNG (stable texture layout) ───────────────────────────────────────
let _rs = 12345;
function sr(): number {
  _rs = (_rs ^ (_rs << 13)) ^ (_rs >> 17) ^ (_rs << 5);
  return ((_rs >>> 0) / 4294967296);
}

// ── Mountain layers — y coords calibrated to 50vh canvas ─────────────────────
// y=0 = top of canvas (≈ mid-viewport), y=1 = bottom of canvas
// Peaks matched to existing SVG scale: tallest ~0.08, horizon ~0.55
const BASE_LAYERS: MLayer[] = [
  // Layer 1: distant horizon, gentle rolls
  { p:0.001, c:[6,10,24], rs:0,
    pts:[[0,.57],[.10,.54],[.22,.56],[.35,.53],[.47,.55],[.58,.52],[.70,.54],[.82,.52],[.93,.54],[1,.56]] },

  // Layer 2: far mountains, wider domes
  { p:0.003, c:[5,8,20], rs:0.0006,
    pts:[[0,.51],[.06,.47],[.12,.42],[.18,.46],[.24,.40],[.30,.44],[.36,.38],[.42,.42],[.48,.36],
         [.54,.40],[.60,.35],[.66,.39],[.72,.36],[.78,.41],[.84,.43],[.90,.40],[.96,.44],[1,.46]] },

  // Layer 3: mid — first table mountains, detailed ridges
  { p:0.006, c:[4,6,16], rs:0.0012,
    pts:[[0,.45],[.03,.40],[.07,.34],[.10,.28],[.12,.22],[.145,.20],[.165,.19],[.185,.21],[.20,.24],[.21,.29],
         [.24,.22],[.27,.17],[.285,.15],[.295,.17],[.30,.20],[.33,.15],[.355,.12],[.365,.13],[.375,.12],
         [.385,.14],[.39,.17],[.42,.13],[.44,.11],[.445,.11],[.455,.13],[.46,.16],[.49,.12],[.51,.10],
         [.52,.10],[.53,.12],[.545,.15],[.57,.11],[.585,.10],[.59,.10],[.60,.12],[.61,.15],[.63,.11],
         [.65,.10],[.66,.10],[.67,.12],[.68,.16],[.71,.20],[.74,.14],[.76,.12],[.77,.13],[.79,.16],
         [.82,.21],[.86,.25],[.91,.29],[.96,.33],[1,.36]] },

  // Layer 4: HERO — table mountain + spires + plateau + double peak
  { p:0.010, c:[3,5,12], rs:0.0010,
    pts:[[0,.48],[.02,.44],[.04,.37],[.07,.28],[.085,.23],[.095,.19],[.108,.17],[.125,.16],[.140,.16],
         [.152,.18],[.165,.23],[.18,.31],[.20,.36],
         [.215,.28],[.235,.18],[.248,.12],[.258,.08],[.262,.08],
         [.268,.12],[.276,.09],[.284,.14],
         [.298,.25],[.318,.19],[.340,.13],[.352,.11],[.362,.12],[.372,.10],[.383,.08],
         [.395,.06],[.408,.05],[.420,.04],[.432,.04],[.444,.06],[.456,.08],
         [.470,.13],[.484,.22],[.496,.16],[.508,.14],[.516,.17],
         [.534,.22],[.546,.14],[.556,.08],[.564,.07],[.572,.08],[.585,.14],
         [.600,.21],[.618,.12],[.638,.08],[.650,.05],[.659,.04],[.667,.04],[.676,.08],[.690,.21],
         [.708,.14],[.722,.19],[.745,.16],[.765,.20],[.800,.27],[.840,.32],[.888,.37],[.942,.42],[1,.44]] },

  // Layer 5: near mountains — broader, different rhythm from hero
  { p:0.018, c:[2,3,9], rs:0.0015,
    pts:[[0,.53],[.05,.47],[.09,.42],[.14,.37],[.18,.42],[.23,.36],[.27,.40],[.31,.34],
         [.35,.31],[.38,.29],[.41,.32],[.44,.36],[.47,.31],[.51,.35],[.55,.40],[.59,.34],
         [.62,.38],[.66,.43],[.70,.37],[.74,.42],[.79,.46],[.84,.43],[.89,.47],[1,.50]] },

  // Layer 6: dark front ridge — jagged, low, different character
  { p:0.028, c:[1,2,5], rs:0.0025,
    pts:[[0,.62],[.05,.58],[.10,.54],[.15,.58],[.21,.52],[.28,.56],[.34,.50],
         [.40,.54],[.46,.49],[.52,.53],[.58,.48],[.64,.52],[.69,.49],
         [.75,.53],[.81,.57],[.87,.54],[.93,.58],[1,.61]] },
];

// ── Roughen paths (seeded, stable) ────────────────────────────────────────────
function refine(pts: Pt[], rs: number): Pt[] {
  if (rs === 0) return pts;
  const out: Pt[] = [];
  const intv = 0.010;
  for (let i = 0; i < pts.length - 1; i++) {
    out.push(pts[i]);
    const dx = pts[i+1][0]-pts[i][0], dy = pts[i+1][1]-pts[i][1];
    const n = Math.max(0, Math.floor(Math.sqrt(dx*dx+dy*dy)/intv)-1);
    for (let j = 1; j <= n; j++) {
      const t = j/(n+1);
      out.push([pts[i][0]+dx*t+(sr()-0.5)*rs, pts[i][1]+dy*t+(sr()-0.5)*rs*0.4]);
    }
  }
  out.push(pts[pts.length-1]);
  return out;
}
_rs = 12345;
const RPTS: Pt[][] = BASE_LAYERS.map(l => refine(l.pts, l.rs));

// ── Pre-compute couloirs + strata (seeded) ────────────────────────────────────
function buildTex(pts: Pt[], li: number): LayerTex {
  const couloirs: Couloir[] = [];
  const strata:   Stratum[] = [];
  for (let i = 1; i < pts.length-1; i++) {
    const pv=pts[i-1], cu=pts[i], nx=pts[i+1];
    const prom = Math.min(pv[1],nx[1]) - cu[1];
    if (cu[1]<pv[1] && cu[1]<nx[1] && prom>0.012) {
      const nC = prom>0.055?3:prom>0.028?2:1;
      for (let c=0; c<nC; c++) {
        const side = c===0?-1:c===1?1:(sr()>.5?-1:1);
        const xOff = side*(0.007+c*0.005+sr()*0.006);
        const dep  = 0.045+sr()*0.065;
        const wx   = (sr()-0.5)*0.005;
        couloirs.push({ sx:cu[0], sy:cu[1], mx:cu[0]+xOff*0.5+wx, my:cu[1]+dep*0.42,
                         ex:cu[0]+xOff+wx*0.5, ey:cu[1]+dep, al:0.08+sr()*0.13, w:0.4+sr()*0.8 });
      }
      if (prom>0.030 && li>=2) {
        const fdir = nx[1]>pv[1]?1:-1;
        for (let s=1; s<=2+Math.floor(sr()*2); s++) {
          const sy2=cu[1]+s*0.020+sr()*0.010;
          strata.push({ x1:cu[0]+fdir*0.010+sr()*0.005, y1:sy2+(sr()-0.5)*0.007,
                         x2:cu[0]+fdir*(0.030+sr()*0.022), y2:sy2-(sr()-0.5)*0.007,
                         al:0.06+sr()*0.07, w:0.4+sr()*0.4 });
        }
      }
    }
  }
  return { couloirs, strata };
}
const MTEX: LayerTex[] = BASE_LAYERS.map((l,li) => buildTex(l.pts, li));

// ── Component ─────────────────────────────────────────────────────────────────
export default function MountainSilhouette() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let W = 0, H = 0, rafId = 0;

    function resize() {
      if (!canvas) return;
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width  = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      draw();
    }

    function drawLayer(l: MLayer, rpts: Pt[], tex: LayerTex, oy: number, li: number) {
      const [r,g,b] = l.c;

      // Mountain fill
      ctx.beginPath();
      ctx.moveTo(rpts[0][0]*W, rpts[0][1]*H+oy);
      for (let i=1; i<rpts.length; i++) ctx.lineTo(rpts[i][0]*W, rpts[i][1]*H+oy);
      ctx.lineTo(W, H+10); ctx.lineTo(0, H+10);
      ctx.closePath();
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();

      // Couloirs
      ctx.lineCap = "round";
      tex.couloirs.forEach(c => {
        ctx.beginPath();
        ctx.moveTo(c.sx*W, c.sy*H+oy);
        ctx.quadraticCurveTo(c.mx*W, c.my*H+oy, c.ex*W, c.ey*H+oy);
        ctx.strokeStyle = `rgba(0,0,0,${c.al})`;
        ctx.lineWidth   = c.w;
        ctx.stroke();
      });

      // Rock strata
      tex.strata.forEach(s => {
        ctx.beginPath();
        ctx.moveTo(s.x1*W, s.y1*H+oy); ctx.lineTo(s.x2*W, s.y2*H+oy);
        ctx.strokeStyle = `rgba(0,0,0,${s.al})`; ctx.lineWidth = s.w; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s.x1*W, s.y1*H+oy-1); ctx.lineTo(s.x2*W, s.y2*H+oy-1);
        ctx.strokeStyle = `rgba(120,140,180,${s.al*0.18})`; ctx.lineWidth = s.w*0.4; ctx.stroke();
      });

      // Atmospheric haze on back 3 layers (adds blue-tinted depth)
      if (li < 3) {
        const peakY = Math.min(...l.pts.map(q=>q[1]))*H+oy;
        const hzA   = [0.11, 0.07, 0.04][li];
        const hz    = ctx.createLinearGradient(0, peakY, 0, peakY+H*0.24);
        hz.addColorStop(0,   `hsla(210,42%,20%,${hzA})`);
        hz.addColorStop(0.5, `hsla(210,36%,14%,${hzA*0.45})`);
        hz.addColorStop(1,   `hsla(0,0%,0%,0)`);
        ctx.beginPath();
        ctx.moveTo(l.pts[0][0]*W, l.pts[0][1]*H+oy);
        for (let i=1; i<l.pts.length; i++) ctx.lineTo(l.pts[i][0]*W, l.pts[i][1]*H+oy);
        ctx.lineTo(W, H+10); ctx.lineTo(0, H+10);
        ctx.closePath(); ctx.fillStyle = hz; ctx.fill();
      }
    }

    function draw() {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      const sc = window.scrollY;
      const isMobileView = W < 768;
      const virtualW = 900;
      if (isMobileView) {
        ctx.save();
        ctx.transform(virtualW / W, 0, 0, 1, -(virtualW - W) / 2, 0);
      }
      BASE_LAYERS.forEach((l, li) => drawLayer(l, RPTS[li], MTEX[li], -sc * l.p, li));
      if (isMobileView) {
        ctx.restore();
      }
    }

    // Visibility (identical logic to original)
    const lastEl = document.getElementById("gl-why");
    function onScroll() {
      if (!canvas) return;
      const pastEnd = lastEl
        ? window.scrollY > lastEl.offsetTop + lastEl.offsetHeight - window.innerHeight * 0.3
        : false;
      if (pastEnd) {
        canvas.style.opacity = "0";
      } else if (window.scrollY > 100) {
        canvas.style.opacity = "1";
      }
      if (rafId) return;
      rafId = requestAnimationFrame(() => { rafId = 0; draw(); });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        bottom:        0,
        left:          0,
        width:         "100%",
        height:        "50vh",
        zIndex:        1,
        pointerEvents: "none",
        opacity:       "0",
        transition:    "opacity 0.3s ease",
      }}
    />
  );
}
