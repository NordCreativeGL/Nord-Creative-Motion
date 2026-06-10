'use client'
import { useRef, useEffect } from 'react'

interface Floe {
  x: number; y: number; vx: number; vy: number
  radius: number; pts: [number, number][]
  rotation: number; rotSpeed: number
  brightness: number; opacity: number
}

function seededRand(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function makeShape(verts: number, r: () => number, irregularity = 0.28): [number, number][] {
  const pts: [number, number][] = []
  const step = (2 * Math.PI) / verts
  for (let i = 0; i < verts; i++) {
    const a = i * step + (r() - 0.5) * step * 0.35
    const d = 0.78 + (r() - 0.5) * 2 * irregularity
    pts.push([Math.cos(a) * d, Math.sin(a) * d])
  }
  return pts
}

function drawPath(ctx: CanvasRenderingContext2D, pts: [number, number][], radius: number) {
  const n = pts.length
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const cp1x = (p1[0] + (p2[0] - p0[0]) / 6) * radius
    const cp1y = (p1[1] + (p2[1] - p0[1]) / 6) * radius
    const cp2x = (p2[0] - (p3[0] - p1[0]) / 6) * radius
    const cp2y = (p2[1] - (p3[1] - p1[1]) / 6) * radius
    if (i === 0) ctx.moveTo(p1[0] * radius, p1[1] * radius)
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0] * radius, p2[1] * radius)
  }
  ctx.closePath()
}

function initFloes(W: number, H: number): Floe[] {
  const r = seededRand(42)
  const placed: Floe[] = []

  const push = (x: number, y: number, radius: number, verts: number, irregularity?: number) => {
    placed.push({
      x, y, radius,
      vx: (r() - 0.5) * 0.06,
      vy: (r() - 0.5) * 0.06,
      pts: makeShape(verts, r, irregularity ?? 0.28),
      rotation: r() * Math.PI * 2,
      rotSpeed: (r() - 0.5) * 0.00009,
      brightness: Math.floor(168 + r() * 52),
      opacity: 0.25 + r() * 0.30,
    })
  }

  // 2 hero floes — large, unique, very slow
  push(W * 0.12, H * 0.72, 160, 18, 0.38)
  placed[placed.length - 1].vx *= 0.4
  placed[placed.length - 1].vy *= 0.4

  push(W * 0.82, H * 0.28, 140, 20, 0.42)
  placed[placed.length - 1].vx *= 0.4
  placed[placed.length - 1].vy *= 0.4

  // Regular floes placed with collision-free spawning
  const layers = [
    { count: 11, rMin: 48, rMax: 72,  verts: 12, irr: 0.26 },
    { count: 22, rMin: 22, rMax: 46,  verts: 10, irr: 0.24 },
    { count: 28, rMin: 7,  rMax: 20,  verts: 8,  irr: 0.20 },
  ]
  for (const { count, rMin, rMax, verts, irr } of layers) {
    for (let i = 0; i < count; i++) {
      const radius = rMin + r() * (rMax - rMin)
      for (let att = 0; att < 60; att++) {
        const x = r() * (W + 80) - 40
        const y = r() * (H + 80) - 40
        let clear = true
        for (const f of placed) {
          const dx = f.x - x, dy = f.y - y
          if (dx * dx + dy * dy < (f.radius + radius + 6) ** 2) { clear = false; break }
        }
        if (clear) { push(x, y, radius, verts, irr); break }
      }
    }
  }
  return placed
}

function resolveCollisions(floes: Floe[]) {
  for (let i = 0; i < floes.length; i++) {
    for (let j = i + 1; j < floes.length; j++) {
      const a = floes[i], b = floes[j]
      const dx = b.x - a.x, dy = b.y - a.y
      const distSq = dx * dx + dy * dy
      const minD = a.radius + b.radius + 4
      if (distSq < minD * minD && distSq > 0.001) {
        const dist = Math.sqrt(distSq)
        const nx = dx / dist, ny = dy / dist
        const push = (minD - dist) * 0.5
        a.x -= nx * push; a.y -= ny * push
        b.x += nx * push; b.y += ny * push
        const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
        if (dot > 0) {
          a.vx -= dot * nx * 0.5; a.vy -= dot * ny * 0.5
          b.vx += dot * nx * 0.5; b.vy += dot * ny * 0.5
        }
      }
    }
  }
}

function drawFloe(ctx: CanvasRenderingContext2D, f: Floe) {
  ctx.save()
  ctx.translate(f.x + 3, f.y + 5)
  ctx.rotate(f.rotation)
  drawPath(ctx, f.pts, f.radius)
  ctx.fillStyle = `rgba(0,0,0,${f.opacity * 0.4})`
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.translate(f.x, f.y)
  ctx.rotate(f.rotation)
  drawPath(ctx, f.pts, f.radius)
  const b = f.brightness
  ctx.fillStyle = `rgba(${b},${b + 5},${b + 12},${f.opacity})`
  ctx.fill()
  ctx.restore()
}

export default function PackIceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let floes: Floe[] = []
    let animId = 0

    function animate() {
      if (!canvas || !ctx) return
      const W = canvas.width, H = canvas.height
      floes.forEach((f) => {
        f.x += f.vx; f.y += f.vy; f.rotation += f.rotSpeed
        const m = f.radius + 10
        if (f.x < -m) f.x = W + m
        if (f.x > W + m) f.x = -m
        if (f.y < -m) f.y = H + m
        if (f.y > H + m) f.y = -m
      })
      resolveCollisions(floes)
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, W, H)
      floes.forEach((f) => drawFloe(ctx, f))
      animId = requestAnimationFrame(animate)
    }

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      floes = initFloes(rect.width, rect.height)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId) }
  }, [])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
}
