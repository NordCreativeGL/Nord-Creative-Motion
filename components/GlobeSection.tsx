'use client'
import { useEffect, useRef } from 'react'

export default function GlobeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const heading1Ref = useRef<HTMLDivElement>(null)
  const heading2Ref = useRef<HTMLDivElement>(null)
  const body1Ref = useRef<HTMLParagraphElement>(null)
  const body2Ref = useRef<HTMLParagraphElement>(null)
  const body3Ref = useRef<HTMLParagraphElement>(null)
  const readMoreRef = useRef<HTMLAnchorElement>(null)
  const hasAnimated = useRef(false)
  const animIdRef = useRef<number>(0)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    let d3: any, topojson: any, worldFeatures: any[], glFeature: any

    const loadLibs = async () => {
      const [d3mod, topomod] = await Promise.all([
        import('d3'),
        import('topojson-client'),
      ])
      d3 = d3mod
      topojson = topomod

      const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json())
      worldFeatures = (topojson.feature(world, world.objects.countries) as any).features
      glFeature = worldFeatures.find((f: any) => f.id === '304')
    }

    const eio = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t
    const eo = (t: number) => 1 - Math.pow(1-t, 3)
    const lerp = (a: number, b: number, t: number) => a + (b-a)*t

    const drawFrame = (
      scale: number, rotLon: number, rotLat: number,
      cx: number, cy: number, globeAlpha: number, countriesAlpha: number
    ) => {
      if (!d3 || !canvas) return
      const dpr = window.devicePixelRatio || 1
      const W = canvas.width / dpr
      const H = canvas.height / dpr
      const ctx = canvas.getContext('2d')!

      ctx.clearRect(0, 0, W, H)

      const proj = d3.geoOrthographic()
        .scale(scale)
        .translate([cx, cy])
        .rotate([rotLon, rotLat])
      const path = d3.geoPath().projection(proj).context(ctx)

      ctx.save()
      ctx.globalAlpha = globeAlpha

      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.fillStyle = '#040404'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.beginPath()
      path(d3.geoGraticule()())
      ctx.strokeStyle = 'rgba(255,255,255,0.032)'
      ctx.lineWidth = 0.4
      ctx.stroke()

      if (worldFeatures) {
        ctx.save()
        ctx.globalAlpha = countriesAlpha
        worldFeatures.forEach((f: any) => {
          if (f.id === '304') return
          ctx.beginPath()
          path(f)
          ctx.fillStyle = 'rgba(255,255,255,0.65)'
          ctx.fill()
          ctx.strokeStyle = '#040404'
          ctx.lineWidth = 0.3
          ctx.stroke()
        })
        ctx.restore()

        ctx.globalAlpha = 1
        if (glFeature && videoRef.current && videoRef.current.readyState >= 2) {
          const bounds = path.bounds(glFeature)
          const bx = bounds[0][0], by = bounds[0][1]
          const bw = bounds[1][0] - bx, bh = bounds[1][1] - by
          if (bw > 0 && bh > 0) {
            ctx.save()
            ctx.beginPath()
            path(glFeature)
            ctx.clip()
            ctx.drawImage(videoRef.current, bx, by, bw, bh)
            ctx.restore()
          }
        } else if (glFeature) {
          ctx.beginPath()
          path(glFeature)
          ctx.fillStyle = 'rgba(130,215,255,0.85)'
          ctx.fill()
          ctx.strokeStyle = '#040404'
          ctx.lineWidth = 0.3
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    const animateText = () => {
      const gsap = (window as any).gsap
      if (!gsap) return
      const ease = 'cubic-bezier(0.25, 0.1, 0.15, 1)'
      const refs = [labelRef, heading1Ref, heading2Ref, body1Ref, body2Ref, body3Ref, readMoreRef]
      const delays = [0, 0.05, 0.35, 0.8, 1.0, 1.2, 1.4]
      refs.forEach((r, i) => {
        if (r.current) gsap.to(r.current, { opacity: 1, y: 0, duration: 0.9, delay: delays[i], ease })
      })
    }

    const startAnimation = async () => {
      await loadLibs()
      const video = videoRef.current
      if (video) { video.play().catch(() => {}) }

      const dpr = window.devicePixelRatio || 1
      const W = section.offsetWidth
      const H = section.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)

      const DURATION = 6
      const finalCX = W * 0.74
      const finalCY = H * 0.51
      const finalScale = 2050

      const t0 = performance.now()

      const drawFinalLoop = () => {
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, W, H)
        const proj = d3.geoOrthographic()
          .scale(finalScale)
          .translate([finalCX, finalCY])
          .rotate([42, -72])
        const path = d3.geoPath().projection(proj).context(ctx)
        if (glFeature && videoRef.current && videoRef.current.readyState >= 2) {
          const bounds = path.bounds(glFeature)
          const bx = bounds[0][0], by = bounds[0][1]
          const bw = bounds[1][0] - bx, bh = bounds[1][1] - by
          if (bw > 0 && bh > 0) {
            ctx.save()
            ctx.beginPath()
            path(glFeature)
            ctx.clip()
            ctx.drawImage(videoRef.current, bx, by, bw, bh)
            ctx.restore()
          }
        }
        animIdRef.current = requestAnimationFrame(drawFinalLoop)
      }

      const tick = () => {
        const p = Math.min((performance.now() - t0) / 1000 / DURATION, 1)

        let scale: number, rotLon: number, rotLat: number
        let cx = W / 2, cy = H / 2
        let globeAlpha = 1
        let countriesAlpha = 1

        if (p < 0.22) {
          const q = eo(p / 0.22)
          scale = lerp(70, 450, q)
          rotLon = lerp(-134, -80, q)
          rotLat = lerp(25, -18, q)
        } else if (p < 0.60) {
          const q = eio((p - 0.22) / 0.38)
          scale = 450
          rotLon = lerp(-80, 100, q)
          rotLat = -18
        } else if (p < 0.86) {
          const q = eio((p - 0.60) / 0.26)
          scale = lerp(450, 2050, q)
          rotLon = lerp(100, 42, q)
          rotLat = lerp(-18, -72, q)
          cx = lerp(W / 2, W * 0.74, q)
          cy = lerp(H / 2, H * 0.51, q)
          countriesAlpha = lerp(1, 0, q)
        } else {
          const q = eio((p - 0.86) / 0.14)
          scale = 2050
          rotLon = 42
          rotLat = -72
          cx = W * 0.74
          cy = H * 0.51
          countriesAlpha = 0
        }

        drawFrame(scale, rotLon, rotLat, cx, cy, globeAlpha, countriesAlpha)

        if (p < 1) {
          animIdRef.current = requestAnimationFrame(tick)
        } else {
          animateText()
          drawFinalLoop()
        }
      }

      animIdRef.current = requestAnimationFrame(tick)
    }

    const gsapInit = async () => {
      const gsap = (await import('gsap')).gsap
      ;(window as any).gsap = gsap
      const refs = [labelRef, heading1Ref, heading2Ref, body1Ref, body2Ref, body3Ref, readMoreRef]
      refs.forEach(r => { if (r.current) gsap.set(r.current, { opacity: 0, y: 20 }) })
    }
    gsapInit()

    const onScroll = () => {
      if (hasAnimated.current || !section) return
      const top = section.getBoundingClientRect().top + window.scrollY
      if (window.scrollY >= top - window.innerHeight * 0.5) {
        hasAnimated.current = true
        startAnimation()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="globe-section"
      data-snap="true"
      style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative' }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}
      />
      <video
        ref={videoRef}
        src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/BEAUTY.mp4"
        autoPlay muted loop playsInline
        style={{ display: 'none' }}
      />

      <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 'clamp(160px, 16vw, 220px)', paddingRight: '1rem', zIndex: 2, transform: 'translateX(150px)' }}>
        <div ref={labelRef} style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>Based in Greenland</div>
        <div ref={heading1Ref} style={{ fontSize: 'clamp(34px, 4.2vw, 53px)', fontWeight: 300, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em' }}>We live here</div>
        <div ref={heading2Ref} style={{ fontSize: 'clamp(34px, 4.2vw, 53px)', fontWeight: 300, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '2rem', paddingLeft: 'clamp(40px, 4vw, 60px)' }}>We work here</div>
        <p ref={body1Ref} style={{ fontSize: '20px', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', marginBottom: '1rem', maxWidth: '580px' }}>We are based in Qaqortoq in South Greenland, where we live and work close to the nature that inspires us every day.</p>
        <p ref={body2Ref} style={{ fontSize: '20px', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', marginBottom: '1rem', maxWidth: '580px' }}>We are available for projects across all of Greenland — from remote landscapes to towns and industrial sites — creating photography and film that document people, places, and projects in their natural context.</p>
        <p ref={body3Ref} style={{ fontSize: '20px', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', maxWidth: '580px' }}>This allows us to operate efficiently in locations where production is often limited by logistics and conditions.</p>
        <a
          ref={readMoreRef}
          href="/about"
          style={{
            display: 'inline-block',
            width: 'fit-content',
            marginTop: '2rem',
            padding: '14px 32px',
            border: '1px solid rgba(255,255,255,0.6)',
            borderRadius: '999px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 300,
            textDecoration: 'none',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'white';
            (e.currentTarget as HTMLAnchorElement).style.color = '#000';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = 'white';
          }}
        >
          Read more about us
        </a>
      </div>
    </section>
  )
}
