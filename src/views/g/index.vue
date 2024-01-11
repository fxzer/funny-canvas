<script setup lang='ts'>
const { canvasRef, context, width, height } = useCanvas({ animate })

const { x } = useMouse()
const bar = {
  width: 20,
  distance: 20,
  speed: 8,
  length: 500,
}
let bars: Bar[] = []
class Bar {
  x: number
  y: number
  lineY: number
  targetY: number
  hue: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.lineY = y
    this.targetY = y
    this.hue = Math.floor(Math.random() * 360)
  }

  draw() {
    if (context.value) {
      // draw top arc
      context.value.beginPath()
      context.value.arc(this.x, this.y - bar.length * 1.05, bar.width * 0.2, 0, Math.PI * 2)
      context.value.fillStyle = `hsla(${this.hue}, 80%, 40%, 0.8)`
      context.value.fill()
      context.value.closePath()
      // draw bottom arc
      const tmp = (this.y - this.lineY) / bar.length * 100 / 1.5
      context.value.beginPath()
      context.value.arc(this.x, this.y, bar.width * 0.8, 0, Math.PI * 2)
      context.value.fillStyle = `hsla(220, 100%, ${tmp}%, 1)`
      context.value.fill()
      context.value.closePath()

      // draw bar
      context.value.beginPath()
      context.value.moveTo(this.x, this.y)
      context.value.lineTo(this.x, this.lineY)
      context.value.lineWidth = bar.width
      context.value.lineCap = 'round'

      context.value.strokeStyle = `hsla(${this.hue}, 80%, 20%, 0.6)`
      context.value.stroke()
      context.value.closePath()
    }
  }

  update() {
    if (x.value !== undefined) {
      const distanceX = Math.abs(this.x - x.value) ** 2 * 0.005
      this.targetY = (this.y - bar.length) + distanceX
      if (this.targetY > this.y)
        this.targetY = this.y
    }
    else {
      this.targetY = this.y
    }

    const distanceY = Math.abs(this.lineY - this.targetY)

    if (this.lineY < this.targetY) {
      if (distanceY < bar.speed)
        this.lineY += distanceY
      else
        this.lineY += bar.speed
    }
    else if (this.lineY > this.targetY) {
      if (distanceY < bar.speed)
        this.lineY -= distanceY
      else
        this.lineY -= bar.speed
    }
  }
}

function animate() {
   context.value?.clearRect(0, 0, width.value, height.value)
  bars.forEach((b) => {
    b.update()
    b.draw()
  })
}

function resizeReset() {
  bars = []
  for (let i = bar.distance * 3 + bar.width / 2; i < width.value - bar.distance * 3; i += bar.width + bar.distance)
    bars.push(new Bar(i, (height.value + bar.length) * 0.5))
}

onMounted(() => {
  window.addEventListener('resize', resizeReset)
  resizeReset()
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>

 <style scoped lang='scss'></style>
