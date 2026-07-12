'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

function rng(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

function tracePoly(ctx: CanvasRenderingContext2D, pts: number[][], round: number) {
  const n = pts.length
  const lerp = (a: number[], b: number[], t: number): number[] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  for (let i = 0; i < n; i++) {
    const prev = pts[(i + n - 1) % n], cur = pts[i], next = pts[(i + 1) % n]
    const a = lerp(cur, prev, round), b = lerp(cur, next, round)
    if (i === 0) ctx.moveTo(a[0], a[1]); else ctx.lineTo(a[0], a[1])
    ctx.quadraticCurveTo(cur[0], cur[1], b[0], b[1])
  }
  ctx.closePath()
}

// Darkening amount matching PackIceCtaSection's vignette(fg, w, h+380, 0.5) at a given
// point in CTA's own coordinate frame. Only ever applied clipped to a floe's own shape
// (tracePoly) — never as a full-canvas or rectangular fill — so it cannot affect
// anything outside that floe, including the background gradient.
function vignetteAlphaAt(x: number, y: number, w: number, ctaH: number, strength: number): number {
  const H = ctaH + 380
  const cx = w / 2, cy = H * 0.55
  const inner = Math.min(w, H) * 0.35
  const outer = Math.max(w, H) * 0.78
  const d = Math.hypot(x - cx, y - cy)
  const t = Math.min(Math.max((d - inner) / (outer - inner), 0), 1)
  return t * strength
}

interface FloeShape {
  pts: number[][]
  round: number
  R: number
  cracks: number[][][]
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

interface Floe extends FloeShape {
  x: number; y: number; tier: number; glow: boolean
  phase: number; phase2: number; rot: number; rotV: number
  driftR: number; driftS: number; amp: number
}

// Verbatim port of PackIceCtaSection.tsx's build() — same seed (1207), same call
// order, same exclusion zones — guaranteed to produce the identical floe list
// that PackIceCtaSection actually renders for a given (w, h).
function buildCtaFloes(w: number, h: number): Floe[] {
  const rnd = rng(1207)
  const out: Floe[] = []
  const ex = { x: w / 2, y: h / 2, hw: Math.min(w * 0.40, 330), hh: Math.min(h * 0.34, 240) }
  const footerTextEx = { x: w / 2, y: h + 148, hw: w < 768 ? w * 0.30 : w * 0.095, hh: 148 }
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
    })
  }
  const base = Math.min(w, 1500)
  for (let i = 0; i < 10; i++) mk(base * 0.006, base * 0.022, 2, 10, 140)
  for (let i = 0; i < 4; i++) mk(base * 0.07, base * 0.105, 0, 0, h)
  for (let i = 0; i < 14; i++) mk(base * 0.026, base * 0.052, 1, 0, h)
  for (let i = 0; i < 27; i++) mk(base * 0.005, base * 0.013, 2, 0, h)
  for (let i = 0; i < 7; i++) mk(base * 0.028, base * 0.048, 1, h + 10, h + 370)
  for (let i = 0; i < 7; i++) mk(base * 0.005, base * 0.013, 2, h + 10, h + 370)
  for (let i = 0; i < 2; i++) mk(base * 0.038, base * 0.055, 1, h + 10, h + 370, true)
  return out
}

const FILLS = ['rgb(200,216,222)', 'rgb(215,228,235)', 'rgb(238,248,252)']

export default function IcebergPackagesSection({ id }: { id?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { lang } = useLang()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const sectionPadding = isMobile
    ? '80px 24px'
    : 'clamp(100px, 10vw, 160px) clamp(160px, 16vw, 220px)'

  const t = {
    en: {
      eyebrow: 'PACKAGES', heading: 'Three ways to work with us',
      t1: ['Professional design', 'Up to 3 pages', 'Contact form', 'Mobile optimised', '2 revision rounds'],
      t2: ['Everything in Starter', 'Up to 7 pages', 'SEO setup', 'Copywriting', 'Multilingual (2 languages)', 'Support', '5 revision rounds'],
      t3: ['Everything in Business', 'Up to 12 pages', 'Photo & video production', 'Advanced animations', 'Multilingual (3+ languages)', 'Advanced statistics', 'Priority support', '10 revision rounds'],
    },
    da: {
      eyebrow: 'PAKKER', heading: 'Tre måder at arbejde med os',
      t1: ['Professionelt design', 'Op til 3 sider', 'Kontaktformular', 'Mobiloptimeret', '2 revisionsrunder'],
      t2: ['Alt i Starter', 'Op til 7 sider', 'SEO-opsætning', 'Tekst & indhold', 'Flersproget (2 sprog)', 'Support', '5 revisionsrunder'],
      t3: ['Alt i Business', 'Op til 12 sider', 'Foto & videoproduktion', 'Avancerede animationer', 'Flersproget (3+ sprog)', 'Avanceret statistik', 'Prioriteret support', '10 revisionsrunder'],
    },
  }

  const TIER_META = [
    { lbl: 'TIER I', name: 'Starter' },
    { lbl: 'TIER II', name: 'Business' },
    { lbl: 'TIER III', name: 'Full Production' },
  ]

  const featureLists = [t[lang].t1, t[lang].t2, t[lang].t3]

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: isMobile ? '24px 24px 28px' : 'clamp(36px, 2.8vw, 52px) clamp(30px, 2.4vw, 40px) clamp(40px, 3vw, 56px)',
    background: 'radial-gradient(130% 90% at 18% -10%, rgba(186,238,230,.16), transparent 52%), linear-gradient(180deg, rgba(255,255,255,.045), rgba(10,32,36,.35))',
    border: '1px solid rgba(255,255,255,.1)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14)',
    transition: 'all .45s ease',
  }
  const tierLabelStyle: React.CSSProperties = {
    margin: 0,
    fontSize: isMobile ? 11 : 'clamp(12px, 0.85vw, 14px)',
    letterSpacing: '.14em',
    fontWeight: 300,
    fontFamily: "var(--font-geist-sans), sans-serif",
    color: '#eef2f4',
    textTransform: 'uppercase',
  }
  const packageNameStyle: React.CSSProperties = {
    margin: isMobile ? '8px 0 0' : '10px 0 0',
    fontSize: 'clamp(26px, 2.2vw, 38px)',
    fontWeight: 300,
    fontFamily: "var(--font-geist-sans), sans-serif",
    color: 'white',
    letterSpacing: '-0.01em',
  }
  const dividerStyle: React.CSSProperties = {
    width: '100%',
    height: 1,
    background: 'rgba(255,255,255,.14)',
    margin: isMobile ? '18px 0' : '28px 0',
  }
  const featureListStyle: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '12px' : '14px',
  }
  const featureItemStyle: React.CSSProperties = {
    fontSize: isMobile ? 13 : 'clamp(14px, 0.95vw, 16px)',
    lineHeight: 1.45,
    fontFamily: "var(--font-geist-sans), sans-serif",
    color: 'rgba(238,242,244,.5)',
  }
  const onCardMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(143,227,216,.5)'
    ;(e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.2), 0 0 44px rgba(143,227,216,.16)'
  }
  const onCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.1)'
    ;(e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.14)'
  }

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let dead = false
    let cutoffs: Floe[] = []
    let pkgH = 0
    let dpr = 1
    let ctaWCache = 0
    let ctaHCache = 0

    function computeCutoffs() {
      const cta = document.getElementById('web-cta')
      if (!cta) return
      const ctaRect = cta.getBoundingClientRect()
      ctaWCache = ctaRect.width
      ctaHCache = ctaRect.height
      const all = buildCtaFloes(ctaRect.width, ctaRect.height)
      cutoffs = all.filter((f) => f.y - f.R < 0)
    }

    function fit() {
      if (!wrap || !canvas) return
      const r = wrap.getBoundingClientRect()
      pkgH = r.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(2, Math.round(r.width * dpr))
      canvas.height = Math.max(2, Math.round(r.height * dpr))
      computeCutoffs()
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)

    function draw(t: number) {
      if (dead || !canvas || !ctx) return
      const w = canvas.width / dpr, h = canvas.height / dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const f of cutoffs) {
        const dx = Math.sin(t * f.driftS + f.phase) * f.driftR + Math.sin(t * 0.00035 + f.phase) * f.amp * 0.5
        const dy = Math.cos(t * f.driftS * 0.8 + f.phase2) * f.driftR * 0.7 + Math.cos(t * 0.00028 + f.phase2) * f.amp * 0.4
        const localY = pkgH + f.y + dy
        const localX = f.x + dx
        if (localY + f.R < 0) continue
        ctx.save()
        ctx.translate(localX, localY)
        ctx.rotate(f.rot + t * f.rotV)
        if (f.glow) {
          const oxp = f.R * 0.08, oyp = f.R * 0.14
          const gh = ctx.createRadialGradient(oxp, oyp, f.R * 0.30, oxp, oyp, f.R * 2.0)
          gh.addColorStop(0, 'rgba(0,215,200,0.34)')
          gh.addColorStop(0.35, 'rgba(0,210,198,0.20)')
          gh.addColorStop(0.65, 'rgba(0,200,192,0.08)')
          gh.addColorStop(1, 'rgba(0,190,185,0)')
          ctx.fillStyle = gh
          ctx.fillRect(-f.R * 2, -f.R * 2, f.R * 4, f.R * 4)
          ctx.save(); ctx.translate(oxp, oyp); ctx.scale(1.55, 1.55)
          ctx.beginPath(); tracePoly(ctx, f.pts, 0.35)
          ctx.fillStyle = 'rgba(0,215,200,0.07)'; ctx.fill()
          ctx.restore()
        }
        if (f.tier < 2) {
          ctx.save(); ctx.translate(2.5, 4)
          ctx.beginPath(); tracePoly(ctx, f.pts, f.round)
          ctx.fillStyle = 'rgba(0,3,8,0.5)'; ctx.fill()
          ctx.restore()
        }
        ctx.beginPath(); tracePoly(ctx, f.pts, f.round)
        ctx.fillStyle = FILLS[f.tier]; ctx.fill()
        if (f.tier === 0) {
          ctx.strokeStyle = 'rgba(0,18,50,0.22)'; ctx.lineWidth = 0.9
          for (const seg of f.cracks) {
            ctx.beginPath()
            seg.forEach((p, i) => { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]) })
            ctx.stroke()
          }
        }
        const vig = vignetteAlphaAt(f.x, f.y + dy, ctaWCache, ctaHCache, 0.5)
        if (vig > 0.002) {
          if (f.glow) {
            // Also dim the glow halo, using the exact same center/radii as the glow
            // gradient itself (oxp, oyp, R*0.3 to R*2.0) so the darkening fades to
            // zero at precisely the same edge the glow does — it can never extend
            // past the glow's own footprint.
            const oxp = f.R * 0.08, oyp = f.R * 0.14
            const gv = ctx.createRadialGradient(oxp, oyp, f.R * 0.30, oxp, oyp, f.R * 2.0)
            gv.addColorStop(0, 'rgba(0,0,0,' + vig.toFixed(3) + ')')
            gv.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = gv
            ctx.fillRect(-f.R * 2, -f.R * 2, f.R * 4, f.R * 4)
          }
          ctx.beginPath(); tracePoly(ctx, f.pts, f.round)
          ctx.fillStyle = 'rgba(0,0,0,' + vig.toFixed(3) + ')'
          ctx.fill()
        }
        ctx.restore()
      }
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    return () => {
      dead = true
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <section
      id={id}
      ref={wrapRef}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #06121D 0%, #031720 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
      />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        padding: sectionPadding,
        paddingTop: isMobile ? '72px' : '40px',
        fontFamily: 'var(--font-geist-sans), sans-serif',
      }}>
        <p style={{
          fontSize: 'clamp(11px, 0.7vw, 13px)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(0,215,200,0.85)',
          marginBottom: isMobile ? '10px' : '20px',
        }}>
          {t[lang].eyebrow}
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 2.78vw, 68px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: isMobile ? '16px' : '40px',
        }}>
          {t[lang].heading}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '16px' : 'clamp(18px, 1.5vw, 26px)',
        }}>
          {TIER_META.map((tier, i) => (
            <article
              key={tier.name}
              style={cardStyle}
              onMouseEnter={onCardMouseEnter}
              onMouseLeave={onCardMouseLeave}
            >
              <p style={tierLabelStyle}>{tier.lbl}</p>
              <h3 style={packageNameStyle}>{tier.name}</h3>
              <div style={dividerStyle} />
              <ul style={featureListStyle}>
                {featureLists[i].map((f) => (
                  <li key={f} style={featureItemStyle}>{f}</li>
                ))}
              </ul>
              <div style={{ marginTop: 'auto', paddingTop: isMobile ? '24px' : '32px', height: isMobile ? 48 : 64 }} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
