<template>
   <canvas ref="canvasC"></canvas>
</template>
<script lang="ts" setup>
import { onMounted, ref, watchEffect, } from 'vue';
import useMouse from '@/hooks/useMouse'
import { useDark } from '@vueuse/core'

const isDark = useDark()

const canvasC = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null);
const { x, y } = useMouse()
let particlesArray: Particle[] = [];
const mouse = {
   x,
   y,
   radius: 200
}
/* 自定义例子颜色，数量，密度 */
class Particle { //粒子
   x: number;
   y: number;
   size: number;
   baseX: number;
   baseY: number;
   density: number;

   constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.size = 4; //粒子大小
      this.baseX = this.x; //粒子初始位置
      this.baseY = this.y; //粒子初始位置
      this.density = (Math.random() * 10) + 1; //粒子密度
   }
   draw() {
      ctx.value?.beginPath();
      ctx.value!.fillStyle = 'green';
      ctx.value?.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.value?.closePath();
      ctx.value?.fill();
   }
   update() {
      let dx = mouse.x.value - this.x;
      let dy = mouse.y.value - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy); // 粒子与鼠标的距离

      //计算力度
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;
      if (distance < mouse.radius) { //在鼠标半径范围内的粒子
         this.x -= directionX
         this.y -= directionY
      } else {//不在鼠标半径范围内的粒子
         let speed = 20; //粒子回到初始位置的速度越大越慢
         if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / speed;
         }
         if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / speed;
         }
      }
   }
}
const fillText = () => {
   /* 文字粒子 */
   let cw = canvasC.value!.width;
   let ch = canvasC.value!.height;
   particlesArray = [];
   let fontSize = 40;
   let text = 'ABC'
   let adjustX = Math.floor((cw - ctx.value!.measureText('A').width) / 3.5) - 400;
   let adjustY = Math.floor((ch - fontSize * 10) / 4);
   ctx.value!.font = `${fontSize}px Verdana`; //字体大小
   ctx.value?.fillText(text, 0, fontSize - (0.2 * fontSize), cw); //让文字初始化在 canvas 最左上角
   const textCoordinates = ctx.value?.getImageData(0, 0, cw, ch);
   let { width: w = 0, height: h = 0, data = [] } = textCoordinates || {};
   for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
         if (data[(y * 4 * w) + (x * 4) + 3] > 128) {
            particlesArray.push(new Particle(x * 20 + adjustX, y * 20 + adjustY))
         }
      }
   }
}
const initCanvas = () => {
   if (canvasC.value) {
      canvasC.value.width = window.innerWidth || 600;
      canvasC.value.height = window.innerHeight || 600;
      ctx.value = canvasC.value?.getContext('2d') as CanvasRenderingContext2D;   //获取canvas的上下文
      fillText()
   }
}

const strokePre = ref<string>('rgba(255,255,255,')

//粒子连接线
const connect = () => {
   let opacity = 0.6;
   for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
         let dx = particlesArray[a].x - particlesArray[b].x;
         let dy = particlesArray[a].y - particlesArray[b].y;
         let distance = Math.sqrt(dx * dx + dy * dy);
         let maxDistance = 30;
         if (distance < maxDistance) {
            opacity = parseFloat((1 - (distance / maxDistance)).toFixed(2));
            ctx.value!.strokeStyle = `${strokePre.value}${opacity})`;
            ctx.value?.beginPath();
            ctx.value!.lineWidth = 1.8;
            ctx.value?.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.value?.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.value?.stroke();
         }
      }
   }
}
//动画
const animate = () => {
   ctx.value?.clearRect(0, 0, canvasC.value!.width, canvasC.value!.height);
   for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].draw();
      particlesArray[i].update();
   }
   connect()
   requestAnimationFrame(animate);
}
watchEffect(() => {
   strokePre.value =  isDark.value ? 'rgba(255,255,255,' : 'rgba(0,0,0,'
})

onMounted(() => {
   initCanvas();
   animate()
})
</script>