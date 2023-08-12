<script lang="ts" setup>
const { x, y } = useMouse()
const { canvasRef, context, width, height } = useCanvas()

let particlesArray: Particle[] = []
const mouseRadius = 200
/* 自定义例子颜色，数量，密度 */
class Particle { // 粒子
  x: number
  y: number
  size: number
  baseX: number
  baseY: number
  density: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.size = 2 // 粒子大小
    this.baseX = this.x // 粒子初始位置
    this.baseY = this.y // 粒子初始位置
    this.density = (Math.random() * 10) + 1 // 粒子密度
  }

  draw() {
    context.value?.beginPath()
    context.value!.fillStyle = 'green'
    context.value?.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.value?.closePath()
    context.value?.fill()
  }

  update() {
    const dx = x.value - this.x
    const dy = y.value - this.y
    const distance = Math.sqrt(dx * dx + dy * dy) // 粒子与鼠标的距离

    // 计算力度
    const forceDirectionX = dx / distance
    const forceDirectionY = dy / distance

    const maxDistance = mouseRadius
    const force = (maxDistance - distance) / maxDistance
    const directionX = forceDirectionX * force * this.density
    const directionY = forceDirectionY * force * this.density
    if (distance < mouseRadius) { // 在鼠标半径范围内的粒子
      this.x -= directionX
      this.y -= directionY
    }
    else { // 不在鼠标半径范围内的粒子
      const speed = 20 // 粒子回到初始位置的速度越大越慢
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX
        this.x -= dx / speed
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY
        this.y -= dy / speed
      }
    }
  }
}
function fillText() {
  /* 文字粒子 */
  particlesArray = []
  const fontSize = 240
  const text = 'ABC'
  context.value!.font = `${fontSize}px Verdana` // 字体大小
  context.value?.fillText(text, 0, fontSize - (0.2 * fontSize), width.value) // 让文字初始化在 canvas 最左上角
  const textCoordinates = context.value?.getImageData(0, 0, width.value, height.value)
  const { width: w = 0, height: h = 0, data = [] } = textCoordinates || {}
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (data[(y * 4 * w) + (x * 4) + 3] > 128) {
        const { px, py } = calculateOffset(x, y, fontSize, text)
        particlesArray.push(new Particle(px, py))
      }
    }
  }
}
// 计算每个粒子的位置偏移，始终保持居中展示
function calculateOffset(x: number, y: number, fs: number, text: string) {
  const len = text.length
  const tw = fs * len
  const px = x + width.value / 2 - tw * 0.8 / 2
  const py = y + height.value / 2 - fs / 2
  return { px, py }
}
// function randomParticle() {
//   for (let i = 0; i < 100; i++) {
//     const x = Math.floor(Math.random() * width.value)
//     const y = Math.floor(Math.random() * height.value)
//     const particle = new Particle(x, y)
//     particlesArray.push(particle)
//   }
// }

// 动画
function animate() {
  if (!context.value || !canvasRef.value)
    return
  context.value?.clearRect(0, 0, width.value, height.value)
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].draw()
    particlesArray[i].update()
  }
  requestAnimationFrame(animate)
}

onMounted(() => {
  fillText()
  // randomParticle()
  animate()
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>
