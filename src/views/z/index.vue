<script setup lang='ts'>
const { canvasRef } = useCanvas()
function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDec(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(4))
}

function getDirection() {
  const arr = [-1, 1]
  return arr[getRandom(0, 1)]
}

function strRgbToArr(str: string) {
  return str
    .substring(4, str.length - 1)
    .replace(/ /g, '')
    .split(',')
    .map(i => Number(i))
}

function avgColor(rgb: number[]) {
  const out = []

  for (const i of rgb) {
    const dif = 255 - i
    const r = 255 - Math.floor(Math.random() * (dif * 2))
    out.push(r)
  }

  return `rgb(${out[0]},${out[1]},${out[2]})`
}

class CloudHeart {
  speed: number
  radius: number
  direction: number
  dead: boolean
  angle: number
  birthday: number
  x?: number
  y?: number
  alpha: number
  size: number
  startSize: number
  baby: boolean
  img: HTMLImageElement
  cx: number
  cy: number

  constructor(size: number, img: HTMLImageElement, x: number, y: number) {
    const spread = size * getRandomDec(0.2, 1.2)
    this.alpha = 0
    this.startSize = size
    this.size = size / 3
    this.baby = true
    this.img = img
    this.cx = getRandom(x - spread, x + spread)
    this.cy = getRandom(y - spread, y + spread)
    this.speed = getRandom(500, 1500)
    this.radius = getRandom(5, 30)
    this.direction = getDirection()
    this.dead = false
    this.angle = 0
    this.birthday = performance.now()
  }

  animate(ts: number) {
    const elapsed = ts - this.birthday
    const inc = this.startSize / 500

    this.angle = Math.PI * (ts / this.speed)

    if (this.direction === 1) {
      this.x = this.cx + Math.cos(this.angle) * this.radius
      this.y = this.cy + Math.sin(this.angle) * this.radius
    }
    else {
      this.x = this.cx - Math.sin(this.angle) * this.radius
      this.y = this.cy - Math.cos(this.angle) * this.radius
    }

    this.alpha = (this.size / this.startSize)

    if (this.baby)
      this.size = this.size + (elapsed * inc)

    else
      this.size = this.startSize - ((elapsed / 2.2) * inc)

    if (this.size >= this.startSize) {
      this.baby = false
      this.birthday = ts
      this.startSize = this.size
    }

    if (this.size < 0)
      this.dead = true
  }
}

class GrowHeart {
  constructor(img, x, y, canvas) {
    this.size = 0
    this.x = x
    this.y = y
    this.img = img
    this.dead = false
    this.fadeout = false
    this.birthday = performance.now()
    this.w = canvas.width
    this.alpha = 0.6
  }

  fade() {
    this.fadeout = true
  }

  animate(ts) {
    const elapsed = ts - this.birthday

    this.size += elapsed / 10
    this.alpha -= elapsed / 50000

    if (this.alpha < 0)
      this.dead = true
  }
}

class HeartCloud {
  size: number
  paint: boolean
  clicking: boolean
  heartArray: any[]
  color: string
  svg: HTMLElement
  canvas: HTMLCanvasElement
  ctx: any
  cycle: any
  constructor(el: HTMLCanvasElement, svg: HTMLElement) {
    this.size = 20
    this.paint = false
    this.clicking = false
    this.heartArray = []
    this.color = 'rgb(255,83,93)'

    this.svg = svg

    this.canvas = el
    this.ctx = this.canvas.getContext('2d')

    this.canvasSize = this.canvasSize.bind(this)
    this.pushLogo = this.pushLogo.bind(this)

    this.bindEvents()
    this.canvasSize()
    this.animateCanvas(10)
  }

  canvasSize() {
    const style = window.getComputedStyle(this.canvas, null)
    const width = Number(style.getPropertyValue('width').slice(0, -2))
    const height = Number(style.getPropertyValue('height').slice(0, -2))

    this.canvas.width = width
    this.canvas.height = height
  }

  bindEvents() {
    window.addEventListener('resize', () => this.canvasSize())

    this.canvas.addEventListener('mousedown', () => { this.clicking = true })
    this.canvas.addEventListener('mouseup', () => {
      this.clicking = false
      this.killGrowHearts()
    })

    const down = ['mouseenter', 'touchstart']

    down.forEach((i) => {
      this.canvas.addEventListener(i, (e) => {
        this.paint = true
        this.pushLogo(e)
        this.cycle = setInterval(() => this.pushLogo(e), 100)
      }, false)
    })

    const up = ['mouseleave', 'touchend']

    up.forEach((i) => {
      this.canvas.addEventListener(i, () => {
        this.clearCycle()
        this.paint = false
      }, false)
    })

    const drag = ['mousemove', 'touchdrag']

    drag.forEach((i) => {
      this.canvas.addEventListener(i, (e) => {
        this.clearCycle()
        if (this.paint) {
          this.pushLogo(e)
          this.cycle = setInterval(() => this.pushLogo(e), 100)
        }
      }, false)
    })
  }

  killGrowHearts() {
    for (const h of this.heartArray) {
      if (h.fade)
        h.fade()
    }
  }

  clearCycle() {
    clearInterval(this.cycle)
    this.cycle = null
  }

  pushLogo(e: any) {
    const cloudSize = Math.floor(getRandom(20, 100) / this.size)

    for (let i = 0; i < cloudSize; i++) {
      const rgb = strRgbToArr(this.color)
      const color = avgColor(rgb)

      if (this.clicking) {
        const GH = new GrowHeart(
          // getRandom(this.size - 20, this.size + 20),
          this.createImg(color),
          this.getMousePos(e).x,
          this.getMousePos(e).y,
          this.canvas,
        )

        this.heartArray.push(GH)
      }
      else {
        const CH = new CloudHeart(
          getRandom(this.size - 20, this.size + 20),
          this.createImg(color),
          this.getMousePos(e).x,
          this.getMousePos(e).y,
        )

        this.heartArray.push(CH)
      }
    }
  }

  createImg(color: string) {
    (this.svg.querySelector('#inner') as HTMLElement).style.fill = color
    const xml = (new XMLSerializer()).serializeToString(this.svg)
    const img = new Image()
    img.src = `data:image/svg+xml;charset=utf-8,${xml}`
    return img
  }

  getMousePos(e: any) {
    const rect = this.canvas.getBoundingClientRect()

    const left = e.clientX ? e.clientX : e.targetTouches[0].clientX
    const top = e.clientY ? e.clientY : e.targetTouches[0].clientY

    return {
      x: left - rect.left,
      y: top - rect.top,
    }
  }

  animateCanvas(ts: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.heartArray.length > 0) {
      for (const g of this.heartArray) {
        if (g.dead) {
          const i = this.heartArray.indexOf(g)
          this.heartArray.splice(i, 1)
        }
        else {
          const x = g.x - (g.size / 2)
          const y = g.y - (g.size / 2)

          this.ctx.globalAlpha = g.alpha
          this.ctx.drawImage(g.img, x, y, g.size, g.size)
          g.animate(ts)
        }
      }
    }

    requestAnimationFrame(ts => this.animateCanvas(ts))
  }
}

onMounted(() => {
  const heart = document.querySelector('.heart') as HTMLElement
  const canvas = document.querySelector('canvas')

  canvas && heart && new HeartCloud(canvas, heart)
})
</script>

<template>
  <canvas ref="canvasRef" />
  <svg class="heart hidden cursor-crosshair" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.8 133.8"><g id="inner"><path class="st0" d="M41.9 100.7L11.8 70.6C-2 56.8-2 34.3 11.8 20.5c13.8-13.8 36.3-13.8 50.1 0L92 50.6c13.8 13.8 13.8 36.3 0 50.1-13.8 13.8-36.4 13.8-50.1 0z" /><path class="st0" d="M41.9 50.6L72 20.5c13.8-13.8 36.3-13.8 50.1 0 13.8 13.8 13.8 36.3 0 50.1L92 100.7c-13.8 13.8-36.3 13.8-50.1 0-13.8-13.8-13.8-36.3 0-50.1z" /><path class="st0" d="M63.4 122.2L36.6 95.4c-1.9-1.9-1.9-5.1 0-7.1l26.8-26.8c1.9-1.9 5.1-1.9 7.1 0l26.8 26.8c1.9 1.9 1.9 5.1 0 7.1l-26.8 26.8c-2 1.9-5.2 1.9-7.1 0z" /></g></svg>
</template>

<style scoped lang='scss'>

</style>
