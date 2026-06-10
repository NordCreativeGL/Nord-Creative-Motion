'use client'
import { useRef, useEffect } from 'react'

interface Floe {
  x: number; y: number; vx: number; vy: number
  radius: number; pts: [number, number][]
  rotation: number; rotSpeed: number
  brightness: number; opacity: number; glow: number
}

// Half-width and half-height of the exclusion ellipse around the "Start your project" button
const BTN_ZONE = { rx: 160, ry: 60 }

// Largest possible floe radius (hero floes), used as the size reference for fill color
const MAX_RADIUS = 152

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
  const ROUND = 0.35
  const n = pts.length
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n]
    const curr = pts[i]
    const next = pts[(i + 1) % n]
    const currX = curr[0] * radius, currY = curr[1] * radius
    const prevX = prev[0] * radius, prevY = prev[1] * radius
    const nextX = next[0] * radius, nextY = next[1] * radius
    const p1x = currX + (prevX - currX) * ROUND
    const p1y = currY + (prevY - currY) * ROUND
    const p2x = currX + (nextX - currX) * ROUND
    const p2y = currY + (nextY - currY) * ROUND
    if (i === 0) {
      ctx.moveTo(p1x, p1y)
    } else {
      ctx.lineTo(p1x, p1y)
    }
    ctx.quadraticCurveTo(currX, currY, p2x, p2y)
  }
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

  const cx = W / 2, cy = H * 0.56

  const tryPlace = (radius: number, glow: number) => {
    for (let att = 0; att < 70; att++) {
      const x = r() * (W + 60) - 30
      const y = r() * (H + 60) - 30
      let clear = true
      const bx = x - cx, by = y - cy
      const brx = BTN_ZONE.rx + radius, bry = BTN_ZONE.ry + radius
      if ((bx * bx) / (brx * brx) + (by * by) / (bry * bry) < 1) { clear = false }
      if (clear) {
        for (const f of placed) {
          const dx = f.x - x, dy = f.y - y
          const gap = f.radius + radius + 22 + r() * 46
          if (dx * dx + dy * dy < gap * gap) { clear = false; break }
        }
      }
      if (clear) { spawn(x, y, radius, glow); return }
    }
  }

  // 4 hero floes — large, unique, strong glow
  spawn(W * 0.15, H * 0.70, 152, 1.0, true)
  spawn(W * 0.81, H * 0.31, 132, 0.85, true)
  spawn(W * 0.45, H * 0.12, 140, 0.75, true)
  spawn(W * 0.68, H * 0.82, 122, 0.65, true)

  // Medium floes — only ~1/3 get a subtle glow, varied vertex counts
  for (let i = 0; i < 26; i++) {
    const radius = 32 + r() * 67
    const glow = radius > 56 ? 0.55 : (r() > 0.7 ? 0.4 : 0)
    tryPlace(radius, glow)
  }
  // Small floes — no glow
  for (let i = 0; i < 38; i++) tryPlace(13 + r() * 25, 0)
  // Tiny fragments — no glow
  for (let i = 0; i < 60; i++) tryPlace(3 + r() * 10, 0)

  // Extra small-to-medium floes for added density
  for (let i = 0; i < 20; i++) {
    const radius = 99 * (0.3 + r() * 0.4)
    const glow = radius > 56 ? 0.55 : (r() > 0.7 ? 0.4 : 0)
    tryPlace(radius, glow)
  }

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

function drawShimmer(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  for (let i = 0; i < 8; i++) {
    const baseY = (h / 8) * i + (h / 16)
    const y = baseY + Math.sin(t * 0.0003 + i * 1.7) * 6
    const grad = ctx.createLinearGradient(0, y, w, y)
    grad.addColorStop(0, 'rgba(180,210,230,0)')
    grad.addColorStop(0.25 + Math.sin(i * 0.9) * 0.1, 'rgba(180,210,230,0.045)')
    grad.addColorStop(0.6, 'rgba(180,210,230,0.025)')
    grad.addColorStop(1, 'rgba(180,210,230,0)')
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(w * 0.25, y - 4 + Math.sin(t * 0.0002 + i) * 3, w * 0.75, y + 4 + Math.cos(t * 0.00025 + i) * 3, w, y)
    ctx.lineWidth = 1.5
    ctx.strokeStyle = grad
    ctx.stroke()
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
  const fillRGB = f.radius >= MAX_RADIUS * 0.6 ? '200, 216, 222' : '248, 252, 255'
  ctx.fillStyle = `rgba(${fillRGB}, ${f.opacity})`
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

    function animate(t: number = performance.now()) {
      if (!canvas || !ctx) return
      const W = canvas.width, H = canvas.height
      floes.forEach((f) => {
        f.x += f.vx; f.y += f.vy; f.rotation += f.rotSpeed
        const m = f.radius + 12
        if (f.x < -m) f.x = W + m
        if (f.x > W + m) f.x = -m
        if (f.y < -m) f.y = H + m
        if (f.y > H + m) f.y = -m

        const cx = W / 2, cy = H * 0.56
        const dx = f.x - cx, dy = f.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const rx = BTN_ZONE.rx + f.radius, ry = BTN_ZONE.ry + f.radius
        if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) < 1) {
          f.vx += (dx / dist) * 0.05
          f.vy += (dy / dist) * 0.05
        }
      })
      resolveCollisions(floes)
      ctx.fillStyle = '#04111c'
      ctx.fillRect(0, 0, W, H)
      drawShimmer(ctx, W, H, t)
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
