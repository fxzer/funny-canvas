<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import useMouse from '@/hooks/useMouse'

const canvasC = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)
const { x, y } = useMouse()
let particlesArray: Particle[] = []
const mouse = {
  x,
  y,
  radius: 200,
}
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
    this.size = 2 // 粒子大小
    this.baseX = this.x // 粒子初始位置
    this.baseY = this.y // 粒子初始位置
    this.density = (Math.random() * 10) + 1 // 粒子密度
  }

  draw() {
    ctx.value?.beginPath()
    ctx.value!.fillStyle = 'green'
    ctx.value?.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.value?.closePath()
    ctx.value?.fill()
  }

  update() {
    const dx = mouse.x.value - this.x
    const dy = mouse.y.value - this.y
    const distance = Math.sqrt(dx * dx + dy * dy) // 粒子与鼠标的距离

    // 计算力度
    const forceDirectionX = dx / distance
    const forceDirectionY = dy / distance

    const maxDistance = mouse.radius
    const force = (maxDistance - distance) / maxDistance
    const directionX = forceDirectionX * force * this.density
    const directionY = forceDirectionY * force * this.density
    if (distance < mouse.radius) { // 在鼠标半径范围内的粒子
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
  const cw = canvasC.value!.width
  const ch = canvasC.value!.height
  particlesArray = []
  const fontSize = 240
  const text = 'ABC'
  ctx.value!.font = `${fontSize}px Verdana` // 字体大小
  ctx.value?.fillText(text, 0, fontSize - (0.2 * fontSize), cw) // 让文字初始化在 canvas 最左上角
  const textCoordinates = ctx.value?.getImageData(0, 0, cw, ch)
  const { width: w = 0, height: h = 0, data = [] } = textCoordinates || {}
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (data[(y * 4 * w) + (x * 4) + 3] > 128) {
        const { px, py } = calculateOffset(x, y, fontSize, text)
        particlesArray.push(new Particle(px, py))
      }
    }
  }
}
// 计算每个粒子的位置偏移，始终保持居中展示
function calculateOffset(x: number, y: number, fs: number, text: string) {
  const len = text.length
  const tw = fs * len
  const px = x + canvasC.value!.width / 2 - tw * 0.8 / 2
  const py = y + canvasC.value!.height / 2 - fs / 2
  return { px, py }
}
function initCanvas() {
  if (canvasC.value) {
    canvasC.value.width = window.innerWidth || 600
    canvasC.value.height = window.innerHeight || 600
    ctx.value = canvasC.value?.getContext('2d') as CanvasRenderingContext2D // 获取canvas的上下文
    fillText()
    // randomParticle()
  }
}
// const randomParticle = () => {
//    for (let i = 0; i < 100; i++) {
//       const x = Math.floor(Math.random() * canvasC.value!.width);
//       const y = Math.floor(Math.random() * canvasC.value!.height);
//       let particle = new Particle(x, y);
//       particlesArray.push(particle);
//    }
// }

// 动画
function animate() {
  if (!ctx.value || !canvasC.value)
    return
  ctx.value?.clearRect(0, 0, canvasC.value!.width, canvasC.value!.height)
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].draw()
    particlesArray[i].update()
  }
  requestAnimationFrame(animate)
}

onMounted(() => {
  initCanvas()
  animate()
})
</script>

<template>
  <canvas ref="canvasC" />
</template>
