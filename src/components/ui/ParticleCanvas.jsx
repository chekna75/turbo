import { useEffect, useRef } from 'react'

const PARTICLE_COUNT_DESKTOP = 80
const PARTICLE_COUNT_MOBILE  = 40
const CONNECTION_DIST        = 130
const GOLD = '212, 151, 26'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let rafId
    let particles = []

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const parent = canvas.parentElement
      const { width, height } = parent.getBoundingClientRect()
      canvas.width  = width  * dpr
      canvas.height = height * dpr
      canvas.style.width  = width  + 'px'
      canvas.style.height = height + 'px'
      ctx.scale(dpr, dpr)

      const count = width < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.2,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
      }))
    }

    const draw = () => {
      const W = canvas.width  / dpr
      const H = canvas.height / dpr
      ctx.clearRect(0, 0, W, H)

      // Update & draw particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        // Oscillate opacity
        p.opacity += p.opacityDir * 0.004
        if (p.opacity >= 0.75) p.opacityDir = -1
        if (p.opacity <= 0.15) p.opacityDir =  1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${GOLD}, ${p.opacity})`
        ctx.fill()
      }

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.18
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${GOLD}, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const observer = new ResizeObserver(resize)
    observer.observe(canvas.parentElement)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 3 }}
    />
  )
}
