/*
1.获取 body 的宽高，设置 canvas 的宽高
2.监听 window 的 resize 事件，重新设置 canvas 的宽高
3.初始化 canvas 的 ctx
4.返回 canvasRef 和 ctx
*/
type CanvasFn = (cancelAnimate?: Function) => void
interface Option {
  init?: CanvasFn
  animate?: CanvasFn
}
export function useCanvas(option?: Option) {
  const { init, animate } = option || {}
  let requestAnimationId = 0
  const canvasRef = ref<HTMLCanvasElement>()
  const width = ref<number>(window.innerWidth)
  const height = ref<number>(window.innerHeight)
  const context = ref<CanvasRenderingContext2D>()

  const debounceResize = useDebounceFn(() => {
    canvasRef.value!.width = width.value = window.innerWidth
    canvasRef.value!.height = height.value = window.innerHeight
  }, 300)

  onMounted(() => {
    if (canvasRef.value) {
      canvasRef.value.width = width.value
      canvasRef.value.height = height.value
      context.value = canvasRef.value?.getContext('2d') as CanvasRenderingContext2D

      function cancelAnimate() {
        cancelAnimationFrame(requestAnimationId)
      }

      init && init(cancelAnimate)
      function doAnimate() {
        cancelAnimate()
        requestAnimationId = requestAnimationFrame(doAnimate)
        animate && animate(cancelAnimate)
      }
      doAnimate()
    }
    window.addEventListener('resize', debounceResize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', debounceResize)
    cancelAnimationFrame(requestAnimationId)
  })
  return {
    width,
    height,
    canvasRef,
    context,
  }
}
