'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const T = THREE

interface BlobOpts {
  len: number; h: number; w: number; sink?: number; noise: number; taper?: number
  sx?: number; sy?: number; sz?: number; seed?: number; endTaper?: number; endNarrow?: number
  profile?: (u: number) => number
  arch?: { amp: number; u: number; spread: number; maxY: number }
}

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

function addCracks(mesh: THREE.Mesh, color: string, opacity: number, threshold?: number) {
  const edges = new T.EdgesGeometry(mesh.geometry, threshold ?? 16)
  mesh.add(new T.LineSegments(edges, new T.LineBasicMaterial({ color, transparent: true, opacity })))
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
  const armC = new T.Mesh(geoC, ice); armC.rotation.y = -0.22
  addCracksSplit(armC, '#6f9fb6', 0.3, 16, 34, -1)
  berg.add(armC)

  const shapeA = new T.Shape()
  const ptsA: [number, number][] = [[0,-2.5],[0,12.5],[5.2,12.3],[10.4,11.6],[15.6,10.2],[20.3,8.5],[23.4,5.9],[26,2.6],[26,-1.5],[23,-2.3],[19.5,-1.6],[16.9,-0.4],[14.3,2.4],[11.7,4.0],[9.1,2.4],[6.5,-0.4],[3.5,-2.0]]
  shapeA.moveTo(ptsA[0][0], ptsA[0][1])
  for (let i = 1; i < ptsA.length; i++) shapeA.lineTo(ptsA[i][0], ptsA[i][1])
  let geoA = new T.ExtrudeGeometry(shapeA, { depth: 11, steps: 5, bevelEnabled: true, bevelThickness: 1.0, bevelSize: 1.0, bevelSegments: 2, curveSegments: 4 })
  geoA.translate(0, 0, -5.5)
  roundify(geoA, { len: 26, h: 15, sink: 2.5 })
  jitter(geoA, 0.55, 12.5, 0.4)
  reliefBack(geoA, 1, 1.3)
  addColors(geoA, 15, 2.5)
  const armA = new T.Mesh(geoA, ice); armA.rotation.y = Math.PI * 0.94
  addCracksSplit(armA, '#6f9fb6', 0.28, 22, 42, 1)
  berg.add(armA)

  const geoB = makeBlob({
    len: 24, h: 22, w: 10, sink: 2.5, noise: 0.34, taper: 0.6, sx: 14, sy: 8, sz: 6, seed: 37, endTaper: 0.5, endNarrow: 0.7,
    profile: (u) => {
      const peak = 0.2 + 0.7 * Math.exp(-Math.pow(u - 0.72, 2) / 0.03)
      const shoulder = 0.32 * Math.exp(-Math.pow(u - 0.32, 2) / 0.055)
      const crust = 0.03 * Math.sin(u * 7 + 1.4)
      return Math.max(peak + shoulder + crust, 0.14)
    },
  })
  reliefBack(geoB, 1, 1.0); geoB.computeVertexNormals()
  const spike = new T.Mesh(geoB, ice); spike.rotation.y = Math.PI / 2 + 0.18
  addCracksSplit(spike, '#6f9fb6', 0.28, 15, 32, 1)
  berg.add(spike)

  const geoCore = makeBlob({ len: 21, h: 7.5, w: 17, sink: 2.5, noise: 0.5, taper: 0.5, sx: 11, sy: 6, sz: 9, seed: 71, endTaper: 0.5, profile: (u) => 0.85 + 0.06 * Math.sin(u * 6) })
  geoCore.translate(-10.5, 0, 0)
  const core = new T.Mesh(geoCore, ice); addCracks(core, '#6f9fb6', 0.3, 16); berg.add(core)

  const geoNub = makeBlob({ len: 12, h: 5.5, w: 9, sink: 2.5, noise: 0.5, taper: 0.5, sx: 8, sy: 4, sz: 5, seed: 113, profile: (u) => 0.82 + 0.1 * Math.sin(u * 6) })
  geoNub.translate(-6, 0, 8)
  const nub = new T.Mesh(geoNub, ice); addCracks(nub, '#6f9fb6', 0.3, 16); berg.add(nub)

  const keelMat = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.9, metalness: 0, transparent: false, opacity: 1, depthWrite: true, side: T.DoubleSide })
  keelMat.clippingPlanes = [new T.Plane(new T.Vector3(0, -1, 0), 0)]
  const keelGeo = (() => {
    const fp: [number, number][] = [[-26,0],[-21,-6],[-10,-9],[0,-11],[6,-19],[13,-12],[23,-9],[32,-4],[35,1],[31,6],[20,10],[7,11],[-6,10],[-17,8],[-24,4]]
    const K = fp.length, M = 12, cx = 4, cz = -2, topY = 3.0, deep = 52
    const stops: [number, [number, number, number]][] = [[0.00,[0.07,0.22,0.26]],[0.16,[0.26,0.72,0.68]],[0.42,[0.08,0.38,0.42]],[0.72,[0.04,0.15,0.21]],[1.00,[0.02,0.06,0.10]]]
    const colAt = (t: number): [number, number, number] => {
      for (let s = 0; s < stops.length - 1; s++) {
        if (t <= stops[s + 1][0]) { const k = (t - stops[s][0]) / (stops[s + 1][0] - stops[s][0]), a = stops[s][1], b = stops[s + 1][1]; return [a[0]+(b[0]-a[0])*k, a[1]+(b[1]-a[1])*k, a[2]+(b[2]-a[2])*k] }
      }
      return stops[stops.length - 1][1]
    }
    const verts: number[] = [], cols: number[] = [], idx: number[] = []
    for (let j = 0; j <= M; j++) {
      const t = j / M, rf = (1.1 - Math.pow(t, 1.25)) * Math.min(Math.max(0, (t - topY / deep) / 0.02), 1), y = topY - deep * t
      for (let k = 0; k < K; k++) {
        let px = cx + (fp[k][0] - cx) * rf, pz = cz + (fp[k][1] - cz) * rf
        const damp = 1 - t * 0.55
        px += (hash(Math.round(px * 3), j * 7, k) - 0.5) * 2.2 * damp
        pz += (hash(j * 5, k, Math.round(pz * 3)) - 0.5) * 2.2 * damp
        const noiseAmp = j === 0 ? 6.0 : 1.6
        const yy = y + (hash(k, j, 3) - 0.5) * noiseAmp
        verts.push(px, yy, pz); const c = colAt(t); cols.push(c[0], c[1], c[2])
      }
    }
    const bi = (M + 1) * K; verts.push(cx, topY - deep * 1.05, cz); { const c = colAt(1); cols.push(c[0], c[1], c[2]) }
    for (let j = 0; j < M; j++) for (let k = 0; k < K; k++) { const a = j*K+k, b = j*K+(k+1)%K, c2 = (j+1)*K+k, d = (j+1)*K+(k+1)%K; idx.push(a, c2, b, b, c2, d) }
    for (let k = 0; k < K; k++) idx.push(M * K + k, bi, M * K + (k + 1) % K)
    const g = new T.BufferGeometry()
    g.setAttribute('position', new T.Float32BufferAttribute(verts, 3))
    g.setAttribute('color', new T.Float32BufferAttribute(cols, 3))
    g.setIndex(idx); g.computeVertexNormals()
    return g
  })()
  const keel = new T.Mesh(keelGeo, keelMat); berg.add(keel)

  {
    const stops2: [number, [number, number, number]][] = [[0.00,[0.07,0.22,0.26]],[0.18,[0.22,0.62,0.60]],[0.45,[0.07,0.34,0.39]],[0.74,[0.04,0.14,0.20]],[1.00,[0.02,0.06,0.10]]]
    const colAt2 = (t: number): [number, number, number] => {
      for (let s = 0; s < stops2.length - 1; s++) if (t <= stops2[s + 1][0]) { const k = (t - stops2[s][0]) / (stops2[s + 1][0] - stops2[s][0]), a = stops2[s][1], b = stops2[s + 1][1]; return [a[0]+(b[0]-a[0])*k, a[1]+(b[1]-a[1])*k, a[2]+(b[2]-a[2])*k] }
      return stops2[stops2.length - 1][1]
    }
    const g = new T.IcosahedronGeometry(1, 3)
    const p2 = g.attributes.position as THREE.BufferAttribute
    const cols2 = new Float32Array(p2.count * 3)
    const top = 3, deep = 60, rxT = 17, rzT = 15, originX = 4, originZ = -9
    for (let i = 0; i < p2.count; i++) {
      let x = p2.getX(i), y = p2.getY(i), z = p2.getZ(i)
      const dn = (1 - y) / 2, rf = 1 - Math.pow(dn, 1.3) * 0.92
      let px = originX + x * rxT * rf, pz = originZ + z * rzT * rf, py = top - deep * dn
      px += (hash(Math.round(px*3), Math.round(py*3), Math.round(pz*3)) - 0.5) * 2.6
      py += (hash(Math.round(py*3), Math.round(pz*3), Math.round(px*3)) - 0.5) * 2.6
      pz += (hash(Math.round(pz*3), Math.round(px*3), Math.round(py*3)) - 0.5) * 2.6
      p2.setXYZ(i, px, py, pz)
      const c = colAt2(Math.min(dn, 1)); cols2[i*3]=c[0]; cols2[i*3+1]=c[1]; cols2[i*3+2]=c[2]
    }
    g.setAttribute('color', new T.BufferAttribute(cols2, 3)); g.computeVertexNormals()
    const spikeKeel = new T.Mesh(g, keelMat); berg.add(spikeKeel)
  }

  return berg
}

export default function WebOfferBg() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = mountRef.current
    if (!host) return

    let dead = false
    let raf = 0

    const R_ORBIT = 64
    const CH = 11

    const W = () => host.clientWidth
    const H = () => host.clientHeight

    const renderer = new T.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W(), H())
    renderer.setClearColor('#081826')
    renderer.localClippingEnabled = true
    host.appendChild(renderer.domElement)

    const scene = new T.Scene()
    scene.background = new T.Color('#081826')
    scene.fog = new T.FogExp2('#081826', 0.012)

    const camera = new T.PerspectiveCamera(44, W() / H(), 0.1, 3200)

    scene.add(new T.AmbientLight('#0d2433', 1.8))
    const sun = new T.DirectionalLight('#4a8fa0', 1.2)
    sun.position.set(0, 40, 10)
    scene.add(sun)
    const keelGlow = new T.PointLight('#46c8ba', 5.0, 150, 2)
    keelGlow.position.set(0, -5, 0)
    scene.add(keelGlow)
    const deepDark = new T.PointLight('#061620', 3.0, 400, 2)
    deepDark.position.set(0, -60, 0)
    scene.add(deepDark)

    const berg = buildIceberg()
    scene.add(berg)

    const water = new T.Mesh(
      new T.PlaneGeometry(1200, 1200).rotateX(-Math.PI / 2),
      new T.MeshStandardMaterial({ color: '#08202c', transparent: true, opacity: 0.68, roughness: 0.1, metalness: 0.45, side: T.DoubleSide })
    )
    water.position.y = 0
    scene.add(water)

    const tick = () => {
      if (dead) return
      const angle = (window as any).__nordBergAngle ?? 0
      camera.position.set(Math.sin(angle) * R_ORBIT, -20, Math.cos(angle) * R_ORBIT)
      camera.lookAt(0, -26, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      camera.aspect = W() / H()
      camera.updateProjectionMatrix()
      renderer.setSize(W(), H())
    }
    window.addEventListener('resize', onResize)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.domElement.remove()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
}
