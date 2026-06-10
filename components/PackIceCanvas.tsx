'use client'
import { useRef, useEffect } from 'react'

const HORIZON = 0.28
const DRIFT = 0.0006
const COLS = 7
const ROWS = 9

interface Floe {
  wx: number; wy: number; radius: number
  pts: [number, number][]; driftX: number
  rotation: number; rotSpeed: number; opacity: number
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

function project(wx: number, wy: number, W: number, H: number) {
  const hy = H * HORIZON
  const spread = 0.7 + wy * 1.8
  const sx = W / 2 + (wx - W / 2) * spread
  const sy = hy + wy * (H - hy)
  const scale = 0.06 + wy * 0.94
  return { sx, sy, scale }
}

function initFloes(W: number): Floe[] {
  const r = seededRand(42)
  const floes: Floe[] = []
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const wy = Math.max(0.02, Math.min(0.98,
        (row + 0.5) / ROWS + (r() - 0.5) * 0.07
      ))
      const wx = W * ((col + 0.5) / COLS) + (r() - 0.5) * (W / COLS * 0.55)
      const radius = 16 + r() * 50
      const verts = Math.floor(5 + r() * 4)
      floes.push({
        wx, wy, radius,
        pts: makeShape(verts, r),
        driftX: (r() - 0.5) * 0.12,
        rotation: r() * Math.PI * 2,
        rotSpeed: (r() - 0.5) * 0.0003,
        opacity: 0.15 + r() * 0.22,
      })
    }
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

    function drawFrame() {
      if (!canvas || !ctx) return
      const W = canvas.width
      const H = canvas.height

      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, W, H)

      // Atmosphere fade at horizon
      const fog = ctx.createLinearGradient(0, 0, 0, H * HORIZON * 1.6)
      fog.addColorStop(0, 'rgba(0,0,0,1)')
      fog.addColorStop(1, 'rgba(0,0,0,0)')

      // Draw floes far-to-near
      const sorted = [...floes].sort((a, b) => a.wy - b.wy)
      sorted.forEach((f) => {
        if (!ctx || !canvas) return
        const { sx, sy, scale } = project(f.wx, f.wy, W, H)
        const rPx = f.radius * scale

        ctx.save()
        ctx.translate(sx, sy)
        ctx.rotate(f.rotation)

        ctx.beginPath()
        ctx.moveTo(f.pts[0][0] * rPx, f.pts[0][1] * rPx)
        for (let i = 1; i < f.pts.length; i++) {
          ctx.lineTo(f.pts[i][0] * rPx, f.pts[i][1] * rPx)
        }
        ctx.closePath()

        // Subtle 3D: offset shadow
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowBlur = rPx * 0.3
        ctx.shadowOffsetY = rPx * 0.15

        const bright = Math.floor(185 + f.wy * 30)
        ctx.fillStyle = `rgba(${bright},${bright + 6},${bright + 14},${f.opacity})`
        ctx.fill()

        ctx.shadowColor = 'transparent'
        ctx.restore()
      })

      // Horizon fog overlay
      ctx.fillStyle = fog
      ctx.fillRect(0, 0, W, H * HORIZON * 1.6)
    }

    function animate() {
      if (!canvas) return
      const W = canvas.width
      floes.forEach((f) => {
        f.wy += DRIFT * (0.6 + f.wy * 0.8)
        f.rotation += f.rotSpeed
        f.wx += f.driftX
        if (f.wy > 1.2) {
          f.wy = 0.02 + Math.random() * 0.04
          f.wx = Math.random() * W
          f.radius = 10 + Math.random() * 28
          f.opacity = 0.08 + Math.random() * 0.12
        }
        if (f.wx < -W * 0.4) f.wx = W * 1.4
        if (f.wx > W * 1.4) f.wx = -W * 0.4
      })
      drawFrame()
      animId = requestAnimationFrame(animate)
    }

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      floes = initFloes(rect.width)
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
