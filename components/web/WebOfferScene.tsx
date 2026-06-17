'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WebOfferScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let dead = false
    let raf = 0
    let cleanupFn: (() => void) | null = null

    const T = THREE
    const M = THREE.MathUtils

    let tealLight: THREE.PointLight | null = null
    let stars: THREE.Points | null = null
    let water: THREE.Mesh | null = null
    let waterBase: Float32Array | null = null
    let glacierMeta: { valleyHalf: number; wallFootZ: number; zLip: number } | null = null

    // ---------- noise helpers ----------
    function hash(x: number, y: number): number {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
      return s - Math.floor(s)
    }
    function vnoise(x: number, y: number): number {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
      const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
      return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
    }
    function fbm(x: number, y: number): number {
      let s = 0, amp = 1, f = 1, n = 0
      for (let i = 0; i < 4; i++) { s += amp * vnoise(x * f, y * f); n += amp; amp *= 0.5; f *= 2 }
      return s / n
    }

    // height of the calving-front top edge as a function of x
    function wallTopAt(x: number): number {
      let h = 18
      h += (fbm(x * 0.042 + 5, 1.3) - 0.5) * 26
      h += Math.sin(x * 0.13 + fbm(x * 0.03, 3) * 4) * 4
      const notch = fbm(x * 0.085 + 12, 2.2)
      if (notch > 0.64) h -= (notch - 0.64) * 46
      return Math.max(8, h)
    }

    // z of the wall surface at a given (x, height)
    function wallFaceZ(x: number, y: number): number {
      if (!glacierMeta) return 0
      const top = wallTopAt(x)
      const frac = Math.min(1, Math.max(0, y / top))
      const tw = Math.pow(frac, 1 / 0.74)
      return glacierMeta.wallFootZ + (glacierMeta.zLip - glacierMeta.wallFootZ) * tw
    }

    function buildLights(scene: THREE.Scene) {
      scene.add(new T.AmbientLight(0x274a59, 1.45))
      scene.add(new T.HemisphereLight(0x4a7a8a, 0x0c2028, 1.5))
      const moon = new T.DirectionalLight(0xe6f3ff, 1.9)
      moon.position.set(-34, 60, 30); scene.add(moon)
      const fill = new T.DirectionalLight(0xbcd6e8, 1.0)
      fill.position.set(40, 44, 24); scene.add(fill)
      const teal = new T.PointLight(0x3fc2b4, 6.0, 220, 2)
      teal.position.set(0, 2, 14); scene.add(teal); tealLight = teal
      const teal2 = new T.PointLight(0x29928a, 3.2, 150, 2)
      teal2.position.set(-22, 1.5, -6); scene.add(teal2)
      const teal3 = new T.PointLight(0x29928a, 2.8, 150, 2)
      teal3.position.set(22, 1.5, -6); scene.add(teal3)
    }

    function buildSky(scene: THREE.Scene) {
      const cv = document.createElement('canvas'); cv.width = 16; cv.height = 320
      const cx = cv.getContext('2d')!
      const grd = cx.createLinearGradient(0, 0, 0, 320)
      grd.addColorStop(0, '#0a1a28')
      grd.addColorStop(0.34, '#0e2533')
      grd.addColorStop(0.5, '#1b4452')
      grd.addColorStop(0.58, '#2d6478')
      grd.addColorStop(0.66, '#1d4858')
      grd.addColorStop(1, '#0c2a34')
      cx.fillStyle = grd; cx.fillRect(0, 0, 16, 320)
      const bg = new T.CanvasTexture(cv)
      ;(bg as any).encoding = (THREE as any).sRGBEncoding
      scene.background = bg
      const N = 1300, pos = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const r = 380 + Math.random() * 320, th = Math.random() * Math.PI * 2
        pos[i * 3] = Math.cos(th) * r
        pos[i * 3 + 1] = 110 + Math.random() * 300
        pos[i * 3 + 2] = -220 - Math.random() * 420
      }
      const g = new T.BufferGeometry()
      g.setAttribute('position', new T.BufferAttribute(pos, 3))
      const m = new T.PointsMaterial({ color: 0xdcecff, size: 1.4, sizeAttenuation: true, transparent: true, opacity: 0.7 })
      stars = new T.Points(g, m)
      scene.add(stars)
    }

    function buildInlandIce(scene: THREE.Scene) {
      // distant snowy inland ice cap continuing over the saddle, behind the glacier crest
      const cols = 110, rows = 16, stride = cols + 1, verts: number[] = []
      const zR = -298, spanX = 540
      for (let i = 0; i <= rows; i++) {
        const t = i / rows
        for (let j = 0; j <= cols; j++) {
          const u = j / cols
          const x = (u - 0.5) * spanX
          const swell = fbm(u * 5 + 2, t * 3 + 1) * 26 + fbm(u * 13, t * 6) * 10
          const dip = Math.pow(Math.abs(u - 0.5) * 2, 1.6) * 6
          const y = 74 + swell - dip + t * 10
          verts.push(x, y, zR - t * 150 + (vnoise(u * 8, t * 4) - 0.5) * 24)
        }
      }
      const idx: number[] = []
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
        const a = i * stride + j, b = a + 1, c = a + stride, d = c + 1
        idx.push(a, c, b, b, c, d)
      }
      let geo = new T.BufferGeometry()
      geo.setAttribute('position', new T.Float32BufferAttribute(verts, 3))
      geo.setIndex(idx)
      geo = geo.toNonIndexed()
      geo.computeVertexNormals()
      const p = geo.attributes.position as THREE.BufferAttribute
      const nrm = geo.attributes.normal as THREE.BufferAttribute
      const tc = p.count / 3
      const col = new Float32Array(p.count * 3)
      const cSnow = new T.Color(0xe6f3f2), cBlue = new T.Color(0x9fcdd2), tmp = new T.Color()
      for (let t = 0; t < tc; t++) {
        const a = 3 * t; const up = M.clamp(nrm.getY(a), 0, 1)
        tmp.copy(cBlue).lerp(cSnow, Math.pow(up, 0.5))
        for (let k = 0; k < 3; k++) { col[(a + k) * 3] = tmp.r; col[(a + k) * 3 + 1] = tmp.g; col[(a + k) * 3 + 2] = tmp.b }
      }
      geo.setAttribute('color', new T.BufferAttribute(col, 3))
      const mat = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.7, metalness: 0.0 })
      scene.add(new T.Mesh(geo, mat))
    }

    function buildGlacier(scene: THREE.Scene) {
      const cols = 200, rows = 150, stride = cols + 1, verts: number[] = []
      const valleyHalf = 66, wallFootZ = -34, zLip = -46, zBack = -500, wallRows = 30
      glacierMeta = { valleyHalf, wallFootZ, zLip }
      // random large vertical cracks running down the wall (mix of dark recesses + teal-glowing fissures)
      let seed = 7
      const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
      interface Crack { x: number; w: number; depth: number; glow: boolean; wander: number; wfreq: number; phase: number }
      const cracks: Crack[] = []
      const nCracks = 9
      for (let k = 0; k < nCracks; k++) {
        cracks.push({
          x: (rnd() - 0.5) * 2 * valleyHalf * 0.92,
          w: 2.4 + rnd() * 5.5,
          depth: 5 + rnd() * 8,
          glow: rnd() < 0.42,
          wander: 1.5 + rnd() * 5,
          wfreq: 0.04 + rnd() * 0.13,
          phase: rnd() * 6.28
        })
      }
      const crackAt = (x: number, y: number) => {
        let g = 0, glow = 0, dark = 0, depth = 0
        for (const c of cracks) {
          const cx = c.x + Math.sin(y * c.wfreq + c.phase) * c.wander
          const dd = Math.abs(x - cx) / c.w
          if (dd < 1) { const f = Math.pow(1 - dd, 1.7); if (f > g) { g = f; depth = c.depth } if (c.glow) glow = Math.max(glow, f); else dark = Math.max(dark, f) }
        }
        return { g, glow, dark, depth }
      }
      for (let i = 0; i <= rows; i++) {
        let z, region, tw = 0, tb = 0
        if (i <= wallRows) {
          tw = i / wallRows
          z = M.lerp(wallFootZ, zLip, tw)
          region = 0
        } else {
          tb = (i - wallRows) / (rows - wallRows)
          z = M.lerp(zLip, zBack, tb)
          region = 1
        }
        const zr = -z
        for (let j = 0; j <= cols; j++) {
          const u = j / cols
          const x = (u - 0.5) * 2 * valleyHalf
          const edge = Math.abs(u - 0.5) * 2
          const top = wallTopAt(x)
          let y, zz = z
          if (region === 0) {
            y = top * Math.pow(tw, 0.74)
            const roughMask = M.smoothstep(fbm(x * 0.055 + 20, zr * 0.05), 0.42, 0.72)
            y += (fbm(x * 0.13 + 4, zr * 0.11) - 0.5) * (1.1 + roughMask * 4.2) * tw
            zz += (fbm(x * 0.05 + 2, zr * 0.05) - 0.5) * 7 * Math.pow(tw, 0.6)
            const cr = crackAt(x, y)
            zz -= cr.g * cr.depth * (0.35 + 0.65 * tw)
            if (tw < 0.06) y = M.lerp(0.5, y, tw / 0.06)
          } else {
            const climb = Math.pow(tb, 0.95) * (40 + fbm(x * 0.05, 9) * 24)
            y = top + climb - tb * 2
            y += (fbm(x * 0.09 + 9, zr * 0.05) - 0.5) * (4 + tb * 12)
            y += edge * edge * 8 * tb
          }
          verts.push(x, y, zz)
        }
      }
      const idx: number[] = []
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
        const a = i * stride + j, b = a + 1, c = a + stride, d = c + 1
        idx.push(a, c, b, b, c, d)
      }
      let geo = new T.BufferGeometry()
      geo.setAttribute('position', new T.Float32BufferAttribute(verts, 3))
      geo.setIndex(idx)
      geo = geo.toNonIndexed()
      geo.computeVertexNormals()
      const p = geo.attributes.position as THREE.BufferAttribute
      const nrm = geo.attributes.normal as THREE.BufferAttribute
      const tc = p.count / 3
      const col = new Float32Array(p.count * 3)
      const cIce = new T.Color(0xdfeef1), cMid = new T.Color(0x9fcfd2), cDeep = new T.Color(0x4e9aa0), cShadow = new T.Color(0x0d2c33), cGlow = new T.Color(0x57e3d2), cTeal = new T.Color(0x2c7570)
      const tmp = new T.Color()
      for (let t = 0; t < tc; t++) {
        const a = 3 * t
        const ny = nrm.getY(a), nz = nrm.getZ(a)
        const yc = (p.getY(a) + p.getY(a + 1) + p.getY(a + 2)) / 3
        const xc = (p.getX(a) + p.getX(a + 1) + p.getX(a + 2)) / 3
        const up = M.clamp(ny, 0, 1)
        tmp.copy(cDeep).lerp(cMid, Math.pow(up, 0.6)).lerp(cIce, up * up * 0.9)
        if (nz > 0.22) tmp.lerp(cIce, (nz - 0.22) * 0.7)
        const sideways = (1 - up)
        if (sideways > 0.5) tmp.lerp(cShadow, (sideways - 0.5) * 0.9)
        const cr = crackAt(xc, yc)
        if (cr.dark > 0.15) tmp.lerp(cShadow, (cr.dark - 0.15) * 1.15)
        if (cr.glow > 0.2) tmp.lerp(cGlow, (cr.glow - 0.2) * 0.66)
        if (yc < 6) tmp.lerp(cTeal, M.clamp((6 - yc) / 9, 0, 0.55))
        for (let k = 0; k < 3; k++) { col[(a + k) * 3] = tmp.r; col[(a + k) * 3 + 1] = tmp.g; col[(a + k) * 3 + 2] = tmp.b }
      }
      geo.setAttribute('color', new T.BufferAttribute(col, 3))
      const mat = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.48, metalness: 0.0, emissive: 0x123f3b, emissiveIntensity: 0.13, side: T.DoubleSide })
      scene.add(new T.Mesh(geo, mat))
    }

    function buildSideMountains(scene: THREE.Scene) {
      const build = (side: number) => {
        const rows = 64, cols = 34, stride = cols + 1, verts: number[] = []
        for (let i = 0; i <= rows; i++) {
          const t = i / rows
          const z = M.lerp(28, -300, t)
          const valleyEdge = M.lerp(54, 78, Math.pow(t, 0.5))
          const span = M.lerp(90, 150, t)
          for (let j = 0; j <= cols; j++) {
            const u = j / cols
            let h = Math.pow(u, 0.92) * 116
            h += fbm(u * 2.4 + side * 9, t * 4.2) * 46
            h += fbm(u * 6 + side, t * 9) * 16
            h *= (0.3 + 0.7 * Math.pow(u, 0.4))
            h += t * 26
            const x = side * (valleyEdge + u * span) + (vnoise(u * 4 + side, t * 6) - 0.5) * 12
            verts.push(x, h - 4, z)
          }
        }
        const idx: number[] = []
        for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
          const a = i * stride + j, b = a + 1, c = a + stride, d = c + 1
          idx.push(a, c, b, b, c, d)
        }
        let geo = new T.BufferGeometry()
        geo.setAttribute('position', new T.Float32BufferAttribute(verts, 3))
        geo.setIndex(idx)
        geo = geo.toNonIndexed()
        geo.computeVertexNormals()
        const p = geo.attributes.position as THREE.BufferAttribute
        const nrm = geo.attributes.normal as THREE.BufferAttribute
        const tc = p.count / 3
        const col = new Float32Array(p.count * 3)
        const cRock = new T.Color(0x0c151b), cRock2 = new T.Color(0x1c2e38), cSnow = new T.Color(0x9fb4bb), cBase = new T.Color(0x070f14)
        const tmp = new T.Color()
        for (let t2 = 0; t2 < tc; t2++) {
          const a = 3 * t2
          const ny = nrm.getY(a), yc = (p.getY(a) + p.getY(a + 1) + p.getY(a + 2)) / 3
          const up = M.clamp(ny, 0, 1)
          tmp.copy(cRock).lerp(cRock2, up * 0.6)
          const snow = M.smoothstep(yc, 64, 104) * M.smoothstep(up, 0.66, 0.98)
          tmp.lerp(cSnow, snow * 0.55)
          if (yc < 5) tmp.lerp(cBase, M.clamp((5 - yc) / 9, 0, 0.8))
          for (let k = 0; k < 3; k++) { col[(a + k) * 3] = tmp.r; col[(a + k) * 3 + 1] = tmp.g; col[(a + k) * 3 + 2] = tmp.b }
        }
        geo.setAttribute('color', new T.BufferAttribute(col, 3))
        const mat = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1.0, metalness: 0.0, side: T.DoubleSide })
        scene.add(new T.Mesh(geo, mat))
      }
      build(-1); build(1)
    }

    function buildWater(scene: THREE.Scene) {
      const geo = new T.PlaneGeometry(700, 700, 48, 48)
      geo.rotateX(-Math.PI / 2)
      const mat = new T.MeshStandardMaterial({ color: 0x123f48, roughness: 0.24, metalness: 0.62, transparent: true, opacity: 1.0 })
      const w = new T.Mesh(geo, mat)
      w.position.y = 0; scene.add(w); water = w
      waterBase = (geo.attributes.position.array as Float32Array).slice()
    }

    function updateScene(dt: number, t: number) {
      if (water && waterBase) {
        const p = water.geometry.attributes.position as THREE.BufferAttribute, b = waterBase
        for (let i = 0; i < p.count; i++) {
          const x = b[i * 3], z = b[i * 3 + 2]
          const y = Math.sin(x * 0.12 + t * 0.9) * 0.18 + Math.sin(z * 0.18 + t * 1.3) * 0.14 + Math.sin((x + z) * 0.07 + t * 0.6) * 0.22
          p.setY(i, y)
        }
        p.needsUpdate = true
        water.geometry.computeVertexNormals()
      }
      if (tealLight) tealLight.intensity = 2.7 + Math.sin(t * 1.7) * 0.4
      if (stars) { stars.rotation.y = t * 0.006; (stars.material as THREE.PointsMaterial).opacity = 0.62 + Math.sin(t * 0.5) * 0.1 }
    }

    function init3d() {
      const host = mountRef.current
      if (!host) return
      while (host.firstChild) host.removeChild(host.firstChild)
      const w = host.clientWidth || window.innerWidth
      const h = host.clientHeight || window.innerHeight

      const renderer = new T.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h)
      renderer.setClearColor(0x0a1c28, 1)
      host.appendChild(renderer.domElement)

      const scene = new T.Scene()
      scene.fog = new T.FogExp2(0x3a7280, 0.0023)

      const camera = new T.PerspectiveCamera(60, w / h, 0.1, 1600)
      camera.position.set(0, 16, 40)
      camera.lookAt(0, 9, -95)

      buildLights(scene)
      buildSky(scene)
      buildInlandIce(scene)
      buildGlacier(scene)
      buildSideMountains(scene)
      buildWater(scene)

      const onResize = () => {
        const W = host.clientWidth, H = host.clientHeight
        renderer.setSize(W, H)
        camera.aspect = W / H
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      const clock = new T.Clock()
      let t = 0
      const tick = () => {
        if (dead) return
        raf = requestAnimationFrame(tick)
        const dt = Math.min(clock.getDelta(), 0.05)
        t += dt
        updateScene(dt, t)
        renderer.render(scene, camera)
      }
      tick()

      cleanupFn = () => {
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    init3d()

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      if (cleanupFn) cleanupFn()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
