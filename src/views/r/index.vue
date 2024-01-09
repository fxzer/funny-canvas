<script setup lang='ts'>
import colors from '@/contants/colors'

const { canvasRef, context, width, height } = useCanvas()
let particles: Particle[] = []

function randomColor(colors: string[]) {
  return colors[Math.floor(Math.random() * colors.length)]
}

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}

addEventListener('click', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

interface Point {
  x: number
  y: number
}
class Particle {
  x: number
  y: number
  radius: number // 小球半径
  color: string
  radians = Math.random() * Math.PI * 2 // 小球的初始角度
  velocity: Point
  ttl: number // 粒子存活时间
  constructor(x: number, y: number, radius: number, color: string, velocity: Point) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.ttl = 2000
  }

  draw() {
    if (context.value) {
      context.value.beginPath()
      context.value.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      context.value.fillStyle = this.color
      context.value.fill()
      context.value.closePath()
    }
  }

  update() {
    this.ttl--
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.draw()
  }
}

function init() {
  particles = []
  generateParticles()
}
let rafId = 0
const isDark = useDark()
function animate() {
  rafId = requestAnimationFrame(animate)
  if (context.value) {
    context.value.clearRect(0, 0, width.value, height.value)
    context.value.fillStyle = isDark.value ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.05)'
    context.value.fillRect(0, 0, width.value, height.value)
  }
  particles.forEach((particle, index) => {
    if (particle.ttl <= 0)
      particles.splice(index, 1)
    else
      particle.update()
  })
}
watchEffect(() => {
  cancelAnimationFrame(rafId)
  animate()
})

// 生成粒子
function generateParticles(count = 30) {
  const color = randomColor(colors)
  const radian = (Math.PI * 2) / count
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(mouse.x, mouse.y, 4, color, {
      x: Math.cos(radian * i),
      y: Math.sin(radian * i),
    }))
  }
}

function onClick() {
  setTimeout(generateParticles, 50)
}
init()
animate()
</script>

<template>
  <canvas ref="canvasRef" class="backdrop-blur" @click="onClick" />
</template>

<style scoped lang='scss'>

</style>
