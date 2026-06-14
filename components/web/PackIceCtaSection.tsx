'use client'

import { useEffect, useRef } from 'react'

// ---------- types ----------

interface FloeShape {
  pts: number[][]
  round: number
  R: number
  cracks: number[][][]
}

interface Floe extends FloeShape {
  x: number
  y: number
  tier: number
  glow: boolean
  phase: number
  phase2: number
  rot: number
  rotV: number
  driftR: number
  driftS: number
  amp: number
  spC: HTMLCanvasElement
  half: number
}

interface IceLayout {
  bgC: HTMLCanvasElement
  fgC: HTMLCanvasElement
  floes: Floe[]
  shimmers: number[][]
  w: number
  h: number
}

interface PackIcePainter {
  draw: (t: number) => void
  resize: (w: number, h: number) => void
  setDpr: (d: number) => void
}

// ---------- pure helpers ----------

function rng(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

function tracePoly(ctx: CanvasRenderingContext2D, pts: number[][], round: number) {
  const n = pts.length
  const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  for (let i = 0; i < n; i++) {
    const prev = pts[(i + n - 1) % n], cur = pts[i], next = pts[(i + 1) % n]
    const a = lerp(cur, prev, round), b = lerp(cur, next, round)
    if (i === 0) ctx.moveTo(a[0], a[1]); else ctx.lineTo(a[0], a[1])
    ctx.quadraticCurveTo(cur[0], cur[1], b[0], b[1])
  }
  ctx.closePath()
}

function layer(w: number, h: number, dpr: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas')
  c.width = Math.max(2, Math.round(w * dpr))
  c.height = Math.max(2, Math.round(h * dpr))
  const x = c.getContext('2d')!
  x.setTransform(dpr, 0, 0, dpr, 0, 0)
  return [c, x]
}

function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const g = ctx.createRadialGradient(w / 2, h * 0.55, Math.min(w, h) * 0.35, w / 2, h * 0.55, Math.max(w, h) * 0.78)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,' + strength + ')')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

function makeFloe(r: number, rnd: () => number): FloeShape {
  const n = 5 + Math.floor(rnd() * 5)
  const pts: number[][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.55
    const rad = r * (0.55 + rnd() * 0.45)
    pts.push([Math.cos(a) * rad, Math.sin(a) * rad])
  }
  const elong = rnd() < 0.3 ? 1.7 + rnd() * 0.9 : 1 + rnd() * 0.35
  for (const p of pts) p[0] *= elong
  const round = rnd() < 0.45 ? 0.06 + rnd() * 0.08 : 0.14 + rnd() * 0.07
  let R = 0
  for (const p of pts) R = Math.max(R, Math.hypot(p[0], p[1]))
  const cracks: number[][][] = []
  const nc = 2 + Math.floor(rnd() * 2)
  for (let c = 0; c < nc; c++) {
    const a0 = rnd() * Math.PI * 2
    const seg: number[][] = []
    let pxx = Math.cos(a0) * r * 0.15, pyy = Math.sin(a0) * r * 0.15
    let dir = a0 + Math.PI * (0.7 + rnd() * 0.6)
    const steps = 3 + Math.floor(rnd() * 2)
    seg.push([pxx, pyy])
    for (let sgi = 0; sgi < steps; sgi++) {
      const len = r * (0.16 + rnd() * 0.16)
      dir += (rnd() - 0.5) * 0.9
      pxx += Math.cos(dir) * len; pyy += Math.sin(dir) * len
      seg.push([pxx, pyy])
    }
    cracks.push(seg)
  }
  return { pts, round, R, cracks }
}

// ---------- createPackIce ----------

function createPackIce(canvas: HTMLCanvasElement): PackIcePainter {
  const ctx = canvas.getContext('2d')!
  const FILLS = ['rgb(200,216,222)', 'rgb(215,228,235)', 'rgb(238,248,252)']
  let L: IceLayout | null = null
  let _dpr = 1

  function build(w: number, h: number): Floe[] {
    const rnd = rng(1207)
    const out: Floe[] = []
    const extH = h + 380
    const ex = { x: w / 2, y: h / 2, hw: Math.min(w * 0.40, 330), hh: Math.min(h * 0.34, 240) }
    const footerTextEx = { x: w / 2, y: h + 148, hw: w * 0.095, hh: 148 }
    const privacyEx    = { x: w / 2, y: h + 318, hw: w * 0.10,       hh: 30  }
    const exScale = [1.3, 1.0, 0.7]
    const place = (R: number, tier: number, yMin: number, yMax: number): { x: number, y: number } | null => {
      const fx = exScale[tier]
      for (let i = 0; i < 320; i++) {
        const x = rnd() * w, y = yMin + rnd() * (yMax - yMin)
        if (x > ex.x - ex.hw * fx - R && x < ex.x + ex.hw * fx + R &&
            y > ex.y - ex.hh * fx - R && y < ex.y + ex.hh * fx + R) continue
        if (x > footerTextEx.x - footerTextEx.hw - R &&
            x < footerTextEx.x + footerTextEx.hw + R &&
            y > footerTextEx.y - footerTextEx.hh - R &&
            y < footerTextEx.y + footerTextEx.hh + R) continue
        if (x > privacyEx.x - privacyEx.hw - R &&
            x < privacyEx.x + privacyEx.hw + R &&
            y > privacyEx.y - privacyEx.hh - R &&
            y < privacyEx.y + privacyEx.hh + R) continue
        let ok = true
        for (const f of out) {
          const dx = f.x - x, dy = f.y - y
          const min = (f.R + R) * 1.04 + 24
          if (dx * dx + dy * dy < min * min) { ok = false; break }
        }
        if (ok) return { x, y }
      }
      return null
    }
    const mk = (rMin: number, rMax: number, tier: number, yMin: number, yMax: number, forceGlow?: boolean) => {
      const r = rMin + rnd() * (rMax - rMin)
      const sh = makeFloe(r, rnd)
      const pos = place(sh.R, tier, yMin, yMax)
      if (!pos) return
      const glow = forceGlow !== undefined ? forceGlow : (tier === 0 ? rnd() < 0.75 : tier === 1 ? rnd() < 0.3 : false)
      out.push({
        ...pos, ...sh, tier, glow,
        phase: rnd() * 6.28, phase2: rnd() * 6.28,
        rot: rnd() * 6.28, rotV: (rnd() - 0.5) * 0.000012,
        driftR: tier === 0 ? 4 + rnd() * 4 : tier === 1 ? 6 + rnd() * 5 : 8 + rnd() * 7,
        driftS: 0.000055 + rnd() * 0.00005,
        amp: 0.7 + rnd() * 1.1,
        spC: document.createElement('canvas'),
        half: 0,
      })
    }
    const base = Math.min(w, 1500)
    for (let i = 0; i < 10; i++) mk(base * 0.006, base * 0.022, 2, 10, 140)
    for (let i = 0; i < 4; i++) mk(base * 0.07, base * 0.105, 0, 0, h)
    for (let i = 0; i < 16; i++) mk(base * 0.026, base * 0.052, 1, 0, h)
    for (let i = 0; i < 30; i++) mk(base * 0.005, base * 0.013, 2, 0, h)
    for (let i = 0; i < 8; i++) mk(base * 0.028, base * 0.048, 1, h + 10, h + 370)
    for (let i = 0; i < 30; i++) mk(base * 0.005, base * 0.013, 2, h + 10, h + 370)
    for (let i = 0; i < 2; i++) mk(base * 0.038, base * 0.055, 1, h + 10, h + 370, true)
    return out
  }

  function resize(w: number, h: number) {
    const dpr = _dpr
    const rnd2 = rng(733)
    const floes = build(w, h)
    const [bgC, bg] = layer(w, h + 380, dpr)
    const OVERLAP = 150
    let g = bg.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, 'rgba(6,38,51,0)')
    g.addColorStop(OVERLAP / h, '#062633')
    g.addColorStop(0.6, '#041c29')
    g.addColorStop(1, '#041c29')
    bg.fillStyle = g; bg.fillRect(0, 0, w, h)
    for (let i = 0; i < 9; i++) {
      const mx = rnd2() * w, my = rnd2() * h, mr = (0.18 + rnd2() * 0.22) * Math.max(w, h)
      g = bg.createRadialGradient(mx, my, mr * 0.2, mx, my, mr)
      const lighter = rnd2() < 0.55
      g.addColorStop(0, lighter ? 'rgba(20,90,105,0.055)' : 'rgba(1,8,14,0.10)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      bg.fillStyle = g; bg.fillRect(mx - mr, my - mr, mr * 2, mr * 2)
    }
    g = bg.createLinearGradient(0, h, 0, h + 380)
    g.addColorStop(0, '#041c29')
    g.addColorStop(1, '#031520')
    bg.fillStyle = g; bg.fillRect(0, h, w, 380)
    for (const f of floes) {
      const pad = f.glow ? f.R * 1.0 + 30 : 18
      const half = f.R + pad
      const [spC, sp] = layer(half * 2, half * 2, dpr)
      sp.translate(half, half)
      if (f.glow) {
        const oxp = f.R * 0.08, oyp = f.R * 0.14
        const gh = sp.createRadialGradient(oxp, oyp, f.R * 0.30, oxp, oyp, f.R * 2.0)
        gh.addColorStop(0, 'rgba(0,215,200,0.34)')
        gh.addColorStop(0.35, 'rgba(0,210,198,0.20)')
        gh.addColorStop(0.65, 'rgba(0,200,192,0.08)')
        gh.addColorStop(1, 'rgba(0,190,185,0)')
        sp.fillStyle = gh; sp.fillRect(-half, -half, half * 2, half * 2)
        sp.save(); sp.translate(oxp, oyp); sp.scale(1.55, 1.55)
        sp.beginPath(); tracePoly(sp, f.pts, 0.35)
        sp.fillStyle = 'rgba(0,215,200,0.07)'; sp.fill()
        sp.restore()
      }
      if (f.tier < 2) {
        sp.save(); sp.translate(2.5, 4)
        sp.beginPath(); tracePoly(sp, f.pts, f.round)
        sp.fillStyle = 'rgba(0,3,8,0.5)'; sp.fill()
        sp.restore()
      }
      sp.beginPath(); tracePoly(sp, f.pts, f.round)
      sp.fillStyle = FILLS[f.tier]; sp.fill()
      if (f.tier === 0) {
        sp.strokeStyle = 'rgba(0,18,50,0.22)'; sp.lineWidth = 0.9
        for (const seg of f.cracks) {
          sp.beginPath()
          seg.forEach((p, i) => { if (i === 0) sp.moveTo(p[0], p[1]); else sp.lineTo(p[0], p[1]) })
          sp.stroke()
        }
      }
      f.spC = spC; f.half = half
    }
    const [fgC, fg] = layer(w, h + 380, dpr)
    vignette(fg, w, h + 380, 0.5)
    fg.clearRect(0, 0, w, OVERLAP)
    const rnd3 = rng(919)
    const shimmers = Array.from({ length: 14 }, () => [rnd3(), rnd3(), 0.03 + rnd3() * 0.1, rnd3()])
    L = { bgC, fgC, floes, shimmers, w, h }
  }

  function draw(t: number) {
    const w = canvas.width / _dpr, fullH = canvas.height / _dpr
    const h = fullH - 380
    if (!L || L.w !== w || L.h !== h) resize(w, h)
    if (!L) return
    const cur = L
    ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0)
    ctx.clearRect(0, 0, w, fullH)
    ctx.drawImage(cur.bgC, 0, 0, w, fullH)
    for (let i = 0; i < cur.shimmers.length; i++) {
      const sh = cur.shimmers[i]
      const x = ((sh[0] + t * 0.0000035 * (0.5 + sh[3])) % 1) * w
      const y = sh[1] * h, len = sh[2] * w
      ctx.fillStyle = 'rgba(120,200,210,' + (0.025 + sh[3] * 0.03).toFixed(3) + ')'
      ctx.fillRect(x - len / 2, y, len, 1)
    }
    for (const f of cur.floes) {
      const dx = Math.sin(t * f.driftS + f.phase) * f.driftR + Math.sin(t * 0.00035 + f.phase) * f.amp * 0.5
      const dy = Math.cos(t * f.driftS * 0.8 + f.phase2) * f.driftR * 0.7 + Math.cos(t * 0.00028 + f.phase2) * f.amp * 0.4
      ctx.save()
      ctx.translate(f.x + dx, f.y + dy)
      ctx.rotate(f.rot + t * f.rotV)
      ctx.drawImage(f.spC, -f.half, -f.half, f.half * 2, f.half * 2)
      ctx.restore()
    }
    ctx.drawImage(cur.fgC, 0, 0, w, fullH)
  }

  function setDpr(d: number) { _dpr = d }
  return { draw, resize, setDpr }
}

// ---------- component ----------

const MONO_FONT = "'IBM Plex Mono', 'Courier New', monospace"

export default function PackIceCtaSection({ id }: { id?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ice = createPackIce(canvas)

    function fit() {
      const r = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas!.width = Math.max(2, Math.round(r.width * dpr))
      canvas!.height = Math.max(2, Math.round(r.height * dpr))
      ice.setDpr(dpr)
      ice.resize(r.width, r.height - 380)
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)

    let rafId: number
    function loop(t: number) {
      ice.draw(t)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <section id={id} style={{ position: 'relative', minHeight: '100dvh', overflow: 'visible', zIndex: 5 }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: '-150px', left: 0, width: '100%', height: 'calc(100% + 530px)', display: 'block' }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px', gap: 22,
      }}>
        <div style={{ fontFamily: MONO_FONT, fontSize: 11, letterSpacing: '0.38em', color: 'rgba(0,215,200,0.85)' }}>
          {'START YOUR PROJECT'}
        </div>
        <h2 style={{
          margin: 0, fontSize: 'clamp(32px, 4.8vw, 62px)', fontWeight: 250, lineHeight: 1.06,
          letterSpacing: '-0.015em', textWrap: 'balance', maxWidth: '13em',
        }}>
          Ready to build something worth seeing?
        </h2>
        <p style={{
          margin: 0, fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 300,
          color: 'rgba(255,255,255,0.55)', maxWidth: '30em',
        }}>
          {'Tell us about your project. We’ll take it from there.'}
        </p>
        <a
          href="mailto:hello@nordcreative.dk"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 12,
            background: 'rgba(234,248,254,0.96)', color: '#042230', borderRadius: 999,
            padding: '16px 38px', fontSize: 15, fontWeight: 500, letterSpacing: '0.03em',
            textDecoration: 'none',
          }}
        >
          Start your project<span style={{ fontFamily: MONO_FONT, fontSize: 14 }}>{'→'}</span>
        </a>
      </div>

      <div style={{
        position: 'absolute', bottom: 22, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1,
        fontFamily: MONO_FONT, fontSize: 9, letterSpacing: '0.34em', color: 'rgba(255,255,255,0.28)',
      }}>
        {'NORD CREATIVE'}
      </div>
    </section>
  )
}
