<script lang="ts" setup>
import colors from '@/contants/colors'

const isDark = useDark()
const { canvasRef, context, width, height } = useCanvas({ animate })
const { x, y } = useMouseInElement(canvasRef)
const mouseRadius = 200
let rindex = 0
let particles: Particle[] = []
/* 自定义例子颜色，数量，密度 */
class Particle { // 粒子
  x: number
  y: number
  size: number
  baseX: number
  baseY: number
  density: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.size = 4 // 粒子大小
    this.baseX = this.x // 粒子初始位置
    this.baseY = this.y // 粒子初始位置
    this.density = (Math.random() * 20) + 1 // 粒子密度
  }

  draw() {
    context.value?.beginPath()
    if (rindex < 180)
      context.value!.fillStyle = 'green'
    else
      context.value!.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    context.value?.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.value?.closePath()
    context.value?.fill()
  }

  update() {
    const dx = x.value - this.x
    const dy = y.value - this.y
    const distance = Math.sqrt(dx * dx + dy * dy) // 粒子与鼠标的距离

    // 计算力度
    const forceDirectionX = dx / distance
    const forceDirectionY = dy / distance

    const maxDistance = mouseRadius
    const force = (maxDistance - distance) / maxDistance
    const directionX = forceDirectionX * force * this.density
    const directionY = forceDirectionY * force * this.density
    if (distance < mouseRadius) { // 在鼠标半径范围内的粒子
      this.x -= directionX
      this.y -= directionY
    }
    else { // 不在鼠标半径范围内的粒子
      const speed = 20 // 粒子回到初始位置的速度越大越慢
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX
        this.x -= dx / speed
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY
        this.y -= dy / speed
      }
    }
  }
}
function fillText() {
  /* 文字粒子 */
  particles = []
  const fontSize = 40
  const text = '彩云'
  context.value!.font = `${fontSize}px Verdana` // 字体大小
  context.value?.fillText(text, 0, fontSize - 10, width.value) // 让文字初始化在 canvas 最左上角
  const adjustX = width.value / 2 - context.value!.measureText(text).width * 20 / 2
  const adjustY = Math.floor((height.value - fontSize * 10) / 4)
  const textCoordinates = context.value?.getImageData(0, 0, width.value, height.value)
  const { width: w = 0, height: h = 0, data = [] } = textCoordinates || {}
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (data[(y * 4 * w) + (x * 4) + 3] > 128)
        particles.push(new Particle(x * 20 + adjustX, y * 20 + adjustY))
    }
  }
}

const strokePre = ref<string>('rgba(255,255,255,')

// 粒子连接线
function connect() {
  let opacity = 0.6
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x
      const dy = particles[a].y - particles[b].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 30
      if (distance < maxDistance) {
        opacity = Number.parseFloat((1 - (distance / maxDistance)).toFixed(2))
        context.value!.strokeStyle = `${strokePre.value}${opacity})`
        context.value?.beginPath()
        context.value!.lineWidth = 1.8
        context.value?.moveTo(particles[a].x, particles[a].y)
        context.value?.lineTo(particles[b].x, particles[b].y)
        context.value?.stroke()
      }
    }
  }
}
// 动画
function animate() {
  rindex++
  context.value?.clearRect(0, 0, width.value, height.value)
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw()
    particles[i].update()
  }
  connect()
}
watchEffect(() => {
  strokePre.value = isDark.value ? 'rgba(255,255,255,' : 'rgba(0,0,0,'
})
onMounted(() => {
  fillText()
})
window.addEventListener('resize', () => {
  window.location.reload()
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>
