<template>
  <canvas ref='canvasF'></canvas>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
const canvasF = ref<HTMLCanvasElement>()
let requestAnimationId = 0;
let ctx = ref<CanvasRenderingContext2D | null>(null);
import useMouse from '@/hooks/useMouse';
const mouse = useMouse();
const canvas = reactive({
  w: 0,
  h: 0,
})
/* 类的定义 */
type Parent = {
  x: number,
  y: number,
  nextPos?: Parent
}
/*  */
let maxl = 300,
  minl = 50,
  n = 30,
  numt = 500,
  tent: tentacle[] = [],
  clicked = false,
  target = { x: 0, y: 0, errx: 0, erry: 0 },
  last_target = {x: 0, y: 0},
  t = 0,
  q = 10;
  console.log("[ clicked ]-28", clicked);

const initData = () => {
  for (let i = 0; i < numt; i++) {
    tent.push(
      new tentacle(
        Math.random() * canvas.w,
        Math.random() * canvas.h,
        Math.random() * (maxl - minl) + minl,
        n,
        Math.random() * 2 * Math.PI
      )
    );
  }
}

const draw = () => {
  //animation
  console.log("[ mouse ]-51", mouse);
  if (mouse.x) {
    target.errx = mouse.x.value - target.x;
    target.erry = mouse.y.value - target.y;
  } else {
    target.errx =
      canvas.w / 2 +
      ((canvas.h / 2 - q) * Math.sqrt(2) * Math.cos(t)) /
      (Math.pow(Math.sin(t), 2) + 1) -
      target.x;
    target.erry =
      canvas.h / 2 +
      ((canvas.h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) /
      (Math.pow(Math.sin(t), 2) + 1) -
      target.y;
  }

  target.x += target.errx / 10;
  target.y += target.erry / 10;

  t += 0.01;

  ctx.value!.beginPath();
  ctx.value!.arc(
    target.x,
    target.y,
    dist(last_target.x, last_target.y, target.x, target.y) + 5,
    0,
    2 * Math.PI
  );
  ctx.value!.fillStyle = "hsl(210,100%,80%)";
  ctx.value!.fill();

  for (let i = 0; i < numt; i++) {
    tent[i].move(last_target as Parent, target);
    tent[i].show2(target);
    tent[i].show(target);
  }
  last_target.x = target.x;
  last_target.y = target.y;

}
// 定义线段类
class segment {
  first: boolean;
  pos: Parent;
  nextPos: Parent;
  l: number;
  ang: number;

  constructor(parent: Parent, l: number, a: number, first: boolean) {
    // 判断是否是第一个线段
    this.first = first;
    // 如果是第一个线段，初始化位置为 parent 的位置
    if (first) {
      this.pos = {
        x: parent.x,
        y: parent.y,
      };
      // 如果不是第一个线段，初始化位置为上一个线段的 nextPos
    } else {
      this.pos = {
        x: parent.nextPos!.x,
        y: parent.nextPos!.y,
      };
    }
    // 线段长度和角度
    this.l = l;
    this.ang = a;
    // 计算下一个位置
    this.nextPos = {
      x: this.pos.x + this.l * Math.cos(this.ang),
      y: this.pos.y + this.l * Math.sin(this.ang),
    };
  }
  // 更新线段的位置，使其追随目标点
  update(t: Parent) {
    this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
    this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI);
    this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI);
    this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
    this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
  }
  // 退化线段的位置，以保持连续性
  fallback(t: Parent) {
    this.pos.x = t.x;
    this.pos.y = t.y;
    this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
    this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
  }
  // 画出线段
  show() {
    ctx.value!.lineTo(this.nextPos.x, this.nextPos.y);
  }
}

// 定义触手类
class tentacle {
  x: number;
  y: number;
  l: number;
  n: number;
  t: Parent;
  rand: number;
  angle: number = 0;
  dt: number = 0;
  segments: segment[];
  constructor(x: number, y: number, l: number, n: number, a: number) {
    console.log("[ a ]-158", a);
    // 触手的起始位置、长度、线段数量和角度
    this.x = x;
    this.y = y;
    this.l = l;
    this.n = n;
    this.t = { x: 0, y: 0 };
    this.rand = Math.random();
    this.segments = [new segment(this, this.l / this.n, 0, true)];
    for (let i = 1; i < this.n; i++) {
      this.segments.push(
        new segment(this.segments[i - 1] as any, this.l / this.n, 0, false)
      );
    }
  }
  move(last_target: Parent, target: Parent) {
    // 更新当前目标点和角度
    this.angle = Math.atan2(target.y - this.y, target.x - this.x);
    // 计算距离和时间间隔
    this.dt =
      dist(last_target.x, last_target.y, target.x, target.y) + 5;
    // 根据当前目标点和时间间隔计算新的目标点
    this.t = {
      x: target.x - 0.8 * this.dt * Math.cos(this.angle),
      y: target.y - 0.8 * this.dt * Math.sin(this.angle),
    };
    // 更新第一个线段以跟随目标点
    if (this.t.x) {
      this.segments[this.n - 1].update(this.t);
    } else {
      this.segments[this.n - 1].update(target);
    }
    // 更新其他线段以跟随前面的线段
    for (let i = this.n - 2; i >= 0; i--) {
      this.segments[i].update(this.segments[i + 1].pos);
    }
    // 如果触手到达了目标点，则让它们向后倒退
    if (
      dist(this.x, this.y, target.x, target.y) <=
      this.l + dist(last_target.x, last_target.y, target.x, target.y)
    ) {
      this.segments[0].fallback({ x: this.x, y: this.y });
      for (let i = 1; i < this.n; i++) {
        this.segments[i].fallback(this.segments[i - 1].nextPos);
      }
    }
  }
  show(target: Parent) {
    if (dist(this.x, this.y, target.x, target.y) <= this.l) {
      ctx.value!.globalCompositeOperation = "lighter";
      ctx.value!.beginPath();
      ctx.value!.lineTo(this.x, this.y);
      for (let i = 0; i < this.n; i++) {
        this.segments[i].show();
      }
      ctx.value!.strokeStyle =
        "hsl(" +
        (this.rand * 60 + 180) +
        ",100%," +
        (this.rand * 60 + 25) +
        "%)";
      ctx.value!.lineWidth = this.rand * 2;
      ctx.value!.lineCap = "round";
      ctx.value!.lineJoin = "round";
      ctx.value!.stroke();
      ctx.value!.globalCompositeOperation = "source-over";
    }
  }
  show2(target: Parent) {
    ctx.value!.beginPath();
    if (dist(this.x, this.y, target.x, target.y) <= this.l) {
      ctx.value!.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI);
      ctx.value!.fillStyle = "white";
    } else {
      ctx.value!.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
      ctx.value!.fillStyle = "darkcyan";
    }
    ctx.value!.fill();
  }
}

const initCanvas = () => {
  if (canvasF.value) {
    canvas.w = canvasF.value.width = window.innerWidth || 600;
    canvas.h = canvasF.value.height = window.innerHeight || 600;
    ctx.value = canvasF.value?.getContext('2d') as CanvasRenderingContext2D;   //获取canvas的上下文
  }
}


// 计算两个点之间的距离
const dist = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}


const amimate = () => {
  requestAnimationId = window.requestAnimationFrame(amimate);
  ctx.value!.clearRect(0, 0, canvas.w, canvas.h);
  draw();
}

onMounted(() => {
  initData()
  initCanvas();
  // amimate()
})
onUnmounted(() => {
  window.cancelAnimationFrame(requestAnimationId)
})


</script>
<style scoped lang='scss'></style>