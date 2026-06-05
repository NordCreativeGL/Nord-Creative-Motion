'use client'

import { useEffect, useRef } from 'react'

const FOCAL = 500
const Z_SPEED = 0.22

interface StarOffset { dx: number; dy: number; dz?: number; s: number; b: number }
interface ConstellDef { cx: number; cy: number; cz: number; spin: boolean; stars: StarOffset[]; lines?: [number, number][] }

const CONSTELLATIONS: ConstellDef[] = [
  { cx:-130,cy:-90,cz:400,spin:false, stars:[
    {dx:50,dy:-35,s:2.2,b:.80},{dx:-40,dy:10,s:1.8,b:.60},
    {dx:-32,dy:30,s:1.6,b:.50},{dx:0,dy:42,s:1.4,b:.42},
    {dx:15,dy:24,s:1.4,b:.40},{dx:28,dy:3,s:1.4,b:.38},
  ]},
  { cx: 130, cy: -80, cz: 630, spin: false, stars: [
    {dx:   0, dy: -60, s: 2.3, b: 0.74},
    {dx:  55, dy:  -5, s: 2.0, b: 0.63},
    {dx:   5, dy:  50, s: 1.7, b: 0.55},
    {dx: -50, dy:  10, s: 2.1, b: 0.68},
  ]},
  { cx:-180,cy:20,cz:900,spin:false, stars:[
    {dx:30,dy:18,s:2.5,b:.76},{dx:8,dy:28,s:1.7,b:.64},
    {dx:-18,dy:-8,s:1.5,b:.48},{dx:-35,dy:-26,s:1.4,b:.45},
    {dx:-10,dy:-40,s:1.5,b:.44},{dx:15,dy:-20,s:1.3,b:.40},
  ]},
  { cx: 20, cy: -30, cz: 1260, spin: false, lines: [[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]], stars: [
    {dx: 55,  dy: -42, s: 2.8, b: 0.82},
    {dx: 52,  dy:  22, s: 2.4, b: 0.72},
    {dx: -18, dy:  30, s: 2.2, b: 0.68},
    {dx: -18, dy: -32, s: 1.8, b: 0.55},
    {dx: -65, dy: -48, s: 2.6, b: 0.80},
    {dx:-108, dy: -43, s: 2.3, b: 0.74},
    {dx:-145, dy: -12, s: 2.4, b: 0.76},
  ]},
  { cx:30,cy:-160,cz:1480,spin:false, stars:[
    {dx:30,dy:22,s:2.0,b:.68},{dx:12,dy:-9,s:1.8,b:.60},
    {dx:-18,dy:-28,s:1.7,b:.55},{dx:-33,dy:4,s:1.8,b:.60},
    {dx:-14,dy:30,s:1.5,b:.48},
  ]},
  { cx:160,cy:30,cz:1660,spin:true, stars:[
    {dx:0,dy:-42,s:2.8,b:.82},{dx:0,dy:0,s:2.0,b:.66},
    {dx:0,dy:58,s:1.8,b:.60},{dx:-35,dy:-7,s:1.7,b:.56},
    {dx:35,dy:-7,s:1.8,b:.62},
  ]},
  { cx:-80,cy:-130,cz:1800,spin:true, stars:[
    {dx:0,dy:-3,s:3.2,b:.88},{dx:18,dy:14,s:1.7,b:.54},
    {dx:24,dy:25,s:1.7,b:.54},{dx:-4,dy:18,s:1.4,b:.42},
  ]},
  { cx:140,cy:120,cz:1930,spin:false, stars:[
    {dx:0,dy:0,s:2.5,b:.78},{dx:-28,dy:24,s:2.0,b:.66},
    {dx:18,dy:-18,s:1.8,b:.60},{dx:-9,dy:-28,s:1.7,b:.56},
    {dx:28,dy:20,s:1.8,b:.60},
  ]},
  { cx:-20,cy:40,cz:2100,spin:false, stars:[
    {dx:-48,dy:-40,s:3.5,b:.86},{dx:42,dy:-44,s:2.8,b:.80},
    {dx:-18,dy:4,s:2.2,b:.70},{dx:0,dy:7,s:2.4,b:.74},
    {dx:18,dy:10,s:2.2,b:.70},{dx:38,dy:55,s:4.0,b:.88},
    {dx:-29,dy:52,s:2.0,b:.64},
  ]},
  { cx:-170, cy:90, cz:2250, spin:false, stars:[
    {dx:0,dy:0,s:3.5,b:.92},
    {dx:28,dy:28,s:2.0,b:.62},
    {dx:18,dy:55,s:1.8,b:.55},
    {dx:-18,dy:55,s:1.9,b:.58},
    {dx:-28,dy:28,s:2.1,b:.65},
  ]},
  { cx:150, cy:-70, cz:2400, spin:false, stars:[
    {dx:-50,dy:0,s:3.0,b:.85},
    {dx:-25,dy:15,s:2.2,b:.68},
    {dx:0,dy:10,s:2.0,b:.62},
    {dx:25,dy:-5,s:2.3,b:.70},
    {dx:48,dy:-20,s:2.5,b:.74},
    {dx:60,dy:10,s:1.8,b:.56},
    {dx:55,dy:35,s:1.9,b:.60},
  ]},
  { cx:-80, cy:-120, cz:2560, spin:false, stars:[
    {dx:0,dy:0,s:2.8,b:.80},
    {dx:30,dy:-20,s:2.4,b:.72},
    {dx:60,dy:-30,s:2.0,b:.63},
    {dx:85,dy:-15,s:2.6,b:.76},
    {dx:100,dy:10,s:1.9,b:.58},
    {dx:-30,dy:20,s:2.2,b:.67},
  ]},
  { cx:60, cy:130, cz:2720, spin:true, stars:[
    {dx:0,dy:-45,s:2.5,b:.74},
    {dx:-35,dy:0,s:2.2,b:.68},
    {dx:-35,dy:35,s:2.0,b:.63},
    {dx:35,dy:35,s:1.9,b:.60},
    {dx:35,dy:0,s:2.3,b:.70},
  ]},
]

function randomStarColor(): string {
  const r = Math.random()
  if (r < 0.04) return '255,210,150'
  if (r < 0.16) return '255,248,200'
  return '215,228,255'
}

interface Star3D { x:number; y:number; z:number; size:number; bright:number; color:string }

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W=0,H=0,cx=0,cy=0,opacity=1,time=0
    let ss = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0 }
    let ssNext = performance.now() + 6000 + Math.random() * 4000
    let bgStars: Star3D[] = []

    function isMob() { return window.innerWidth < 1024 }

    function initBg() {
      const count = isMob() ? 1300 : 3500
      bgStars = Array.from({ length: count }, () => {
        const z = 300 + Math.random() * 2200
        return {
          x: (Math.random() - 0.5) * z * 2.2,
          y: (Math.random() - 0.5) * z * 1.4,
          z,
          size: 0.25 + Math.random() * 0.65,
          bright: 0.18 + Math.random() * 0.28,
          color: randomStarColor(),
        }
      })
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
          const newZ1 = camZ + 300 + Math.random() * 2000
          s.z = newZ1
          s.x = (Math.random() - 0.5) * newZ1 * 2.2
          s.y = (Math.random() - 0.5) * newZ1 * 1.4
          s.color = randomStarColor()
          continue
        }
        if (dz > 2600) {
          const newZ2 = camZ + 400 + Math.random() * 800
          s.z = newZ2
          s.x = (Math.random() - 0.5) * newZ2 * 2.2
          s.y = (Math.random() - 0.5) * newZ2 * 1.4
          s.color = randomStarColor()
          continue
        }
        const scale = FOCAL / dz
        const sx = cx + (s.x - camX) * scale
        const sy = cy + (s.y - camY) * scale
        if (sx < -5 || sx > W + 5 || sy < -5 || sy > H + 5) continue
        const sz = Math.max(0.4, Math.min(s.size * scale, 2.0))
        const al = s.bright * Math.min(1, dz / 100)
        ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color},${al})`; ctx.fill()
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

      const now = performance.now()
      if (!ss.active && now >= ssNext) {
        const angle = Math.PI * (0.14 + Math.random() * 0.22)
        const speed = 10 + Math.random() * 4
        ss.x = Math.random() * W * 0.75
        ss.y = -10
        ss.vx = Math.cos(angle) * speed
        ss.vy = Math.sin(angle) * speed
        ss.life = 0
        ss.maxLife = 18 + Math.floor(Math.random() * 10)
        ss.active = true
        ssNext = now + 6000 + Math.random() * 4000
      }
      if (ss.active) {
        ss.life++
        ss.x += ss.vx
        ss.y += ss.vy
        if (ss.x > W + 20 || ss.y > H + 20) {
          ss.active = false
        } else {
          const t = ss.life / ss.maxLife
          const al = Math.sin(t * Math.PI) * 0.85
          const tx = ss.x - ss.vx * 6
          const ty = ss.y - ss.vy * 6
          const grad = ctx.createLinearGradient(tx, ty, ss.x, ss.y)
          grad.addColorStop(0, `rgba(255,255,255,0)`)
          grad.addColorStop(1, `rgba(255,255,255,${al.toFixed(2)})`)
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(ss.x, ss.y)
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.5
          ctx.stroke()
          ctx.restore()
          if (ss.life >= ss.maxLife) ss.active = false
        }
      }
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
