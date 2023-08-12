<script setup>
import Play from '@/components/Play.vue'

const { canvasRef, context, width, height } = useCanvas()
const audio1 = ref()
const audio2 = ref()
const audio3 = ref()
const audio4 = ref()
const audio5 = ref()
const audio6 = ref()
const audio7 = ref()
const audio8 = ref()
const audioGroup1 = [audio1, audio2, audio3]
const audioGroup2 = [audio4, audio5, audio6]
const audioGroup3 = [audio7, audio8]
let fireworks = []

function randNumber(min, max) {
  return Math.random() * (max - min) + min
}
class Particle {
  randColor() {
    return `rgb(${Number.parseInt(Math.random() * 255)}, ${Number.parseInt(Math.random() * 255)}, ${Number.parseInt(Math.random() * 255)})`
  }

  constructor(x, y) {
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.color = this.randColor()
  }

  update() {
    this.vy += 0.1
    this.x += this.vx
    this.y += this.vy
  }

  draw(context) {
    if (this.x < 0 || this.y < 0 || this.x > width.value || this.y > height.value)
      return

    context.fillStyle = this.color
    context.beginPath()
    context.arc(this.x, this.y, 2, 0, Math.PI * 2, false)
    context.fill()
  }
}
class Explosion {
  constructor(x, y) {
    this.particles = []
    const count = randNumber(50, 100)
    for (let i = 0; i < count; i++) {
      const vx = Math.sin(i / 30 * Math.PI * 2)
      const vy = Math.cos(i / 30 * Math.PI * 2)
      const particle = new Particle(x, y)
      const fuzziness = Math.random() * 5
      particle.vx = vx * fuzziness
      particle.vy = vy * fuzziness

      this.particles.push(particle)
    }
  }

  update() {
    this.particles.forEach((par) => {
      par.update()
    })
  }

  draw(context) {
    this.particles.forEach((par) => {
      par.draw(context)
    })
  }
}

class Firework {
  constructor(x, y, vx, vy, delay) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.blown = false
    this.source = new Particle(x, y)
    this.source.vx = vx
    this.source.vy = vy
    this.delay = delay // 添加延迟时间属性
  }

  update() {
    if (this.source.vy > 0 && !this.blown) {
      this.explosion = new Explosion(this.source.x, this.source.y)
      this.blown = true
    }
    if (!this.blown)
      this.source.update()

    else
      this.explosion.update()
  }

  draw(context) {
    if (this.blown)
      this.explosion.draw(context)

    else
      this.source.draw(context)
  }
}

function initFirework() {
  fireworks = Array.from({ length: 10 }).map(() => {
    return new Firework(width.value * Math.random(), randNumber(height.value / 2, height.value), 0, -10, randNumber(100, 1000))
  })
}
function amimate() {
  context.value.clearRect(0, 0, width.value, height.value)
  fireworks.forEach(async (firework) => {
    if (firework.delay <= 0) { // 延迟时间已过
      firework.update()
      firework.draw(context.value)
      if (firework.blown && !firework.playSound) {
        await audioGroup1[Number.parseInt(Math.random() * 3)].value.play()
        await audioGroup2[Number.parseInt(Math.random() * 3)].value.play()
        await audioGroup3[Number.parseInt(Math.random() * 2)].value.play()
        firework.playSound = true
      }
    }
    else {
      firework.delay -= 16 // 每帧减少16毫秒
    }
  })
  requestAnimationFrame(amimate)
}
const showPlayBtn = ref(true)
function playHandler() {
  amimate()
  setTimeout(() => {
    showPlayBtn.value = false
  }, 100)
}
onMounted(() => {
  initFirework()
  setInterval(() => {
    initFirework()
  }, 5000)
})
</script>

<template>
  <div class="relative">
    <canvas ref="canvasRef" />
    <Play
      v-if="showPlayBtn"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 cursor-pointer text-sky-200 dark:text-gray-500" @click="playHandler"
    />
    <audio ref="audio1" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/lift1.mp3" />
    <audio ref="audio2" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/lift2.mp3" />
    <audio ref="audio3" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/lift3.mp3" />
    <audio ref="audio4" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst-sm-1.mp3" />
    <audio ref="audio5" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst-sm-2.mp3" />
    <audio ref="audio6" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst2.mp3" />
    <audio ref="audio7" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/crackle-sm-1.mp3" />
    <audio ref="audio8" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/crackle1.mp3" />
  </div>
</template>

<style scoped lang='scss'>
.play-btn {
  animation: play 1s infinite;
}

//播放按钮放大缩小吸引点击的动画
@keyframes play {
  0% {
    transform: scale(1) translate(-50%, -50%);
  }

  50% {
    transform: scale(1.2) translate(-50%, -50%);
  }

  100% {
    transform: scale(1) translate(-50%, -50%);
  }
}
</style>
