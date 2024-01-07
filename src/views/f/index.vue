<script lang="ts" setup>
import ironman from './ironman'

const { canvasRef, context } = useCanvas()

let particlesArray: Particle[] = []
let requestAnimationId = 0
const count = 1000
let mappedImage: number[][] = []

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
  size: number
  speed: number
  velocity: number
  constructor() {
    this.x = image.x + Math.random() * image.width
    this.y = image.y + Math.random() * image.height
    this.speed = 0
    this.velocity = Math.random() * 3.5
    this.size = Math.random() * 1.5 + 1
  }

  update() {
    this.y += this.velocity
    this.y += this.velocity
    if (this.y >= image.y + image.height) {
      this.y = image.y
      this.x = image.x + Math.random() * image.width
    }
  }

  draw() {
    context.value?.beginPath()
    context.value?.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.value!.fillStyle = 'white'
    context.value?.fill()
  }
}

function fillImage() {
  // 画矩形
  context.value?.stroke()
  image.img = new Image()
  image.img.src = ironman
  image.img.onload = () => {
    image.x = (canvasRef.value!.width - image.width) / 2
    image.y = (canvasRef.value!.height - image.height) / 2

    // 画矩形边框
    context.value!.strokeStyle = 'white'
    context.value!.lineWidth = 5
    context.value?.strokeRect(image.x, image.y, image.width, image.height)
    context.value?.drawImage(image.img, image.x, image.y, image.width, image.height)
    const { data = [], width, height } = context.value?.getImageData(image.x, image.y, image.width, image.height) as ImageData
    // context.value?.clearRect(image.x,image.y,image.width,image.height);
    image.data = data
    // grayify(data)
    handleRGB(data, width, height)
    context.value?.putImageData(new ImageData(data as any, width, height), image.x, image.y)
    initParticles()
  }
}

// const grayify = (data: Uint8ClampedArray | never[]) => {
//    for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];
//       const total = r + g + b;
//       const average = total / 3;
//       data[i] = average;
//       data[i + 1] = average;
//       data[i + 2] = average;
//    }
// }
function handleRGB(data: Uint8ClampedArray | never[], width: number, height: number) {
  mappedImage = []

  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const r = data[y * width * 4 + x * 4]
      const g = data[y * width * 4 + x * 4 + 1]
      const b = data[y * width * 4 + x * 4 + 2]
      const brightness = calculateBrightness(r, g, b)
      row.push(brightness)
    }
    mappedImage.push(row)
  }
}
function calculateBrightness(r: number, g: number, b: number) {
  return Math.sqrt(
    (r * r) * 0.299
    + (g * g) * 0.587
    + (b * b) * 0.114,
  ) / 100
}

function initParticles() {
  particlesArray = []
  for (let i = 0; i < count; i++)
    particlesArray.push(new Particle())

  animate()
}
function animate() {
  context.value?.drawImage(image.img, image.x, image.y, image.width, image.height)
  context.value!.globalAlpha = 0.05 // 透明度
  context.value!.fillStyle = 'rgb(0,0,0)'
  context.value?.fillRect(image.x, image.y, image.width, image.height)
  // context.value!.globalAlpha = 0.2; // 透明度
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update()
    // context.value!.globalAlpha = particlesArray[i].speed * 0.5; // 透明度
    particlesArray[i].draw()
  }
  if (requestAnimationId)
    cancelAnimationFrame(requestAnimationId)
  requestAnimationId = requestAnimationFrame(animate)
}
onMounted(() => {
  fillImage()
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>
