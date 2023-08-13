<script setup='props' lang='ts'>
const { context, canvasRef, width, height } = useCanvas()

const { random } = Math
const r180 = Math.PI
const r15 = Math.PI / 12
const r90 = Math.PI / 2

// 3-6之间的随机数
const maxDeep = ref(5)
const maxLen = ref(8)
const stopped = ref(false)
type MyFunctionType = (...args: any[]) => void

function getNextPoint(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta)
  const dy = r * Math.sin(theta)
  return [x + dx, y + dy]
}
let controls: any

onMounted(async () => {
  let steps: MyFunctionType[] = []
  let prevSteps: MyFunctionType[] = []

  let deep = 0

  const step = (x: number, y: number, rad: number) => {
    const length = random() * maxLen.value

    const [nx, ny] = getNextPoint(x, y, length, rad)

    context.value!.beginPath()
    context.value!.moveTo(x, y)
    context.value!.lineTo(nx, ny)
    context.value!.stroke()

    const rad1 = rad + random() * r15
    const rad2 = rad - random() * r15

    if (nx < -10 || nx > width.value || ny < -10 || ny > height.value)
      return

    if (deep <= maxDeep.value || random() > 0.5)
      steps.push(() => step(nx, ny, rad1))
    if (deep <= maxDeep.value || random() > 0.5)
      steps.push(() => step(nx, ny, rad2))
  }

  const frame = () => {
    deep += 1
    prevSteps = steps
    steps = []

    if (!prevSteps.length) {
      controls.pause()
      stopped.value = true
    }
    prevSteps.forEach(i => i())
  }
  controls = useRafFn(frame, { immediate: false })

  const start = () => {
    controls.pause()
    deep = 0
    context.value!.clearRect(0, 0, width.value, height.value)
    context.value!.lineWidth = 1
    // 透明度 30%的灰色
    context.value!.strokeStyle = '#c9cdd440'
    prevSteps = []
    steps = random() < 0.5
      ? [
          () => step(0, random() * height.value, 0),
          () => step(width.value, random() * height.value, r180),
        ]
      : [
          () => step(random() * width.value, 0, r90),
          () => step(random() * width.value, height.value, -r90),
        ]
    controls.resume()
    stopped.value = false
  }

  start()
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>

<style scoped lang='scss'>

</style>
