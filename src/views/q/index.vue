<script setup lang='ts'>
import colors from '@/contants/colors'

const { canvasRef, context, width, height } = useCanvas()
const halfWidth = computed(() => { return width.value / 2 })
const halfHeight = computed(() => { return height.value / 2 })

let particles: Particle[] = []
function randomIntFromRange(min: number, max: number) {
  return Math.random() * (max - min + 1) + min
}

function randomColor(colors: string[]) {
  return colors[Math.floor(Math.random() * colors.length)]
}

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}

addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

class Particle {
  x: number
  y: number
  radius: number // 小球半径
  color: string
  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    if (context.value) {
      context.value.beginPath()
      context.value.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      context.value.fillStyle = this.color
      context.value.shadowColor = this.color
      context.value.shadowBlur = 10
      context.value.fill()
      context.value.closePath()
    }
  }

  update() {
    this.draw()
  }
}

function init() {
  particles = []
  for (let i = 0; i < 200; i++) {
    const radius = randomIntFromRange(0.1, 2)
    const x = randomIntFromRange(radius - halfWidth.value, width.value - radius)
    const y = randomIntFromRange(radius - halfHeight.value - 300, height.value - radius + 300)
    particles.push(new Particle(x, y, radius, randomColor(colors)))
  }
}
let rafId = 0.01
const isDark = useDark()
let radians = 0
const radian = ref(0.001)
const alpha = ref(1)
const { pressed } = useMousePressed({ target: canvasRef })
function animate() {
  rafId = requestAnimationFrame(animate)
  if (context.value) {
    context.value.fillStyle = isDark.value ? `rgba(0,0,0,${alpha.value})` : `rgba(255, 255, 255,${alpha.value})`
    context.value.fillRect(0, 0, width.value, height.value)
    // 画布旋转
    context.value?.save()
    context.value?.translate(halfWidth.value, halfHeight.value)
    context.value?.rotate(radians)
  }
  radians += radian.value
  // 更新粒子
  particles.forEach((particle) => {
    particle.update()
  })
  context.value?.restore()
  if (pressed.value && alpha.value >= 0.08)
    alpha.value -= 0.01
  else if (!pressed.value && alpha.value < 1)
    alpha.value += 0.01
}
watchEffect(() => {
  cancelAnimationFrame(rafId)
  animate()
})
let i = 1
function speedUp() {
  i += 1
  if (i <= 5) {
    radian.value += 0.005 * i
  }
  else {
    i = 1
    radian.value = 0.001
  }
}
init()
animate()
</script>

<template>
  <canvas ref="canvasRef" class="backdrop-blur-sm" @click="speedUp" />
</template>

<style scoped lang='scss'>

</style>
