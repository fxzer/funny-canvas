<script lang="ts" setup>
import ironman from '@/assets/ironman.jpg'

const { canvasRef, context, width, height } = useCanvas({ animate })
const mouse = useMouse()
let particles: Particle[] = []

const image = reactive({
  img: new Image(),
  x: 0,
  y: 0,
  width: 600,
  height: 600,
  data: [] as Uint8ClampedArray | never[],
})
class Particle {
  x: number
  y: number
  vy: number
  vx: number
  color: string
  constructor(x: number, y: number, c: string) {
    this.x = x
    this.y = y
    this.vx = x
    this.vy = y
    this.color = c
  }

  update() {
    const dx = mouse.x.value - this.x
    const dy = mouse.y.value - this.y
    const rSquared = dx * dx + dy * dy
    if (rSquared < 150 * 150) {
      const r = Math.sqrt(rSquared)
      this.x -= dx / 10 * (1 - r / 150)
      this.y -= dy / 10 * (1 - r / 150)
    }
    else {
      this.x += (this.vx - this.x) / 20
      this.y += (this.vy - this.y) / 20
    }
  }

  draw() {
    context.value?.beginPath()
    context.value?.arc(this.x, this.y, 2, 0, Math.PI * 2)
    context.value!.fillStyle = this.color
    context.value?.fill()
  }
}
function drawRect() {
  context.value!.strokeStyle = 'white'
  context.value!.lineWidth = 5
  context.value?.strokeRect(image.x, image.y, image.width, image.height)
}

function loadImageData() {
  image.img = new Image()
  image.img.src = ironman
  image.img.onload = () => {
    drawRect()
    context.value?.drawImage(image.img, image.x, image.y, image.width, image.height)
    const { data = [] } = context.value?.getImageData(image.x, image.y, image.width, image.height) as ImageData
    context.value?.clearRect(0, 0, width.value, height.value)
    image.data = data
    particles = []
    const step = 16
    for (let i = 0; i < data.length / 4; i += 4 * step) {
      const r = data[i * 4]
      const g = data[i * 4 + 1]
      const b = data[i * 4 + 2]
      const a = data[i * 4 + 3]
      const color = `rgba(${r},${g},${b},${a})`
      const x = (i % image.width) + (width.value - image.width) / 2
      const y = (i / image.height) + (height.value - image.height) / 2
      particles.push(new Particle(x, y, color))
    }
  }
}

function animate() {
  context.value!.fillStyle = 'rgba(0,0,0,0.1)'
  context.value?.fillRect(0, 0, width.value, height.value)
  particles.forEach((p) => {
    p.draw()
    p.update()
  })
}
loadImageData()
</script>

<template>
  <canvas ref="canvasRef" />
</template>
