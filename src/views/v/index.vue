<script setup lang='ts'>
import colors from '@/contants/colors'

const { canvasRef, context, width, height } = useCanvas({ animate })
let triangles: Triangle[] = []
let count = 0

// 通过中心点、半径、角度计算出点的坐标
function computePoint(x: number, y: number, r: number, angle: number) {
  return {
    x: r * Math.cos(angle * Math.PI / 180) + x,
    y: r * Math.sin(angle * Math.PI / 180) + y,
  }
}

class EndPoint {
  r: number // 半径
  cx: number // 圆心 x
  cy: number // 圆心 y
  angle: number // 角度
  x: number
  y: number

  constructor(cx: number, cy: number, r: number, angle: number) {
    this.cx = cx
    this.cy = cy
    this.r = r
    this.angle = angle
    const { x, y } = computePoint(cx, cy, r, angle)
    this.x = x
    this.y = y
  }
}
class Triangle {
  x: number
  y: number
  r: number
  angle: number // 当前角度
  active: boolean
  targetAngle: number // 目标角度
  rotateAngle: number // 旋转角度
  color: string

  constructor(x: number, y: number, r: number, angle: number) {
    this.x = x
    this.y = y
    this.r = r
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.angle = angle
    this.active = true
    this.targetAngle = this.angle
    this.rotateAngle = 180
  }

  update() {
    this.rotateAngle--
    if (this.targetAngle < this.angle + 60)
      this.targetAngle++
  }

  draw() {
    this.drawTriangle(this.angle)
    this.drawTriangle(this.targetAngle)
  }

  drawTriangle(angle: number) {
    const points = Array.from({ length: 3 }, (_, i) => {
      return new EndPoint(this.x, this.y, this.r, angle + i * 120)
    })
    if (!context.value)
      return
    context.value.beginPath()
    context.value.strokeStyle = this.color
    points.forEach(p => context.value?.lineTo(p.x, p.y))
    context.value.closePath()
    context.value.stroke()
  }
}

function init() {
  triangles = []
  triangles.push(new Triangle(width.value / 2, height.value / 2, height.value / 2, -90))
  count = 480
}

function animate() {
  if (!context.value)
    return
  context.value.clearRect(0, 0, width.value, height.value)
  triangles.forEach((triangle) => {
    triangle.update()
    triangle.draw()
    const { x, y, r, angle, active } = triangle
    if (triangle.targetAngle === angle + 60 && r > 10 && active) {
      const newTriangles = Array.from({ length: 6 }).map((_, i) => {
        const newR = r / 3// 新半径
        const newRadius = r * 2 / 3
        const newAngle = angle + i * 60
        const { x: newX, y: newY } = computePoint(x, y, newRadius, newAngle)
        triangle.active = false
        return new Triangle(newX, newY, newR, newAngle)
      })
      triangles.push(...newTriangles)
    }
  })
  count--
  if (count < 0)
    init()
  // requestAnimationFrame(animate)
}
init()
// onMounted(animate)
</script>

<template>
  <canvas ref="canvasRef" />
</template>

<style scoped lang='scss'>
</style>
