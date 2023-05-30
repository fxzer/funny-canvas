<script setup lang="ts">
import { ref , onUnmounted } from "vue";
import ColorThief from "colorthief";
import pic1 from "@/assets/imgs/i/1.png";
import pic2 from "@/assets/imgs/i/2.png";
import pic3 from "@/assets/imgs/i/3.png";
import pic4 from "@/assets/imgs/i/4.png";
const pics = [pic1, pic2, pic3, pic4];

const index = ref(0);
const colorThief = new ColorThief();
const enterHandler = (e: EventTarget, i: number) => {
  const img = e?.target as HTMLImageElement;
  let colorTop3 = colorThief.getPalette(img, 3);
  const [c1, c2, c3] = colorTop3.map(c => `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
   document.body.style.setProperty("--color1", c1);
   document.body.style.setProperty("--color2", c2);
   document.body.style.setProperty("--color3", c3);   
   //使用c1,c2,c3给 body 设置渐变色 
   document.body.style.background = `linear-gradient(to bottom, ${c1}, ${c2}, ${c3})`;
  index.value = i;
};
onUnmounted(() =>{
   document.body.style.background = `transparent`;
})
</script>

<template>
  <div class=" fixed h-screen w-full flex items-center justify-center">
    <div class="grid grid-cols-2 gap-8 w-1/2 h-1/2">
      <img
        :src="pic"
        v-for="(pic, idx) in pics"
        :key="idx"
        class="pic"
        :class="index === idx ? '' : 'opacity-40'"
        @mouseenter="enterHandler($event, idx)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pic {
  @apply hover:scale-105 duration-300 border-2 border-white;
}
img {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
