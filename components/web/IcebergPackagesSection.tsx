'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

// ---------- types ----------

type Point = number[]

interface BergData {
  phase: number
  above: Point[]
  below: Point[]
}

interface KeelParams {
  bulge: number
  bulgeAt: number
  taper: number
  rough: number
  softP: number
  blunt?: boolean
  tilt?: number
}

interface Scene {
  y0: number
  y1: number
  wl: number
}

interface Item {
  bd: BergData
  i: number
  cx: number
  wl: number
  k: number
}

interface Plan {
  stack: boolean
  scenes: Scene[]
  items: Item[]
}

interface Sprite {
  it: Item
  spC: HTMLCanvasElement
  bw: number
  bh: number
  ax: number
  ay: number
}

interface Anchor {
  cx: number
  wl: number
  halfW: number
  depth: number
  topH: number
}

interface Layout {
  bgC: HTMLCanvasElement
  fgC: HTMLCanvasElement
  sprites: Sprite[]
  scenes: Scene[]
  stack: boolean
  anchors: Anchor[]
  w: number
  h: number
  key: string
}

interface DepthLayoutInfo {
  key: string
  stack: boolean
  wantH: number
  items: Anchor[]
}

interface DepthPainter {
  draw: (t: number) => void
  resize: (w: number, h: number) => void
  layout: () => DepthLayoutInfo | null
  bob: (i: number, t: number) => number
  pointer: (x: number, y: number) => void
  hoverVal: (i: number) => number
  setDpr: (d: number) => void
}

// ---------- pure helpers ----------

function rng(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

function tracePoly(ctx: CanvasRenderingContext2D, pts: number[][], round: number) {
  const n = pts.length
  const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  for (let i = 0; i < n; i++) {
    const prev = pts[(i + n - 1) % n], cur = pts[i], next = pts[(i + 1) % n]
    const a = lerp(cur, prev, round), b = lerp(cur, next, round)
    if (i === 0) ctx.moveTo(a[0], a[1]); else ctx.lineTo(a[0], a[1])
    ctx.quadraticCurveTo(cur[0], cur[1], b[0], b[1])
  }
  ctx.closePath()
}

function layer(w: number, h: number, dpr: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas')
  c.width = Math.max(2, Math.round(w * dpr))
  c.height = Math.max(2, Math.round(h * dpr))
  const x = c.getContext('2d')!
  x.setTransform(dpr, 0, 0, dpr, 0, 0)
  return [c, x]
}

function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const g = ctx.createRadialGradient(w / 2, h * 0.55, Math.min(w, h) * 0.35, w / 2, h * 0.55, Math.max(w, h) * 0.78)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,' + strength + ')')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

function genKeel(seed: number, topHalfW: number, depth: number, P: KeelParams): Point[] {
  const rnd = rng(seed)
  const N = 13
  const env = (t: number) => {
    if (t < P.bulgeAt) { const u = t / P.bulgeAt; return 1 + (P.bulge - 1) * Math.sin(u * Math.PI / 2) }
    const u = (t - P.bulgeAt) / (1 - P.bulgeAt); return P.bulge * Math.pow(1 - u, P.taper)
  }
  const tilt = P.tilt || 0
  const tMax = P.blunt ? 0.86 : 1
  const side = (dir: number): Point[] => {
    const pts: Point[] = []; let off = 0
    for (let i = 1; i <= N; i++) {
      const t = (i / (N + 0.6)) * tMax
      const raw = (rnd() * 2 - 1) * P.rough + (rnd() * 2 - 1) * P.rough * 0.4
      off = off * 0.45 + raw * 0.55
      const x = dir * topHalfW * env(t) * (1 + off) + tilt * topHalfW * t
      const y = t * depth
      const r = rnd() < P.softP ? 0.4 + rnd() * 0.3 : 0
      pts.push([x, y, r])
    }
    return pts
  }
  const right = side(1), left = side(-1)
  let bottom: Point[]
  if (P.blunt) {
    bottom = []
    const xr = right[right.length - 1][0] * 0.92, xl = left[left.length - 1][0] * 0.92, nb = 4
    for (let j = 0; j < nb; j++) {
      const f = (j + 0.5) / nb
      const x = xr + (xl - xr) * f + (rnd() - 0.5) * topHalfW * 0.12
      const y = depth * (0.90 + rnd() * 0.10)
      bottom.push([x, y, rnd() < 0.5 ? 0.4 : 0])
    }
  } else {
    bottom = [[(rnd() * 2 - 1) * topHalfW * 0.28 + tilt * topHalfW, depth, rnd() < 0.5 ? 0.45 : 0]]
  }
  return [[topHalfW * 1.02, 0, 0]].concat(right, bottom, left.reverse(), [[-topHalfW * 1.02, 0, 0]])
}

const bMaxA = (bd: BergData) => Math.max(...bd.above.map((p) => -p[1]))
const bMaxB = (bd: BergData) => Math.max(...bd.below.map((p) => p[1]))
const bHalfW = (bd: BergData) => Math.max(...bd.above.concat(bd.below).map((p) => Math.abs(p[0])))
const bHalfWBelow = (bd: BergData) => Math.max(...bd.below.map((p) => Math.abs(p[0])))

// ---------- static depth scene data ----------

const DEPTH_BERGS: BergData[] = [
  { phase: 0.0,
    above: [[-52,0],[-46,-12],[-36,-26],[-24,-18],[-14,-44],[-4,-62],[4,-48],[14,-56],[24,-32],[34,-20],[44,-10],[52,0]],
    below: [] },
  { phase: 1.9,
    above: [[-60,0],[-56,-18],[-50,-30],[-46,-62],[-38,-76],[-28,-72],[-22,-56],[-14,-46],[-6,-50],[0,-42],[6,-68],[16,-86],[26,-78],[32,-58],[40,-36],[48,-20],[56,-8],[60,0]],
    below: [] },
  { phase: 3.7,
    above: [[-78,0],[-74,-14],[-66,-30],[-54,-42],[-40,-38],[-30,-48],[-18,-44],[-8,-58],[0,-52],[8,-80],[14,-108],[20,-126],[28,-96],[36,-68],[46,-50],[58,-32],[68,-16],[78,0]],
    below: [] },
]

DEPTH_BERGS[0].below = genKeel(317, 52, 112, { bulge: 1.52, bulgeAt: 0.50, taper: 0.42, rough: 0.15, softP: 0.62, blunt: true, tilt: 0.34 })
DEPTH_BERGS[1].below = genKeel(947, 60, 175, { bulge: 1.32, bulgeAt: 0.36, taper: 0.62, rough: 0.15, softP: 0.45 })
DEPTH_BERGS[2].below = genKeel(523, 78, 262, { bulge: 1.27, bulgeAt: 0.24, taper: 0.88, rough: 0.15, softP: 0.50, tilt: -0.12 })

const DEPTH_STARS = [
  [0.08,0.35,0.8,0.5],[0.18,0.18,0.7,0.45],[0.30,0.45,0.8,0.55],[0.41,0.15,0.7,0.5],
  [0.53,0.38,0.9,0.6],[0.66,0.22,0.7,0.45],[0.77,0.42,0.8,0.5],[0.88,0.16,0.8,0.55],
  [0.95,0.40,0.7,0.4],[0.24,0.60,0.7,0.3],[0.60,0.58,0.7,0.35],
]

const DEPTH_RAYS = [
  { x: 0.22, drift: 0.012, wTop: 0.016, wBot: 0.06, a: 0.040 },
  { x: 0.38, drift: -0.010, wTop: 0.011, wBot: 0.045, a: 0.030 },
  { x: 0.55, drift: 0.014, wTop: 0.018, wBot: 0.07, a: 0.045 },
  { x: 0.70, drift: -0.008, wTop: 0.010, wBot: 0.04, a: 0.028 },
  { x: 0.88, drift: 0.010, wTop: 0.014, wBot: 0.055, a: 0.036 },
]

// ---------- makeFloe (ported from arctic-ocean.html for parity with the source) ----------

function makeFloe(r: number, rnd: () => number) {
  const n = 5 + Math.floor(rnd() * 5)
  const pts: number[][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.55
    const rad = r * (0.55 + rnd() * 0.45)
    pts.push([Math.cos(a) * rad, Math.sin(a) * rad])
  }
  const elong = rnd() < 0.3 ? 1.7 + rnd() * 0.9 : 1 + rnd() * 0.35
  for (const p of pts) p[0] *= elong
  const round = rnd() < 0.45 ? 0.06 + rnd() * 0.08 : 0.14 + rnd() * 0.07
  let R = 0
  for (const p of pts) R = Math.max(R, Math.hypot(p[0], p[1]))
  const cracks: number[][][] = []
  const nc = 2 + Math.floor(rnd() * 2)
  for (let c = 0; c < nc; c++) {
    const a0 = rnd() * Math.PI * 2
    const seg: number[][] = []
    let pxx = Math.cos(a0) * r * 0.15, pyy = Math.sin(a0) * r * 0.15
    let dir = a0 + Math.PI * (0.7 + rnd() * 0.6)
    const steps = 3 + Math.floor(rnd() * 2)
    seg.push([pxx, pyy])
    for (let sgi = 0; sgi < steps; sgi++) {
      const len = r * (0.16 + rnd() * 0.16)
      dir += (rnd() - 0.5) * 0.9
      pxx += Math.cos(dir) * len; pyy += Math.sin(dir) * len
      seg.push([pxx, pyy])
    }
    cracks.push(seg)
  }
  return { pts, round, R, cracks }
}

// ---------- createDepth ----------

function createDepth(canvas: HTMLCanvasElement, allowHover = true): DepthPainter {
  const ctx = canvas.getContext('2d')!
  let L: Layout | null = null
  const hov = [0, 0, 0]
  const hovT = [0, 0, 0]
  let px = -1e4, py = -1e4
  let _dpr = 1

  function pathB(c: CanvasRenderingContext2D, pts: Point[]) {
    c.beginPath()
    const n = pts.length
    const mid = (a: Point, b2: Point): Point => [(a[0] + b2[0]) / 2, (a[1] + b2[1]) / 2]
    const first = pts[0]
    if (first[2]) {
      const m0 = mid(pts[n - 1], first); c.moveTo(m0[0], m0[1])
      const m1 = mid(first, pts[1]); c.quadraticCurveTo(first[0], first[1], m1[0], m1[1])
    } else {
      c.moveTo(first[0], first[1])
    }
    for (let i = 1; i < n; i++) {
      const cur = pts[i]
      if (cur[2]) {
        const prev = pts[i - 1], next = pts[(i + 1) % n]
        const mIn = mid(prev, cur), mOut = mid(cur, next)
        c.lineTo(mIn[0], mIn[1]); c.quadraticCurveTo(cur[0], cur[1], mOut[0], mOut[1])
      } else {
        c.lineTo(cur[0], cur[1])
      }
    }
    c.closePath()
  }

  const STACK_HEADER = 170
  const ICEBERG_SCALE = 1.0
  const TIER_SCALE = [1.25, 1.15, 1.10] // per-tier extra scale; Tier I and II need a wider keel to fit their feature lists

  function plan(w: number, h: number): Plan {
    const stack = w < 1024
    const items: Item[] = []
    const scenes: Scene[] = []
    if (!stack) {
      const isMobileCanvas = w < 1400
      const wl = isMobileCanvas ? h * 0.45 : h * 0.41
      const wlAnchor = isMobileCanvas ? h * 0.35 : h * 0.26
      const maxAAll = Math.max(...DEPTH_BERGS.map(bMaxA))
      const maxBAll = Math.max(...DEPTH_BERGS.map(bMaxB))
      const kCap = isMobileCanvas ? Infinity : w * 0.00165
      const k = Math.min((wlAnchor - 30) / maxAAll, (h - wlAnchor - 36) / maxBAll, kCap) * ICEBERG_SCALE
      const cxs = isMobileCanvas ? [1/6, 0.5, 5/6] : [0.17, 0.48, 0.80]
      const tScale = TIER_SCALE
      scenes.push({ y0: 0, y1: h, wl })
      DEPTH_BERGS.forEach((bd, i) => items.push({ bd, i, cx: cxs[i] * w, wl, k: k * tScale[i] }))
    } else {
      const sh = Math.max((h - STACK_HEADER) / 3, 200)
      DEPTH_BERGS.forEach((bd, i) => {
        const y0 = STACK_HEADER + i * sh, wl = y0 + sh * 0.45
        const k = Math.min((sh * 0.30 - 24) / bMaxA(bd), (sh * 0.70 - 40) / bMaxB(bd), w * 0.0042) * ICEBERG_SCALE
        scenes.push({ y0, y1: y0 + sh, wl })
        items.push({ bd, i, cx: 0.5 * w, wl, k: k * TIER_SCALE[i] })
      })
      scenes[0].y0 = 0
    }
    return { stack, scenes, items }
  }

  function buildSprite(item: Item, dpr: number) {
    const { bd, k, i } = item
    const maxA = bMaxA(bd), maxB = bMaxB(bd), halfW = bHalfW(bd)
    const pad = 30
    const bw = halfW * 2 * k + pad * 2, bh = (maxA + maxB) * k + pad * 2
    const [spC, sp] = layer(bw, bh, dpr)
    const ax = bw / 2, ay = pad + maxA * k
    sp.translate(ax, ay); sp.scale(k, k)
    const rs = rng(101 + i * 37)

    pathB(sp, bd.below)
    let g = sp.createLinearGradient(0, 0, 0, maxB)
    g.addColorStop(0, 'rgba(170,248,240,0.55)')
    g.addColorStop(0.25, 'rgba(70,190,192,0.36)')
    g.addColorStop(0.6, 'rgba(18,95,120,0.24)')
    g.addColorStop(1, 'rgba(4,36,58,0.15)')
    sp.fillStyle = g; sp.fill()

    sp.save(); pathB(sp, bd.below); sp.clip()
    g = sp.createLinearGradient(0, 0, 0, 30)
    g.addColorStop(0, 'rgba(215,255,250,0.55)')
    g.addColorStop(1, 'rgba(215,255,250,0)')
    sp.fillStyle = g; sp.fillRect(-halfW * 1.4, 0, halfW * 2.8, 32)
    g = sp.createLinearGradient(-halfW, 0, halfW, 0)
    g.addColorStop(0, 'rgba(0,18,36,0.20)')
    g.addColorStop(0.32, 'rgba(0,18,36,0)')
    g.addColorStop(0.68, 'rgba(0,18,36,0)')
    g.addColorStop(1, 'rgba(0,18,36,0.15)')
    sp.fillStyle = g; sp.fillRect(-halfW * 1.4, 0, halfW * 2.8, maxB)
    g = sp.createLinearGradient(-halfW * 0.75, 0, halfW * 0.75, 0)
    g.addColorStop(0, 'rgba(2,26,44,0)')
    g.addColorStop(0.25, 'rgba(2,26,44,0.13)')
    g.addColorStop(0.75, 'rgba(2,26,44,0.13)')
    g.addColorStop(1, 'rgba(2,26,44,0)')
    sp.fillStyle = g; sp.fillRect(-halfW * 0.75, 8, halfW * 1.5, maxB * 0.66)
    g = sp.createLinearGradient(0, 8, 0, maxB * 0.74)
    g.addColorStop(0, 'rgba(2,26,44,0)')
    g.addColorStop(0.2, 'rgba(2,26,44,0.10)')
    g.addColorStop(0.75, 'rgba(2,26,44,0.10)')
    g.addColorStop(1, 'rgba(2,26,44,0)')
    sp.fillStyle = g; sp.fillRect(-halfW * 0.62, 8, halfW * 1.24, maxB * 0.66)
    const bp = bd.below
    for (let v = 1; v < bp.length - 2; v++) {
      if (rs() < 0.3) continue
      const p1 = bp[v], p2 = bp[v + 1]
      if (p1[1] < 34 && p2[1] < 34) continue
      const q2 = [p2[0] * (0.18 + rs() * 0.3), p2[1] * (0.55 + rs() * 0.25)]
      const q1 = [p1[0] * (0.18 + rs() * 0.3), p1[1] * (0.55 + rs() * 0.25)]
      sp.beginPath()
      sp.moveTo(p1[0], p1[1]); sp.lineTo(p2[0], p2[1]); sp.lineTo(q2[0], q2[1]); sp.lineTo(q1[0], q1[1])
      sp.closePath()
      const light = rs() < 0.45
      sp.fillStyle = light
        ? 'rgba(195,252,246,' + (0.03 + rs() * 0.04).toFixed(3) + ')'
        : 'rgba(2,28,48,' + (0.04 + rs() * 0.06).toFixed(3) + ')'
      sp.fill()
      if (rs() < 0.3) { sp.strokeStyle = 'rgba(185,248,242,0.06)'; sp.lineWidth = 0.7; sp.stroke() }
    }
    const nStreak = 5 + i * 2
    for (let sIdx = 0; sIdx < nStreak; sIdx++) {
      const x0 = (rs() * 2 - 1) * halfW * 0.8
      const y0 = 10 + rs() * maxB * 0.25
      const len = maxB * (0.25 + rs() * 0.45)
      const drift = (rs() - 0.5) * halfW * 0.16
      sp.strokeStyle = sIdx % 3 === 0 ? 'rgba(195,250,244,0.10)' : 'rgba(3,34,56,0.13)'
      sp.lineWidth = 0.8 + rs() * 0.9
      sp.beginPath(); sp.moveTo(x0, y0)
      if (rs() < 0.5) sp.quadraticCurveTo(x0 + drift, y0 + len * 0.5, x0 + drift * 0.5, y0 + len)
      else { sp.lineTo(x0 + drift * 0.4, y0 + len * 0.5); sp.lineTo(x0 + drift, y0 + len) }
      sp.stroke()
    }
    sp.restore()

    sp.save()
    sp.lineJoin = 'round'
    sp.shadowColor = 'rgba(0,215,200,0.45)'; sp.shadowBlur = 14
    pathB(sp, bd.below)
    sp.strokeStyle = 'rgba(150,240,232,0.34)'; sp.lineWidth = 1.4 / k; sp.stroke()
    sp.restore()

    pathB(sp, bd.above)
    g = sp.createLinearGradient(-halfW * 0.8, -maxA, halfW * 0.6, 0)
    g.addColorStop(0, 'rgba(246,253,255,0.98)')
    g.addColorStop(0.5, 'rgb(206,223,231)')
    g.addColorStop(1, 'rgba(168,200,217,0.96)')
    sp.fillStyle = g; sp.fill()

    sp.save(); pathB(sp, bd.above); sp.clip()
    g = sp.createLinearGradient(-halfW, 0, halfW, 0)
    g.addColorStop(0, 'rgba(255,255,255,0.20)')
    g.addColorStop(0.45, 'rgba(255,255,255,0)')
    g.addColorStop(1, 'rgba(22,60,95,0.18)')
    sp.fillStyle = g; sp.fillRect(-halfW, -maxA, halfW * 2, maxA + 4)
    for (let f = 0; f < 16 + i * 6; f++) {
      const x = (rs() * 2 - 1) * halfW * 0.85
      const y = -rs() * maxA * 0.9
      const len = 6 + rs() * maxA * 0.2
      sp.strokeStyle = f % 3 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(12,44,74,0.13)'
      sp.lineWidth = 0.7 + rs() * 0.6
      sp.beginPath(); sp.moveTo(x, y); sp.lineTo(x + (rs() - 0.5) * 5, y + len); sp.stroke()
    }
    g = sp.createLinearGradient(0, 0, 0, -22)
    g.addColorStop(0, 'rgba(60,205,196,0.25)')
    g.addColorStop(1, 'rgba(60,205,196,0)')
    sp.fillStyle = g; sp.fillRect(-halfW, -24, halfW * 2, 24)
    sp.restore()

    pathB(sp, bd.above)
    sp.strokeStyle = 'rgba(255,255,255,0.22)'; sp.lineWidth = 1 / k; sp.stroke()

    return { spC, bw, bh, ax, ay }
  }

  function resize(w: number, h: number) {
    const dpr = _dpr
    const P = plan(w, h)
    const [bgC, bg] = layer(w, h, dpr)
    let g: CanvasGradient
    const starRng = rng(4801)
    for (const sc of P.scenes) {
      g = bg.createLinearGradient(0, sc.y0, 0, sc.wl)
      g.addColorStop(0, '#01040a')
      g.addColorStop(0.6, '#040f1d')
      g.addColorStop(1, '#06182a')
      bg.fillStyle = g; bg.fillRect(0, sc.y0, w, sc.wl - sc.y0 + 1)
      const skyH = sc.wl - sc.y0
      const nStars = Math.round((w * skyH) / 5200)
      for (let i = 0; i < nStars; i++) {
        const sx = starRng() * w
        const sy = sc.y0 + Math.pow(starRng(), 1.35) * skyH * 0.96
        const big = starRng() < 0.12
        const rad = big ? 0.8 + starRng() * 0.7 : 0.35 + starRng() * 0.5
        const a = (big ? 0.55 : 0.28) + starRng() * 0.35
        bg.fillStyle = 'rgba(220,235,244,' + a.toFixed(3) + ')'
        bg.beginPath(); bg.arc(sx, sy, rad, 0, Math.PI * 2); bg.fill()
        if (big && starRng() < 0.5) {
          bg.fillStyle = 'rgba(180,222,238,' + (a * 0.4).toFixed(3) + ')'
          bg.beginPath(); bg.arc(sx, sy, rad * 2.4, 0, Math.PI * 2); bg.fill()
        }
      }
      const hy = sc.y0 + skyH * (0.3 + starRng() * 0.3)
      g = bg.createLinearGradient(0, hy - skyH * 0.18, 0, hy + skyH * 0.18)
      g.addColorStop(0, 'rgba(60,110,150,0)')
      g.addColorStop(0.5, 'rgba(60,110,150,0.05)')
      g.addColorStop(1, 'rgba(60,110,150,0)')
      bg.fillStyle = g; bg.fillRect(0, hy - skyH * 0.18, w, skyH * 0.36)
      g = bg.createLinearGradient(0, sc.wl, 0, sc.y1)
      g.addColorStop(0, '#07343f')
      g.addColorStop(0.45, '#052733')
      g.addColorStop(1, '#031b26')
      bg.fillStyle = g; bg.fillRect(0, sc.wl, w, sc.y1 - sc.wl)
    }
    for (const it of P.items) {
      const maxB = bMaxB(it.bd) * it.k
      const gy = it.wl + maxB * 0.42
      const gr = Math.max(bHalfWBelow(it.bd) * it.k * 2.0, 60)
      g = bg.createRadialGradient(it.cx, gy, gr * 0.12, it.cx, gy, gr)
      g.addColorStop(0, 'rgba(0,215,200,' + (0.07 + it.i * 0.025).toFixed(3) + ')')
      g.addColorStop(1, 'rgba(0,215,200,0)')
      bg.fillStyle = g; bg.fillRect(it.cx - gr, it.wl, gr * 2, gr * 2)
    }
    const sprites: Sprite[] = P.items.map((it) => ({ it, ...buildSprite(it, dpr) }))
    const [fgC, fg] = layer(w, h, dpr)
    for (const sc of P.scenes) {
      fg.fillStyle = 'rgba(190,230,238,0.45)'; fg.fillRect(0, sc.wl, w, 1)
      g = fg.createLinearGradient(0, sc.wl - 16, 0, sc.wl + 14)
      g.addColorStop(0, 'rgba(3,16,26,0)')
      g.addColorStop(0.5, 'rgba(60,150,160,0.06)')
      g.addColorStop(1, 'rgba(3,16,26,0)')
      fg.fillStyle = g; fg.fillRect(0, sc.wl - 16, w, 30)
    }
    vignette(fg, w, h, 0.42)
    const anchors: Anchor[] = P.items.map((it) => ({
      cx: it.cx, wl: it.wl,
      halfW: bHalfWBelow(it.bd) * it.k,
      depth: bMaxB(it.bd) * it.k,
      topH: bMaxA(it.bd) * it.k,
    }))
    L = { bgC, fgC, sprites, scenes: P.scenes, stack: P.stack, anchors, w, h, key: w + 'x' + h + (P.stack ? 's' : 'r') }
  }

  function bobOf(i: number, t: number) { return Math.sin(t * 0.00045 + DEPTH_BERGS[i].phase) * 2.6 }

  function draw(t: number) {
    const w = canvas.width / _dpr, h = canvas.height / _dpr
    if (!L || L.w !== w || L.h !== h) resize(w, h)
    if (!L) return
    const cur = L
    ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0)
    ctx.drawImage(cur.bgC, 0, 0, w, h)
    for (const sc of cur.scenes) {
      for (let i = 0; i < DEPTH_STARS.length; i++) {
        const st = DEPTH_STARS[i]
        const tw = 0.75 + 0.25 * Math.sin(t * 0.0006 + i * 2.1)
        ctx.fillStyle = 'rgba(214,232,240,' + (st[3] * tw).toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(st[0] * w, sc.y0 + st[1] * (sc.wl - sc.y0) * 0.85, st[2], 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.save(); ctx.beginPath(); ctx.rect(0, sc.wl, w, sc.y1 - sc.wl); ctx.clip()
      for (const r of DEPTH_RAYS) {
        const sway = Math.sin(t * 0.0002 + r.x * 9) * w * r.drift
        const topX = r.x * w, botX = r.x * w + sway + w * 0.025
        const g = ctx.createLinearGradient(0, sc.wl, 0, sc.y1 - (sc.y1 - sc.wl) * 0.1)
        g.addColorStop(0, 'rgba(140,230,235,' + r.a + ')')
        g.addColorStop(1, 'rgba(140,230,235,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(topX - w * r.wTop, sc.wl); ctx.lineTo(topX + w * r.wTop, sc.wl)
        ctx.lineTo(botX + w * r.wBot, sc.y1); ctx.lineTo(botX - w * r.wBot, sc.y1)
        ctx.closePath(); ctx.fill()
      }
      ctx.restore()
    }
    for (let i = 0; i < cur.anchors.length; i++) {
      const a = cur.anchors[i]
      const inside = allowHover && px > a.cx - a.halfW * 1.08 && px < a.cx + a.halfW * 1.08 &&
                     py > a.wl - a.topH - 14 && py < a.wl + a.depth + 14
      hovT[i] = inside ? 1 : 0
      hov[i] += (hovT[i] - hov[i]) * 0.10
      if (hov[i] < 0.004) hov[i] = 0
    }
    canvas.style.cursor = hovT.some((v) => v) ? 'pointer' : ''
    const ord = cur.sprites.map((s, idx) => idx).sort((p, q) => hov[cur.sprites[p].it.i] - hov[cur.sprites[q].it.i])
    for (const idx of ord) {
      const s = cur.sprites[idx]
      const i = s.it.i, b = bobOf(i, t), a = cur.anchors[i], hv = hov[i]
      const scl = 1 + 0.50 * hv
      ctx.save()
      ctx.translate(s.it.cx, s.it.wl + b); ctx.scale(scl, scl)
      ctx.drawImage(s.spC, -s.ax, -s.ay, s.bw, s.bh)
      ctx.restore()
    }
    ctx.drawImage(cur.fgC, 0, 0, w, h)
  }

  function layout(): DepthLayoutInfo | null {
    if (!L) return null
    const wantH = L.stack ? Math.round(STACK_HEADER + 3 * Math.min(Math.max(520, L.w * 1.35), 680)) : 0
    return { key: L.key, stack: L.stack, wantH, items: L.anchors }
  }
  function setDpr(d: number) { _dpr = d }
  function pointer(x: number, y: number) { px = x; py = y }
  function hoverVal(i: number) { return hov[i] }
  return { draw, resize, layout, bob: bobOf, pointer, hoverVal, setDpr }
}

// ---------- tier content ----------

const TIERS = [
  {
    lbl: 'TIER I',
    name: 'Starter',
    feats: ['Professional design', 'Up to 5 pages', 'Contact form', 'Mobile optimised', '2 revision rounds'],
  },
  {
    lbl: 'TIER II',
    name: 'Business',
    feats: ['Everything in Starter', 'SEO setup', 'Copywriting', 'Up to 10 pages', 'CMS integration', 'Google Analytics', '3 revision rounds'],
  },
  {
    lbl: 'TIER III',
    name: 'Full Production',
    feats: ['Everything in Business', 'Photo & video production', 'Advanced animations', 'Custom functionality', 'Ongoing maintenance', 'Unlimited revisions'],
  },
]

const TOTAL_EM = [13.2, 16.5, 14.9]

const PRIMARY_FONT = "var(--font-geist-sans), sans-serif"

// Fixed text sizes shared by all three icebergs (independent of per-tier keel geometry/scale)
const FONT_TIER_LABEL = 11   // px — "TIER I / II / III" eyebrow
const FONT_PACKAGE_NAME = 21 // px — "Starter / Business / Full Production"
const FONT_FEATURE_ITEM = 13 // px — feature list lines

export default function IcebergPackagesSection({ id }: { id?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const tierRefs = useRef<(HTMLDivElement | null)[]>([])
  const { lang } = useLang()
  const [isMobile, setIsMobile] = useState(false)
  const [mobileImgs, setMobileImgs] = useState<{
    urls: string[]
    anchors: { cx: number; wl: number; depth: number; topH: number; halfW: number }[]
    w: number
    h: number
  } | null>(null)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const t = {
    en: {
      eyebrow: 'PACKAGES', heading: 'Three ways to work with us',
      t1: ['Professional design','Up to 3 pages','Contact form','Mobile optimised','2 revision rounds'],
      t2: ['Everything in Starter','Up to 7 pages','SEO setup','Copywriting','Multilingual (2 languages)','Priority support (email)','5 revision rounds'],
      t3: ['Everything in Business','Up to 12 pages','Photo & video production','Advanced animations','Multilingual (3+ languages)','Advanced statistics','Priority support (dedicated)','10 revision rounds'],
    },
    da: {
      eyebrow: 'PAKKER', heading: 'Tre måder at arbejde med os',
      t1: ['Professionelt design','Op til 3 sider','Kontaktformular','Mobiloptimeret','2 revisionsrunder'],
      t2: ['Alt i Starter','Op til 7 sider','SEO-opsætning','Tekst & indhold','Flersproget (2 sprog)','Prioriteret support (e-mail)','5 revisionsrunder'],
      t3: ['Alt i Business','Op til 12 sider','Foto & videoproduktion','Avancerede animationer','Flersproget (3+ sprog)','Avanceret statistik','Prioriteret support (dedikeret)','10 revisionsrunder'],
    }
  }

  useEffect(() => {
    if (!isMobile) return
    if (mobileImgs) return
    const w = window.innerWidth
    const h = Math.max(window.innerHeight, 820)
    const fullW = w * 3
    const offscreen = document.createElement('canvas')
    offscreen.width = Math.round(fullW)
    offscreen.height = Math.round(h)
    const depth = createDepth(offscreen, false)
    depth.setDpr(1)
    depth.resize(fullW, h)
    depth.draw(0)
    const lay = depth.layout()
    if (!lay || !lay.items.length) return
    const urls: string[] = []
    for (let i = 0; i < 3; i++) {
      const panel = document.createElement('canvas')
      panel.width = Math.round(w)
      panel.height = Math.round(h)
      const pctx = panel.getContext('2d')
      if (!pctx) continue
      pctx.drawImage(offscreen, Math.round(i * w), 0, Math.round(w), Math.round(h), 0, 0, Math.round(w), Math.round(h))
      urls.push(panel.toDataURL('image/jpeg', 0.88))
    }
    setMobileImgs({ urls, anchors: lay.items, w, h })
  }, [isMobile, mobileImgs])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const depth = createDepth(canvas, !isMobile)

    let lastFitW = 0, lastFitH = 0
    function fit() {
      const r = canvas!.getBoundingClientRect()
      const newW = Math.round(r.width), newH = Math.round(r.height)
      if (Math.abs(newW - lastFitW) < 2 && Math.abs(newH - lastFitH) < 100) return
      lastFitW = newW; lastFitH = newH
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5)
      canvas!.width = Math.max(2, Math.round(r.width * dpr))
      canvas!.height = Math.max(2, Math.round(r.height * dpr))
      depth.setDpr(dpr)
      depth.resize(r.width, r.height)
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)

    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas!.getBoundingClientRect()
      depth.pointer(e.clientX - r.left, e.clientY - r.top)
    }
    const handleMouseLeave = () => depth.pointer(-1e4, -1e4)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    let key: string | null = null
    let rafId: number

    function syncDepth(t: number) {
      const lay = depth.layout()
      if (!lay) return
      if (lay.key !== key) {
        key = lay.key
        if (sectionRef.current) sectionRef.current.style.minHeight = lay.stack ? lay.wantH + 'px' : '100dvh'
        setTimeout(fit, 60)
        lay.items.forEach((b, i) => {
          const el = tierRefs.current[i]
          if (!el) return
          const wdt = Math.min(b.halfW * (window.innerWidth < 768 ? 1.5 : 1.08), window.innerWidth < 768 ? 280 : 320)
          const topOff = Math.max(16, b.depth * 0.06)
          const avail = b.depth * (window.innerWidth < 768 ? 0.80 : 0.56) - topOff
          const fs = Math.max(9, Math.min(15, wdt / 16, avail / TOTAL_EM[i]))
          el.style.left = (b.cx - wdt / 2) + 'px'
          el.style.top = (b.wl + topOff) + 'px'
          el.style.width = wdt + 'px'
          el.style.fontSize = fs + 'px'
          el.style.transformOrigin = '50% ' + (-topOff) + 'px'
          el.style.visibility = 'visible'
        })
      }
      lay.items.forEach((b, i) => {
        const el = tierRefs.current[i]
        if (!el) return
        const hv = depth.hoverVal(i)
        const sc = 1 + 0.50 * hv
        el.style.transform = 'translateY(' + depth.bob(i, t).toFixed(2) + 'px) scale(' + sc.toFixed(4) + ')'
        el.style.zIndex = hv > 0.02 ? '3' : '1'
      })
    }

    function loop(t: number) {
      depth.draw(t)
      syncDepth(t)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isMobile])

  if (isMobile) {
    const tierFeats = [t[lang].t1, t[lang].t2, t[lang].t3]
    const tierLbls = ['TIER I', 'TIER II', 'TIER III']
    const tierNames = ['Starter', 'Business', 'Full Production']
    if (!mobileImgs) {
      return (
        <div id={id} style={{ width: '100vw', height: '100svh', background: '#031b26' }} />
      )
    }
    const sharedFs = Math.min(...([0, 1, 2].map((j) => {
      const a = mobileImgs.anchors[j]
      if (!a) return 14
      const w2 = Math.min(a.halfW * 1.5, 260)
      const tO = Math.max(16, a.depth * 0.20)
      return Math.max(10, Math.min(16, (a.depth * 0.80 - tO) / TOTAL_EM[j]))
    })))
    const sharedTopOff = Math.min(...mobileImgs.anchors.map(a => Math.max(16, a.depth * 0.20)))
    return (
      <div
        id={id}
        style={{
          width: '100vw',
          height: mobileImgs.h + 'px',
          overflowX: 'scroll',
          overflowY: 'hidden',
          overscrollBehaviorX: 'contain',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
        }}
      >
        {[0, 1, 2].map((i) => {
          const anch = mobileImgs.anchors[i]
          if (!anch) return null
          const cw = mobileImgs.w
          const ch = mobileImgs.h
          const localCx = anch.cx - i * cw
          const wdt = Math.min(anch.halfW * 1.5, 260)
          const topOff = sharedTopOff
          const avail = anch.depth * 0.80 - topOff
          const fs = sharedFs
          const topPct = ((anch.wl + topOff) / ch * 100).toFixed(2) + '%'
          const leftPct = ((localCx - wdt / 2) / cw * 100).toFixed(2) + '%'
          const widthPct = (wdt / cw * 100).toFixed(2) + '%'
          return (
            <div
              key={i}
              style={{
                width: '100vw',
                height: ch + 'px',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={mobileImgs.urls[i]}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                alt=""
              />
              {i === 0 && (
                <div style={{
                  position: 'absolute', top: '6dvh', left: 0, right: 0, zIndex: 2,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px',
                }}>
                  <div style={{ fontFamily: PRIMARY_FONT, fontSize: 11, letterSpacing: '0.38em', color: 'rgba(0,215,200,0.85)', marginBottom: 14 }}>
                    {t[lang].eyebrow}
                  </div>
                  <h2 style={{ margin: 0, fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 250, lineHeight: 1.08, letterSpacing: '-0.015em', color: '#f4fbff' }}>
                    {t[lang].heading}
                  </h2>
                </div>
              )}
              <div style={{
                position: 'absolute',
                left: leftPct,
                top: topPct,
                width: widthPct,
                fontSize: fs + 'px',
                zIndex: 3,
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                textShadow: '0 1px 10px rgba(0,8,16,0.9)',
              }}>
                <span style={{ fontFamily: PRIMARY_FONT, fontSize: '0.78em', letterSpacing: '0.3em', color: 'rgba(140,235,225,0.9)' }}>
                  {tierLbls[i]}
                </span>
                <span style={{ fontFamily: PRIMARY_FONT, fontSize: '28px', fontWeight: 300, letterSpacing: '0.01em', color: 'rgba(255,255,255,0.97)', marginTop: '0.35em', whiteSpace: 'nowrap' }}>
                  {tierNames[i]}
                </span>
                <div style={{ width: '2.4em', height: '1px', background: 'rgba(140,235,225,0.4)', margin: '0.8em 0 0.95em' }} />
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '0.78em',
                  fontFamily: PRIMARY_FONT, fontSize: '0.86em', lineHeight: 1.35,
                  color: 'rgba(232,250,252,0.85)', letterSpacing: '0.02em',
                }}>
                  {tierFeats[i].map((f) => <span key={f}>{f}</span>)}
                </div>
              </div>
              {i === 0 && (
                <div style={{
                  position: 'absolute', bottom: '4dvh', left: 0, right: 0, zIndex: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '1px solid rgba(0,215,200,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pkgSwipeX 1.2s ease-in-out infinite',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8h8M9 5l3 3-3 3" stroke="rgba(0,215,200,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: PRIMARY_FONT, fontSize: 10, letterSpacing: '0.3em', color: 'rgba(0,215,200,0.6)', textTransform: 'uppercase' }}>
                    Swipe
                  </span>
                </div>
              )}
            </div>
          )
        })}
        <style>{`
          @keyframes pkgSwipeX { 0%,100% { transform: translateX(-6px); opacity: 0.5; } 50% { transform: translateX(6px); opacity: 1; } }
          @keyframes pkgHintFade { 0%,60% { opacity: 1; } 100% { opacity: 0; } }
        `}</style>
      </div>
    )
  }

  return (
    <section id={id} ref={sectionRef} style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', background: '#031b26' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />

      <div style={{
        position: 'absolute', top: '6dvh', left: 0, right: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px',
      }}>
        <div style={{
          fontFamily: PRIMARY_FONT, fontSize: 11, letterSpacing: '0.38em',
          color: 'rgba(0,215,200,0.85)', marginBottom: 18,
        }}>
          {t[lang].eyebrow}
        </div>
        <h2 style={{
          margin: 0, fontSize: 'clamp(30px, 4.4vw, 56px)', fontWeight: 250, lineHeight: 1.08,
          letterSpacing: '-0.015em', textWrap: 'balance',
        }}>
          {t[lang].heading}
        </h2>
      </div>

      {TIERS.map((tier, i) => (
        <div
          key={tier.name}
          ref={(el) => { tierRefs.current[i] = el }}
          style={{
            position: 'absolute', zIndex: 1, visibility: 'hidden', pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            textShadow: '0 1px 10px rgba(0,8,16,0.65)',
          }}
        >
          <span style={{ fontFamily: PRIMARY_FONT, fontSize: FONT_TIER_LABEL + 'px', letterSpacing: '0.3em', color: 'rgba(140,235,225,0.9)' }}>
            {tier.lbl}
          </span>
          <span style={{ fontSize: FONT_PACKAGE_NAME + 'px', fontWeight: 300, letterSpacing: '0.01em', color: 'rgba(255,255,255,0.97)', marginTop: '0.35em', whiteSpace: 'nowrap' }}>
            {tier.name}
          </span>
          <div style={{ width: '2.4em', height: '1px', background: 'rgba(140,235,225,0.4)', margin: '0.8em 0 0.95em' }} />
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '0.78em',
            fontFamily: PRIMARY_FONT, fontSize: FONT_FEATURE_ITEM + 'px', lineHeight: 1.5,
            color: 'rgba(232,250,252,0.85)', letterSpacing: '0.02em', whiteSpace: 'nowrap',
          }}>
            {[t[lang].t1, t[lang].t2, t[lang].t3][i].map((f) => <span key={f}>{f}</span>)}
          </div>
        </div>
      ))}
    </section>
  )
}
