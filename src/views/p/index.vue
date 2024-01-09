<script setup lang='ts'>
const { canvasRef, context, width, height } = useCanvas()
let particles: Particle[] = []
const colors = [
  '#4ad1b4',
  '#4bd1bd',
  '#4cd1c6',
  '#4dd1cf',
  '#4ed1d7',
  '#4fd1e0',
  '#50d0e8',
  '#51d0f0',
  '#52cff7',
  '#53cfff',
  '#55ceff',
  '#56cdff',
  '#57ccff',
  '#58caff',
  '#58c9ff',
  '#59c7ff',
  '#5ac5ff',
  '#5ac3ff',
  '#5bc1ff',
  '#5bbfff',
  '#5bbcff',
  '#5bb9ff',
  '#69b6ff',
  '#7eb3ff',
  '#8fb0ff',
  '#9fadff',
  '#aea9ff',
  '#bca6ff',
  '#c8a2ff',
  '#d39eff',
  '#de9bff',
  '#e897ff',
  '#f194fa',
  '#f991f2',
  '#ff8deb',
  '#ff8be3',
  '#ff88db',
  '#ff86d2',
  '#ff84ca',
  '#ff83c1',
  '#ff82b8',
  '#ff82af',
  '#ff82a7',
  '#ff839e',
  '#ff8496',
  '#ff868d',
  '#ff8885',
  '#ff8a7d',
  '#ff8d76',
  '#ff8f6e',
  '#ff9367',
  '#ff9661',
  '#ff995a',
  '#ff9c54',
  '#fea04f',
  '#f8a34a',
  '#f2a646',
  '#ebaa42',
  '#e4ad3f',
  '#ddb03d',
  '#d5b33c',
  '#cdb63c',
  '#c5b83d',
  '#bdbb3e',
  '#b4bd41',
  '#abc045',
  '#a2c249',
  '#98c44e',
  '#8ec654',
  '#84c75a',
  '#79c961',
  '#6dca68',
  '#60cc70',
  '#51cd77',
  '#48ce80',
  '#48cf88',
  '#49cf91',
  '#49d099',
  '#49d0a2',
  '#4ad1ab',
  '#4ad1b4',
]
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
    this.velocity = 0.06
    this.distanceFromCenter = randomIntFromRange(50, 120)
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
  for (let i = 0; i < 10; i++) {
    const radius = randomIntFromRange(3, 6)
    particles.push(new Particle(width.value / 2, height.value / 2, radius, randomColor(colors)))
  }
}
let rafId = 0
const isDark = useDark()
function animate() {
  rafId = requestAnimationFrame(animate)
  if (context.value) {
    context.value.fillStyle = isDark.value ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.05)'
    context.value.fillRect(0, 0, width.value, height.value)
  }
  particles.forEach((particle) => {
    particle.update()
  })
}
watchEffect(() => {
  cancelAnimationFrame(rafId)
  animate()
})

init()
animate()
</script>

<template>
  <canvas ref="canvasRef" class="backdrop-blur" />
</template>

<style scoped lang='scss'>

</style>
