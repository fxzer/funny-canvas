<script setup lang='ts'>
import colors from '@/contants/colors'

const { canvasRef, context } = useCanvas()
class Application {
  canvas: any
  ctx: any
  w: number
  h: number
  speed: number
  lineData: { x: number, y: number }[]
  maxHeight: number
  active: number
  heartData: { x: number, y: number }[]
  heartR: number
  dt: number
  x: number
  y: number
  startX: number
  startY: number
  // lineColor: string
  // shadowColor: string
  centerY: number
  rid: number

  constructor() {
    this.canvas = null
    this.ctx = null
    this.w = 0
    this.h = 0
    this.speed = 5
    this.lineData = []
    this.maxHeight = 50
    this.active = 0
    this.heartData = []
    this.heartR = 10
    this.dt = 0
    this.x = 0
    this.y = 0
    this.startX = 0
    this.startY = 0
    this.centerY = 0
    this.rid = 0
    this.init()
  }

  init() {
    this.canvas = canvasRef.value
    this.ctx = context.value
    window.addEventListener('resize', this.reset.bind(this))
    window.addEventListener('click', this.speedUp.bind(this))
    this.render()
  }

  speedUp() {
    this.speed += 3
    if (this.speed > 15)
      this.speed = 5

    this.render()
  }

  reset() {
    this.w = this.canvas.width = this.ctx.width = window.innerWidth
    this.h = this.canvas.height = this.ctx.height = window.innerHeight
    this.centerY = this.h / 2 + this.heartR * Math.PI * 2
    this.y = this.centerY
    this.clear()
  }

  clear() {
    this.heartData.length = this.lineData.length = 0
    this.active = 0
    this.x = 0
    this.getHeart()
    this.ctx.clearRect(0, 0, this.w, this.h)
  }

  render() {
    this.reset()
    this.step()
  }

  getHeart() {
    let t = Math.PI + 0.5
    const maxt = 2 * Math.PI - 1
    const vt = this.speed / 100
    let x = 0
    let y = 0
    const r = this.heartR
    for (let i = 0; i < Math.ceil(maxt / vt); i++) {
      x = 16 * Math.sin(t) ** 3
      y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      t += vt
      x *= r
      y = -y * r - r * Math.PI * 4
      if (y < 0)
        this.heartData.push({ x, y })
    }
  }

  drawTopLine() {
    const { ctx, w, x, y, maxHeight, lineData, speed, active, centerY } = this
    lineData.unshift({ x, y })
    let x1 = x + Math.random() * speed + speed
    let y1 = centerY
    if (x1 > w * 0.05 && x1 < w * 0.95) {
      if (Math.random() > 0.8 && active === 0)
        y1 += Math.random() * maxHeight * 2 - maxHeight

      if (x1 > w * 0.25 && this.active === 0)
        this.active = 1

      if (x1 > w * 0.38 && this.active === 1) {
        this.active = 2
        this.startX = x1 + speed * 3
        this.startY = centerY
      }
      if (this.heartData.length > 0 && this.active === 2) {
        const _pos = this.heartData.shift() as { x: number, y: number }
        x1 = this.startX + _pos.x
        y1 = this.startY + _pos.y
        if (y1 > this.startY)
          y1 = this.startY
      }
      if (x1 > 0.55 * w && this.heartData.length === 0 && this.active === 2)
        this.active = 0
    }
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(255,255,255,.5)'
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x1, y1)
    ctx.stroke()
    ctx.closePath()
    this.x = x1
    this.y = y1
  }

  drawLine() {
    const { ctx, lineData } = this
    if (lineData.length < 2)
      return
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.shadowBlur = 20
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.beginPath()
    ctx.moveTo(lineData[1].x, lineData[1].y)
    ctx.lineTo(lineData[0].x, lineData[0].y)
    ctx.stroke()
    ctx.closePath()
  }

  step() {
    cancelAnimationFrame(this.rid)
    this.rid = requestAnimationFrame(this.step.bind(this))
    if (this.dt % 1 === 0) {
      this.drawLine()
      this.drawTopLine()
    }
    if (this.x > this.w + this.speed)
      this.clear()

    this.dt++
  }
}

onMounted(() => {
  // eslint-disable-next-line no-new
  new Application()
})
</script>

<template>
  <canvas id="earth" ref="canvasRef" />
</template>

<style scoped lang='scss'>

</style>
