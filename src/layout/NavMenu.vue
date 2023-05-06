<template>
  <div class="text-center absolute bottom-8 left-0 right-0 select-none">
    <router-link v-for="nav in navs" :key="nav" :to="'/' + nav" class="inline-block text-xl  px-2  font-mono ease-in-out duration-100 transform  
       text-zinc-400 hover:text-zinc-600 origin-bottom
       dark:text-zinc-600   dark:hover:text-zinc-400" :class="{
         'text-zinc-800   dark:text-zinc-200 scale-125': currentRoute.path === '/' + nav,
       }">
      {{ nav.toUpperCase() }}</router-link>
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
<style scoped lang='scss'></style>