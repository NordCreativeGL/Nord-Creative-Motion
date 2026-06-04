'use client'

import { useEffect, useRef } from 'react'

const FOCAL = 500
const Z_SPEED = 0.35

interface StarOffset { dx: number; dy: number; dz?: number; s: number; b: number }
interface ConstellDef { cx: number; cy: number; cz: number; stars: StarOffset[] }
interface Star3D { x: number; y: number; z: number; size: number; bright: number }

const CONSTELLATIONS: ConstellDef[] = [
  // Ursa Minor — fades in at Services entry
  { cx: 20, cy: -50, cz: 450, stars: [
    { dx: 36, dy: -26, s: 2.5, b: 0.90 }, { dx: -34, dy: 8, s: 2.8, b: 0.82 },
    { dx: -28, dy: 26, s: 2.2, b: 0.65 }, { dx: -4, dy: 36, s: 1.5, b: 0.48 },
    { dx: 9, dy: 20, s: 1.6, b: 0.46 },  { dx: 24, dy: 2, s: 1.5, b: 0.44 },
  ]},
  // Ursa Major / Karlsvognen
  { cx: -55, cy: 18, cz: 700, stars: [
    { dx: -58, dy: -16, s: 3.0, b: 0.88 }, { dx: -39, dy: -8, s: 2.8, b: 0.80 },
    { dx: -20, dy: -2, s: 3.0, b: 0.86 }, { dx: 0, dy: 7, s: 2.0, b: 0.60 },
    { dx: 3, dy: 26, s: 2.5, b: 0.70 },   { dx: 28, dy: 16, s: 2.0, b: 0.72 },
    { dx: 30, dy: -8, s: 3.5, b: 0.92 },
  ]},
  // Draco
  { cx: 60, cy: -30, cz: 1000, stars: [
    { dx: 26, dy: 16, s: 3.0, b: 0.86 },  { dx: 7, dy: 26, s: 2.0, b: 0.73 },
    { dx: -16, dy: -7, s: 1.8, b: 0.55 }, { dx: -31, dy: -23, s: 1.5, b: 0.52 },
    { dx: -8, dy: -36, s: 1.8, b: 0.50 }, { dx: 13, dy: -18, s: 1.5, b: 0.45 },
  ]},
  // Cassiopeia — Greenland section
  { cx: -60, cy: -50, cz: 1400, stars: [
    { dx: -48, dy: -10, s: 2.5, b: 0.75 }, { dx: -20, dy: 10, s: 3.0, b: 0.86 },
    { dx: 0, dy: -9, s: 2.8, b: 0.80 },   { dx: 21, dy: 10, s: 2.5, b: 0.75 },
    { dx: 44, dy: -7, s: 2.2, b: 0.68 },
  ]},
  // Cepheus
  { cx: 50, cy: 45, cz: 1650, stars: [
    { dx: 26, dy: 20, s: 2.5, b: 0.76 },   { dx: 11, dy: -8, s: 2.2, b: 0.68 },
    { dx: -16, dy: -26, s: 2.0, b: 0.62 }, { dx: -30, dy: 4, s: 2.2, b: 0.68 },
    { dx: -13, dy: 28, s: 1.8, b: 0.55 },
  ]},
  // Cygnus / Northern Cross — Based in Greenland
  { cx: -40, cy: 30, cz: 1850, stars: [
    { dx: 0, dy: -36, s: 3.5, b: 0.90 }, { dx: 0, dy: 0, s: 2.5, b: 0.74 },
    { dx: 0, dy: 50, s: 2.2, b: 0.68 },  { dx: -30, dy: -6, s: 2.0, b: 0.62 },
    { dx: 30, dy: -6, s: 2.2, b: 0.70 },
  ]},
  // Lyra / Vega
  { cx: 55, cy: -25, cz: 2000, stars: [
    { dx: 0, dy: -2, s: 4.0, b: 0.96 },  { dx: 16, dy: 13, s: 2.0, b: 0.60 },
    { dx: 21, dy: 22, s: 2.0, b: 0.60 }, { dx: -3, dy: 16, s: 1.6, b: 0.48 },
  ]},
  // Perseus — CTA section
  { cx: -50, cy: 20, cz: 2150, stars: [
    { dx: 0, dy: 0, s: 3.0, b: 0.86 },    { dx: -25, dy: 22, s: 2.5, b: 0.74 },
    { dx: 16, dy: -16, s: 2.2, b: 0.68 }, { dx: -8, dy: -25, s: 2.0, b: 0.62 },
    { dx: 25, dy: 18, s: 2.2, b: 0.68 },
  ]},
  // Orion — the finale
  { cx: 15, cy: 10, cz: 2350, stars: [
    { dx: -42, dy: -36, s: 4.5, b: 0.96 }, { dx: 38, dy: -40, s: 3.5, b: 0.88 },
    { dx: -16, dy: 4, s: 2.8, b: 0.78 },   { dx: 0, dy: 7, s: 3.0, b: 0.82 },
    { dx: 16, dy: 9, s: 2.8, b: 0.78 },    { dx: 34, dy: 50, s: 5.0, b: 0.99 },
    { dx: -26, dy: 48, s: 2.5, b: 0.72 },
  ]},
]

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0, cx = 0, cy = 0, opacity = 0
    let bgStars: Star3D[] = []

    const constStars: Star3D[] = []
    for (const c of CONSTELLATIONS) {
      for (const s of c.stars) {
        constStars.push({
          x: c.cx + s.dx, y: c.cy + s.dy,
          z: c.cz + (s.dz ?? 0),
          size: s.s, bright: s.b,
        })
      }
    }

    function isMob() { return window.innerWidth < 1024 }

    function initBg() {
      const count = isMob() ? 120 : 250
      bgStars = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
        z: 50 + Math.random() * 2800,
        size: 0.25 + Math.random() * 0.7,
        bright: 0.05 + Math.random() * 0.16,
      }))
    }

    function resize() {
      if (!canvas || !ctx) return
      W = window.innerWidth
      H = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = W * 0.5
      cy = H * 0.44
    }

    function onScroll() {
      const heroH = window.innerHeight
      const t = (window.scrollY - heroH * 0.05) / (heroH * 0.5)
      opacity = Math.min(1, Math.max(0, t))
    }

    function spike(c: CanvasRenderingContext2D, x: number, y: number, len: number, lw: number, al: number) {
      const g1 = c.createLinearGradient(x - len, y, x + len, y)
      g1.addColorStop(0, 'rgba(245,250,255,0)')
      g1.addColorStop(0.5, `rgba(245,250,255,${al * 0.65})`)
      g1.addColorStop(1, 'rgba(245,250,255,0)')
      c.beginPath(); c.moveTo(x - len, y); c.lineTo(x + len, y)
      c.strokeStyle = g1; c.lineWidth = lw; c.stroke()
      const g2 = c.createLinearGradient(x, y - len, x, y + len)
      g2.addColorStop(0, 'rgba(245,250,255,0)')
      g2.addColorStop(0.5, `rgba(245,250,255,${al * 0.65})`)
      g2.addColorStop(1, 'rgba(245,250,255,0)')
      c.beginPath(); c.moveTo(x, y - len); c.lineTo(x, y + len)
      c.strokeStyle = g2; c.lineWidth = lw; c.stroke()
    }

    let rafId: number

    function draw() {
      rafId = requestAnimationFrame(draw)
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)
      if (opacity <= 0.005) return

      const camZ = window.scrollY * Z_SPEED
      const camX = Math.sin(camZ * 0.004) * 30
      const camY = -camZ * 0.008

      for (const s of bgStars) {
        const dz = s.z - camZ
        if (dz < 8) {
          s.z = camZ + 800 + Math.random() * 2000
          s.x = (Math.random() - 0.5) * 500
          s.y = (Math.random() - 0.5) * 500
          continue
        }
        const scale = FOCAL / dz
        const sx = cx + (s.x - camX) * scale
        const sy = cy + (s.y - camY) * scale
        if (sx < -8 || sx > W + 8 || sy < -8 || sy > H + 8) continue
        const sz = Math.min(s.size * scale, 2.2)
        const al = s.bright * opacity * Math.min(1, dz / 150)
        ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(215,228,255,${al})`; ctx.fill()
      }

      ctx.save()
      for (const star of constStars) {
        const dz = star.z - camZ
        if (dz < 8) continue
        const scale = FOCAL / dz
        const sx = cx + (star.x - camX) * scale
        const sy = cy + (star.y - camY) * scale
        if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) continue

        const sz = Math.min(star.size * scale * 0.8, 24)
        const al = star.bright * opacity * Math.min(1, dz / 60)

        if (sz >= 2.5 && star.bright >= 0.7) spike(ctx, sx, sy, sz * 7, sz * 0.22, al)

        if (sz >= 2.0) {
          const gr = sz * 4
          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr)
          grd.addColorStop(0, `rgba(205,225,255,${0.24 * al})`)
          grd.addColorStop(1, 'rgba(205,225,255,0)')
          ctx.beginPath(); ctx.arc(sx, sy, gr, 0, Math.PI * 2)
          ctx.fillStyle = grd; ctx.fill()
        }

        ctx.beginPath(); ctx.arc(sx, sy, sz * 0.65, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, al * 1.1)})`; ctx.fill()
        ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(235,245,255,${al * 0.45})`; ctx.fill()
      }
      ctx.restore()
    }

    const heroH = window.innerHeight
    const initT = (window.scrollY - heroH * 0.05) / (heroH * 0.5)
    opacity = Math.min(1, Math.max(0, initT))

    resize()
    initBg()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
