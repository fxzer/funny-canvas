<template>
   <canvas ref="canvasL"></canvas>
</template>
<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import * as THREE ,{ vertices } from 'three'
console.log("[ THREE ]-7", THREE);

const canvasL = ref<HTMLCanvasElement | null>(null)
let scene: any, camera: any, renderer: any

function init() {
   renderer = new THREE.WebGLRenderer({
      canvas: canvasL.value,
      antialias: true
   });
   renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
   renderer.setSize(window.innerWidth, window.innerHeight);
   scene = new THREE.Scene();
   camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
   );
   camera.position.z = 60;
}


let length = 30;
let mouseJump = {
   x: 0,
   y: 0
};
let offset = 0;

class Spline {
   geometry: any
   material: any
   color: number
   mesh: any
   speed: number
   constructor() {
      this.color = Math.floor(Math.random() * 80 + 180)
      for (let j = 0; j < 180; j++) {
         this.geometry.vertices.push(
            new THREE.Vector3(j / 180 * length * 2 - length, 0, 0)
         );
         this.geometry.colors[j] = new THREE.Color(
            "hsl(" + (j * 0.6 + this.color) + ",70%,70%)"
         );
      }
      this.material = new THREE.LineBasicMaterial({
         vertexColors: THREE.VertexColors
      });
      this.mesh = new THREE.Line(this.geometry, this.material);
      this.speed = (Math.random() + 0.1) * 0.0002;
      scene.add(this.mesh);
   }
}
let isMouseDown = false;
let prevA = 0;
function render(a: any) {
   requestAnimationFrame(render);
   for (let i = 0; i < splines.length; i++) {
      for (let j = 0; j < splines[i].geometry.vertices.length; j++) {
         let vector = splines[i].geometry.vertices[j];
         vector.y =
            noise.simplex2(j * 0.05 + i - offset, a * splines[i].speed) * 8;
         vector.z = noise.simplex2(vector.x * 0.05 + i, a * splines[i].speed) * 8;

         vector.y *= 1 - Math.abs(vector.x / length);
         vector.z *= 1 - Math.abs(vector.x / length);
      }
      splines[i].geometry.verticesNeedUpdate = true;
   }
   scene.rotation.x = a * 0.0003;
   if (isMouseDown) {
      mouseJump.x += 0.001;
      if (a - prevA > 100) {
         updateColor();
         prevA = a;
      }
   } else {
      mouseJump.x -= 0.001;
   }
   mouseJump.x = Math.max(0, Math.min(0.07, mouseJump.x));
   offset += mouseJump.x;
   renderer.render(scene, camera);
}
let splines: Spline[] = [];
for (let i = 0; i < 12; i++) splines.push(new Spline());


function onResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
}


function updateColor() {
   for (let i = 0; i < splines.length; i++) {
      let color = Math.abs((splines[i].color - offset * 10) % 360);
      for (let j = 0; j < splines[i].geometry.vertices.length; j++) {
         splines[i].mesh.geometry.colors[j] = new THREE.Color(
            "hsl(" + (j * 0.6 + color) + ",70%,70%)"
         );
      }
      splines[i].mesh.geometry.colorsNeedUpdate = true;
   }
}
function onMouseDown() {
   isMouseDown = true;
   return false;
}
function onMouseUp() {
   isMouseDown = false;
}
onMounted(() => {
   init()
   window.addEventListener("resize", onResize);
   window.addEventListener("keydown", onMouseDown);
   document.body.addEventListener("mousedown", onMouseDown);
   document.body.addEventListener("mouseup", onMouseUp);
   document.body.addEventListener("touchstart", onMouseDown);
   document.body.addEventListener("touchend", onMouseUp);
   requestAnimationFrame(render);

})
</script>
<style scoped lang='scss'></style>