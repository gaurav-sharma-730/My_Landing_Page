import { useEffect, useRef } from 'react'

// Liquid-like (gooey) background with animated blobs reacting to cursor
// Uses SVG filter to create the gooey merging effect
export default function GooeyBackground({ blobCount = 6 }) {
  const svgRef = useRef(null)
  const frameRef = useRef(0)
  const mouse = useRef({ x: 0.5, y: 0.5 }) // normalized 0..1
  const blobs = useRef([]) // { x, y, r, a, s }

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const resize = () => {
      const rect = svg.getBoundingClientRect()
      svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(svg)

    const onMove = (e) => {
      const rect = svg.getBoundingClientRect()
      mouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    window.addEventListener('mousemove', onMove)

    // init blobs
    const rect = svg.getBoundingClientRect()
    const minDim = Math.min(rect.width, rect.height)
    if (!blobs.current.length) {
      const arr = []
      for (let i = 0; i < blobCount; i++) {
        arr.push({
          x: Math.random(),
          y: Math.random(),
          r: (0.08 + Math.random() * 0.12) * minDim, // 8% - 20% of min dimension
          a: Math.random() * Math.PI * 2, // angle
          s: 0.2 + Math.random() * 0.6, // speed factor
          h: Math.floor((360 / blobCount) * i), // hue base
        })
      }
      blobs.current = arr
    }

    const circles = svg.querySelector('#goo-circles')
    const ensureCircles = () => {
      while (circles.childElementCount < blobs.current.length) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        c.setAttribute('fill', 'hsl(200, 100%, 60%)')
        c.style.mixBlendMode = 'screen'
        circles.appendChild(c)
      }
    }
    ensureCircles()

    const animate = (t) => {
      const rect = svg.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const minD = Math.min(w, h)
      const { x: mx, y: my } = mouse.current

      ensureCircles()

      blobs.current.forEach((b, i) => {
        // base orbit
        b.a += 0.005 * b.s
        const orbitR = 0.08 + (i % 3) * 0.03
        const ox = 0.5 + orbitR * Math.cos(b.a * (0.8 + i * 0.05))
        const oy = 0.5 + orbitR * Math.sin(b.a * (1.0 + i * 0.04))

        // blend base orbit with current position for smoothness
        b.x += (ox - b.x) * 0.04
        b.y += (oy - b.y) * 0.04

        // gentle attraction to mouse
        b.x += (mx - b.x) * 0.02
        b.y += (my - b.y) * 0.02

        const cx = b.x * w
        const cy = b.y * h
        const r = b.r * (0.9 + 0.1 * Math.sin(t * 0.001 * (1 + i)))

        const hue = (b.h + (t * 0.01)) % 360
        const el = circles.children[i]
        el.setAttribute('cx', cx.toFixed(2))
        el.setAttribute('cy', cy.toFixed(2))
        el.setAttribute('r', r.toFixed(2))
        el.setAttribute('fill', `hsla(${hue}, 85%, 60%, 0.9)`) // vibrant color
      })

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('mousemove', onMove)
      ro.disconnect()
    }
  }, [blobCount])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 -z-10 w-full h-full pointer-events-none select-none"
      style={{ isolation: 'isolate' }}
      aria-hidden
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 32 -14"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>

        {/* Background radial gradient to fully cover viewport */}
        <radialGradient id="bg-grad" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#0b0b10" />
          <stop offset="60%" stopColor="#121426" />
          <stop offset="100%" stopColor="#0a0c1a" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-grad)" />
      <g id="goo-circles" filter="url(#goo)" style={{ mixBlendMode: 'screen' }} />
    </svg>
  )
}
