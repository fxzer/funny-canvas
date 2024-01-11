<script setup lang="ts">
const { x, y } = useMouse()
const { canvasRef, context, width, height } = useCanvas({ animate })

interface Particle {
  x: number
  y: number
  dx: number
  dy: number
}
const particles = ref<Particle[]>([])
const particleRadius = 2
const attrtchDistance = 180
const connectionDistance = 120
const connectionOpacity = 0.2
const isDark = useDark()
const particleColor = ref(isDark.value ? '#fff' : '#000')
const lineColor = ref(isDark.value ? 'rgba(255,255,255,' : 'rgba(0,0,0,')
const debounceResize = useDebounceFn(init, 500)
watchEffect(() => {
  particleColor.value = isDark.value ? '#fff' : '#000'
  lineColor.value = isDark.value ? 'rgba(255,255,255,' : 'rgba(0,0,0,'
})

function init() {
  particles.value = []
  for (let i = 0; i < 100; i++) {
    const particle: Particle = {
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 - 1,
    }
    particles.value.push(particle)
  }
}

function animate() {
  if (!context.value || !canvasRef.value)
    return
  context.value.clearRect(0, 0, width.value, height.value)
  particles.value.forEach((particle) => {
    const distance = Math.sqrt(
      (particle.x - x.value) ** 2
      + (particle.y - y.value) ** 2,
    )
    if (distance < attrtchDistance) {
      const opacity = 1 - distance / attrtchDistance
      context.value?.beginPath()
      context.value?.moveTo(particle.x, particle.y)
      context.value?.lineTo(x.value, y.value)
      context.value!.strokeStyle = `${lineColor.value}${opacity * connectionOpacity})`
      context.value?.stroke()
      context.value?.closePath()
    }
    // 如果<180并且大于120，则吸引
    if (x.value && y.value && distance < attrtchDistance && distance > connectionDistance) {
      if (distance < connectionDistance + 10) {
        particle.x += (x.value - particle.x) * 0.01
        particle.y += (y.value - particle.y) * 0.01
      }
      else {
        particle.x += (x.value - particle.x) * 0.01
        particle.y += (y.value - particle.y) * 0.01
      }
    }
    else {
      particle.x += particle.dx
      particle.y += particle.dy
    }

    if (particle.x < particleRadius || particle.x > width.value - particleRadius)
      particle.dx *= -1

    if (particle.y < particleRadius || particle.y > height.value - particleRadius)
      particle.dy *= -1

    context.value?.beginPath()
    context.value?.arc(particle.x, particle.y, particleRadius, 0, Math.PI * 2)
    context.value!.fillStyle = `${particleColor.value}`
    context.value?.fill()
    context.value?.closePath()

    particles.value.forEach((otherParticle) => {
      if (particle !== otherParticle) {
        const dp = Math.sqrt(
          (particle.x - otherParticle.x) ** 2
          + (particle.y - otherParticle.y) ** 2,
        )

        if (dp < connectionDistance) {
          const opacity = 1 - dp / connectionDistance
          context.value!.beginPath()
          context.value!.moveTo(particle.x, particle.y)
          context.value!.lineTo(otherParticle.x, otherParticle.y)
          context.value!.strokeStyle = `${lineColor.value}${opacity * connectionOpacity})`
          context.value!.stroke()
          context.value!.closePath()
        }
      }
    })
  })
}

init()
window.addEventListener('resize', debounceResize)
</script>

<template>
  <canvas ref="canvasRef" />
</template>
