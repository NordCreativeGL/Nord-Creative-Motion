'use client'
import { useRef, useEffect } from 'react'

function seededRand(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildFloe(cx: number, cy: number, radius: number, verts: number, r: () => number): [number, number][] {
  const pts: [number, number][] = []
  const step = (2 * Math.PI) / verts
  for (let i = 0; i < verts; i++) {
    const angle = i * step + (r() - 0.5) * step * 0.8
    const dist = radius * (0.55 + r() * 0.75)
    pts.push([cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)])
  }
  return pts
}

export default function PackIceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function draw() {
      if (!canvas || !ctx) return
      const r = seededRand(137)
      const W = canvas.width
      const H = canvas.height

      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, W, H)

      const layers = [
        { count: 22, rMin: 50, rMax: 120, vMin: 5, vMax: 9, opMin: 0.22, opMax: 0.38 },
        { count: 30, rMin: 18, rMax: 50, vMin: 5, vMax: 8, opMin: 0.13, opMax: 0.24 },
        { count: 35, rMin: 5,  rMax: 17, vMin: 4, vMax: 7, opMin: 0.07, opMax: 0.15 },
      ]

      layers.forEach(({ count, rMin, rMax, vMin, vMax, opMin, opMax }) => {
        for (let i = 0; i < count; i++) {
          if (!canvas || !ctx) return
          const x = r() * W
          const y = r() * H
          const radius = rMin + r() * (rMax - rMin)
          const verts = Math.floor(vMin + r() * (vMax - vMin))
          const opacity = opMin + r() * (opMax - opMin)
          const pts = buildFloe(x, y, radius, verts, r)
          ctx.beginPath()
          ctx.moveTo(pts[0][0], pts[0][1])
          for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1])
          ctx.closePath()
          ctx.fillStyle = `rgba(205, 215, 222, ${opacity})`
          ctx.fill()
        }
      })
    }

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      draw()
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
