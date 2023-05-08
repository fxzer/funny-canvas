<template>
  <canvas ref='canvasA'  class="backdrop-blur"></canvas>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
const canvasA = ref<HTMLCanvasElement>()
let requestAnimationId = 0;
let ctx = ref<CanvasRenderingContext2D | null>(null);
const canvas = reactive({
  w: 0,
  h: 0,
  fps: 0
})
const template = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()'
const templateArr = template.split('')
const fontSize = 16
const fontStyle = `${fontSize}px Arial`
const drops: number[] = []
let lastTime = performance.now()

const draw = () => {
  calcFPS()
  ctx.value!.fillStyle = 'rgba(0,0,0,0.05)'
  ctx.value!.fillRect(0, 0, canvas.w, canvas.h)
  ctx.value!.fillStyle = '#0F0'
  ctx.value!.font = fontStyle
  for (let i = 0; i < drops.length; i++) {
    const text = templateArr[Math.floor(Math.random() * templateArr.length)]
    ctx.value?.fillText(text, i * fontSize, drops[i] * fontSize)
    if (drops[i] * fontSize > canvas.h && Math.random() > 0.95) {
      drops[i] = 0
    }
    drops[i] += 1
  }
}
const initCanvas = () => {
  if (canvasA.value) {
    canvas.w = canvasA.value.width = window.innerWidth || 600;
    canvas.h = canvasA.value.height = window.innerHeight || 600;
    ctx.value = canvasA.value?.getContext('2d') as CanvasRenderingContext2D;   //获取canvas的上下文
    let columns  = Math.floor(canvas.w / fontSize)
    for (let i = 0; i < columns ; i++) {
      drops[i] = 1
    }
    amimate()
  }
}
const amimate = () => {
  requestAnimationId = window.requestAnimationFrame(amimate)
  draw()
}
//计算屏幕刷新率
const calcFPS = () => {
  const now = performance.now()
  const deltaTime = now - lastTime
  lastTime = now
  canvas.fps = Math.round(1000 / deltaTime)
    //给文字添加背景
 ctx.value!.fillStyle = 'rgba(0,0,0,1)'
  ctx.value!.fillRect(0, 0, 60, 20)
  //填充文字到左上角
  ctx.value!.fillStyle = '#FFF'
  ctx.value!.font = '16px Sans-serif'
  ctx.value!.fillText(`FPS:${canvas.fps}`, 10, 20)
}
onMounted(() => {
  initCanvas();
})
onUnmounted(() => {
  window.cancelAnimationFrame(requestAnimationId)
})
</script>
<style scoped lang='scss'></style>