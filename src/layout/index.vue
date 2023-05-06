<template>
  <div id="layout" class="w-full h-full relative">
    <Logo />
    <router-view />
    <NavMenu :navs="navs" />
    <Arrow class="left-4 rotate-180 arrow-common" @click="switchHandler(Direction.prev)" />
    <Arrow class="right-4  arrow-common" @click="switchHandler(Direction.next)" />
  </div>
</template>
<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import NavMenu from './NavMenu.vue';
import Arrow from '@/components/Arrow.vue';
import Logo from '@/components/Logo.vue';

const navs = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))
const currentRouter = useRouter()
const currentRoute = useRoute()

enum Direction {
  prev = -1,
  next = 1
}
const switchHandler = (direction: Direction) => {
  let edgeIdx = direction == Direction.prev ? 0 : navs.length - 1
  let isEdge = navs.indexOf(currentRoute.path.slice(1)) === edgeIdx
  let nextIdx = navs.indexOf(currentRoute.path.slice(1)) + direction
  let edgeNextPath = direction == Direction.prev ? '/' + navs[navs.length - 1] : '/' + navs[0]
  let nextPath = isEdge ? edgeNextPath : navs[nextIdx]
  currentRouter.push(nextPath)
}
</script>
<style scoped lang='scss'></style>