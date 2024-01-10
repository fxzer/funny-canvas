<script setup lang='ts'>
defineProps({
  navs: {
    type: Array as PropType<Nav[]>,
    required: true,
  },
})

const currentRoute = useRoute()
const activeClass = (path: string) => currentRoute.path === path ? '!text-green scale-125' : 'text-zinc'
</script>

<template>
  <div text-center absolute bottom-8 left-0 right-0 select-none z-50>
    <router-link
      v-for=" nav in navs" :key="nav.id" :to="`/${nav.label}`"
      class="link inline-block text-xl font-mono ease-in-out duration-200 group hover:text-zinc-600 origin-bottom relative  dark:hover:text-zinc-200"
      :class="activeClass(`/${nav.label}`)"
    >
      <span class="letter px-2" @mouseenter="nav.ishover = true" @mouseleave="nav.ishover = false">
        {{ nav.label.toUpperCase() }}</span>
      <div
        border="dark:~ slate-200" class="wh-20 origin-bottom-left -rotate-45 absolute bottom-8 left-[14px] overflow-hidden -z-10 ease-in-out duration-500 transition-all"
        :class="nav.ishover ? 'block' : 'hidden'"
      >
        <img :src="nav.src" class="wh-full rotate-45">
      </div>
    </router-link>
  </div>
</template>
