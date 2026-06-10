'use client'
import { useRef, useEffect } from 'react'

interface Floe {
  x: number; y: number; vx: number; vy: number
  radius: number; pts: [number, number][]
  rotation: number; rotSpeed: number
  brightness: number; opacity: number; glow: boolean
}

function seededRand(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function makeShape(verts: number, r: () => number): [number, number][] {
  const pts: [number, number][] = []
  const step = (2 * Math.PI) / verts
  for (let i = 0; i < verts; i++) {
    const a = i * step + (r() - 0.5) * step * 0.55
    const d = 0.62 + r() * 0.72
    pts.push([Math.cos(a) * d, Math.sin(a) * d])
  }
  return pts
}

function tracePath(ctx: CanvasRenderingContext2D, pts: [number, number][], radius: number) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0] * radius, pts[0][1] * radius)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * radius, pts[i][1] * radius)
  ctx.closePath()
}

function initFloes(W: number, H: number): Floe[] {
  const r = seededRand(73)
  const placed: Floe[] = []

  const spawn = (x: number, y: number, radius: number, verts: number, slow = false) => {
    placed.push({
      x, y, radius,
      vx: (r() - 0.5) * (slow ? 0.025 : 0.06),
      vy: (r() - 0.5) * (slow ? 0.025 : 0.06),
      pts: makeShape(verts, r),
      rotation: r() * Math.PI * 2,
      rotSpeed: (r() - 0.5) * 0.00008,
      brightness: Math.floor(225 + r() * 28),
      opacity: 0.82 + r() * 0.16,
      glow: r() > 0.4,
    })
  }

  const tryPlace = (radius: number, verts: number, slow = false) => {
    for (let att = 0; att < 70; att++) {
      const x = r() * (W + 60) - 30
      const y = r() * (H + 60) - 30
      let clear = true
      for (const f of placed) {
        const dx = f.x - x, dy = f.y - y
        const gap = f.radius + radius + 18 + r() * 40
        if (dx * dx + dy * dy < gap * gap) { clear = false; break }
      }
      if (clear) { spawn(x, y, radius, verts, slow); return }
    }
  }

  // 2 hero floes — large unique shapes
  spawn(W * 0.16, H * 0.70, 150, 16, true)
  spawn(W * 0.80, H * 0.32, 130, 17, true)

  // Medium floes (spread out, lots of dark water between)
  for (let i = 0; i < 16; i++) tryPlace(34 + r() * 40, 11)
  // Small floes
  for (let i = 0; i < 26; i++) tryPlace(14 + r() * 18, 9)
  // Tiny fragments
  for (let i = 0; i < 40; i++) tryPlace(3 + r() * 8, 7)

  return placed
}

function resolveCollisions(floes: Floe[]) {
  for (let i = 0; i < floes.length; i++) {
    for (let j = i + 1; j < floes.length; j++) {
      const a = floes[i], b = floes[j]
      const dx = b.x - a.x, dy = b.y - a.y
      const distSq = dx * dx + dy * dy
      const minD = a.radius + b.radius + 14
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
  // Turquoise underwater glow (submerged ice)
  if (f.glow) {
    ctx.save()
    ctx.translate(f.x, f.y)
    ctx.rotate(f.rotation)
    tracePath(ctx, f.pts, f.radius * 1.5)
    ctx.fillStyle = `rgba(64, 180, 190, ${f.opacity * 0.12})`
    ctx.fill()
    tracePath(ctx, f.pts, f.radius * 1.22)
    ctx.fillStyle = `rgba(90, 205, 210, ${f.opacity * 0.16})`
    ctx.fill()
    ctx.restore()
  }
  // Soft shadow for depth
  ctx.save()
  ctx.translate(f.x + 2, f.y + 3)
  ctx.rotate(f.rotation)
  tracePath(ctx, f.pts, f.radius)
  ctx.fillStyle = `rgba(0,0,0,0.35)`
  ctx.fill()
  ctx.restore()
  // Ice surface — bright white
  ctx.save()
  ctx.translate(f.x, f.y)
  ctx.rotate(f.rotation)
  tracePath(ctx, f.pts, f.radius)
  const b = f.brightness
  ctx.fillStyle = `rgba(${b},${b + 2},${b + 4},${f.opacity})`
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
        const m = f.radius + 12
        if (f.x < -m) f.x = W + m
        if (f.x > W + m) f.x = -m
        if (f.y < -m) f.y = H + m
        if (f.y > H + m) f.y = -m
      })
      resolveCollisions(floes)
      // Deep arctic water
      ctx.fillStyle = '#03070a'
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
