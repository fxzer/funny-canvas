<template>
  <div id="layout" class="w-full h-full relative">
    <Logo />
    <router-view />
    <NavMenu :navs="navList" />
    <Arrow class="left-4 rotate-180 arrow-common" @click="switchHandler(Direction.prev)" />
    <Arrow class="right-4  arrow-common" @click="switchHandler(Direction.next)" />
    <button class="absolute top-4 right-4" @click="themeToggle">
    <svg   class=" text-slate-200"  v-show="isDark" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
    <svg   class=" text-orange-400" v-show="!isDark" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q-2.075 0-3.538-1.463T7 12q0-2.075 1.463-3.538T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17ZM1 13v-2h4v2H1Zm18 0v-2h4v2h-4Zm-8-8V1h2v4h-2Zm0 18v-4h2v4h-2ZM6.35 7.75L3.875 5.275l1.4-1.4L7.75 6.35l-1.4 1.4Zm12.375 12.375L16.25 17.65l1.4-1.4l2.475 2.475l-1.4 1.4ZM17.65 7.75l-1.4-1.4l2.475-2.475l1.4 1.4L17.65 7.75ZM5.275 20.125l-1.4-1.4L6.35 16.25l1.4 1.4l-2.475 2.475Z"/></svg>
  </button>
  </div>
</template>
<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core'
import { reactive } from 'vue'
import NavMenu from './NavMenu.vue';
import Arrow from '@/components/Arrow.vue';
import Logo from '@/components/Logo.vue';
import imgs from './imgs'
const navs:Nav[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)).map(( letter ,index) => {
  return {
    id: index,
    label: letter,
    hover:false,  
    src: imgs[letter],
  }
})
const navList =  reactive(navs)
const currentRouter = useRouter()
const currentRoute = useRoute()

enum Direction {
  prev = -1,
  next = 1
}
const switchHandler = (direction: Direction) => {
  const letter = currentRoute.path.slice(1)
  const lastLetter = navs[navs.length - 1].label
  if(direction == Direction.prev){
    if(letter === navs[0].label){
      currentRouter.push('/' + lastLetter)
    }else{
      let nextIdx = navs.findIndex((label) => label.label === letter) + direction
      currentRouter.push('/' + navs[nextIdx].label)
    }
  }else{
    if(letter === lastLetter){
      currentRouter.push('/' + navs[0].label)
    }else{
      let nextIdx = navs.findIndex((label) => label.label === letter) + direction
      currentRouter.push('/' + navs[nextIdx].label)
    }
  }
}

const isDark = useDark()
const toggleDark = useToggle(isDark)
const themeToggle = () => {
  toggleDark()
}
</script>
<style scoped lang='scss'></style>