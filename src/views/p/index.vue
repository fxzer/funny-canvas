<script setup lang='ts'>
import colors from '@/contants/colors'

const { canvasRef, context, width, height } = useCanvas({ init, animate })
let particles: Particle[] = []

function randomIntFromRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors: string[]) {
  return colors[Math.floor(Math.random() * colors.length)]
}

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}

addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

class Particle {
  x: number
  y: number
  radius: number // 小球半径
  color: string
  radians = Math.random() * Math.PI * 2 // 小球的初始角度
  velocity: number // 小球的流度
  distanceFromCenter: number // 小球距离中心的距离
  lastMouse: { x: number, y: number }
  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = 0.03
    this.distanceFromCenter = randomIntFromRange(50, 160)
    this.lastMouse = { x, y }
  }

  draw(lastPoint: { x: number, y: number }) {
    if (context.value) {
      context.value.beginPath()
      context.value.strokeStyle = this.color
      context.value.lineWidth = this.radius
      context.value.moveTo(lastPoint.x, lastPoint.y)
      context.value.lineTo(this.x, this.y)
      context.value.stroke()
      context.value.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      context.value.fillStyle = this.color
      context.value.fill()
      context.value.closePath()
    }
  }

  update() {
    const lastPoint = { x: this.x, y: this.y }
    // 粒子旋转
    this.radians += this.velocity
    this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter
    this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter

    // 拖尾效果
    this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.06
    this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.06
    this.draw(lastPoint)
  }
}

function init() {
  particles = []
  for (let i = 0; i < 40; i++) {
    const radius = randomIntFromRange(3, 6)
    particles.push(new Particle(width.value / 2, height.value / 2, radius, randomColor(colors)))
  }
}
const isDark = useDark()
function animate() {
  if (context.value) {
    context.value.fillStyle = isDark.value ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.05)'
    context.value.fillRect(0, 0, width.value, height.value)
  }
  particles.forEach((particle) => {
    particle.update()
  })
}
</script>

<template>
  <canvas ref="canvasRef" class="backdrop-blur" />
</template>

<style scoped lang='scss'>

</style>
