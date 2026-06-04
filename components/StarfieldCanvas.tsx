'use client'

import { useEffect, useRef } from 'react'

interface Star {
  rDeg: number
  thetaDeg: number
  size: number
  brightness: number
}

const STARS: Star[] = [
  // Ursa Major / Karlsvognen
  { rDeg: 28.3, thetaDeg: 165.9, size: 2.5, brightness: 0.88 }, // Dubhe
  { rDeg: 33.6, thetaDeg: 165.5, size: 2.0, brightness: 0.72 }, // Merak
  { rDeg: 36.3, thetaDeg: 178.5, size: 1.8, brightness: 0.65 }, // Phecda
  { rDeg: 33.0, thetaDeg: 183.9, size: 1.5, brightness: 0.56 }, // Megrez
  { rDeg: 34.0, thetaDeg: 193.5, size: 2.2, brightness: 0.82 }, // Alioth
  { rDeg: 35.1, thetaDeg: 201.0, size: 2.0, brightness: 0.76 }, // Mizar
  { rDeg: 40.7, thetaDeg: 206.9, size: 2.2, brightness: 0.84 }, // Alkaid
  // Cassiopeia
  { rDeg: 30.9, thetaDeg: 2.3,  size: 1.8, brightness: 0.70 }, // Caph
  { rDeg: 33.5, thetaDeg: 10.1, size: 2.2, brightness: 0.82 }, // Schedar
  { rDeg: 29.3, thetaDeg: 14.2, size: 2.0, brightness: 0.76 }, // Cih
  { rDeg: 29.8, thetaDeg: 21.5, size: 1.8, brightness: 0.70 }, // Ruchbah
  { rDeg: 26.3, thetaDeg: 28.6, size: 1.6, brightness: 0.62 }, // Segin
  // Draco
  { rDeg: 25.6, thetaDeg: 211.1, size: 1.5, brightness: 0.52 }, // Thuban
  { rDeg: 31.0, thetaDeg: 231.2, size: 1.4, brightness: 0.48 }, // iota Dra
  { rDeg: 24.3, thetaDeg: 257.2, size: 1.5, brightness: 0.52 }, // Aldhibah
  { rDeg: 17.3, thetaDeg: 275.3, size: 1.3, brightness: 0.44 }, // chi Dra
  { rDeg: 22.3, thetaDeg: 288.1, size: 1.4, brightness: 0.48 }, // delta Dra
  { rDeg: 37.7, thetaDeg: 262.6, size: 2.0, brightness: 0.73 }, // Rastaban
  { rDeg: 38.5, thetaDeg: 269.2, size: 2.2, brightness: 0.82 }, // Eltanin
  // Orion
  { rDeg: 82.6, thetaDeg: 88.8, size: 3.0, brightness: 0.95 }, // Betelgeuse
  { rDeg: 98.2, thetaDeg: 78.6, size: 3.5, brightness: 0.98 }, // Rigel
  { rDeg: 83.7, thetaDeg: 81.3, size: 2.5, brightness: 0.85 }, // Bellatrix
  { rDeg: 90.3, thetaDeg: 83.0, size: 2.0, brightness: 0.75 }, // Mintaka
  { rDeg: 91.2, thetaDeg: 84.1, size: 2.2, brightness: 0.80 }, // Alnilam
  { rDeg: 91.9, thetaDeg: 85.2, size: 2.0, brightness: 0.75 }, // Alnitak
  { rDeg: 99.7, thetaDeg: 86.9, size: 1.8, brightness: 0.68 }, // Saiph
]

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0, height = 0, cx = 0, cy = 0, maxRadius = 0
    let rotation = 0
    const BASE_SPEED = 0.00009
    let scrollVel = 0
    const DECAY = 0.92
    let opacity = 0
    let lastScrollY = window.scrollY

    interface BgStar { x: number; y: number; z: number; baseSize: number }
    let bgStars: BgStar[] = []

    function isMob() { return window.innerWidth < 1024 }

    function initBgStars() {
      const count = isMob() ? 80 : 160
      bgStars = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: Math.random(),
        baseSize: Math.random() * 0.7 + 0.3,
      }))
    }

    function resize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      cx = width * 0.5
      cy = height * 0.42
      maxRadius = Math.min(width, height) * (isMob() ? 0.72 : 0.84)
      initBgStars()
    }

    function onScroll() {
      const y = window.scrollY
      const delta = y - lastScrollY
      lastScrollY = y
      scrollVel += delta * 0.000032
      const heroH = window.innerHeight
      const t = (y - heroH * 0.05) / (heroH * 0.5)
      opacity = Math.min(1, Math.max(0, t))
    }

    let rafId: number

    function draw() {
      rafId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, width, height)
      if (opacity <= 0.01) return

      scrollVel *= DECAY
      rotation += BASE_SPEED + scrollVel

      const zSpeed = 0.00025 + Math.abs(scrollVel) * 1.5
      for (const s of bgStars) {
        s.z -= zSpeed
        if (s.z <= 0.01) {
          s.z = 1
          s.x = (Math.random() - 0.5) * 2
          s.y = (Math.random() - 0.5) * 2
        }
        const px = cx + (s.x / s.z) * width * 0.55
        const py = cy + (s.y / s.z) * height * 0.55
        if (px < -20 || px > width + 20 || py < -20 || py > height + 20) continue
        const size = Math.max(0.2, s.baseSize * (1 - s.z * 0.6))
        const alpha = (1 - s.z) * 0.45 * opacity
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210,225,255,${alpha})`
        ctx.fill()
      }

      // Polaris — fixed at center
      const pgrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10)
      pgrd.addColorStop(0, `rgba(200,220,255,${0.28 * opacity})`)
      pgrd.addColorStop(1, 'rgba(200,220,255,0)')
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2)
      ctx.fillStyle = pgrd; ctx.fill()
      ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(240,248,255,${0.92 * opacity})`; ctx.fill()

      // Constellation stars
      for (const star of STARS) {
        const r = (star.rDeg / 90) * maxRadius
        const angle = (star.thetaDeg * Math.PI) / 180 + rotation
        const sx = cx + r * Math.cos(angle)
        const sy = cy + r * Math.sin(angle)
        const alpha = star.brightness * opacity

        if (star.size >= 2.0) {
          const gr = star.size * 4
          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr)
          grd.addColorStop(0, `rgba(200,220,255,${0.22 * alpha})`)
          grd.addColorStop(1, 'rgba(200,220,255,0)')
          ctx.beginPath(); ctx.arc(sx, sy, gr, 0, Math.PI * 2)
          ctx.fillStyle = grd; ctx.fill()
        }

        ctx.beginPath(); ctx.arc(sx, sy, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240,248,255,${alpha})`; ctx.fill()
      }
    }

    resize()
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
