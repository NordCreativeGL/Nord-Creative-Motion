'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function KeelScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let dead = false
    let raf = 0
    const T = THREE
    const W = () => mount.clientWidth
    const H = () => mount.clientHeight

    function hash(x: number, y: number, z: number): number {
      const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
      return s - Math.floor(s)
    }

    const renderer = new T.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W(), H())
    mount.appendChild(renderer.domElement)

    const scene = new T.Scene()
    scene.background = new T.Color('#04070d')
    scene.fog = new T.Fog('#04070d', 50, 200)

    const camera = new T.PerspectiveCamera(38, W() / H(), 0.1, 500)
    camera.position.set(45, -20, 60)
    camera.lookAt(5, -30, -2)

    scene.add(new T.HemisphereLight('#dff2f8', '#0a2230', 0.85))
    const key = new T.DirectionalLight('#fff3e2', 1.0)
    key.position.set(50, 60, 30)
    scene.add(key)
    const rim = new T.DirectionalLight('#3fded0', 0.4)
    rim.position.set(-45, 18, -40)
    scene.add(rim)

    const keelMat = new T.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.9,
      metalness: 0,
      depthWrite: true,
      side: T.DoubleSide,
    })

    const keelStops: [number, [number, number, number]][] = [
      [0.00, [0.10, 0.30, 0.34]],
      [0.16, [0.26, 0.72, 0.68]],
      [0.44, [0.08, 0.36, 0.41]],
      [0.72, [0.04, 0.15, 0.21]],
      [1.00, [0.02, 0.06, 0.10]],
    ]
    const keelCol = (t: number): [number, number, number] => {
      for (let s = 0; s < keelStops.length - 1; s++) {
        if (t <= keelStops[s + 1][0]) {
          const k = (t - keelStops[s][0]) / (keelStops[s + 1][0] - keelStops[s][0])
          const a = keelStops[s][1]
          const b = keelStops[s + 1][1]
          return [
            a[0] + (b[0] - a[0]) * k,
            a[1] + (b[1] - a[1]) * k,
            a[2] + (b[2] - a[2]) * k,
          ]
        }
      }
      return keelStops[keelStops.length - 1][1]
    }

    const g = new T.IcosahedronGeometry(1, 3)
    const p2 = g.attributes.position as THREE.BufferAttribute
    const cols2 = new Float32Array(p2.count * 3)
    const kcx = 5, kcz = -2, rx = 26, rz = 15
    const equatorY = 2.6, domeH = 5, keelDepth = 79

    for (let i = 0; i < p2.count; i++) {
      let x = p2.getX(i), y = p2.getY(i), z = p2.getZ(i)
      const dn = (1 - y) / 2
      const ang = Math.atan2(z, x)
      const block = hash(Math.round(x * 5), Math.round(z * 5), Math.round(y * 5)) > 0.66
        ? 0.16 + 0.2 * hash(Math.round(y * 6), Math.round(x * 6), 4)
        : 0
      const lb =
        1 +
        0.2 * (
          Math.sin(ang * 3 + dn * 4) +
          0.55 * Math.sin(ang * 5 - dn * 3) +
          0.35 * Math.sin(ang * 8 + dn * 7)
        ) +
        (hash(Math.round(x * 4), Math.round(z * 4), Math.round(y * 4)) - 0.5) * 0.22 +
        block
      let px = kcx + x * rx * lb
      let pz = kcz + z * rz * lb
      const reach = Math.max(1 - dn * 3.2, 0)
      px = kcx + (px - kcx) * (1 + 0.55 * reach)
      pz = kcz + (pz - kcz) * (1 + 0.32 * reach)
      let py = y >= 0 ? equatorY + y * domeH : equatorY + y * keelDepth
      const noiseAmp = 2.8 + dn * 2.6
      const nkx = Math.round(px * 3)
      const nky = Math.round(py * 3)
      const nkz = Math.round(pz * 3)
      px += (hash(nkx, nky, nkz) - 0.5) * noiseAmp
      py += (hash(nky, nkz, nkx) - 0.5) * noiseAmp
      pz += (hash(nkz, nkx, nky) - 0.5) * noiseAmp
      p2.setXYZ(i, px, py, pz)
      const c = keelCol(Math.min(dn, 1))
      cols2[i * 3] = c[0]
      cols2[i * 3 + 1] = c[1]
      cols2[i * 3 + 2] = c[2]
    }
    g.setAttribute('color', new T.BufferAttribute(cols2, 3))
    g.computeVertexNormals()
    const keel = new T.Mesh(g, keelMat)
    scene.add(keel)

    const cv = document.createElement('canvas')
    cv.width = 256
    cv.height = 256
    const ctx2d = cv.getContext('2d')!
    const grad = ctx2d.createRadialGradient(128, 128, 8, 128, 128, 128)
    grad.addColorStop(0, 'rgba(80,210,196,0.25)')
    grad.addColorStop(0.5, 'rgba(40,150,150,0.10)')
    grad.addColorStop(1, 'rgba(17,96,111,0)')
    ctx2d.fillStyle = grad
    ctx2d.fillRect(0, 0, 256, 256)
    const glow = new T.Mesh(
      new T.PlaneGeometry(40, 20).rotateX(-Math.PI / 2),
      new T.MeshBasicMaterial({
        map: new T.CanvasTexture(cv),
        transparent: true,
        blending: T.AdditiveBlending,
        depthWrite: false,
      })
    )
    glow.position.set(5, 2, -2)
    scene.add(glow)

    const onResize = () => {
      camera.aspect = W() / H()
      camera.updateProjectionMatrix()
      renderer.setSize(W(), H())
    }
    window.addEventListener('resize', onResize)

    let t0 = 0
    const tick = (t: number) => {
      if (dead) return
      if (!t0) t0 = t
      const dt = t - t0
      camera.position.x = 45 + Math.sin(dt * 0.0003) * 3
      camera.position.y = -20 + Math.sin(dt * 0.0004) * 1.5
      camera.lookAt(5, -30, -2)
      ;(glow.material as THREE.MeshBasicMaterial).opacity =
        0.5 + Math.sin(dt * 0.0008) * 0.15
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  )
}
