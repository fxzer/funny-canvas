<script setup>
const { canvasRef, context, width } = useCanvas()
let rid = 0
const CSIZE = 400
let t = 0
let curves = []
const hue = randomH()
let eg = Math.random() < 0.3
let inc = 3
let stopped = true // 是否已暂停
function getRandomInt(min, max, low) {
  if (low)
    return Math.floor(Math.random() * Math.random() * (max - min)) + min
  else
    return Math.floor(Math.random() * (max - min)) + min
}

function randomH() {
  return getRandomInt(0, 360)
}
class Circle {
  constructor(x, y, xp, yp, radius, pc) {
    this.x = x
    this.y = y
    this.xp = xp
    this.yp = yp
    this.radius = radius
    this.pc = pc
    this.c = []
  }

  drawCircle(rf) {
    context.value.beginPath()
    context.value.moveTo(this.x + this.radius * rf, this.y)
    context.value.arc(this.x, this.y, this.radius * rf, 0, Math.PI * 2)
    context.value.fillStyle = `hsl(${hue + 5 * this.radius},90%,50%)`
    context.value.fill()
  }
}

// 曲线
class Curve {
  constructor() {
    this.car = []
    this.to = -getRandomInt(0, 400)
  }

  canDrawCurve() {
    const tt = this.to + t
    context.value.setLineDash([Math.max(1, tt), 4000])
    context.value.stroke(this.path)
    if (tt > this.len + 40) {
      this.car[this.car.length - 1].drawCircle(0.8)
      return tt <= this.len + 120
    }
    else if (tt > this.len) {
      const raf = 0.8 * (tt - this.len) / 40
      this.car[this.car.length - 1].drawCircle(raf)
      return true
    }
    else {
      return true
    }
  }

  addCurveCircle(cir) {
    if (cir.pc) {
      this.car.unshift(cir.pc)
      this.addCurveCircle(cir.pc)
    }
  }

  setPath() {
    this.len = 0
    this.path = new Path2D()
    this.path.moveTo(0, 0)
    this.path.lineTo(this.car[1].xp, this.car[1].yp)
    this.len += this.car[0].radius
    for (let i = 1; i < this.car.length - 1; i++) {
      this.path.bezierCurveTo(this.car[i].x, this.car[i].y, this.car[i].x, this.car[i].y, this.car[i + 1].xp, this.car[i + 1].yp)
      this.len += 2 * this.car[i].radius
    }
    this.path.lineTo(this.car[this.car.length - 1].x, this.car[this.car.length - 1].y)
    this.len += this.car[this.car.length - 1].radius
  }
}
let circles = [new Circle(0, 0, 0, 0, 50, 0, 0)]
function drawPoint(x, y, color) {
  context.value.beginPath()
  context.value.arc(x, y, 5, 0, Math.PI * 2)
  context.value.closePath()
  context.value.fillStyle = color || 'red'
  context.value.fill()
}

// 判断是否在区域内，并不与任何圆相交
function canGrow(x, y, r) {
  if ((x * x + y * y) ** 0.5 > CSIZE - r)
    return false
  for (let i = 0; i < circles.length; i++) {
    const rt = r + circles[i].radius
    const xd = circles[i].x - x
    const yd = circles[i].y - y
    if (Math.abs(xd) > rt || Math.abs(yd) > rt)
      continue
    if ((xd * xd + yd * yd) ** 0.5 + 1 < rt)
      return false
  }
  return true
}

function grow(r) {
  const a = Math.PI * 2 * Math.random() // 半径
  const c = eg
    ? circles[circles.length - 1 - getRandomInt(0, circles.length, true)]
    : circles[getRandomInt(0, circles.length)] // 取出一个弧
  const x = c.x + (c.radius + r) * Math.cos(a)
  const y = c.y + (c.radius + r) * Math.sin(a)
  if (canGrow(x, y, r)) {
    const xp = c.x + c.radius * Math.cos(a)
    const yp = c.y + c.radius * Math.sin(a)
    const circle = new Circle(x, y, xp, yp, r, c)
    c.c.push(circle)
    circles.push(circle)
    return true
  }
  return false
}

function draw() {
  context.value.clearRect(-CSIZE, -CSIZE, 2 * CSIZE, 2 * CSIZE)
  let grown = 0
  for (let i = 0; i < curves.length; i++) {
    if (curves[i].canDrawCurve())
      grown++
  }
  drawPoint(0, 0, 'silver')
  return grown
}

function setCircles() {
  circles = [new Circle(0, 0, 0, 0, 50, 0, 0)]
  for (let i = 0; i < 2000; i++) {
    let r = 10
    if (i < 20)
      r = 42
    else if (i < 100)
      r = 34
    else if (i < 300)
      r = 26
    else if (i < 1000)
      r = 18
    grow(r)
  }
  curves = []
  for (let i = 0; i < circles.length; i++) {
    if (circles[i].c.length === 0) {
      const nc = new Curve()
      nc.car = [circles[i]]
      nc.addCurveCircle(circles[i])
      nc.setPath()
      curves.push(nc)
    }
  }
}
function animate() {
  cancelAnimationFrame(rid)
  if (stopped)
    return
  t += inc
  if (!draw() || t < 0) {
    if (inc === 3) { inc = -8 }
    else {
      context.value.strokeStyle = `hsla(${randomH()},90%,60%,0.6)`
      inc = 3
      t = 0
      eg = Math.random() < 0.3
      setCircles()
    }
  }

  rid = requestAnimationFrame(animate)
}
function start() {
  if (stopped)
    requestAnimationFrame(animate)

  stopped = !stopped
}
function init() {
  context.value.translate(width.value / 2, CSIZE)
  context.value.lineCap = 'round'
  context.value.fillStyle = 'green'
  context.value.lineWidth = 5
  context.value.strokeStyle = `hsla(${randomH()},90%,60%,0.6)`
}
onMounted(() => {
  addEventListener('click', start, false)
  setCircles()
  init()
  start()
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>
