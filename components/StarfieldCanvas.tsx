'use client'

import { useEffect, useRef } from 'react'

const FOCAL = 500
const Z_SPEED = 0.35

interface StarOffset { dx: number; dy: number; dz?: number; s: number; b: number }
interface ConstellDef { cx: number; cy: number; cz: number; spin: boolean; stars: StarOffset[] }

const CONSTELLATIONS: ConstellDef[] = [
  { cx:-130,cy:-90,cz:450,spin:false, stars:[
    {dx:50,dy:-35,s:2.2,b:.80},{dx:-40,dy:10,s:1.8,b:.60},
    {dx:-32,dy:30,s:1.6,b:.50},{dx:0,dy:42,s:1.4,b:.42},
    {dx:15,dy:24,s:1.4,b:.40},{dx:28,dy:3,s:1.4,b:.38},
  ]},
  { cx:130,cy:-80,cz:700,spin:false, stars:[
    {dx:-70,dy:-18,s:2.5,b:.78},{dx:-48,dy:-10,s:2.3,b:.72},
    {dx:-26,dy:-2,s:2.5,b:.76},{dx:0,dy:8,s:1.7,b:.54},
    {dx:4,dy:32,s:2.0,b:.62},{dx:34,dy:18,s:1.7,b:.64},
    {dx:36,dy:-10,s:3.0,b:.84},
  ]},
  { cx:-180,cy:20,cz:1000,spin:false, stars:[
    {dx:30,dy:18,s:2.5,b:.76},{dx:8,dy:28,s:1.7,b:.64},
    {dx:-18,dy:-8,s:1.5,b:.48},{dx:-35,dy:-26,s:1.4,b:.45},
    {dx:-10,dy:-40,s:1.5,b:.44},{dx:15,dy:-20,s:1.3,b:.40},
  ]},
  { cx:-110,cy:130,cz:1400,spin:false, stars:[
    {dx:-55,dy:-12,s:2.0,b:.68},{dx:-22,dy:11,s:2.5,b:.80},
    {dx:0,dy:-10,s:2.3,b:.74},{dx:23,dy:11,s:2.0,b:.68},
    {dx:50,dy:-8,s:1.8,b:.60},
  ]},
  { cx:30,cy:-160,cz:1650,spin:false, stars:[
    {dx:30,dy:22,s:2.0,b:.68},{dx:12,dy:-9,s:1.8,b:.60},
    {dx:-18,dy:-28,s:1.7,b:.55},{dx:-33,dy:4,s:1.8,b:.60},
    {dx:-14,dy:30,s:1.5,b:.48},
  ]},
  { cx:160,cy:30,cz:1850,spin:true, stars:[
    {dx:0,dy:-42,s:2.8,b:.82},{dx:0,dy:0,s:2.0,b:.66},
    {dx:0,dy:58,s:1.8,b:.60},{dx:-35,dy:-7,s:1.7,b:.56},
    {dx:35,dy:-7,s:1.8,b:.62},
  ]},
  { cx:-80,cy:-130,cz:2000,spin:true, stars:[
    {dx:0,dy:-3,s:3.2,b:.88},{dx:18,dy:14,s:1.7,b:.54},
    {dx:24,dy:25,s:1.7,b:.54},{dx:-4,dy:18,s:1.4,b:.42},
  ]},
  { cx:140,cy:120,cz:2150,spin:false, stars:[
    {dx:0,dy:0,s:2.5,b:.78},{dx:-28,dy:24,s:2.0,b:.66},
    {dx:18,dy:-18,s:1.8,b:.60},{dx:-9,dy:-28,s:1.7,b:.56},
    {dx:28,dy:20,s:1.8,b:.60},
  ]},
  { cx:-20,cy:40,cz:2350,spin:false, stars:[
    {dx:-48,dy:-40,s:3.5,b:.86},{dx:42,dy:-44,s:2.8,b:.80},
    {dx:-18,dy:4,s:2.2,b:.70},{dx:0,dy:7,s:2.4,b:.74},
    {dx:18,dy:10,s:2.2,b:.70},{dx:38,dy:55,s:4.0,b:.88},
    {dx:-29,dy:52,s:2.0,b:.64},
  ]},
]

interface Star3D { x:number; y:number; z:number; size:number; bright:number }

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W=0,H=0,cx=0,cy=0,opacity=1,time=0
    let bgStars: Star3D[] = []

    function isMob() { return window.innerWidth < 1024 }

    function initBg() {
      const count = isMob() ? 500 : 1200
      bgStars = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 700,
        y: (Math.random() - 0.5) * 700,
        z: 30 + Math.random() * 2500,
        size: 0.8 + Math.random() * 2.0,
        bright: 0.30 + Math.random() * 0.45,
      }))
    }

    function resize() {
      if (!canvas||!ctx) return
      W = window.innerWidth; H = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio||1,2)
      canvas.width=W*dpr; canvas.height=H*dpr
      canvas.style.width=W+'px'; canvas.style.height=H+'px'
      ctx.setTransform(dpr,0,0,dpr,0,0)
      cx=W*0.5; cy=H*0.44
      initBg()
    }

    function onScroll() {
    }

    function spike(c:CanvasRenderingContext2D,x:number,y:number,len:number,lw:number,al:number) {
      const g1=c.createLinearGradient(x-len,y,x+len,y)
      g1.addColorStop(0,'rgba(245,250,255,0)')
      g1.addColorStop(0.5,`rgba(245,250,255,${al*0.6})`)
      g1.addColorStop(1,'rgba(245,250,255,0)')
      c.beginPath();c.moveTo(x-len,y);c.lineTo(x+len,y)
      c.strokeStyle=g1;c.lineWidth=lw;c.stroke()
      const g2=c.createLinearGradient(x,y-len,x,y+len)
      g2.addColorStop(0,'rgba(245,250,255,0)')
      g2.addColorStop(0.5,`rgba(245,250,255,${al*0.6})`)
      g2.addColorStop(1,'rgba(245,250,255,0)')
      c.beginPath();c.moveTo(x,y-len);c.lineTo(x,y+len)
      c.strokeStyle=g2;c.lineWidth=lw;c.stroke()
    }

    let rafId: number

    function draw() {
      rafId = requestAnimationFrame(draw)
      if (!ctx) return
      ctx.clearRect(0,0,W,H)
      if (opacity<=0.005) return

      time += 0.0002
      const camZ = window.scrollY*Z_SPEED
      const camX = Math.sin(camZ*0.003)*50
      const camY = Math.cos(camZ*0.002)*25 - camZ*0.006

      for (const s of bgStars) {
        const dz = s.z - camZ
        if (dz < 8) {
          s.z = camZ + 400 + Math.random() * 1200
          s.x = (Math.random() - 0.5) * 700
          s.y = (Math.random() - 0.5) * 700
          continue
        }
        const scale = FOCAL / dz
        const sx = cx + (s.x - camX) * scale
        const sy = cy + (s.y - camY) * scale
        if (sx < -5 || sx > W + 5 || sy < -5 || sy > H + 5) continue
        const sz = Math.max(0.5, Math.min(s.size * scale, 4.0))
        const al = s.bright * Math.min(1, dz / 100)
        ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(215,228,255,${al})`; ctx.fill()
      }

      ctx.save()
      for (const c of CONSTELLATIONS) {
        const spinA = c.spin ? time : 0
        for (const s of c.stars) {
          const dx = spinA!==0 ? s.dx*Math.cos(spinA)-s.dy*Math.sin(spinA) : s.dx
          const dy = spinA!==0 ? s.dx*Math.sin(spinA)+s.dy*Math.cos(spinA) : s.dy
          const ax=c.cx+dx, ay=c.cy+dy, az=c.cz+(s.dz??0)
          const dz=az-camZ
          if (dz<8) continue
          const sc=FOCAL/dz
          const sx=cx+(ax-camX)*sc
          const sy=cy+(ay-camY)*sc
          if (sx<-50||sx>W+50||sy<-50||sy>H+50) continue
          const sz=Math.min(s.s*sc*0.72,16)
          const al=s.b*Math.min(1,dz/40)
          if (sz>=3.0&&s.b>=0.7) spike(ctx,sx,sy,sz*5,sz*0.2,al)
          if (sz>=1.8) {
            const gr=sz*3.5
            const grd=ctx.createRadialGradient(sx,sy,0,sx,sy,gr)
            grd.addColorStop(0,`rgba(205,225,255,${0.18*al})`)
            grd.addColorStop(1,'rgba(205,225,255,0)')
            ctx.beginPath();ctx.arc(sx,sy,gr,0,Math.PI*2)
            ctx.fillStyle=grd;ctx.fill()
          }
          ctx.beginPath();ctx.arc(sx,sy,sz*0.65,0,Math.PI*2)
          ctx.fillStyle=`rgba(255,255,255,${Math.min(1,al*1.05)})`;ctx.fill()
          ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2)
          ctx.fillStyle=`rgba(235,245,255,${al*0.4})`;ctx.fill()
        }
      }
      ctx.restore()
    }

    resize()
    initBg()
    window.addEventListener('scroll',onScroll,{passive:true})
    window.addEventListener('resize',resize)
    rafId=requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll',onScroll)
      window.removeEventListener('resize',resize)
    }
  },[])

  return (
    <canvas ref={canvasRef} style={{
      position:'fixed',top:0,left:0,width:'100%',height:'100%',
      zIndex:0,pointerEvents:'none',
    }}/>
  )
}
