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

function makeShape(verts: number, r: () => number): [number, number][] {
  const pts: [number, number][] = []
  const step = (2 * Math.PI) / verts
  for (let i = 0; i < verts; i++) {
    const a = i * step + (r() - 0.5) * step * 0.75
    pts.push([Math.cos(a) * (0.5 + r() * 0.8), Math.sin(a) * (0.5 + r() * 0.8)])
  }
  return pts
}

function initFloes(W: number, H: number): Floe[] {
  const r = seededRand(42)
  const placed: Floe[] = []
  const layers = [
    { count: 12, rMin: 48, rMax: 72 },
    { count: 24, rMin: 22, rMax: 46 },
    { count: 30, rMin: 7,  rMax: 20 },
  ]
  for (const { count, rMin, rMax } of layers) {
    for (let i = 0; i < count; i++) {
      const radius = rMin + r() * (rMax - rMin)
      let ok = false
      for (let att = 0; att < 60; att++) {
        const x = r() * (W + 80) - 40
        const y = r() * (H + 80) - 40
        let clear = true
        for (const f of placed) {
          const dx = f.x - x, dy = f.y - y
          if (dx * dx + dy * dy < (f.radius + radius + 6) ** 2) { clear = false; break }
        }
        if (clear) {
          placed.push({
            x, y, radius,
            vx: (r() - 0.5) * 0.07,
            vy: (r() - 0.5) * 0.07,
            pts: makeShape(Math.floor(5 + r() * 4), r),
            rotation: r() * Math.PI * 2,
            rotSpeed: (r() - 0.5) * 0.00010,
            brightness: Math.floor(168 + r() * 52),
            opacity: 0.22 + r() * 0.30,
          })
          ok = true
          break
        }
      }
      if (!ok) r()
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
  const draw = (ox: number, oy: number, style: string) => {
    ctx.save()
    ctx.translate(f.x + ox, f.y + oy)
    ctx.rotate(f.rotation)
    ctx.beginPath()
    ctx.moveTo(f.pts[0][0] * f.radius, f.pts[0][1] * f.radius)
    for (let i = 1; i < f.pts.length; i++)
      ctx.lineTo(f.pts[i][0] * f.radius, f.pts[i][1] * f.radius)
    ctx.closePath()
    ctx.fillStyle = style
    ctx.fill()
    ctx.restore()
  }
  draw(3, 4, `rgba(0,0,0,${f.opacity * 0.4})`)
  const b = f.brightness
  draw(0, 0, `rgba(${b},${b + 5},${b + 12},${f.opacity})`)
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
        const m = f.radius + 8
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
