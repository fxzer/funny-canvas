<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import Play from '@/components/Play.vue'
const canvas = ref()
const audio1 = ref()
const audio2 = ref()
const audio3 = ref()
const audio4 = ref()
const audio5 = ref()
const audio6 = ref()
const audio7 = ref()
const audio8 = ref()
const audioGroup1 = [audio1, audio2, audio3]
const audioGroup2 = [audio4, audio5, audio6]
const audioGroup3 = [audio7, audio8]
const ctx = ref(null);
let fireworks = [];

class Particle {
  randColor() {
    return `rgb(${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)})`;
  }
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;

    this.color = this.randColor();
  }

  update() {
    this.vy += 0.1;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    if (this.x < 0 || this.y < 0 && this.x > canvas.width || this.y > canvas.height) return;

    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    context.fill();
  }
}
class Explosion {
  constructor(x, y) {
    this.particles = new Array();
    for (var i = 0; i < 70; i++) {
      var vx = Math.sin(i / 30 * Math.PI * 2);
      var vy = Math.cos(i / 30 * Math.PI * 2);
      var particle = new Particle(x, y);
      var fuzziness = Math.random() * 5;
      particle.vx = vx * fuzziness;
      particle.vy = vy * fuzziness;

      this.particles.push(particle);
    }
  }

  update() {
    this.particles.forEach(function (par) {
      par.update();
    })
  }

  draw(ctx) {
    this.particles.forEach(function (par) {
      par.draw(ctx);
    })
  }
}

class Firework {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.blown = false;
    this.source = new Particle(x, y);
    this.source.vx = vx;
    this.source.vy = vy;
  }

  update() {
    if (this.source.vy > 0 && !this.blown) {
      this.explosion = new Explosion(this.source.x, this.source.y);
      this.blown = true;
    }
    if (!this.blown) {
      this.source.update();
    }
    else {
      this.explosion.update();
    }
  }
  draw(ctx) {
    if (this.blown) {
      this.explosion.draw(ctx);
    }
    else {
      this.source.draw(ctx);
    }
  }
}

const initCanvas = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth || 600;
    canvas.value.height = window.innerHeight || 600;
    ctx.value = canvas.value.getContext('2d');
  }
}
const initFirework = () => {
  let w = canvas.value.width;
  let h = canvas.value.height;
  fireworks = [
    new Firework(w * Math.random(), h, 0, -10),
    new Firework(w * Math.random(), h, 0, -10),
    new Firework(w * Math.random(), h, 0, -10),
    new Firework(w * Math.random(), h, 0, -10),
  ]
}
const amimate = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  fireworks.forEach(async function (firework) {
    firework.update();
    firework.draw(ctx.value);
    if (firework.blown && !firework.playSound) {
      await audioGroup1[parseInt(Math.random() * 3)].value.play()
      await audioGroup2[parseInt(Math.random() * 3)].value.play()
      await audioGroup3[parseInt(Math.random() * 2)].value.play();
      firework.playSound = true;
    }
  })
  requestAnimationFrame(amimate)
}
const showPlayBtn = ref(true)
const playHandler =  () => {
  amimate()
  setTimeout(() => {
    showPlayBtn.value = false
  }, 100);
}
onMounted(() => {
  initCanvas();
  initFirework();
  setInterval(function () {
    initFirework()
  }, 5000)
})

onUnmounted(() => {
  // window.cancelAnimationFrame(requestAnimationId)
})
</script>
<template>
  <div class="relative">
    <canvas ref='canvas'></canvas>
    <Play class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 cursor-pointer text-sky-200 dark:text-gray-500" @click="playHandler"  v-if="showPlayBtn"></Play>
    <audio ref="audio1" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/lift1.mp3"></audio>
    <audio ref="audio2" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/lift2.mp3"></audio>
    <audio ref="audio3" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/lift3.mp3"></audio>
    <audio ref="audio4" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst-sm-1.mp3"></audio>
    <audio ref="audio5" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst-sm-2.mp3"></audio>
    <audio ref="audio6" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst2.mp3"></audio>
    <audio ref="audio7" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/crackle-sm-1.mp3"></audio>
    <audio ref="audio8" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/crackle1.mp3"></audio>
  </div>
</template>

<style scoped lang='scss'></style>
