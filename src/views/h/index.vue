<script setup lang='ts'>
import { onMounted, ref } from 'vue'

const canvasH = ref<HTMLCanvasElement>()
const audioA = ref<HTMLAudioElement>()
const audioFile = ref<HTMLInputElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)
const atx = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
let dataArray: any = []
const w = ref(0)
const h = ref(0)
const musicName = ref('The theme of Bangaichi.mp3')
const requestAnimationFrameId = ref(0)
const loading = ref(false)
// 初始化
function initCanvas() {
  if (canvasH.value) {
    w.value = canvasH.value.width = window.innerWidth || 600
    h.value = canvasH.value.height = window.innerHeight || 600
    ctx.value = canvasH.value?.getContext('2d') as CanvasRenderingContext2D // 获取canvas的上下文
  }
}
function initAudio() {
  atx.value = new AudioContext() // 创建一个音频上下文
  const source = atx.value.createMediaElementSource(audioA?.value as HTMLAudioElement)
  // 初始音量
  audioA.value!.volume = 0.2
  analyser.value = atx.value.createAnalyser() // 创建一个分析器
  source.connect(analyser.value) // 将音频源连接到分析器
  analyser.value.connect(atx.value.destination) // 将分析器连接到音频输出
  analyser.value.fftSize = 256// 设置音频数据的大小
  const bufferLength = analyser.value.frequencyBinCount// 获取音频数据的长度
  dataArray = new Uint8Array(bufferLength)// 创建一个与音频数据长度相等的数组

  // 手动触发AudioContext.resume()方法，以启动AudioContext
  document.addEventListener('click', () => {
    // 判断是否是播放状态
    if (audioA.value?.paused) {
      atx.value?.resume()
      audioA.value?.play()
    }
  })
  audioA.value?.addEventListener('play', draw)
  // 取消动画方式二：
  audioA.value?.addEventListener('pause', () => {
    cancelAnimationFrame(requestAnimationFrameId.value)
  })
}

// 处理选择的音频文件
function handleAudioFileChange(e: any) {
  // 获取音频文件名字
  musicName.value = e.target.files[0].name || 'The theme of Bangaichi.mp3'
  if (audioFile.value?.files && audioFile.value.files[0]) {
    loading.value = true
    const reader = new FileReader()
    reader.onload = function (e) {
      audioA.value!.src = e.target?.result as string // 将读取到的音频数据赋值给 audio 标签的 src 属性
      audioA.value!.load() // 加载音频
      audioA.value!.play() // 播放音频
    }
    reader.readAsDataURL(audioFile.value.files[0]) // 作用：将文件读取为 DataURL 格式的字符串
    reader.onloadend = () => {
      loading.value = false
    }
  }
}

function draw() {
  if (ctx.value) {
    ctx.value.clearRect(0, 0, w.value, h.value)
    if (analyser.value) {
      analyser.value.getByteFrequencyData(dataArray) // 将当前分析后的音频数据存入数组
      const dataLen = dataArray.length / 3
      const barWidth = w.value / dataLen / 2
      for (let i = 0; i < dataLen; i++) {
        const value = dataArray[i]
        const percent = value / 256
        const barHeight = h.value * percent
        /* 左右对称 */
        // 左边
        const x1 = i * barWidth + w.value / 2
        // 右边
        const x2 = w.value / 2 - (i + 1) * barWidth

        const y = h.value - barHeight
        const hue = i / dataLen * 360

        ctx.value.fillStyle = `hsl(${hue}, 100%, 50%)`
        ctx.value.fillRect(x1, y, barWidth - 2, barHeight)
        ctx.value.fillRect(x2, y, barWidth - 2, barHeight)
      }
    }
  }
  if (audioA.value?.paused)
    return // 取消动画方式一：
  requestAnimationFrameId.value = requestAnimationFrame(draw)
}
onMounted(() => {
  initCanvas()
  initAudio()
  window.addEventListener('resize', initCanvas)
})
</script>

<template>
  <div class="h-full relative bg-white/10  backdrop-blur">
    <canvas ref="canvasH" />
    <input id="upload" ref="audioFile" type="file" class=" hidden " @change="handleAudioFileChange">
    <div
      class="w-80 left-0 right-0 mx-auto z-50 bg-white/50  backdrop-blur absolute bottom-36 rounded-full overflow-hidden flex-y-center"
    >
      <label for="upload" class="font-mono text-purple-600 rounded-sm bg-purple-500/10  px-2 py-1">选择文件</label>
      <span class=" text-blue-600 bg-blue-600/10  px-2 py-1 truncate flex-1">{{ musicName }}</span>
    </div>
    <div v-if="loading" class="loading text-3xl  text-violet-600 bg-white/30 p-6  backdrop-blur absolute top-1/2 left-1/2 translate-1/2">
      加载中...
    </div>
    <audio ref="audioA" controls class="w-80 left-0 right-0 mx-auto z-50 absolute bottom-20 ">
      <source src="../../assets/music/bangaichi.mp3">
    </audio>
  </div>
</template>
