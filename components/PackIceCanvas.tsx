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
    const d = 0.5 + r() * 0.8
    pts.push([Math.cos(a) * d, Math.sin(a) * d])
  }
  return pts
}

function initFloes(W: number, H: number): Floe[] {
  const r = seededRand(42)
  const floes: Floe[] = []
  for (let i = 0; i < 90; i++) {
    const radius = 12 + r() * 68
    floes.push({
      x: r() * (W + 200) - 100,
      y: r() * (H + 200) - 100,
      vx: (r() - 0.5) * 0.16,
      vy: (r() - 0.5) * 0.16,
      radius,
      pts: makeShape(Math.floor(5 + r() * 4), r),
      rotation: r() * Math.PI * 2,
      rotSpeed: (r() - 0.5) * 0.00022,
      brightness: Math.floor(168 + r() * 52),
      opacity: 0.20 + r() * 0.32,
    })
  }
  return floes
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

    function drawFloe(f: Floe) {
      if (!ctx) return
      const draw = (ox: number, oy: number, fillStyle: string) => {
        if (!ctx) return
        ctx.save()
        ctx.translate(f.x + ox, f.y + oy)
        ctx.rotate(f.rotation)
        ctx.beginPath()
        ctx.moveTo(f.pts[0][0] * f.radius, f.pts[0][1] * f.radius)
        for (let i = 1; i < f.pts.length; i++)
          ctx.lineTo(f.pts[i][0] * f.radius, f.pts[i][1] * f.radius)
        ctx.closePath()
        ctx.fillStyle = fillStyle
        ctx.fill()
        ctx.restore()
      }
      // Shadow for 3D depth
      draw(3, 4, `rgba(0,0,0,${f.opacity * 0.45})`)
      // Ice face
      const b = f.brightness
      draw(0, 0, `rgba(${b},${b + 5},${b + 12},${f.opacity})`)
    }

    function drawFrame() {
      if (!canvas || !ctx) return
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      floes.forEach(drawFloe)
    }

    function animate() {
      if (!canvas) return
      const W = canvas.width
      const H = canvas.height
      floes.forEach((f) => {
        f.x += f.vx
        f.y += f.vy
        f.rotation += f.rotSpeed
        const m = f.radius + 10
        if (f.x < -m) f.x = W + m
        if (f.x > W + m) f.x = -m
        if (f.y < -m) f.y = H + m
        if (f.y > H + m) f.y = -m
      })
      drawFrame()
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
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
  )
}
