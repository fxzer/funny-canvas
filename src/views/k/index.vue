<template>
   <canvas ref='canvasF'></canvas>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
const canvasF = ref<HTMLCanvasElement | null>(null)
let ctx = ref<CanvasRenderingContext2D | null>(null);
let requestAnimationFrameId: number = 0;
const particleCount = 1000
let particles = reactive<Particle[]>([]);
let count =  0;
class Particle {
   l: number;
   ix: number;//初始位置
   iy: number; 
   tx:number;//目标位置
   ty:number; 
   x: number; //当前位置
   y: number; 
   color: string;
   constructor(ix: number, iy: number, l: number ,color: string) {
      this.ix = ix // 初始位置
      this.iy = iy
      this.l = l;
      this.color = color;
      this.x = ix
      this.y = iy
      this.tx = ix
      this.ty = iy
   }
   update( ){
      if(this.tx - this.x)  return
         this.x +=  (this.tx - this.x) * 0.01
         this.y +=  (this.ty - this.x) * 0.01
      
   }
   draw() {
      ctx.value!.fillStyle = this.color
      ctx.value?.fillRect(this.x, this.y, this.l, this.l)
   }
}
const initCanvas = () => {
   canvasF.value!.width = window.innerWidth || 600;
   canvasF.value!.height = window.innerHeight || 600;
   ctx.value = canvasF.value!.getContext("2d");
}
//生成指定范围的整数
const randomInt = (min: number, max: number) => {
   return Math.floor(Math.random() * (max - min + 1) + min)
}
//获取下一个字母
const getNextLetter = () => {
   return String.fromCharCode(Math.round(Math.random() * 26) + 65)
}
//在中心区域生成随机粒子
const makeParticles = () => {
   particles = []
   for (let i = 0; i < particleCount; i++) {
      let rx = canvasF.value!.width / 2 + randomInt(-200,200)
      let ry = canvasF.value!.height / 2 + randomInt(-200,200)
      const particle = new Particle(rx, ry, 6, "white")
      particles.push(particle)
   }
}


//填充字母，获取像素点及其坐标
const getPixels = () => {
   ctx.value!.clearRect(0, 0, canvasF.value!.width, canvasF.value!.height)
   let letter = getNextLetter()
   ctx.value!.fillStyle = 'black';
   ctx.value!.font = 'italic bold 360px Serif';
   let lx = canvasF.value!.width / 2 - ctx.value!.measureText(letter).width / 2
   let ly = canvasF.value!.height / 2 + 100
   ctx.value?.fillText(letter, lx, ly);
   const imageData = ctx.value?.getImageData(0, 0, canvasF.value!.width, canvasF.value!.height)
   count = 0
   for (var y = 0; y < canvasF. value!.height; y += 6) {
      for (var x = 0; x < canvasF.value!.width; x += 6) {
         if (imageData!.data[(y * canvasF.value!.width + x) * 4 + 3] > 128) {
            particles[count].x = x;
            particles[count].y = y;
            count++
         }
      }
   }
}

const animate = () => {
   cancelAnimationFrame(requestAnimationFrameId)
   ctx.value!.clearRect(0, 0, canvasF.value!.width, canvasF.value!.height)
    for(let i = 0; i < count; i++){
      particles[i].update()
      particles[i].draw();
   }
  requestAnimationFrameId =  requestAnimationFrame(animate)
}


//定时切换字母
let timer = setInterval(() => {
   getPixels()
}, 2000)

onMounted(() => {
   initCanvas()
   makeParticles()
   getPixels()
   animate()

})

onUnmounted(() => {
   clearInterval(timer)
})
</script>
<style scoped lang='scss'></style>