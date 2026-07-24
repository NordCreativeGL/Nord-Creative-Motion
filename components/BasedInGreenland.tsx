'use client'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

export default function BasedInGreenland() {
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
  const mobileLabelOverlayRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const animIdRef = useRef<number>(0)
  const scrollPRef = useRef(0)

  const [isStudio, setIsStudio] = useState(false)
  useEffect(() => {
    const check = () => setIsStudio(window.innerWidth >= 1900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { lang } = useLang()

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

      ctx.globalAlpha = globeAlpha * Math.min(1, countriesAlpha * 4)
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.fillStyle = '#040404'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.globalAlpha = globeAlpha

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
      const refs = [labelRef, heading1Ref, heading2Ref, body1Ref, body2Ref, body3Ref, readMoreRef, mobileLabelOverlayRef]
      const delays = [0, 0, 0.15, 0.6, 0.8, 1.0, 1.2]
      refs.forEach((r, i) => {
        if (r.current) gsap.to(r.current, { opacity: 1, y: 0, duration: 0.9, delay: delays[i], ease })
      })
    }

    const startAnimation = async () => {
      const isMobileNow = window.innerWidth < 1024
      await loadLibs()
      const video = videoRef.current
      if (video) { video.play().catch(() => {}) }

      const dpr = window.devicePixelRatio || 1
      const W = section.offsetWidth
      const H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)

      const finalCX = isMobileNow ? W * 0.50 : W * 0.74
      const finalCY = isMobileNow ? H * 0.50 : H * 0.51
      const finalScale = isMobileNow ? Math.round(5800 * (window.innerWidth / 1728)) : Math.round(2050 * (window.innerWidth / 1728))
      const midScale = isMobileNow ? 135 : window.innerWidth >= 1710 ? 450 : Math.round(450 * (window.innerWidth / 1710) * 0.75)

      let textFired = false

      const hideText = () => {
        const gsap = (window as any).gsap
        if (!gsap) return
        const refs = [labelRef, heading1Ref, heading2Ref, body1Ref, body2Ref, body3Ref, readMoreRef, mobileLabelOverlayRef]
        refs.forEach(r => {
          if (r.current) {
            gsap.killTweensOf(r.current)
            gsap.to(r.current, { opacity: 0, y: 20, duration: 0.3 })
          }
        })
      }

      const drawLoop = () => {
        const p = scrollPRef.current

        if (p >= 0.86) {
          ctx.clearRect(0, 0, W, H)
          if (glFeature && videoRef.current && videoRef.current.readyState >= 2) {
            const proj = d3.geoOrthographic()
              .scale(finalScale)
              .translate([finalCX, finalCY])
              .rotate([42, -72])
            const path = d3.geoPath().projection(proj).context(ctx)
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
        } else {
          let scale: number, rotLon: number, rotLat: number
          let cx = W / 2, cy = isMobileNow ? 0.42 * H : H / 2
          let countriesAlpha = 1

          if (p < 0.22) {
            const q = eo(p / 0.22)
            scale = lerp(70, midScale, q)
            rotLon = lerp(-10, 45, q)
            rotLat = lerp(25, -18, q)
          } else if (p < 0.40) {
            const q = eio((p - 0.22) / 0.18)
            scale = midScale
            rotLon = lerp(45, 70, q)
            rotLat = -18
          } else {
            const q = eio((p - 0.40) / 0.46)
            scale = lerp(midScale, finalScale, q)
            rotLon = lerp(70, 42, q)
            rotLat = lerp(-18, -72, q)
            cx = lerp(W / 2, isMobileNow ? W * 0.50 : W * 0.74, q)
            cy = lerp(isMobileNow ? 0.42 * H : H / 2, isMobileNow ? H * 0.50 : H * 0.51, q)
            countriesAlpha = lerp(1, 0, q)
          }

          drawFrame(scale, rotLon, rotLat, cx, cy, 1, countriesAlpha)
        }

        if (p >= 0.72 && !textFired) { textFired = true; animateText() }
        if (p < 0.72 && textFired) { textFired = false; hideText() }

        animIdRef.current = requestAnimationFrame(drawLoop)
      }

      animIdRef.current = requestAnimationFrame(drawLoop)
    }

    const gsapInit = async () => {
      const gsap = (await import('gsap')).gsap
      ;(window as any).gsap = gsap
      const refs = [labelRef, heading1Ref, heading2Ref, body1Ref, body2Ref, body3Ref, readMoreRef, mobileLabelOverlayRef]
      refs.forEach(r => { if (r.current) gsap.set(r.current, { opacity: 0, y: 20 }) })
    }
    gsapInit()

    let animStarted = false

    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const sectionTop = el.getBoundingClientRect().top + window.scrollY
      const startScrollY = sectionTop - window.innerHeight
      const totalRange = window.innerWidth < 1024 ? window.innerHeight * 6.5 : el.offsetHeight
      scrollPRef.current = Math.max(0, Math.min(1, (window.scrollY - startScrollY) / totalRange))

      if (!animStarted && window.scrollY >= sectionTop - window.innerHeight) {
        animStarted = true
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

  const t = {
    en: {
      label: 'Based in Greenland',
      h1: 'We live here', h2: 'We work here',
      b1: "We're based in Qaqortoq, South Greenland — close to the environments and the companies we work with. That familiarity shapes how we plan and approach every production.",
      b2: "We work across all of Greenland for businesses that need their work documented and presented professionally — regardless of where they're based or what it takes to get there.",
      para: 'This allows us to operate efficiently in locations where production is often limited by logistics and conditions.',
      readMore: 'Read more about us',
    },
    da: {
      label: 'Sydgrønland',
      h1: 'Vi bor her', h2: 'Vi arbejder her',
      b1: 'Vi holder til i Qaqortoq, Sydgrønland — tæt på de miljøer og de virksomheder vi arbejder med. Det kendskab kan ses i alt fra planlægning til det færdige resultat.',
      b2: 'Vi arbejder i hele Grønland for virksomheder der har brug for at få deres arbejde dokumenteret og præsenteret professionelt — uanset hvor de befinder sig eller hvad det kræver at komme derhen.',
      para: 'Det betyder vi kan arbejde effektivt, selv der hvor logistik og vejr ellers sætter grænser.',
      readMore: 'Læs mere om os',
    }
  }

  return (
    <section
      ref={sectionRef}
      id="based"
      data-snap="true"
      style={{ height: isMobile ? '900dvh' : '350vh' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: isMobile ? '100dvh' : '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
        }}
      >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: isMobile ? 3 : 5,
          pointerEvents: 'none',
        }}
      />
      <video
        ref={videoRef}
        src="https://cdn.nordcreative.dk/BEAUTY.mp4"
        preload="none"
        autoPlay muted loop playsInline
        style={{ display: 'none' }}
      />

      {isMobile && (
        <div
          ref={mobileLabelOverlayRef}
          style={{
            position: 'absolute',
            bottom: '6%',
            left: '24px',
            zIndex: 6,
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            pointerEvents: 'none',
          }}
        >
          {t[lang].label}
        </div>
      )}

      <div style={{ flex: isMobile ? '0 0 100%' : '0 0 50%', display: isMobile ? 'none' : 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: isMobile ? '24px' : isStudio ? 'clamp(300px, 17vw, 400px)' : 'clamp(160px, 16vw, 220px)', paddingRight: isMobile ? '24px' : '1rem', zIndex: 2, transform: isMobile ? 'none' : 'translateX(150px)', paddingTop: isMobile ? '46dvh' : undefined, paddingBottom: isMobile ? '48px' : undefined }}>
        <div ref={labelRef} style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>{t[lang].label}</div>
        <div ref={heading1Ref} style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em' }}>{t[lang].h1}</div>
        <div ref={heading2Ref} style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '2rem', display: 'block', width: '100%', paddingLeft: isMobile ? '0' : isStudio ? (lang === 'da' ? 'clamp(80px, 7vw, 120px)' : 'clamp(120px, 10vw, 180px)') : (lang === 'da' ? 'clamp(100px, 12vw, 150px)' : 'clamp(160px, 18vw, 240px)') }}>{t[lang].h2}</div>
        <p ref={body1Ref} style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', marginBottom: '1rem', maxWidth: isMobile ? '100%' : isStudio ? '540px' : '510px' }}>{t[lang].b1}</p>
        <p ref={body2Ref} style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', marginBottom: '1rem', maxWidth: isMobile ? '100%' : isStudio ? '540px' : '510px' }}>{t[lang].b2}</p>
        <p ref={body3Ref} style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', maxWidth: isMobile ? '100%' : isStudio ? '540px' : '510px' }}>{t[lang].para}</p>
        <a
          ref={readMoreRef}
          href="/about"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: isStudio ? '560px' : '430px',
            textAlign: 'center',
            marginTop: '2rem',
            padding: '14px 36px',
            border: '1px solid rgba(255,255,255,.9)',
            borderRadius: 8,
            color: 'white',
            fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
            fontWeight: 300,
            fontFamily: 'var(--font-geist-sans), sans-serif',
            textDecoration: 'none',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14)',
            transition: 'box-shadow 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.2), 0 0 44px rgba(255,255,255,.16)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.14)';
          }}
        >
          {t[lang].readMore}
        </a>
      </div>
      </div>
      {isMobile && (
        <div
          style={{
            marginTop: '600dvh',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#060606',
            paddingTop: '48px',
            paddingBottom: '64px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>
            {t[lang].label}
          </div>
          <div style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em' }}>
            {t[lang].h1}
          </div>
          <div style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '2rem' }}>
            {t[lang].h2}
          </div>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', margin: '0 0 1rem 0' }}>
            {t[lang].b1}
          </p>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', margin: '0 0 1rem 0' }}>
            {t[lang].b2}
          </p>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', margin: '0 0 2rem 0' }}>
            {t[lang].para}
          </p>
          <a
            href="/about"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '14px 32px',
              border: '1px solid rgba(255,255,255,.9)',
              borderRadius: 8,
              color: 'white',
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              fontWeight: 300,
              fontFamily: 'var(--font-geist-sans), sans-serif',
              textDecoration: 'none',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14)',
              transition: 'box-shadow 0.3s ease, color 0.3s ease',
            }}
          >
            {t[lang].readMore}
          </a>
        </div>
      )}
    </section>
  )
}
