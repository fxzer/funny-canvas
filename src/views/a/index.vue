<script setup lang='ts'>
const { canvasRef, context, width, height } = useCanvas()
const fps = useFps()
let requestAnimationId = 0
const template = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()'
const templateArr = template.split('')
const fontSize = 16
const fontStyle = `${fontSize}px Arial`
const drops: number[] = []

function draw() {
  showFPS()
  context.value!.fillStyle = 'rgba(0,0,0,0.05)'
  context.value!.fillRect(0, 0, width.value, height.value)
  context.value!.fillStyle = '#0F0'
  context.value!.font = fontStyle
  for (let i = 0; i < drops.length; i++) {
    const text = templateArr[Math.floor(Math.random() * templateArr.length)]
    context.value?.fillText(text, i * fontSize, drops[i] * fontSize)
    if (drops[i] * fontSize > height.value && Math.random() > 0.95)
      drops[i] = 0

    drops[i] += 1
  }
}
function amimate() {
  requestAnimationId = window.requestAnimationFrame(amimate)
  draw()
}
// 显示屏幕刷新率
function showFPS() {
  context.value!.fillStyle = 'rgba(0,0,0,1)'
  context.value!.fillRect(0, 0, 60, 20)
  // 填充文字到左上角
  context.value!.fillStyle = '#FFF'
  context.value!.font = '16px Sans-serif'
  context.value!.fillText(`FPS:${fps.value}`, 10, 20)
}
onMounted(() => {
  const columns = Math.floor(width.value / fontSize)
  for (let i = 0; i < columns; i++)
    drops[i] = 1

  amimate()
})
onUnmounted(() => {
  window.cancelAnimationFrame(requestAnimationId)
})
</script>

<template>
  <canvas ref="canvasRef" class="backdrop-blur" />
</template>

<style scoped lang='scss'></style>
@/hooks/useCanvas
