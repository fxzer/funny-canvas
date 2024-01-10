<script setup lang='ts'>
import colors from '@/contants/colors'

const { canvasRef, context, width, height } = useCanvas()
const { x, y } = useMouse()
const points: Point[] = []
const spacing = 100
const spread = spacing * 0.25
let cols: number, rows: number
let tick: number, basePoint, rightPoint, botPoint

class Point {
  x: number
  y: number
  xBase: number
  yBase: number
  offset: number
  duration: number
  range: number
  dir: number
  rad: number
  rotateAngle: number
  constructor(opt: any) {
    this.x = opt.x
    this.y = opt.y
    this.xBase = this.x
    this.yBase = this.y
    this.offset = random(0, 1000)
    this.duration = random(20, 60)
    this.range = random(3, 6)
    this.dir = random(0, 1) > 0.5 ? 1 : -1
    this.rad = random(2, 4)
    this.rotateAngle = random(0, Math.PI * 2) // 随机旋转角度
  }

  draw() {
    if (!context.value)
      return
    context.value.save()
    context.value.beginPath()
    context.value.translate(this.x, this.y)
    context.value.rotate(this.rotateAngle)
    context.value.rect(-6, -6, 12, 12)
    context.value.fill()
    context.value.stroke()
    context.value.closePath()
    context.value.restore()
  }

  update() {
    this.x = this.xBase + this.dir * Math.sin((tick + this.offset) / this.duration) * this.range
    this.y = this.yBase + this.dir * Math.cos((tick + this.offset) / this.duration) * this.range
    const angle = angleTo(this, new Point({ x: x.value, y: y.value }))
    this.x = this.x + Math.cos(angle) * 100
    this.y = this.y + Math.sin(angle) * 100
  }
}
function angleTo(p1: Point, p2: Point) {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.atan2(dy, dx)
}
function init() {
  x.value = width.value / 2
  y.value = height.value / 2
  cols = 0
  rows = 0
  points.length = 0
  tick = 0
  context.value!.strokeStyle = 'green'
  createPoints()
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

// 创建一些点，每个点都有一个随机的偏移量
function createPoints() {
  for (let x = -spacing / 2; x < width.value + spacing; x += spacing) {
    cols++
    for (let y = -spacing / 2; y < height.value + spacing; y += spacing) {
      if (x === -spacing / 2)
        rows++

      points.push(new Point({
        x: x + random(-spread, spread),
        y: y + random(-spread, spread),
      }))
    }
  }
}
let index = 0
function draw() {
  if (!context.value)
    return
  context.value?.clearRect(0, 0, width.value, height.value)
  context.value.lineWidth = 2
  context.value.beginPath()
  if (index % 60 === 0) { // 每隔60帧清空画布，换颜色
    context.value!.strokeStyle = colors[Math.floor(Math.random() * colors.length)]
  }
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      basePoint = points[x * rows + y]
      rightPoint = x === cols - 1 ? null : points[(x + 1) * rows + y]
      botPoint = y === rows - 1 ? null : points[x * rows + y + 1]

      if (rightPoint) {
        context.value.moveTo(basePoint.x, basePoint.y)
        context.value.lineTo(rightPoint.x, rightPoint.y)
      }
      if (botPoint) {
        context.value.moveTo(basePoint.x, basePoint.y)
        context.value.lineTo(botPoint.x, botPoint.y)
      }
    }
  }
  context.value.stroke()
  context.value.fillStyle = '#000'
  points.forEach((point) => {
    point.update()
    point.draw()
  })

  // 画一个 径向渐变的圆
  const gradient = context.value.createRadialGradient(x.value, y.value, 0, x.value, y.value, 400)
  gradient.addColorStop(0, 'hsla(0, 0%, 0%, 0)')
  gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0.85)')
  context.value.fillStyle = gradient
  context.value.fillRect(0, 0, width.value, height.value)
}
function animate() {
  index++
  draw()
  requestAnimationFrame(animate)
}

useResizeObserver(canvasRef, init)
onMounted(() => {
  init()
  animate()
})
</script>

<template>
  <canvas ref="canvasRef" bg-black />
</template>
