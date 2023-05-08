
<template>
  <canvas ref="canvas" class=" backdrop-blur"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)
const width = ref(0)
const height = ref(0)
let animationRequestId = ref(0)
let codeLines: string[] = [
  "                 _oo0oo_",
  "                o8888888o",
  "               88\" .  \"88",
  "               (|  -_-  |)",
  "               0\   =   /0",
  "              ___/`---'\___",
  "            .' \\|      |// '.",
  "            / \\\\|||  :  |||// \\",
  "          / _||||| -:- |||||- \\",
  "          |   | \\\\\\  - /// |   |",
  "          | \\_|  ''\\---/''  |_/ |",
  "        \  .-\\__  '-'  ___/-. /",
  "        ___'. .'  /--.--\\  `. .'___",
  "    .\"\" '<  `.___\\_<|>_/___.' >' \"\".",
  "   | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
  "   \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /",
  "=====`.____`.___ \\_____/___.-`___.-'=====",
  "                   `=---='",
  "  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  "        佛祖保佑     永不宕机     永无BUG",
  "       佛曰:  ",
  "         写字楼里写字间，写字间里程序员；        ",
  "         程序人员写程序，又拿程序换酒钱。        ",
  "         酒醒只在网上坐，酒醉还来网下眠；        ",
  "         酒醉酒醒日复日，网上网下年复年。        ",
  "         但愿老死电脑间，不愿鞠躬老板前；        ",
  "         奔驰宝马贵者趣，公交自行程序员。        ",
  "         别人笑我忒疯癫，我笑自己命太贱；        ",
  "         不见满街漂亮妹，哪个归得程序员？",
]

let row = 0
let col = 1

// 初始化画布
const initCanvas = () => {
  if (canvas.value) {
    width.value = canvas.value.width = window.innerWidth || 600
    height.value = canvas.value.height = window.innerHeight || 600
    ctx.value = canvas.value.getContext('2d')
    draw()
  }
}

// 绘制代码
const draw = () => {
  if (ctx.value) {
    ctx.value.clearRect(0, 0, width.value, height.value)
    resume()
  }
  animationRequestId.value = requestAnimationFrame(draw)
}
// 执行代码
const resume = () => {
  ctx.value!.globalCompositeOperation = 'source-over'
  ctx.value!.shadowBlur = 0
  ctx.value!.fillStyle = 'hsla(0,0%,0%,0.4)'
  ctx.value!.fillRect(0, 0, width.value, height.value)

  ctx.value!.shadowColor = 'hsla(120,100%,50%,0.5)'
  ctx.value!.shadowBlur = 2
  ctx.value!.fillStyle = 'hsla(120,100%,20%,1)'
  ctx.value!.globalCompositeOperation = 'lighter'
  // 如果当前行是正在输入的那一行，只绘制到当前输入位置（col 列）。否则，绘制整行代码
  for (let i = 0; i <= row; i++) {
    let line = codeLines[i] || ''
    if (i === row) {
      line = line.substring(0, col++)
    }
    //字体大小
    ctx.value!.font = '16px monospace'
    ctx.value!.fillText(line, 100, 100 + i * 16)
  }

  // 绘制光标
  ctx.value!.fillStyle = 'hsla(120,100%,50%,1)'
  if (codeLines[row]) {
    let x = 100 + ctx.value!.measureText(codeLines[row]?.substring(0, col)).width
    let y = 100 + row * 16 - 14
    ctx.value!.fillRect(x, y, 10, 14)
  }
  if (col >= codeLines[row]?.length) { // 换行
    row++
    col = 0
  }

  if (row * 16 > window.innerHeight - 200) {
    ctx.value!.translate(0, -0.5) // 滚动
  }
}
onMounted(() => {
  initCanvas()
  window.addEventListener('resize', initCanvas)
})
</script>
