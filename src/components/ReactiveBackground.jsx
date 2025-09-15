import { useEffect, useRef } from 'react'

// A lightweight reactive gradient background that animates radial blobs and responds to cursor movement
export default function ReactiveBackground({ colors = [
  '#6e00ff', '#ff00b3', '#00cfff', '#7aff6b'
] }) {
  const ref = useRef(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const start = useRef(performance.now())

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      mouse.current = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
    }

    window.addEventListener('mousemove', onMove)

    let rafId
    const animate = () => {
      const t = (performance.now() - start.current) / 1000
      const { x, y } = mouse.current

      // organic motion using sin/cos with phase offsets
      const p1x = 0.5 + 0.25 * Math.sin(t * 0.6) + 0.15 * (x - 0.5)
      const p1y = 0.5 + 0.25 * Math.cos(t * 0.5) + 0.15 * (y - 0.5)

      const p2x = 0.5 + 0.25 * Math.sin(t * 0.7 + 2.1) - 0.1 * (x - 0.5)
      const p2y = 0.5 + 0.25 * Math.cos(t * 0.8 + 1.5) - 0.1 * (y - 0.5)

      const p3x = 0.5 + 0.25 * Math.sin(t * 0.9 + 4.2) + 0.2 * (x - 0.5)
      const p3y = 0.5 + 0.25 * Math.cos(t * 1.0 + 3.3) + 0.2 * (y - 0.5)

      el.style.setProperty('--p1x', `${(p1x * 100).toFixed(2)}%`)
      el.style.setProperty('--p1y', `${(p1y * 100).toFixed(2)}%`)
      el.style.setProperty('--p2x', `${(p2x * 100).toFixed(2)}%`)
      el.style.setProperty('--p2y', `${(p2y * 100).toFixed(2)}%`)
      el.style.setProperty('--p3x', `${(p3x * 100).toFixed(2)}%`)
      el.style.setProperty('--p3y', `${(p3y * 100).toFixed(2)}%`)

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div ref={ref} className="absolute inset-0 -z-10 reactive-gradient" aria-hidden />
}
