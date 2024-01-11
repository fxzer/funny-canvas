<script setup lang='ts'>
import colors from '@/contants/colors'

const { canvasRef, context, width, height } = useCanvas({ init, animate })
const r1 = 380
const r2 = 190
const r3 = 180
interface Point {
  x: number
  y: number
}
const points: Point[] = []
const particles: Particle[] = []

class Particle {
  x: number
  y: number
  r: number
  d: number
  vx: number
  vy: number
  ttl: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.r = Math.random()
    this.d = Math.random()
    this.vx = this.r * Math.cos(this.d * Math.PI * 2)
    this.vy = this.r * Math.sin(this.d * Math.PI * 2)
    this.ttl = Math.random() * 100 | 100
  }

  update() {
    this.x += this.vx * 2
    this.y += this.vy * 2
    this.vy += 0.05
    this.ttl--
  }

  draw() {
    if (!context.value)
      return
    const color = colors[Math.floor(Math.random() * colors.length)]
    renderPoint(this.x, this.y, 1, color)
  }
}

let index = 0
function animate() {
  if (!context.value)
    return
  context.value.clearRect(0, 0, width.value, height.value)
  context.value.fillStyle = 'black'
  context.value.fillRect(0, 0, width.value, height.value)
  const p = points[index]

  renderPoint(p.x, p.y, 3, 'white')

  particles.push(new Particle(p.x, p.y))
  particles.forEach((p, i) => {
    p.update()
    p.draw()
    if (p.ttl < 0)
      particles.splice(i, 1)
  })

  for (let i = 0; i < 500; i++) {
    const p = points[(i + index) % points.length]
    renderPoint(p.x, p.y, 1, `rgba(255,255,255,${1 - i / 500})`)
  }
  index++
  index = index % points.length
}

function renderPoint(x: number, y: number, r: number, color: string) {
  if (!context.value)
    return
  context.value.beginPath()
  context.value.arc(x, y, r, 0, Math.PI * 2, false)
  context.value.fillStyle = color
  context.value.fill()
}
function init() {
  for (let t = 0; t < 360; t += 0.4) {
    const dx = (r1 - r2) * Math.cos(t * Math.PI / 180) + width.value / 2
    const dy = (r1 - r2) * Math.sin(t * Math.PI / 180) + height.value / 2
    const t0 = -t * Math.PI / 180 * r1 / r2
    const x = r3 * Math.cos(t0) + dx
    const y = r3 * Math.sin(t0) + dy
    points.push({ x, y })
  }
}
</script>

<template>
  <canvas ref="canvasRef" />
</template>
