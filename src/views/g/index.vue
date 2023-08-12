<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'

const canvas = ref<HTMLCanvasElement>()

const w = ref(0)
const h = ref(0)
const mouse = reactive({
  x: 0,
  y: 0,
})
const bar = {
  width: 20,
  distance: 16,
  speed: 8,
  length: 400,
}
let ctx: CanvasRenderingContext2D | null = null
let bars: Bar[] = []
class Bar {
  x: number
  y: number
  lineY: number
  targetY: number
  hue: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.lineY = y
    this.targetY = y
    this.hue = Math.floor(Math.random() * 360)
  }

  draw() {
    if (ctx) {
      // draw top arc
      ctx.beginPath()
      ctx.arc(this.x, this.y - bar.length * 1.05, bar.width * 0.2, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${this.hue}, 80%, 40%, 0.8)`
      ctx.fill()
      ctx.closePath()
      // draw bottom arc
      const tmp = (this.y - this.lineY) / bar.length * 100 / 1.5
      ctx.beginPath()
      ctx.arc(this.x, this.y, bar.width * 0.8, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(220, 100%, ${tmp}%, 1)`
      ctx.fill()
      ctx.closePath()

      // draw bar
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x, this.lineY)
      ctx.lineWidth = bar.width
      ctx.lineCap = 'round'

      ctx.strokeStyle = `hsla(${this.hue}, 80%, 20%, 0.6)`
      ctx.stroke()
      ctx.closePath()
    }
  }

  update() {
    if (mouse.x !== undefined) {
      const distanceX = Math.abs(this.x - mouse.x) ** 2 * 0.005
      this.targetY = (this.y - bar.length) + distanceX
      if (this.targetY > this.y)
        this.targetY = this.y
    }
    else {
      this.targetY = this.y
    }

    const distanceY = Math.abs(this.lineY - this.targetY)

    if (this.lineY < this.targetY) {
      if (distanceY < bar.speed)
        this.lineY += distanceY
      else
        this.lineY += bar.speed
    }
    else if (this.lineY > this.targetY) {
      if (distanceY < bar.speed)
        this.lineY -= distanceY
      else
        this.lineY -= bar.speed
    }
  }
}

function animationLoop() {
  ctx?.clearRect(0, 0, w.value, h.value)
  drawScene()
  requestAnimationFrame(animationLoop)
}
function drawScene() {
  bars.forEach((b) => {
    b.update()
    b.draw()
  })
}

function mousemove(e: MouseEvent) {
  mouse.x = e.x
  mouse.y = e.y
}

function mouseout() {
  mouse.x = 0
  mouse.y = 0
}
function resizeReset() {
  if (canvas.value) {
    w.value = canvas.value.width = window.innerWidth || 0
    h.value = canvas.value.height = window.innerHeight || 600
  }
  bars = []
  for (let i = bar.distance * 3 + bar.width / 2; i < w.value - bar.distance * 3; i += bar.width + bar.distance)
    bars.push(new Bar(i, (h.value + bar.length) * 0.5))
}

onMounted(() => {
  ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D
  window.addEventListener('resize', resizeReset)
  window.addEventListener('mousemove', mousemove)
  window.addEventListener('mouseout', mouseout)
  resizeReset()
  animationLoop()
})
</script>

<template>
  <canvas ref="canvas" />
</template>

 <style scoped lang='scss'></style>
