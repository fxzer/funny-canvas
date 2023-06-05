<script setup lang='ts'>
import { ref,  onMounted, onUnmounted, computed } from 'vue'
import { useDark } from '@vueuse/core'
const isDark = useDark()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let width = 0
let height = 0
let ctx: CanvasRenderingContext2D
let timer = 0
const pointColor = computed(() => isDark.value ? '#fff' : '#000')
const lineColor = computed(() => isDark.value ? 'rgba(255,255,255,' : 'rgba(0,0,0,')
let grap: Graph
onMounted(() => {
  if (canvasRef.value) {
    width = canvasRef.value.width = window.innerWidth || 600;
    height = canvasRef.value.height = window.innerHeight || 600;
    ctx = canvasRef.value?.getContext('2d') as CanvasRenderingContext2D;   //获取canvas的上下文
  }
  grap = new Graph()
  grap.draw()
  animate()
})
onUnmounted(() => {
  if (timer)
    cancelAnimationFrame(timer)
})

function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
class Point { // 粒子
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  lastTime: number
  constructor() {
    this.size = 2 // 粒子大小
    this.x = randomNum(0, width - this.size / 2)
    this.y = randomNum(0, height - this.size / 2)
    this.speedX = randomNum(-50, 50)
    this.speedY = randomNum(-50, 50)
    this.lastTime = 0
  }

  draw() {
    if (this.lastTime) {
      const now = Date.now()
      const dt = (now - this.lastTime) / 1000
      if (this.x > width || this.x < 0)
        this.speedX = -this.speedX

      if (this.y > height || this.y < 0)
        this.speedY = -this.speedY

      this.x += this.speedX * dt
      this.y += this.speedY * dt
    }
    ctx?.beginPath()
    ctx!.fillStyle =  pointColor.value
    ctx?.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx?.closePath()
    ctx?.fill()
    this.lastTime = Date.now()
  }
}

class Graph {
  pointCount: number // 点的数量
  maxDistance: number // 点之间连线的最大距离
  points: Point[]
  constructor() {
    this.pointCount = 100
    this.maxDistance = 200
    this.points = new Array(this.pointCount).fill(0).map(() => new Point())
  }

  draw() {
    for (let i = 0; i < this.points.length; i++) {
      const p1 = this.points[i]
      p1.draw()
      for (let j = i + 1; j < this.points.length; j++) {
        const p2 = this.points[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > this.maxDistance)
          continue
        ctx?.beginPath()
        // ctx!.strokeStyle = `rgba(255,255,255,${(this.maxDistance - distance) / this.maxDistance})`
        let alpha = (this.maxDistance - distance) / this.maxDistance
        ctx!.strokeStyle = `${lineColor.value}${alpha})`
        ctx!.lineWidth = 1
        ctx?.moveTo(p1.x, p1.y)
        ctx?.lineTo(p2.x, p2.y)
        ctx?.closePath()
        ctx?.stroke()
      }
    }
  }
}

function animate() {
  ctx?.clearRect(0, 0, width, height)
  if (timer)
    cancelAnimationFrame(timer)
  grap.draw()
  timer = requestAnimationFrame(animate)
}
</script>

<template>
  <canvas ref="canvasRef" :class="isDark ? ' bg-black' : ''" />
</template>

<style lang="scss" scoped></style>
