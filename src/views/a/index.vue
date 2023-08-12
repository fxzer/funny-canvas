<script setup lang='ts'>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useFps } from '@vueuse/core'

const fps = useFps()
const canvasA = ref<HTMLCanvasElement>()
let requestAnimationId = 0
const ctx = ref<CanvasRenderingContext2D | null>(null)
const canvas = reactive({
  w: 0,
  h: 0,
})
const template = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()'
const templateArr = template.split('')
const fontSize = 16
const fontStyle = `${fontSize}px Arial`
const drops: number[] = []

function draw() {
  showFPS()
  ctx.value!.fillStyle = 'rgba(0,0,0,0.05)'
  ctx.value!.fillRect(0, 0, canvas.w, canvas.h)
  ctx.value!.fillStyle = '#0F0'
  ctx.value!.font = fontStyle
  for (let i = 0; i < drops.length; i++) {
    const text = templateArr[Math.floor(Math.random() * templateArr.length)]
    ctx.value?.fillText(text, i * fontSize, drops[i] * fontSize)
    if (drops[i] * fontSize > canvas.h && Math.random() > 0.95)
      drops[i] = 0

    drops[i] += 1
  }
}
function initCanvas() {
  if (canvasA.value) {
    canvas.w = canvasA.value.width = window.innerWidth || 600
    canvas.h = canvasA.value.height = window.innerHeight || 600
    ctx.value = canvasA.value?.getContext('2d') as CanvasRenderingContext2D // 获取canvas的上下文
    const columns = Math.floor(canvas.w / fontSize)
    for (let i = 0; i < columns; i++)
      drops[i] = 1

    amimate()
  }
}
function amimate() {
  requestAnimationId = window.requestAnimationFrame(amimate)
  draw()
}
// 显示屏幕刷新率
function showFPS() {
  ctx.value!.fillStyle = 'rgba(0,0,0,1)'
  ctx.value!.fillRect(0, 0, 60, 20)
  // 填充文字到左上角
  ctx.value!.fillStyle = '#FFF'
  ctx.value!.font = '16px Sans-serif'
  ctx.value!.fillText(`FPS:${fps.value}`, 10, 20)
}
onMounted(() => {
  initCanvas()
})
onUnmounted(() => {
  window.cancelAnimationFrame(requestAnimationId)
})
</script>

<template>
  <canvas ref="canvasA" class="backdrop-blur" />
</template>

<style scoped lang='scss'></style>
