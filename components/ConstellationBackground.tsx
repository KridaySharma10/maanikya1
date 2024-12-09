'use client'

import React, { useEffect, useRef } from 'react'

const ConstellationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let mouseX = 0
    let mouseY = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    class Star {
      x: number
      y: number
      size: number
      twinkleSpeed: number
      twinklePhase: number

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.twinkleSpeed = 0.05 + Math.random() * 0.05
        this.twinklePhase = Math.random() * Math.PI * 2
      }

      draw(ctx: CanvasRenderingContext2D) {
        this.twinklePhase += this.twinkleSpeed
        const brightness = (Math.sin(this.twinklePhase) + 1) / 2 * 0.5 + 0.5
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }

      moveTowards(targetX: number, targetY: number, speed: number) {
        const dx = targetX - this.x
        const dy = targetY - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > 0) {
          this.x += (dx / distance) * speed
          this.y += (dy / distance) * speed
        }
      }
    }

    const stars: Star[] = []
    for (let i = 0; i < 200; i++) {
      stars.push(new Star(canvas))
    }

    const constellations = [
      [
        { x: 0.2, y: 0.3 },
        { x: 0.25, y: 0.35 },
        { x: 0.3, y: 0.28 },
        { x: 0.35, y: 0.32 },
        { x: 0.4, y: 0.25 },
      ],
      [
        { x: 0.6, y: 0.7 },
        { x: 0.65, y: 0.68 },
        { x: 0.7, y: 0.72 },
        { x: 0.75, y: 0.69 },
      ],
      [
        { x: 0.8, y: 0.2 },
        { x: 0.85, y: 0.25 },
        { x: 0.9, y: 0.2 },
        { x: 0.87, y: 0.15 },
      ],
    ]

    const drawConstellations = (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1

      constellations.forEach(constellation => {
        ctx.beginPath()
        constellation.forEach((point, index) => {
          const x = point.x * canvas.width
          const y = point.y * canvas.height
          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.stroke()
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach(star => {
        star.draw(ctx)
        star.moveTowards(mouseX, mouseY, 0.1)
      })

      drawConstellations(ctx)

      // Interactive effect
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(stars[i].x, stars[i].y)
            ctx.lineTo(stars[j].x, stars[j].y)
            ctx.stroke()
          }
        }
      }

      // Mouse interaction
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)'
      ctx.lineWidth = 1
      stars.forEach(star => {
        const dx = mouseX - star.x
        const dy = mouseY - star.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(mouseX, mouseY)
          ctx.lineTo(star.x, star.y)
          ctx.stroke()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}

export default ConstellationBackground

