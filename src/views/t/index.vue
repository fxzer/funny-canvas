<script lang="ts" setup>
const { canvasRef, context, width, height } = useCanvas({ animate })
const hexs: Hex[] = []
const max = Math.sqrt(
  height.value ** 2
  + width.value ** 2,
)
const mouse = {
  x: width.value / 2,
  y: height.value / 2,
}
addEventListener('mousemove', (evt) => {
  mouse.x = evt.x
  mouse.y = evt.y
})
class Hex {
  x: number
  y: number
  color: string
  size: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.color = ''
    this.size = 40
  }

  update() {
    const hsl = Math.atan2(mouse.y - this.y, mouse.x - this.x)
    this.color = `hsla(${hsl / Math.PI * 180},80%,50%,0.5)`
    const r = Math.sqrt(
      (mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2,
    )
    this.size = (1 - r / max) * 40
  }

  draw() {
    if (!context.value)
      return
    context.value.beginPath()
    for (let i = 0; i < 6; i++) {
      const x = this.size * Math.cos(i * Math.PI / 3) + this.x
      const y = this.size * Math.sin(i * Math.PI / 3) + this.y
      context.value.lineTo(x, y)
    }
    context.value.closePath()
    context.value.fillStyle = this.color
    context.value.fill()
    context.value.stroke()
  }
}
function init() {
  for (let w = 0; w < width.value / 120 + 1; w++) {
    for (let h = 0; h < height.value / Math.sqrt(1200) + 1; h++)
      hexs.push(new Hex(w * 120 + (h % 2) * 60, h * Math.sqrt(1200)))
  }
}
function animate() {
  if (!context.value)
    return
  context.value.clearRect(0, 0, width.value, height.value)
  for (const i in hexs) {
    const h = hexs[i]
    h.update()
    h.draw()
  }
}
init()
</script>

<template>
  <canvas ref="canvasRef" />
</template>
