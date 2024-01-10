<script lang="ts" setup>
const { canvasRef, context, width, height } = useCanvas()
const particles: Particle[] = []
const numbersData: number[][][] = []
let count = 60
let index = 0

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  g: number
  ty: number
  opt: number
  fall: boolean
  color: string

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.vx = 1
    this.vy = Math.random() * 3 + 5
    this.g = this.vy
    this.ty = 0.1
    this.opt = 0
    this.fall = false
    this.color = `hsla(${index * 30},80%,50%,`
  }

  update() {
    if (this.fall) {
      if (this.y >= height.value) {
        this.g *= 0.8
        this.vy = -this.g
        this.vx = Math.random() > 0.5 ? Math.random() * 2 : -Math.random() * 2
      }

      const airResistance = 0.01 * this.vy
      this.y += this.vy
      this.x += this.vx

      this.vy += this.ty - airResistance
    }
    this.opt += 0.01
  }

  draw() {
    if (!context.value)
      return
    context.value.beginPath()
    context.value.arc(this.x, this.y, 5, 0, Math.PI * 2, false)
    context.value.fillStyle = `${this.color + this.opt})`
    context.value.fill()
  }
}

function change(i: number) {
  for (const j in numbersData[i]) {
    const p = numbersData[i][j]
    particles.push(new Particle(p[0], p[1]))
  }
}

function init() {
  if (!context.value)
    return
  for (let i = 0; i <= 10; i++) {
    context.value.font = '40px Arial'
    const w = context.value.measureText(`${i}`).width | 0
    context.value.fillText(`${i}`, 0, 40)
    const data = context.value.getImageData(0, 0, w, 41).data
    const len = data.length
    const tdata = []
    for (let j = 0; j < len / 4; j++) {
      if (data[j * 4 + 3] !== 0) {
        const x = j % w | 0
        const y = j / w | 0
        tdata.push([x * 20 + (width.value - w * 20) / 2, y * 20 + (height.value - 40 * 20) / 2 - 200])
      }
    }
    numbersData.push(tdata)
    context.value.clearRect(0, 0, 40, 41)
  }
}

function animate() {
  if (!context.value)
    return
  context.value.fillStyle = 'rgba(0,0,0,0.2)'
  context.value.fillRect(0, 0, width.value, height.value)
  count++
  particles.forEach((p, i) => {
    p.update()
    p.draw()
    if (Math.abs(p.g) < 2)
      particles.splice(i, 1)

    if (count === 60)
      p.fall = true
  })
  if (count === 120) {
    change(10 - index)
    count = 0
    index++
    index = index % numbersData.length
  }
  requestAnimationFrame(animate)
}

onMounted(() => {
  init()
  animate()
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>
