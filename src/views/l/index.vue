<script setup lang="ts">
const { context, canvasRef, width, height } = useCanvas({ init, animate })
interface Point {
  x: number
  y: number
}

interface Branch {
  start: Point
  length: number
  angle: number
}

function init() {
  context.value!.strokeStyle = '#c9cdd440'
  const start1: Point = {
    x: 0,
    y: Math.random() * height.value,
  }
  const start2: Point = {
    x: width.value,
    y: Math.random() * height.value,
  }
  step({
    start: start1,
    length: 10,
    angle: (Math.PI / 4) * (Math.random() * 2 - 1),
  })
  step({
    start: start2,
    length: 10,
    angle: Math.random() * (Math.PI * 5 / 4 - Math.PI * 3 / 4) + Math.PI * 3 / 4, // Math.PI * 3 / 4 ~ Math.PI * 5 / 4
  })
}
let pendingTasks: any[] = []

function step(b: Branch, depth = 0) {
  const end = getEndPoint(b)
  drawBranch(b)

  if (depth < 4 || Math.random() < 0.5) {
    pendingTasks.push(() => step({
      start: end,
      length: b.length + (Math.random() * 2 - 1),
      angle: b.angle - 0.2 * Math.random(),
    }, depth + 1))
  }
  if (depth < 4 || Math.random() < 0.5) {
    pendingTasks.push(() => step({
      start: end,
      length: b.length + (Math.random() * 2 - 1),
      angle: b.angle + 0.2 * Math.random(),
    }, depth + 1))
  }
}

function frame() {
  const tasks: any[] = []
  pendingTasks = pendingTasks.filter((i) => {
    if (Math.random() > 0.4) {
      tasks.push(i)
      return false
    }
    return true
  })
  tasks.forEach(fn => fn())
}

let framesCount = 0
function animate() {
  framesCount += 1
  if (framesCount % 3 === 0) // 每3帧执行一次
    frame()
}

function lineTo(p1: Point, p2: Point) {
  context.value!.beginPath()
  context.value!.moveTo(p1.x, p1.y)
  context.value!.lineTo(p2.x, p2.y)
  context.value!.stroke()
}

// 计算分支终点
function getEndPoint(b: Branch): Point {
  return {
    x: b.start.x + b.length * Math.cos(b.angle),
    y: b.start.y + b.length * Math.sin(b.angle),
  }
}

function drawBranch(b: Branch) {
  lineTo(b.start, getEndPoint(b))
}
</script>

<template>
  <canvas ref="canvasRef" />
</template>

<style scoped lang='scss'>

</style>
