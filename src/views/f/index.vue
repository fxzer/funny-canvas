<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import ironman from './ironman'

const canvasF = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)
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
  // position1: number;
  // position2: number;
  // prow  : number;
  // pcol  : number;
  constructor() {
    this.x = image.x + Math.random() * image.width
    this.y = image.y + Math.random() * image.height
    this.speed = 0
    this.velocity = Math.random() * 3.5
    this.size = Math.random() * 1.5 + 1
    // this.prow = Math.floor(this.y- image.y)
    // this.pcol = Math.floor(this.x- image.x)
    // this.position1 = this.prow > 599 ? 599 : this.prow;
    // this.position2 = this.pcol > 599 ? 599 : this.pcol;
  }

  update() {
    this.y += this.velocity
    // this.position1 = this.prow > 599 ? 599 : this.prow;
    // this.position2 = this.pcol > 599 ? 599 : this.pcol;
    // this.speed = mappedImage[this.position1][this.position2] ;
    // let movement = (2.5 - this.speed) + this.velocity;
    this.y += this.velocity
    if (this.y >= image.y + image.height) {
      this.y = image.y
      this.x = image.x + Math.random() * image.width
    }
  }

  draw() {
    ctx.value?.beginPath()
    ctx.value?.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.value!.fillStyle = 'white'
    ctx.value?.fill()
  }
}

function initCanvas() {
  if (canvasF.value) {
    canvasF.value.width = window.innerWidth || 600
    canvasF.value.height = window.innerHeight || 600
    ctx.value = canvasF.value?.getContext('2d') as CanvasRenderingContext2D // 获取canvas的上下文
    fillImage()
  }
}
function fillImage() {
  // 画矩形
  ctx.value?.stroke()
  image.img = new Image()
  image.img.src = ironman
  image.img.onload = () => {
    image.x = (canvasF.value!.width - image.width) / 2
    image.y = (canvasF.value!.height - image.height) / 2
    // 画矩形边框
    ctx.value!.strokeStyle = 'white'
    ctx.value!.lineWidth = 5
    ctx.value?.strokeRect(image.x, image.y, image.width, image.height)
    ctx.value?.drawImage(image.img, image.x, image.y, image.width, image.height)
    const { data = [], width, height } = ctx.value?.getImageData(image.x, image.y, image.width, image.height) as ImageData
    // ctx.value?.clearRect(image.x,image.y,image.width,image.height);
    image.data = data
    // grayify(data)
    handleRGB(data, width, height)
    ctx.value?.putImageData(new ImageData(data as any, width, height), image.x, image.y)
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
  ctx.value?.drawImage(image.img, image.x, image.y, image.width, image.height)
  ctx.value!.globalAlpha = 0.05 // 透明度
  ctx.value!.fillStyle = 'rgb(0,0,0)'
  ctx.value?.fillRect(image.x, image.y, image.width, image.height)
  // ctx.value!.globalAlpha = 0.2; // 透明度
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update()
    // ctx.value!.globalAlpha = particlesArray[i].speed * 0.5; // 透明度
    particlesArray[i].draw()
  }
  if (requestAnimationId)
    cancelAnimationFrame(requestAnimationId)
  requestAnimationId = requestAnimationFrame(animate)
}
onMounted(() => {
  initCanvas()
})
</script>

<template>
  <canvas ref="canvasF" />
</template>
