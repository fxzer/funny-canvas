       
<template>
  <div class="text-center absolute bottom-8 left-0 right-0 select-none z-50">
    <router-link v-for=" nav  in navs" :key="nav.id" :to="'/' + nav.label"
     class="link inline-block text-xl  font-mono  ease-in-out   duration-500 group
     hover:text-zinc-600 origin-bottom relative   dark:hover:text-zinc-400" 
     :class="currentRoute.path === ('/' + nav.label) ? 'text-zinc-800 dark:text-zinc-200 scale-125' : 'text-zinc-400 dark:text-zinc-600'
       ">
      <span class="letter px-2" @mouseenter="nav.hover = true" @mouseleave="nav.hover = false"> {{
        nav.label.toUpperCase() }}</span>
      <div class="preview w-20 h-20 origin-bottom-left -rotate-45 dark:border border-slate-100 absolute bottom-10 left-[14px] 
        overflow-hidden opacity-0   -z-10 ease-in-out duration-500 transition-all" :class="{
          'opacity-100 z-10': nav.hover,
        }">
        <img  :src="nav.src"  alt="" class=" w-full h-full rotate-45">
      </div> 
    </router-link>
  </div>
</template>
<script setup lang='ts'>
import { defineProps, PropType } from 'vue'
defineProps({
  navs: {
    type: Array as PropType<Nav[]>,
    required: true,
  },
})
import { useRoute } from 'vue-router'
const currentRoute = useRoute()
</script>
<style scoped lang='scss'></style>~