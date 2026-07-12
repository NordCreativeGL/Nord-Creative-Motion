'use client'

import { useEffect, useRef } from 'react'

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

function makeFloe(r: number, rnd: () => number) {
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
  return { pts, round }
}

// Bottom fade-in zone: sparse ice floes appear here, growing denser and more opaque
// toward the very bottom, so the section visually builds up into the pack-ice CTA below.
// All values are named constants for easy iteration.
const FADE_ZONE_FRAC = 0.42   // fraction of section height where floes can appear (from bottom)
const FLOE_COUNT = 18         // total floes drawn in the fade zone
const DENSITY_POWER = 2.4     // higher = floes concentrate more toward the very bottom
const MIN_R_FRAC = 0.006      // floe radius as fraction of min(width, 1500)
const MAX_R_FRAC = 0.024
const GLOW_U_THRESHOLD = 0.75 // only floes past this depth (0-1, 1=bottom) can glow
const GLOW_CHANCE = 0.4
const FILLS = ['rgb(200,216,222)', 'rgb(215,228,235)', 'rgb(238,248,252)']
const SEED = 4417

export default function IcebergPackagesSection({ id }: { id?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function draw() {
      if (!wrap || !canvas || !ctx) return
      const w = wrap.clientWidth
      const sectionH = wrap.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(2, Math.round(w * dpr))
      canvas.height = Math.max(2, Math.round(sectionH * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, sectionH)

      const zoneH = sectionH * FADE_ZONE_FRAC
      const zoneTop = sectionH - zoneH
      const base = Math.min(w, 1500)
      const rnd = rng(SEED)

      for (let i = 0; i < FLOE_COUNT; i++) {
        const u = 1 - Math.pow(rnd(), DENSITY_POWER) // 0 near zoneTop (sparse), 1 near bottom (dense)
        const y = zoneTop + zoneH * u
        const x = rnd() * w
        const r = base * (MIN_R_FRAC + rnd() * (MAX_R_FRAC - MIN_R_FRAC))
        const alpha = Math.min(1, 0.15 + u * 0.85)
        const glow = u > GLOW_U_THRESHOLD && rnd() < GLOW_CHANCE

        const sh = makeFloe(r, rnd)
        const rot = rnd() * Math.PI * 2

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rot)
        ctx.globalAlpha = alpha

        if (glow) {
          const g = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 2.2)
          g.addColorStop(0, 'rgba(0,215,200,0.30)')
          g.addColorStop(0.5, 'rgba(0,210,198,0.14)')
          g.addColorStop(1, 'rgba(0,190,185,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.beginPath()
        tracePoly(ctx, sh.pts, sh.round)
        ctx.fillStyle = FILLS[Math.floor(rnd() * FILLS.length)]
        ctx.fill()
        ctx.restore()
      }
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(wrap)
    return () => ro.disconnect()
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
    </section>
  )
}
