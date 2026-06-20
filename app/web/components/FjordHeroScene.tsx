'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { useLang } from '@/contexts/LanguageContext'

export default function FjordHeroScene({ children }: { children?: React.ReactNode } = {}) {
  const { lang } = useLang()
  useEffect(() => {
    let dead = false
    let raf = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let tmo: ReturnType<typeof setTimeout> | undefined
    let paused = false
    let mtn: any = null
    let sea: any = null
    let fjord: any = null
    let cleanupFn: (() => void) | null = null

    const T = THREE

    function hash(x: number, y: number, z: number): number {
      const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
      return s - Math.floor(s)
    }

    function jitter(geo: THREE.BufferGeometry, amt: number, taperH?: number, taperAmt?: number): THREE.BufferGeometry {
      const p = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) {
        let x = p.getX(i), y = p.getY(i), z = p.getZ(i)
        const kx = Math.round(x * 10), ky = Math.round(y * 10), kz = Math.round(z * 10)
        if (taperH != null) { const f = 1 - Math.min(Math.max(y, 0), taperH) / taperH * (taperAmt || 0); z *= f }
        x += (hash(kx, ky, kz) - 0.5) * amt
        y += (hash(ky, kz, kx) - 0.5) * amt
        z += (hash(kz, kx, ky) - 0.5) * amt
        p.setXYZ(i, x, y, z)
      }
      geo.computeVertexNormals()
      return geo
    }

    function addColors(geo: THREE.BufferGeometry, H: number, sink: number) {
      const p = geo.attributes.position as THREE.BufferAttribute
      const colors = new Float32Array(p.count * 3)
      for (let i = 0; i < p.count; i++) {
        const v = Math.min(Math.max((p.getY(i) + sink) / H, 0), 1)
        const n = hash(Math.round(p.getX(i) * 5), Math.round(p.getY(i) * 5), Math.round(p.getZ(i) * 5)) - 0.5
        const t2 = Math.min(Math.max(Math.pow(v, 0.7) + n * 0.24, 0), 1)
        colors[i * 3] = 0.62 + 0.38 * t2
        colors[i * 3 + 1] = 0.78 + 0.22 * t2
        colors[i * 3 + 2] = 0.85 + 0.15 * t2
      }
      geo.setAttribute('color', new T.BufferAttribute(colors, 3))
    }

    function roundify(geo: THREE.BufferGeometry, o: { len: number; h: number; sink: number }) {
      const p = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i); let z = p.getZ(i)
        const u = Math.min(Math.max(x / o.len, 0.03), 0.97)
        const v = Math.min(Math.max((y + o.sink) / o.h, 0), 1)
        z *= (0.6 + 0.4 * Math.sin(Math.PI * u)) * (1 - v * 0.45) * (0.8 + 0.35 * Math.cos((v - 0.35) * 2.0))
        p.setZ(i, z)
      }
    }

    interface BlobOpts {
      len: number; h: number; w: number; sink?: number; noise: number; taper?: number
      sx?: number; sy?: number; sz?: number; seed?: number; endTaper?: number; endNarrow?: number; topPinch?: number
      profile?: (u: number) => number
      arch?: { amp: number; u: number; spread: number; maxY: number }
    }

    function makeBlob(o: BlobOpts): THREE.BufferGeometry {
      const L = o.len, H = o.h, sink = o.sink ?? 2
      const g = new T.BoxGeometry(L, H, o.w, o.sx ?? 20, o.sy ?? 8, o.sz ?? 8)
      g.translate(L / 2, H / 2 - sink, 0)
      const p = g.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) {
        let x = p.getX(i), y = p.getY(i), z = p.getZ(i)
        const u = Math.min(Math.max(x / L, 0), 1)
        if (y > 0 && o.profile) y *= o.profile(u)
        if (o.arch && y < o.arch.maxY) {
          const lift = o.arch.amp * Math.exp(-Math.pow(u - o.arch.u, 2) / o.arch.spread)
          const w2 = Math.min(Math.max((o.arch.maxY - y) / (o.arch.maxY + sink), 0), 1)
          y += lift * w2
        }
        const v = Math.min(Math.max((y + sink) / H, 0), 1)
        let zs = 1 - v * (o.taper == null ? 0.5 : o.taper)
        const endTaper = o.endTaper == null ? 0.6 : o.endTaper
        zs *= 0.1 + 0.9 * Math.pow(Math.sin(Math.PI * u), endTaper)
        zs *= 0.8 + 0.35 * Math.cos((v - 0.35) * 2.0)
        if (o.topPinch) { const e = Math.max(v - 0.78, 0) / 0.22; zs *= 1 - e * e * o.topPinch }
        if (o.endNarrow) { const e = Math.max(u - 0.78, 0) / 0.22; y *= 1 - e * e * o.endNarrow }
        z *= zs
        const sd = o.seed ?? 0
        const kx = Math.round(x * 7) + sd, ky = Math.round(y * 7) + sd * 2, kz = Math.round(z * 7) + sd * 3
        x += (hash(kx, ky, kz) - 0.5) * o.noise
        y += (hash(ky, kz, kx) - 0.5) * o.noise
        z += (hash(kz, kx, ky) - 0.5) * o.noise * 0.8
        p.setXYZ(i, x, y, z)
      }
      addColors(g, H, sink)
      g.computeVertexNormals()
      return g
    }

    function addCracks(mesh: THREE.Mesh, color: string, opacity: number, threshold?: number) {
      const edges = new T.EdgesGeometry(mesh.geometry, threshold ?? 16)
      mesh.add(new T.LineSegments(edges, new T.LineBasicMaterial({ color, transparent: true, opacity })))
    }

    function reliefBack(geo: THREE.BufferGeometry, zSign: number, amp: number) {
      const p = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
        const onBack = zSign > 0 ? z > 1.5 : z < -1.5
        if (!onBack) continue
        const ridge = Math.sin(x * 0.42 + y * 0.26) + 0.55 * Math.sin(x * 0.19 - y * 0.43 + 1.3)
        const d = amp * ridge
        p.setX(i, x + d * 0.16); p.setY(i, y + d * 0.10)
        p.setZ(i, z + (zSign > 0 ? Math.abs(d) : -Math.abs(d)))
      }
      geo.computeVertexNormals()
    }

    function addCracksSplit(mesh: THREE.Mesh, color: string, opacity: number, frontThresh: number, backThresh: number, backSign: number) {
      const geo = mesh.geometry
      const fe = new T.EdgesGeometry(geo, frontThresh), be = new T.EdgesGeometry(geo, backThresh)
      const pos: number[] = []
      const consider = (eg: THREE.EdgesGeometry, wantBack: boolean) => {
        const p = eg.attributes.position as THREE.BufferAttribute
        for (let i = 0; i < p.count; i += 2) {
          const mz = (p.getZ(i) + p.getZ(i + 1)) / 2
          const isBack = backSign > 0 ? mz > 0.6 : mz < -0.6
          if (wantBack ? isBack : !isBack) pos.push(p.getX(i), p.getY(i), p.getZ(i), p.getX(i + 1), p.getY(i + 1), p.getZ(i + 1))
        }
      }
      consider(fe, false); consider(be, true)
      const g = new T.BufferGeometry()
      g.setAttribute('position', new T.Float32BufferAttribute(pos, 3))
      mesh.add(new T.LineSegments(g, new T.LineBasicMaterial({ color, transparent: true, opacity })))
    }

    function buildIceberg(): THREE.Group {
      const ice = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.92, metalness: 0 })
      const berg = new T.Group()

      // right arm with hole
      const shapeC = new T.Shape()
      const ptsC: [number, number][] = [[0,-2.5],[28,-2.2],[35,-4.5],[33,0.4],[27,2.8],[24.5,4.8],[21,5.2],[17,7.4],[13.5,7.8],[10,9.8],[6.5,10.2],[3,12],[0,12.5]]
      shapeC.moveTo(ptsC[0][0], ptsC[0][1])
      for (let i = 1; i < ptsC.length; i++) shapeC.lineTo(ptsC[i][0], ptsC[i][1])
      const hole = new T.Path()
      hole.absellipse(7.2, 5.2, 2.4, 2.9, 0, Math.PI * 2, true, 0)
      shapeC.holes.push(hole)
      let geoC = new T.ExtrudeGeometry(shapeC, { depth: 8.5, steps: 6, bevelEnabled: true, bevelThickness: 0.9, bevelSize: 0.9, bevelSegments: 2, curveSegments: 4 })
      geoC.translate(0, 0, -4.25)
      roundify(geoC, { len: 35, h: 13, sink: 4.5 })
      jitter(geoC, 0.5, 12.5, 0.35)
      reliefBack(geoC, -1, 1.2)
      addColors(geoC, 13, 2.5)
      const armC = new T.Mesh(geoC, ice)
      armC.rotation.y = -0.22
      addCracksSplit(armC, '#6f9fb6', 0.3, 16, 34, -1)
      berg.add(armC)

      // left block
      const shapeA = new T.Shape()
      const ptsA: [number, number][] = [
        [0, -2.5], [0, 12.5],
        [5.2, 12.3], [10.4, 11.6], [15.6, 10.2], [20.3, 8.5], [23.4, 5.9], [26, 2.6],
        [26, -1.5],
        [23, -2.3], [19.5, -1.6], [16.9, -0.4], [14.3, 2.4], [11.7, 4.0], [9.1, 2.4], [6.5, -0.4], [3.5, -2.0]
      ]
      shapeA.moveTo(ptsA[0][0], ptsA[0][1])
      for (let i = 1; i < ptsA.length; i++) shapeA.lineTo(ptsA[i][0], ptsA[i][1])
      let geoA = new T.ExtrudeGeometry(shapeA, { depth: 11, steps: 5, bevelEnabled: true, bevelThickness: 1.0, bevelSize: 1.0, bevelSegments: 2, curveSegments: 4 })
      geoA.translate(0, 0, -5.5)
      roundify(geoA, { len: 26, h: 15, sink: 2.5 })
      jitter(geoA, 0.55, 12.5, 0.4)
      reliefBack(geoA, 1, 1.3)
      addColors(geoA, 15, 2.5)
      const armA = new T.Mesh(geoA, ice)
      armA.rotation.y = Math.PI * 0.94
      addCracksSplit(armA, '#6f9fb6', 0.28, 22, 42, 1)
      berg.add(armA)

      // back spike
      const geoB = makeBlob({
        len: 24, h: 23, w: 10, sink: 2.5, noise: 0.34, taper: 0.6,
        sx: 14, sy: 8, sz: 6, seed: 37, endTaper: 0.5, endNarrow: 0.7, topPinch: 0.62,
        profile: (u: number) => {
          const peak = 0.22 + 0.78 * Math.exp(-Math.pow(u - 0.72, 2) / 0.024)
          const shoulder = 0.32 * Math.exp(-Math.pow(u - 0.32, 2) / 0.055)
          const crust = 0.03 * Math.sin(u * 7 + 1.4)
          return Math.max(peak + shoulder + crust, 0.14)
        },
      })
      reliefBack(geoB, 1, 1.0)
      geoB.computeVertexNormals()
      const spike = new T.Mesh(geoB, ice)
      spike.rotation.y = Math.PI / 2 + 0.18
      addCracksSplit(spike, '#6f9fb6', 0.28, 15, 32, 1)
      berg.add(spike)

      // central core
      const geoCore = makeBlob({
        len: 21, h: 7.5, w: 17, sink: 2.5, noise: 0.5, taper: 0.5,
        sx: 11, sy: 6, sz: 9, seed: 71, endTaper: 0.5,
        profile: (u: number) => 0.85 + 0.06 * Math.sin(u * 6)
      })
      geoCore.translate(-10.5, 0, 0)
      const core = new T.Mesh(geoCore, ice)
      addCracks(core, '#6f9fb6', 0.3, 16)
      berg.add(core)

      // nub
      const geoNub = makeBlob({
        len: 12, h: 5.5, w: 9, sink: 2.5, noise: 0.5, taper: 0.5,
        sx: 8, sy: 4, sz: 5, seed: 113,
        profile: (u: number) => 0.82 + 0.1 * Math.sin(u * 6)
      })
      geoNub.translate(-6, 0, 8)
      const nub = new T.Mesh(geoNub, ice)
      addCracks(nub, '#6f9fb6', 0.3, 16)
      berg.add(nub)

      // massive submerged keel — single IcosahedronGeometry stretched into a deep keel
      const keelMat = new T.MeshStandardMaterial({
        vertexColors: true, flatShading: true, roughness: 0.9, metalness: 0,
        transparent: false, opacity: 1, depthWrite: true, side: T.DoubleSide
      })
      keelMat.clippingPlanes = [new T.Plane(new T.Vector3(0, -1, 0), 0)]
      const keelStops: [number, [number, number, number]][] = [
        [0.00, [0.10, 0.30, 0.34]], [0.16, [0.26, 0.72, 0.68]],
        [0.44, [0.08, 0.36, 0.41]], [0.72, [0.04, 0.15, 0.21]], [1.00, [0.02, 0.06, 0.10]],
      ]
      const keelCol = (t: number): [number, number, number] => {
        for (let s = 0; s < keelStops.length - 1; s++) {
          if (t <= keelStops[s + 1][0]) {
            const k = (t - keelStops[s][0]) / (keelStops[s + 1][0] - keelStops[s][0])
            const a = keelStops[s][1], b = keelStops[s + 1][1]
            return [a[0]+(b[0]-a[0])*k, a[1]+(b[1]-a[1])*k, a[2]+(b[2]-a[2])*k]
          }
        }
        return keelStops[keelStops.length - 1][1]
      }
      {
        const g = new T.IcosahedronGeometry(1, 3)
        const p2 = g.attributes.position as THREE.BufferAttribute
        const cols2 = new Float32Array(p2.count * 3)
        const kcx = 5, kcz = -2, rx = 26, rz = 15
        const equatorY = 2.6, domeH = 5, keelDepth = 79
        for (let i = 0; i < p2.count; i++) {
          let x = p2.getX(i), y = p2.getY(i), z = p2.getZ(i)
          const dn = (1 - y) / 2
          const ang = Math.atan2(z, x)
          const block = (hash(Math.round(x*5), Math.round(z*5), Math.round(y*5)) > 0.66)
            ? 0.16 + 0.2 * hash(Math.round(y*6), Math.round(x*6), 4) : 0
          const lb = 1
            + 0.2 * (Math.sin(ang*3 + dn*4) + 0.55*Math.sin(ang*5 - dn*3) + 0.35*Math.sin(ang*8 + dn*7))
            + (hash(Math.round(x*4), Math.round(z*4), Math.round(y*4)) - 0.5) * 0.22
            + block
          let px = kcx + x * rx * lb
          let pz = kcz + z * rz * lb
          const reach = Math.max(1 - dn * 3.2, 0)
          px = kcx + (px - kcx) * (1 + 0.55 * reach)
          pz = kcz + (pz - kcz) * (1 + 0.32 * reach)
          let py = (y >= 0) ? equatorY + y * domeH : equatorY + y * keelDepth
          const noiseAmp = 2.8 + dn * 2.6
          const nkx = Math.round(px*3), nky = Math.round(py*3), nkz = Math.round(pz*3)
          px += (hash(nkx, nky, nkz) - 0.5) * noiseAmp
          py += (hash(nky, nkz, nkx) - 0.5) * noiseAmp
          pz += (hash(nkz, nkx, nky) - 0.5) * noiseAmp
          p2.setXYZ(i, px, py, pz)
          const c = keelCol(Math.min(dn, 1))
          cols2[i*3] = c[0]; cols2[i*3+1] = c[1]; cols2[i*3+2] = c[2]
        }
        g.setAttribute('color', new T.BufferAttribute(cols2, 3))
        g.computeVertexNormals()
        const keel = new T.Mesh(g, keelMat)
        keel.renderOrder = -1
        berg.add(keel)
      }

      return berg
    }

    interface TerrainData { ridge: number[]; RW: number; W: number; H: number; snow: number[][]; relief: number[][] }
    interface PrepResult {
      GW: number; GH: number
      ridgeAt: (p: number, flip: boolean) => number
      sample: (which: 'snow' | 'relief', p: number, fy: number, fb: number, flip: boolean) => number
    }

    function prep(data: TerrainData, KC?: number): PrepResult {
      const { ridge, RW, W: GW, H: GH, snow, relief } = data
      const win = Math.max(2, Math.round(RW / 220))
      const rsm = new Array(RW)
      for (let i = 0; i < RW; i++) { let s = 0, n = 0; for (let k = -win; k <= win; k++) { const j = i + k; if (j >= 0 && j < RW) { s += ridge[j]; n++ } } rsm[i] = s / n }
      let rmin = 1; for (const v of rsm) if (v < rmin) rmin = v
      const kc = KC == null ? 1.5 : KC
      return {
        GW, GH,
        ridgeAt: (p, flip) => {
          if (flip) p = 1 - p
          p = Math.min(Math.max(p, 0), 1)
          const f = p * (RW - 1), i0 = Math.floor(f), i1 = Math.min(RW - 1, i0 + 1), fr = f - i0
          const v = rsm[i0] * (1 - fr) + rsm[i1] * fr
          return rmin + (v - rmin) * kc
        },
        sample: (which, p, fy, fb, flip) => {
          if (flip) p = 1 - p
          const grid = which === 'snow' ? snow : relief
          const gx = Math.min(GW - 1, Math.max(0, Math.floor(p * GW)))
          const gy = Math.min(GH - 1, Math.max(0, Math.floor(fy * GH)))
          let s = 0, n = 0
          for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
            const xx = gx + a, yy = gy + b
            if (xx >= 0 && xx < GW && yy >= 0 && yy < GH) { let val = grid[yy][xx]; if (val < 0) val = fb; s += val; n++ }
          }
          return n ? s / n : fb
        }
      }
    }

    interface StripOpts {
      COLS: number; ROWS: number; closed: boolean; R: number
      yTop: number; yFoot: number; footFrac: number; skirtY: number
      snowCol: [number,number,number]; rockGully: [number,number,number]; rockFace: [number,number,number]
      fn: (u: number, ci: number) => { az: number; rfy: number; hm: number; P: PrepResult; lu: number; flip: boolean }
    }

    function emitStrip(scene: THREE.Scene, opts: StripOpts) {
      const { COLS, ROWS, closed, R, yTop, yFoot, footFrac, fn, snowCol, rockGully, rockFace, skirtY } = opts
      const yOf = (fy: number) => yTop - Math.min(Math.max(fy, 0), footFrac) / footFrac * (yTop - yFoot)
      const verts: number[] = [], cols: number[] = [], idx: number[] = []
      const stride = ROWS + 2
      const last = closed ? COLS : COLS - 1
      for (let ci = 0; ci <= (closed ? COLS : COLS - 1); ci++) {
        const u = ci / COLS
        const c = fn(u, ci)
        let rfy = c.rfy; if (rfy > footFrac) rfy = footFrac
        const gully = (hash(Math.floor(ci / 3), 0, 7) - 0.5) * 3.2
                    + (hash(Math.floor(ci / 7), 0, 2) - 0.5) * 5
                    + (hash(ci, 0, 4) - 0.5) * 1.6
        for (let ri = 0; ri <= ROWS; ri++) {
          const t2 = ri / ROWS
          const fy = rfy + t2 * (footFrac - rfy)
          const L = c.P.sample('relief', c.lu, fy, 0.18, c.flip)
          const sn = c.P.sample('snow', c.lu, fy, 0, c.flip)
          const wy = yFoot + ((ri === ROWS ? yOf(footFrac) : yOf(fy)) - yFoot) * c.hm
          const ridgeBoost = Math.pow(1 - t2, 1.5) * 4
          const crag = (hash(Math.floor(ci / 4), Math.floor(ri / 9), 3) - 0.5) * 2.0
          const dR = gully * (0.6 + 0.4 * (1 - t2)) + ridgeBoost + crag
          const rr = R - dR
          verts.push(Math.sin(c.az) * rr, wy, Math.cos(c.az) * rr)
          const lit = Math.min(Math.max((L - 0.12) * 1.5, 0), 1)
          let cr = rockGully[0] + (rockFace[0] - rockGully[0]) * lit
          let cg = rockGully[1] + (rockFace[1] - rockGully[1]) * lit
          let cb = rockGully[2] + (rockFace[2] - rockGully[2]) * lit
          const snA = Math.min(Math.max((sn - 0.10) * 2.2, 0), 1) * (0.66 + 0.34 * lit)
          cr += (snowCol[0] - cr) * snA; cg += (snowCol[1] - cg) * snA; cb += (snowCol[2] - cb) * snA
          cols.push(cr, cg, cb)
        }
        verts.push(Math.sin(c.az) * R, skirtY, Math.cos(c.az) * R)
        cols.push(rockGully[0] * 0.7, rockGully[1] * 0.7, rockGully[2] * 0.7)
      }
      for (let ci = 0; ci < last; ci++) {
        for (let ri = 0; ri < stride - 1; ri++) {
          const a = ci * stride + ri, b = (ci + 1) * stride + ri, c2 = a + 1, d = b + 1
          idx.push(a, b, c2, c2, b, d)
        }
      }
      const g = new T.BufferGeometry()
      g.setAttribute('position', new T.Float32BufferAttribute(verts, 3))
      g.setAttribute('color', new T.Float32BufferAttribute(cols, 3))
      g.setIndex(idx); g.computeVertexNormals()
      scene.add(new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, metalness: 0 })))
    }

    function buildEnclosure(scene: THREE.Scene) {
      const F = mtn && prep(mtn)
      if (!F) return
      const S = (sea && prep(sea)) || F
      const J = (fjord && prep(fjord)) || F
      const TAU = Math.PI * 2, PI = Math.PI
      const smooth = (x: number, a: number, b: number) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t) }
      const wrap = (a: number) => ((a % TAU) + TAU) % TAU
      const angDist = (a: number, b: number) => { let d = Math.abs(wrap(a) - wrap(b)); if (d > PI) d = TAU - d; return d }
      const arcs = [
        { c: PI,         half: 1.04, P: F, flip: false },
        { c: PI - 1.74,  half: 0.80, P: S, flip: false },
        { c: PI + 1.74,  half: 0.80, P: J, flip: true  },
        { c: 0.62,       half: 0.64, P: J, flip: false },
        { c: TAU - 0.62, half: 0.64, P: S, flip: true  },
      ]
      const envMouth = (az: number) => 0.06 + 0.94 * smooth(angDist(az, 0), 0.22, 0.72)
      const pick = (az: number) => {
        let wsum = 0, frac = 0, best = arcs[0], bestw = -1, bestlu = 0.5
        for (const A of arcs) {
          const d = angDist(az, A.c); if (d > A.half) continue
          const off = wrap(az - A.c + PI) - PI
          const lu = Math.min(Math.max(0.5 + off / (2 * A.half), 0), 1)
          const w = 1 - d / A.half
          frac += A.P.ridgeAt(lu, A.flip) * w; wsum += w
          if (w > bestw) { bestw = w; best = A; bestlu = lu }
        }
        if (wsum <= 0) return { rfy: 0.78, P: arcs[0].P, lu: 0.5, flip: false, valEnv: 0.4 }
        const valEnv = 0.5 + 0.5 * Math.sin(PI * bestlu)
        return { rfy: frac / wsum, P: best.P, lu: bestlu, flip: best.flip, valEnv }
      }
      emitStrip(scene, {
        COLS: 760, ROWS: 26, closed: true, R: 660, yTop: 116, yFoot: 0, footFrac: 0.82, skirtY: -14,
        snowCol: [0.84, 0.89, 0.95], rockGully: [0.05, 0.085, 0.12], rockFace: [0.16, 0.23, 0.30],
        fn: (u) => { const az = u * TAU; const p = pick(az); return { az, rfy: p.rfy, hm: envMouth(az) * p.valEnv, P: p.P, lu: p.lu, flip: p.flip } }
      })
    }

    function buildFarRange(scene: THREE.Scene) {
      const base = sea || mtn; if (!base) return
      const P = prep(base, 1.25)
      const span = 150 * Math.PI / 180
      emitStrip(scene, {
        COLS: 200, ROWS: 14, closed: false, R: 1280, yTop: 66, yFoot: 6, footFrac: 0.85, skirtY: -6,
        snowCol: [0.72, 0.78, 0.86], rockGully: [0.07, 0.10, 0.14], rockFace: [0.15, 0.21, 0.27],
        fn: (u) => {
          const az = (u - 0.5) * span
          const taper = Math.pow(Math.sin(Math.PI * u), 0.7)
          return { az, rfy: P.ridgeAt(u, false), hm: 0.55 + 0.45 * taper, P, lu: u, flip: false }
        }
      })
    }

    function buildDistantBergs(scene: THREE.Scene) {
      const mat = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95, metalness: 0 })
      const specs = [
        [48,600,64,20,30,12,1],[124,575,92,16,40,47,0],[201,625,54,26,26,88,2],
        [292,560,78,18,34,133,0],[338,615,48,24,22,201,1],[165,590,70,14,32,260,2],
      ]
      specs.forEach((s, idx2) => {
        const az = s[0] * Math.PI / 180, dist = s[1], len = s[2], h = s[3], w = s[4], type = s[6]
        const pk = 0.34 + hash(idx2, 1, 2) * 0.34
        const pk2 = 0.2 + hash(idx2, 5, 3) * 0.25
        const profile = (u: number) => {
          if (type === 0) return Math.max(0.62 + 0.16 * Math.sin(u * (4 + idx2) + s[5]) + 0.1 * Math.sin(u * 11), 0.4)
          if (type === 2) { const a = 0.7 * Math.exp(-Math.pow(u - pk2, 2) / 0.025); const b2 = 0.85 * Math.exp(-Math.pow(u - (pk2 + 0.42), 2) / 0.03); return Math.max(a + b2 + 0.18, 0.16) }
          const peak = 0.22 + 0.78 * Math.exp(-Math.pow(u - pk, 2) / 0.04)
          return Math.max(peak + 0.16 * Math.exp(-Math.pow(u - (pk + 0.3), 2) / 0.05), 0.15)
        }
        const geo = makeBlob({ len, h, w, sink: 4, noise: len * 0.02, taper: 0.55, sx: 14, sy: 7, sz: 7, seed: s[5], endTaper: 0.55, profile })
        geo.translate(-len / 2, 0, 0)
        const col = geo.attributes.color as THREE.BufferAttribute
        for (let i = 0; i < col.count; i++) col.setXYZ(i, col.getX(i) * 0.62, col.getY(i) * 0.66, col.getZ(i) * 0.72)
        const m = new T.Mesh(geo, mat)
        m.position.set(Math.sin(az) * dist, -2, Math.cos(az) * dist)
        m.rotation.y = hash(idx2, 3, 7) * 6.283
        scene.add(m)
      })
    }

    function buildSky(scene: THREE.Scene) {
      const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 1024
      const x = cv.getContext('2d')!
      const gr = x.createLinearGradient(0, 0, 0, 1024)
      gr.addColorStop(0.00, '#06101c'); gr.addColorStop(0.42, '#0a1c2a'); gr.addColorStop(0.62, '#134a64')
      gr.addColorStop(0.78, '#1d4a62'); gr.addColorStop(0.90, '#163a4f'); gr.addColorStop(1.00, '#0e2535')
      x.fillStyle = gr; x.fillRect(0, 0, 2048, 1024)
      const tex = new T.CanvasTexture(cv); tex.wrapS = T.RepeatWrapping
      const cyl = new T.Mesh(
        new T.CylinderGeometry(1900, 1900, 1500, 72, 1, true),
        new T.MeshBasicMaterial({ map: tex, side: T.BackSide, fog: false, depthWrite: false })
      )
      cyl.position.y = 360
      scene.add(cyl)
    }

    function buildStars(scene: THREE.Scene) {
      const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64
      const g = cv.getContext('2d')!
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.4, 'rgba(255,255,255,1)')
      grd.addColorStop(0.7, 'rgba(255,255,255,0.45)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd; g.fillRect(0, 0, 64, 64)
      const tex = new T.CanvasTexture(cv)

      const R = 1680
      const starColor = (): [number, number, number] => {
        const r = Math.random()
        if (r < 0.04) return [1.0, 0.824, 0.588]
        if (r < 0.16) return [1.0, 0.973, 0.784]
        return [0.843, 0.894, 1.0]
      }
      const tiers = [
        { count: 2800, size: 6,  opacity: 0.85, bMin: 0.45, bMax: 0.70 },
        { count: 820,  size: 11, opacity: 0.95, bMin: 0.70, bMax: 0.95 },
        { count: 210,  size: 19, opacity: 1.0,  bMin: 0.90, bMax: 1.0  },
      ]
      tiers.forEach((tier) => {
        const positions = new Float32Array(tier.count * 3)
        const colors = new Float32Array(tier.count * 3)
        for (let i = 0; i < tier.count; i++) {
          const az = Math.random() * Math.PI * 2
          const elev = -0.05 + Math.pow(Math.random(), 1.7) * 0.95
          const ce = Math.cos(elev)
          positions[i * 3] = R * ce * Math.sin(az)
          positions[i * 3 + 1] = R * Math.sin(elev) + 40
          positions[i * 3 + 2] = R * ce * Math.cos(az)
          const c = starColor()
          const b = tier.bMin + Math.random() * (tier.bMax - tier.bMin)
          colors[i * 3] = c[0] * b
          colors[i * 3 + 1] = c[1] * b
          colors[i * 3 + 2] = c[2] * b
        }
        const geo = new T.BufferGeometry()
        geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3))
        geo.setAttribute('color', new T.Float32BufferAttribute(colors, 3))
        scene.add(new T.Points(geo, new T.PointsMaterial({
          map: tex, size: tier.size, sizeAttenuation: true, vertexColors: true,
          transparent: true, opacity: tier.opacity, depthWrite: false,
          blending: T.AdditiveBlending, fog: false
        })))
      })
    }

    function buildConstellations(scene: THREE.Scene) {
      const dotCv = document.createElement('canvas'); dotCv.width = 64; dotCv.height = 64
      const dg = dotCv.getContext('2d')!
      const dgrd = dg.createRadialGradient(32, 32, 0, 32, 32, 32)
      dgrd.addColorStop(0, 'rgba(255,255,255,1)')
      dgrd.addColorStop(0.3, 'rgba(255,255,255,0.95)')
      dgrd.addColorStop(0.55, 'rgba(210,228,255,0.35)')
      dgrd.addColorStop(1, 'rgba(210,228,255,0)')
      dg.fillStyle = dgrd; dg.fillRect(0, 0, 64, 64)
      const dotTex = new T.CanvasTexture(dotCv)

      const CONST: { stars: [number, number, number, number][]; lines?: [number, number][] }[] = [
        { stars:[[50,-35,2.2,.80],[-40,10,1.8,.60],[-32,30,1.6,.50],[0,42,1.4,.42],[15,24,1.4,.40],[28,3,1.4,.38]] },
        { stars:[[0,-60,2.3,.74],[55,-5,2.0,.63],[5,50,1.7,.55],[-50,10,2.1,.68]] },
        { stars:[[30,18,2.5,.76],[8,28,1.7,.64],[-18,-8,1.5,.48],[-35,-26,1.4,.45],[-10,-40,1.5,.44],[15,-20,1.3,.40]] },
        { lines:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]], stars:[[55,-42,2.8,.82],[52,22,2.4,.72],[-18,30,2.2,.68],[-18,-32,1.8,.55],[-65,-48,2.6,.80],[-108,-43,2.3,.74],[-145,-12,2.4,.76]] },
        { stars:[[30,22,2.0,.68],[12,-9,1.8,.60],[-18,-28,1.7,.55],[-33,4,1.8,.60],[-14,30,1.5,.48]] },
        { stars:[[0,-42,2.8,.82],[0,0,2.0,.66],[0,58,1.8,.60],[-35,-7,1.7,.56],[35,-7,1.8,.62]] },
        { stars:[[0,-3,3.2,.88],[18,14,1.7,.54],[24,25,1.7,.54],[-4,18,1.4,.42]] },
        { stars:[[0,0,2.5,.78],[-28,24,2.0,.66],[18,-18,1.8,.60],[-9,-28,1.7,.56],[28,20,1.8,.60]] },
        { stars:[[-48,-40,3.5,.86],[42,-44,2.8,.80],[-18,4,2.2,.70],[0,7,2.4,.74],[18,10,2.2,.70],[38,55,4.0,.88],[-29,52,2.0,.64]] },
        { stars:[[0,0,3.5,.92],[28,28,2.0,.62],[18,55,1.8,.55],[-18,55,1.9,.58],[-28,28,2.1,.65]] },
        { stars:[[-50,0,3.0,.85],[-25,15,2.2,.68],[0,10,2.0,.62],[25,-5,2.3,.70],[48,-20,2.5,.74],[60,10,1.8,.56],[55,35,1.9,.60]] },
        { stars:[[0,0,2.8,.80],[30,-20,2.4,.72],[60,-30,2.0,.63],[85,-15,2.6,.76],[100,10,1.9,.58],[-30,20,2.2,.67]] },
        { stars:[[0,-45,2.5,.74],[-35,0,2.2,.68],[-35,35,2.0,.63],[35,35,1.9,.60],[35,0,2.3,.70]] },
      ]
      const placements: [number, number][] = [
        [0.0,0.20],[0.5,0.30],[1.05,0.14],[1.6,0.26],[2.1,0.32],[2.6,0.16],[3.15,0.28],
        [3.7,0.13],[4.2,0.30],[4.75,0.21],[5.25,0.25],[5.7,0.15],[6.0,0.30],
      ]

      const Rc = 1620, SC = 1.6, yOff = 40
      CONST.forEach((c, ci) => {
        const az = placements[ci][0], elev = placements[ci][1]
        const ce = Math.cos(elev), se = Math.sin(elev)
        const dir = new T.Vector3(ce * Math.sin(az), se, ce * Math.cos(az))
        const right = new T.Vector3().crossVectors(new T.Vector3(0, 1, 0), dir).normalize()
        const lUp = new T.Vector3().crossVectors(dir, right).normalize()
        const center = dir.clone().multiplyScalar(Rc)
        const pts: THREE.Vector3[] = []
        c.stars.forEach((s) => {
          const p = center.clone()
            .add(right.clone().multiplyScalar(s[0] * SC))
            .add(lUp.clone().multiplyScalar(-s[1] * SC))
          p.y += yOff
          pts.push(p)
          const dotMat = new T.SpriteMaterial({ map: dotTex, color: new T.Color(0.85, 0.91, 1.0), transparent: true, opacity: Math.min(0.85, s[3] * 0.75), blending: T.AdditiveBlending, depthWrite: false, fog: false })
          const dot = new T.Sprite(dotMat)
          dot.position.copy(p)
          const sz = s[2] * 6.5
          dot.scale.set(sz, sz, 1)
          scene.add(dot)
        })
        if (c.lines) {
          const lpos: number[] = []
          c.lines.forEach(([a, b]) => { lpos.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z) })
          const lg = new T.BufferGeometry()
          lg.setAttribute('position', new T.Float32BufferAttribute(lpos, 3))
          scene.add(new T.LineSegments(lg, new T.LineBasicMaterial({ color: 0xbcd8ec, transparent: true, opacity: 0.42, fog: false, depthWrite: false })))
        }
      })
    }

    function buildMilkyWay(scene: THREE.Scene) {
      const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64
      const g = cv.getContext('2d')!
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.5, 'rgba(220,230,255,0.4)')
      grd.addColorStop(1, 'rgba(220,230,255,0)')
      g.fillStyle = grd; g.fillRect(0, 0, 64, 64)
      const tex = new T.CanvasTexture(cv)
      const R = 1700
      const n = new T.Vector3(0.62, 0.40, 0.68).normalize()
      const width = 0.11
      const COUNT = 2600
      const positions: number[] = []
      const colors: number[] = []
      let made = 0, guard = 0
      while (made < COUNT && guard < COUNT * 40) {
        guard++
        const az = Math.random() * Math.PI * 2
        const elev = -0.05 + Math.pow(Math.random(), 1.5) * 0.95
        const ce = Math.cos(elev)
        const dir = new T.Vector3(ce * Math.sin(az), Math.sin(elev), ce * Math.cos(az))
        const d = Math.abs(dir.dot(n))
        const w = Math.exp(-(d * d) / (width * width))
        if (Math.random() > w) continue
        positions.push(dir.x * R, dir.y * R + 40, dir.z * R)
        const b = 0.28 + Math.random() * 0.35
        colors.push(0.63 * b, 0.73 * b, 1.0 * b)
        made++
      }
      const geo = new T.BufferGeometry()
      geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3))
      geo.setAttribute('color', new T.Float32BufferAttribute(colors, 3))
      scene.add(new T.Points(geo, new T.PointsMaterial({
        map: tex, size: 6, sizeAttenuation: true, vertexColors: true,
        transparent: true, opacity: 0.9, depthWrite: false,
        blending: T.AdditiveBlending, fog: false
      })))
    }

    function init3d() {
      const stage = document.getElementById('fj-stage')
      if (!stage) return
      while (stage.firstChild) stage.removeChild(stage.firstChild)
      const W = () => stage.clientWidth, H = () => stage.clientHeight

      const renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
      renderer.localClippingEnabled = true
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W(), H())
      stage.appendChild(renderer.domElement)

      const scene = new T.Scene()
      scene.background = new T.Color('#081826')
      scene.fog = new T.Fog('#081826', 320, 1550)

      const camera = new T.PerspectiveCamera(44, W() / H(), 0.1, 3200)
      camera.updateProjectionMatrix()
      ;(window as any).__fjScene = scene
      ;(window as any).__fjCamera = camera

      scene.add(new T.HemisphereLight('#9fc4da', '#06141f', 0.72))
      const moon = new T.DirectionalLight('#cfe2f2', 0.8); moon.position.set(-40, 55, 35); scene.add(moon)
      const rim = new T.DirectionalLight('#3fded0', 0.32); rim.position.set(45, 16, -45); scene.add(rim)

      buildSky(scene)
      buildStars(scene)
      buildConstellations(scene)
      buildMilkyWay(scene)
      buildEnclosure(scene)
      buildFarRange(scene)
      buildDistantBergs(scene)

      const berg = buildIceberg()
      berg.scale.setScalar(0.9)
      berg.rotation.y = -160 * Math.PI / 180
      scene.add(berg)

      const water = new T.Mesh(
        new T.CircleGeometry(1700, 110).rotateX(-Math.PI / 2),
        new T.MeshStandardMaterial({ color: '#08202c', roughness: 0.9, metalness: 0.08, transparent: true, opacity: 0.62 })
      )
      scene.add(water)

      const gv = document.createElement('canvas'); gv.width = 256; gv.height = 256
      const gx = gv.getContext('2d')!
      const glowGr = gx.createRadialGradient(128, 128, 6, 128, 128, 128)
      glowGr.addColorStop(0, 'rgba(70,200,186,0.30)'); glowGr.addColorStop(0.5, 'rgba(40,140,140,0.10)'); glowGr.addColorStop(1, 'rgba(17,96,111,0)')
      gx.fillStyle = glowGr; gx.fillRect(0, 0, 256, 256)
      const glowMat = new T.MeshBasicMaterial({ map: new T.CanvasTexture(gv), transparent: true, blending: T.AdditiveBlending, depthWrite: false })
      const glow = new T.Mesh(new T.PlaneGeometry(70, 60).rotateX(-Math.PI / 2), glowMat)
      glow.position.set(0, 0.12, 0); scene.add(glow)

      const bitMat = new T.MeshStandardMaterial({ color: '#d8e6ec', flatShading: true, roughness: 0.85 })
      const bits: THREE.Mesh[] = []
      const bitData: [number,number,number,number][] = [
        [24,0.3,-4,1.5],[-26,0.3,8,1.2],[6,0.28,-24,1.3],[18,0.27,20,0.9],[-16,0.3,-20,1.1],
        [10,0.32,15,1.6],[-7,0.3,17,1.2],[30,0.3,-7,1.35],[27,0.28,11,1.0],[-22,0.3,-9,1.25],
        [-19,0.26,14,0.85],[-4,0.32,-22,1.45],[13,0.27,-19,1.0],[21,0.29,21,0.8],[-13,0.3,23,1.1],
        [34,0.28,3,0.9],[37,0.28,-14,1.05]
      ]
      bitData.forEach((b, i) => {
        const g = jitter(new T.IcosahedronGeometry(b[3], 0), 0.5)
        const m = new T.Mesh(g, bitMat)
        m.scale.set(1.3 + hash(i,1,4)*0.5, 0.5 + hash(i,5,2)*0.25, 1.0 + hash(i,3,6)*0.3)
        m.position.set(b[0], b[1], b[2]); m.rotation.y = i * 1.7
        m.userData = { baseY: b[1], ph: i * 0.9, amp: 0.14 + hash(i,7,1)*0.12 }
        scene.add(m); bits.push(m)
      })

      const R_ORBIT = 64, CH = 11
      let target = 0, angle = 0
      let scrollRevealed = false
      let firstFrameDone = false

      ;(window as any).__fjSet = (deg: number) => { target = deg * Math.PI / 180 }
      ;(window as any).__fjPause = (deg?: number) => {
        paused = true
        cancelAnimationFrame(raf); clearTimeout(tmo)
        if (deg != null) { target = deg * Math.PI / 180; angle = target }
        camera.position.set(Math.sin(angle) * R_ORBIT, CH, Math.cos(angle) * R_ORBIT)
        camera.lookAt(0, 5, 0)
        const deg2 = ((angle * 180 / Math.PI) % 360 + 360) % 360
        const degEl = document.getElementById('fj-deg'), needleEl = document.getElementById('fj-needle')
        if (degEl) degEl.textContent = Math.round(deg2) + '°'
        if (needleEl) needleEl.style.transform = 'rotate(' + deg2 + 'deg)'
        updateSections(deg2)
        renderer.render(scene, camera)
      }
      ;(window as any).__fjResume = () => { paused = false; schedule() }

      let dragging = false, lastX = 0
      const onDown = (e: PointerEvent) => {
        dragging = true; lastX = e.clientX; stage.style.cursor = 'grabbing'
        const dh = document.getElementById('fj-drag'); if (dh) dh.style.opacity = '0'
      }
      const onMove = (e: PointerEvent) => { if (dragging) { target -= (e.clientX - lastX) * 0.006; lastX = e.clientX } }
      const onUp = () => { dragging = false; stage.style.cursor = 'grab' }
      stage.addEventListener('pointerdown', onDown)
      window.addEventListener('pointermove', onMove as EventListener)
      window.addEventListener('pointerup', onUp)
      const onResize = () => { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()) }
      window.addEventListener('resize', onResize)

      const degEl = document.getElementById('fj-deg')
      const needle = document.getElementById('fj-needle')
      const secEls = [0, 1, 2].map((i) => document.getElementById('fj-sec-' + i))
      const secRanges: [number, number][] = [[280, 80], [95, 180], [185, 260]]
      const smoothstep = (t: number) => { t = Math.min(Math.max(t, 0), 1); return t * t * (3 - 2 * t) }
      const arcOpacity = (deg: number, start: number, end: number, margin: number) => {
        const width = ((end - start) % 360 + 360) % 360
        const p = ((deg - start) % 360 + 360) % 360
        if (p > width) return 0
        const dEdge = Math.min(p, width - p)
        return smoothstep(dEdge / margin)
      }
      const updateSections = (deg: number) => {
        for (let i = 0; i < secEls.length; i++) {
          if (!secEls[i]) continue
          const o = arcOpacity(deg, secRanges[i][0], secRanges[i][1], 22)
          secEls[i]!.style.opacity = o.toFixed(3)
          secEls[i]!.style.transform = 'translateY(' + ((1 - o) * 14).toFixed(2) + 'px)'
        }
      }

      const ssMake = () => {
        const geo = new T.BufferGeometry()
        geo.setAttribute('position', new T.Float32BufferAttribute(new Float32Array(6), 3))
        geo.setAttribute('color', new T.Float32BufferAttribute(new Float32Array(6), 3))
        const mat = new T.LineBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false })
        const line = new T.Line(geo, mat)
        line.frustumCulled = false
        line.visible = false
        scene.add(line)
        return line
      }
      const ssLines = [ssMake(), ssMake()]
      const ssState = ssLines.map((_, i) => ({
        active: false, life: 0, maxLife: 0,
        head: new T.Vector3(), vel: new T.Vector3(),
        next: performance.now() + 4000 + i * 5000 + Math.random() * 5000
      }))
      const updateShooting = (now: number) => {
        for (let i = 0; i < ssLines.length; i++) {
          const s = ssState[i], line = ssLines[i]
          if (!s.active && now >= s.next) {
            const baseAz = angle + Math.PI + (Math.random() - 0.5) * 1.4
            const elev = 0.6 + Math.random() * 0.5
            const ce = Math.cos(elev)
            const Rs = 1500
            s.head.set(Rs * ce * Math.sin(baseAz), Rs * Math.sin(elev) + 40, Rs * ce * Math.cos(baseAz))
            const dir = s.head.clone().normalize()
            const right = new T.Vector3().crossVectors(new T.Vector3(0, 1, 0), dir).normalize()
            const dn = new T.Vector3().crossVectors(dir, right).normalize()
            const a = Math.PI * (0.14 + Math.random() * 0.22)
            const sp = 34 + Math.random() * 14
            s.vel.copy(right.multiplyScalar(Math.cos(a) * sp * (Math.random() > 0.5 ? 1 : -1)))
              .add(dn.multiplyScalar(-Math.sin(a) * sp))
            s.life = 0
            s.maxLife = 22 + Math.floor(Math.random() * 14)
            s.active = true
            s.next = now + 9000 + Math.random() * 9000
            line.visible = true
          }
          if (s.active) {
            s.life++
            s.head.add(s.vel)
            const t2 = s.life / s.maxLife
            const al = Math.sin(t2 * Math.PI) * 0.9
            const tail = s.head.clone().addScaledVector(s.vel, -6)
            const pos = line.geometry.attributes.position as THREE.BufferAttribute
            pos.setXYZ(0, tail.x, tail.y, tail.z)
            pos.setXYZ(1, s.head.x, s.head.y, s.head.z)
            pos.needsUpdate = true
            const col = line.geometry.attributes.color as THREE.BufferAttribute
            col.setXYZ(0, 0, 0, 0)
            col.setXYZ(1, al, al, al)
            col.needsUpdate = true
            if (s.life >= s.maxLife) { s.active = false; line.visible = false }
          }
        }
      }

      const tick = (t: number) => {
        if (dead) return
        try {
          angle += (target - angle) * 0.07
          const scrollerDiv = document.getElementById('fj-scroller')
          let dive = 0
          if (scrollerDiv) {
            const rct = scrollerDiv.getBoundingClientRect()
            const totalS = Math.max(scrollerDiv.offsetHeight - window.innerHeight, 1)
            const rawP = Math.min(Math.max(-rct.top, 0), totalS) / totalS
            dive = rawP * rawP * (3 - 2 * rawP)
          }
          const idle = (1 - dive) * Math.sin(t * 0.0004) * 0.5
          const diveR = R_ORBIT + (92 - R_ORBIT) * dive
          const camY = CH + (-40 - CH) * dive + idle
          const aimY = camY - (11 + 3 * dive)
          camera.position.set(Math.sin(angle) * diveR, camY, Math.cos(angle) * diveR)
          camera.lookAt(0, aimY, 0)
          berg.position.y = Math.sin(t * 0.0005) * 0.4 * (1 - dive)
          const offerEl = document.getElementById('fj-offer-overlay')
          if (offerEl) {
            const op = Math.min(Math.max((dive - 0.55) / 0.3, 0), 1)
            offerEl.style.opacity = String(op)
            ;(offerEl as HTMLElement).style.pointerEvents = op > 0.05 ? 'auto' : 'none'
          }
          const copyEl = document.getElementById('fj-copy')
          if (copyEl && firstFrameDone) {
            copyEl.style.opacity = String(Math.max(0, 1 - dive * 2.5))
          }
          glowMat.opacity = 0.5 + Math.sin(t * 0.0008) * 0.16
          for (const b of bits) b.position.y = b.userData['baseY'] + Math.sin(t * 0.001 + b.userData['ph']) * b.userData['amp']
          updateShooting(t)
          const deg = ((angle * 180 / Math.PI) % 360 + 360) % 360
          if (!scrollRevealed && deg >= 238 && deg < 320) {
            scrollRevealed = true
            const sc = document.getElementById('fj-scroll')
            if (sc) sc.style.opacity = '1'
            const comp = document.getElementById('fj-compass')
            if (comp) comp.style.opacity = '0'
          }
          if (degEl) degEl.textContent = Math.round(deg) + '°'
          if (needle) needle.style.transform = 'rotate(' + deg + 'deg)'
          updateSections(deg)
          renderer.render(scene, camera)
          if (!firstFrameDone) {
            firstFrameDone = true
            const copy = document.getElementById('fj-copy')
            if (copy) copy.style.opacity = '1'
            const drag = document.getElementById('fj-drag')
            if (drag) drag.style.opacity = '1'
            const comp2 = document.getElementById('fj-compass')
            if (comp2) comp2.style.opacity = '1'
          }
        } catch (err) {}
        schedule()
      }
      const schedule = () => {
        if (paused || dead) return
        if (document.hidden) tmo = setTimeout(() => tick(performance.now()), 33)
        else raf = requestAnimationFrame(tick)
      }
      schedule()

      cleanupFn = () => {
        stage.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointermove', onMove as EventListener)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('resize', onResize)
        renderer.domElement.remove()
        renderer.dispose()
        delete (window as any).__fjSet
        delete (window as any).__fjPause
        delete (window as any).__fjResume
      }
    }

    const get = (f: string) => fetch(f).then(r => r.json()).catch(() => null)
    Promise.all([get('/mtn-front.json'), get('/mtn-sea.json'), get('/mtn-fjord.json')])
      .then(([a, b, c]) => {
        if (dead) return
        mtn = a; sea = b; fjord = c
        try { init3d() } catch (err) { console.error('FjordHeroScene init3d failed:', err) }
      })

    return () => {
      dead = true
      clearTimeout(timer)
      clearTimeout(tmo)
      cancelAnimationFrame(raf)
      if (cleanupFn) cleanupFn()
    }
  }, [])

  const t = {
    en: {
      s1h: 'We build websites that people remember', s1b: 'Custom websites for businesses that want to stand out. Designed and built from scratch — no shortcuts.',
      s2h: 'A website — and everything it needs', s2b: 'Design · Copywriting · SEO · Photo & video · Development · Maintenance. Everything in one place — from idea to launch.',
      s3h: 'Three ways to work with us', s3b: 'Starter · Business · Full Production — from a compact single-page site to website plus photo, drone and video, delivered as one package.',
    },
    da: {
      s1h: 'Vi bygger hjemmesider folk husker', s1b: 'Skræddersyede hjemmesider til virksomheder der vil skille sig ud. Designet og bygget fra nul — ingen genveje.',
      s2h: 'En hjemmeside — og alt der hører til', s2b: 'Design · Copywriting · SEO · Foto & video · Udvikling · Vedligeholdelse. Alt samlet ét sted — fra idé til lancering.',
      s3h: 'Tre måder at arbejde med os', s3b: 'Starter · Business · Full Production — fra et kompakt single-page site til hjemmeside plus foto, drone og video, leveret som ét samlet projekt.',
    }
  }

  return (
    <div
      id="fj-scroller"
      style={{
        position: 'relative',
        width: '100vw',
        height: '130vh',
        background: '#04070d',
        marginLeft: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Archivo:wght@300&display=swap');@keyframes fjNudge{0%,100%{transform:translateX(-14px)}50%{transform:translateX(14px)}}`}</style>
      <div
        id="fj-pin"
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: '#081826',
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
      <div id="fj-stage" style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'grab' }} />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '52%', zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(180deg,rgba(6,20,32,0.92) 0%,rgba(6,20,32,0.7) 32%,rgba(6,20,32,0.32) 62%,rgba(6,20,32,0) 100%)' }} />

      <div id="fj-copy" style={{ position: 'absolute', left: 0, right: 0, top: '14%', zIndex: 4, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.6s ease' }}>
        <div id="fj-sec-0" style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', padding: '0 6%', opacity: 1, willChange: 'opacity, transform' }}>
          <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 300, fontSize: 'clamp(28px,2.78vw,68px)', lineHeight: 1.05, letterSpacing: '-0.012em', color: '#f4fbff', margin: 0 }}>{t[lang].s1h}</h1>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 300, fontSize: 'clamp(1.125rem,1.15vw,1.5rem)', lineHeight: 1.6, color: 'rgba(198,224,231,0.82)', maxWidth: '540px', margin: '18px auto 0' }}>{t[lang].s1b}</p>
        </div>
        <div id="fj-sec-1" style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', padding: '0 6%', opacity: 0, willChange: 'opacity, transform' }}>
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 300, fontSize: 'clamp(28px,2.78vw,68px)', lineHeight: 1.06, letterSpacing: '-0.01em', color: '#f4fbff', margin: 0 }}>{t[lang].s2h}</h2>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 300, fontSize: 'clamp(1.125rem,1.15vw,1.5rem)', lineHeight: 1.6, color: 'rgba(198,224,231,0.82)', maxWidth: '580px', margin: '18px auto 0' }}>{t[lang].s2b}</p>
        </div>
        <div id="fj-sec-2" style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', padding: '0 6%', opacity: 0, willChange: 'opacity, transform' }}>
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 300, fontSize: 'clamp(28px,2.78vw,68px)', lineHeight: 1.06, letterSpacing: '-0.01em', color: '#f4fbff', margin: 0 }}>{t[lang].s3h}</h2>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 300, fontSize: 'clamp(1.125rem,1.15vw,1.5rem)', lineHeight: 1.6, color: 'rgba(198,224,231,0.82)', maxWidth: '560px', margin: '18px auto 0' }}>{t[lang].s3b}</p>
        </div>
      </div>

      <div
        id="fj-scroll"
        className="flex flex-col items-center gap-2"
        style={{ position: 'absolute', left: '50%', bottom: '40px', transform: 'translateX(-50%)', zIndex: 5, opacity: 0, transition: 'opacity 0.8s ease', pointerEvents: 'none' }}
      >
        <div className="w-px h-10 bg-white/50" />
        <svg
          width="12"
          height="7"
          viewBox="0 0 12 7"
          fill="none"
          aria-hidden="true"
          className="animate-bounce"
        >
          <path
            d="M1 1L6 6L11 1"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div style={{ position: 'absolute', left: '50%', bottom: '28px', transform: 'translateX(-50%)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', pointerEvents: 'none' }}>
        <div id="fj-drag" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'opacity 1s ease', opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', color: 'rgba(160,205,215,0.85)' }}>
            <span style={{ fontSize: '18px', opacity: 0.55 }}>‹</span>
            <span style={{ display: 'inline-flex', animation: 'fjNudge 2.6s ease-in-out infinite' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(180,225,232,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11V6.5a1.5 1.5 0 0 1 3 0V10" /><path d="M12 10V5.5a1.5 1.5 0 0 1 3 0V10" />
                <path d="M15 10.5V7a1.5 1.5 0 0 1 3 0v6.5a6 6 0 0 1-6 6h-1.5a5 5 0 0 1-3.6-1.5L5 15.5a1.5 1.5 0 0 1 2.2-2L9 15.2V7a1.5 1.5 0 0 1 3 0" />
              </svg>
            </span>
            <span style={{ fontSize: '18px', opacity: 0.55 }}>›</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.34em', color: 'rgba(150,195,205,0.6)', textTransform: 'uppercase' }}>Drag to rotate the iceberg</div>
        </div>
        <div id="fj-compass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'opacity 0.6s ease', opacity: 0 }}>
          <span style={{ display: 'inline-flex', width: '30px', height: '30px', border: '1px solid rgba(95,222,208,0.4)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <span id="fj-needle" style={{ display: 'block', width: '2px', height: '11px', background: '#5fded0', borderRadius: '2px', transformOrigin: '50% 100%', marginTop: '-9px' }} />
          </span>
          <span id="fj-deg" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.24em', color: 'rgba(150,200,205,0.65)', textAlign: 'center' }}>0°</span>
        </div>
      </div>
      {children}
      </div>
    </div>
  )
}
