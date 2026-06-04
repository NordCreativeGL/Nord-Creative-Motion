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
  { rDeg: 28.3, thetaDeg: 165.9, size: 3.5, brightness: 0.92 },
  { rDeg: 33.6, thetaDeg: 165.5, size: 2.8, brightness: 0.78 },
  { rDeg: 36.3, thetaDeg: 178.5, size: 2.5, brightness: 0.70 },
  { rDeg: 33.0, thetaDeg: 183.9, size: 2.0, brightness: 0.60 },
  { rDeg: 34.0, thetaDeg: 193.5, size: 3.0, brightness: 0.86 },
  { rDeg: 35.1, thetaDeg: 201.0, size: 2.8, brightness: 0.80 },
  { rDeg: 40.7, thetaDeg: 206.9, size: 3.0, brightness: 0.88 },
  // Cassiopeia
  { rDeg: 30.9, thetaDeg: 2.3,   size: 2.5, brightness: 0.75 },
  { rDeg: 33.5, thetaDeg: 10.1,  size: 3.0, brightness: 0.86 },
  { rDeg: 29.3, thetaDeg: 14.2,  size: 2.8, brightness: 0.80 },
  { rDeg: 29.8, thetaDeg: 21.5,  size: 2.5, brightness: 0.75 },
  { rDeg: 26.3, thetaDeg: 28.6,  size: 2.2, brightness: 0.68 },
  // Draco
  { rDeg: 25.6, thetaDeg: 211.1, size: 2.0, brightness: 0.58 },
  { rDeg: 31.0, thetaDeg: 231.2, size: 1.8, brightness: 0.52 },
  { rDeg: 24.3, thetaDeg: 257.2, size: 2.0, brightness: 0.58 },
  { rDeg: 17.3, thetaDeg: 275.3, size: 1.8, brightness: 0.50 },
  { rDeg: 22.3, thetaDeg: 288.1, size: 1.8, brightness: 0.52 },
  { rDeg: 37.7, thetaDeg: 262.6, size: 2.8, brightness: 0.78 },
  { rDeg: 38.5, thetaDeg: 269.2, size: 3.0, brightness: 0.86 },
  // Orion
  { rDeg: 82.6, thetaDeg: 88.8,  size: 4.5, brightness: 0.96 },
  { rDeg: 98.2, thetaDeg: 78.6,  size: 5.0, brightness: 0.99 },
  { rDeg: 83.7, thetaDeg: 81.3,  size: 3.5, brightness: 0.88 },
  { rDeg: 90.3, thetaDeg: 83.0,  size: 2.8, brightness: 0.78 },
  { rDeg: 91.2, thetaDeg: 84.1,  size: 3.0, brightness: 0.82 },
  { rDeg: 91.9, thetaDeg: 85.2,  size: 2.8, brightness: 0.78 },
  { rDeg: 99.7, thetaDeg: 86.9,  size: 2.5, brightness: 0.72 },
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
    const DECAY = 0.94
    const MAX_VEL = 0.0015
    let opacity = 0
    let lastScrollY = window.scrollY

    interface BgStar { rDeg: number; thetaDeg: number; size: number; brightness: number }
    let bgStars: BgStar[] = []

    function isMob() { return window.innerWidth < 1024 }

    function initBgStars() {
      const count = isMob() ? 120 : 250
      bgStars = Array.from({ length: count }, () => ({
        rDeg: Math.random() * 100,
        thetaDeg: Math.random() * 360,
        size: Math.random() * 0.9 + 0.4,
        brightness: Math.random() * 0.20 + 0.06,
      }))
    }

    function resize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = width * 0.5
      cy = height * 0.40
      maxRadius = Math.min(width, height) * (isMob() ? 0.78 : 0.88)
      initBgStars()
    }

    function onScroll() {
      const y = window.scrollY
      const delta = y - lastScrollY
      lastScrollY = y
      const contribution = delta * 0.000018
      scrollVel = Math.max(-MAX_VEL, Math.min(MAX_VEL, scrollVel + contribution))
      const heroH = window.innerHeight
      const t = (y - heroH * 0.05) / (heroH * 0.5)
      opacity = Math.min(1, Math.max(0, t))
    }

    let rafId: number

    function draw() {
      rafId = requestAnimationFrame(draw)
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      if (opacity <= 0.01) return

      scrollVel *= DECAY
      rotation += BASE_SPEED + scrollVel

      for (const s of bgStars) {
        const r = (s.rDeg / 90) * maxRadius
        const angle = (s.thetaDeg * Math.PI) / 180 + rotation
        const sx = cx + r * Math.cos(angle)
        const sy = cy + r * Math.sin(angle)
        if (sx < -5 || sx > width + 5 || sy < -5 || sy > height + 5) continue
        ctx.beginPath()
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,230,255,${s.brightness * opacity})`
        ctx.fill()
      }

      const pgrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14)
      pgrd.addColorStop(0, `rgba(200,220,255,${0.35 * opacity})`)
      pgrd.addColorStop(1, 'rgba(200,220,255,0)')
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2)
      ctx.fillStyle = pgrd; ctx.fill()
      ctx.beginPath(); ctx.arc(cx, cy, 3.0, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(245,250,255,${0.95 * opacity})`; ctx.fill()

      for (const star of STARS) {
        const r = (star.rDeg / 90) * maxRadius
        const angle = (star.thetaDeg * Math.PI) / 180 + rotation
        const sx = cx + r * Math.cos(angle)
        const sy = cy + r * Math.sin(angle)
        const alpha = star.brightness * opacity

        if (star.size >= 2.5) {
          const gr = star.size * 5
          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr)
          grd.addColorStop(0, `rgba(200,225,255,${0.30 * alpha})`)
          grd.addColorStop(1, 'rgba(200,225,255,0)')
          ctx.beginPath(); ctx.arc(sx, sy, gr, 0, Math.PI * 2)
          ctx.fillStyle = grd; ctx.fill()
        }

        ctx.beginPath(); ctx.arc(sx, sy, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,250,255,${alpha})`; ctx.fill()
      }
    }

    const heroH = window.innerHeight
    const initT = (window.scrollY - heroH * 0.05) / (heroH * 0.5)
    opacity = Math.min(1, Math.max(0, initT))

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
