<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { reactive } from 'vue'
import NavMenu from './NavMenu.vue'
import imgs from '@/contants/imgs'
import Arrow from '@/components/Arrow.vue'
import Logo from '@/components/Logo.vue'
import ThemeBtn from '@/components/ThemeBtn.vue'

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))
const navs: Nav[] = letters.map((letter, index) => ({
  id: index,
  label: letter,
  ishover: false,
  src: imgs[letter],
}))
const navList = reactive(navs)
const currentRouter = useRouter()
const currentRoute = useRoute()

enum Direction {
  prev = -1,
  next = 1,
}
function switchHandler(direction: Direction) {
  const letter = currentRoute.path.slice(1)
  const lastLetter = navs[navs.length - 1].label
  if (direction === Direction.prev) {
    if (letter === navs[0].label) {
      currentRouter.push(`/${lastLetter}`)
    }
    else {
      const nextIdx = navs.findIndex(label => label.label === letter) + direction
      currentRouter.push(`/${navs[nextIdx].label}`)
    }
  }
  else {
    if (letter === lastLetter) {
      currentRouter.push(`/${navs[0].label}`)
    }
    else {
      const nextIdx = navs.findIndex(label => label.label === letter) + direction
      currentRouter.push(`/${navs[nextIdx].label}`)
    }
  }
}

const isDark = useDark()
isDark.value = true
const toggleDark = useToggle(isDark)
</script>

<template>
  <div id="layout" class="w-full h-full relative">
    <Logo />
    <router-view />
    <NavMenu :navs="navList" />
    <Arrow class="left-4 rotate-180  " @click="switchHandler(Direction.prev)" />
    <Arrow class="right-4 " @click="switchHandler(Direction.next)" />
    <ThemeBtn v-model="isDark" @click="() => toggleDark()" />
  </div>
</template>
