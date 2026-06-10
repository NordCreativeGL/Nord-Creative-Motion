'use client'
import { useRef, useEffect } from 'react'

interface Floe {
  x: number; y: number; vx: number; vy: number
  radius: number; pts: [number, number][]
  rotation: number; rotSpeed: number
  brightness: number; opacity: number; glow: number
}

function seededRand(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function makeShape(r: () => number): [number, number][] {
  const verts = Math.floor(4 + r() * 4) // 4-7 corners — angular, never round
  const stretchX = 0.7 + r() * 0.9      // some floes long, some compact
  const stretchY = 0.7 + r() * 0.9
  const rot = r() * Math.PI * 2
  const pts: [number, number][] = []
  const baseStep = (2 * Math.PI) / verts
  let acc = 0
  for (let i = 0; i < verts; i++) {
    // uneven angular spacing -> irregular faces
    acc += baseStep * (0.55 + r() * 0.9)
    // strong radius variation -> jagged, broken-ice silhouette
    const rad = 0.45 + r() * 0.75
    const x = Math.cos(acc) * rad * stretchX
    const y = Math.sin(acc) * rad * stretchY
    // apply random orientation
    const cx = x * Math.cos(rot) - y * Math.sin(rot)
    const cy = x * Math.sin(rot) + y * Math.cos(rot)
    pts.push([cx, cy])
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
  const r = seededRand(91)
  const placed: Floe[] = []

  const spawn = (x: number, y: number, radius: number, glow: number, slow = false) => {
    placed.push({
      x, y, radius,
      vx: (r() - 0.5) * (slow ? 0.022 : 0.055),
      vy: (r() - 0.5) * (slow ? 0.022 : 0.055),
      pts: makeShape(r),
      rotation: r() * Math.PI * 2,
      rotSpeed: (r() - 0.5) * 0.00007,
      brightness: Math.floor(224 + r() * 30),
      opacity: 0.84 + r() * 0.14,
      glow,
    })
  }

  const tryPlace = (radius: number, glow: number) => {
    for (let att = 0; att < 70; att++) {
      const x = r() * (W + 60) - 30
      const y = r() * (H + 60) - 30
      let clear = true
      for (const f of placed) {
        const dx = f.x - x, dy = f.y - y
        const gap = f.radius + radius + 22 + r() * 46
        if (dx * dx + dy * dy < gap * gap) { clear = false; break }
      }
      if (clear) { spawn(x, y, radius, glow); return }
    }
  }

  // 2 hero floes — large, unique, strong glow
  spawn(W * 0.15, H * 0.70, 152, 1.0, true)
  spawn(W * 0.81, H * 0.31, 132, 0.85, true)

  // Medium floes — only ~1/3 get a subtle glow, varied vertex counts
  for (let i = 0; i < 16; i++) {
    const radius = 32 + r() * 44
    const glow = radius > 56 ? 0.55 : (r() > 0.7 ? 0.4 : 0)
    tryPlace(radius, glow)
  }
  // Small floes — no glow
  for (let i = 0; i < 24; i++) tryPlace(13 + r() * 16, 0)
  // Tiny fragments — no glow
  for (let i = 0; i < 38; i++) tryPlace(3 + r() * 7, 0)

  return placed
}

function resolveCollisions(floes: Floe[]) {
  for (let i = 0; i < floes.length; i++) {
    for (let j = i + 1; j < floes.length; j++) {
      const a = floes[i], b = floes[j]
      const dx = b.x - a.x, dy = b.y - a.y
      const distSq = dx * dx + dy * dy
      const minD = a.radius + b.radius + 16
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
  if (f.glow > 0) {
    ctx.save()
    ctx.translate(f.x, f.y)
    ctx.rotate(f.rotation)
    tracePath(ctx, f.pts, f.radius * 1.55)
    ctx.fillStyle = `rgba(56, 168, 184, ${f.glow * 0.10})`
    ctx.fill()
    tracePath(ctx, f.pts, f.radius * 1.26)
    ctx.fillStyle = `rgba(84, 198, 208, ${f.glow * 0.16})`
    ctx.fill()
    tracePath(ctx, f.pts, f.radius * 1.08)
    ctx.fillStyle = `rgba(120, 216, 222, ${f.glow * 0.13})`
    ctx.fill()
    ctx.restore()
  }
  ctx.save()
  ctx.translate(f.x + 2, f.y + 3)
  ctx.rotate(f.rotation)
  tracePath(ctx, f.pts, f.radius)
  ctx.fillStyle = `rgba(0,0,0,0.30)`
  ctx.fill()
  ctx.restore()

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
