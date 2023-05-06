<template>
  <div class="text-center absolute bottom-8 left-0 right-0 select-none">
    <router-link v-for="nav in navs" :key="nav" :to="'/' + nav" class="link inline-block text-xl  px-2  font-mono  ease-in-out   duration-500 group
       text-zinc-400 hover:text-zinc-600 origin-bottom relative
       dark:text-zinc-600   dark:hover:text-zinc-400" :class="{
         'text-zinc-800   dark:text-zinc-200 scale-125': currentRoute.path === '/' + nav,
       }">
      <span> {{ nav.toUpperCase() }}</span>
      <div
        class="preview w-20 h-20 origin-bottom-left -rotate-45 dark:border border-slate-100 absolute bottom-10 left-[14px] 
        overflow-hidden opacity-0 group-hover:opacity-100 -z-10 group-hover:z-10 ease-in-out duration-500 transition-all">
        <img src="../assets/imgs/5.jpg" alt="" class=" w-full h-full rotate-45">
      </div>
    </router-link>
  </div>
</template>
<script setup lang='ts'>
import { defineProps, PropType } from 'vue'
defineProps({
  navs: {
    type: Array as PropType<string[]>,
    required: true,
  },
})
import { useRoute } from 'vue-router'
const currentRoute = useRoute()
</script>
<style scoped lang='scss'></style>~