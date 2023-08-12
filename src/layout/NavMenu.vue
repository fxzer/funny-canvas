<script setup lang='ts'>
import type { PropType } from 'vue'
import { defineProps } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  navs: {
    type: Array as PropType<Nav[]>,
    required: true,
  },
})

const currentRoute = useRoute()
const isActive = (path: string) => currentRoute.path === path
</script>

<template>
  <div class="text-center absolute bottom-8 left-0 right-0 select-none z-50">
    <router-link
      v-for=" nav in navs" :key="nav.id" :to="`/${nav.label}`" class="link inline-block text-xl font-mono ease-in-out duration-500 group
   hover:text-zinc-600 origin-bottom relative  dark:hover:text-zinc-400"
      :class="isActive(`/${nav.label}`) ? 'text-black dark:text-white scale-125' : 'text-zinc-400 dark:text-zinc-600'
      "
    >
      <span class="letter px-2" @mouseenter="nav.ishover = true" @mouseleave="nav.ishover = false">
        {{ nav.label.toUpperCase() }}</span>
      <div
        class="wh-20 origin-bottom-left -rotate-45 dark:border border-slate-100 absolute bottom-8 left-[14px]
     overflow-hidden -z-10 ease-in-out duration-500 transition-all" :class="nav.ishover ? 'block' : 'hidden'"
      >
        <img :src="nav.src" class="wh-full rotate-45">
      </div>
    </router-link>
  </div>
</template>
