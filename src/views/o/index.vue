<script setup lang='ts'>

</script>

<template>
  <video
    autoplay loop
    muted
    src="/starnight.mp4"
  />
</template>

<style scoped lang='scss'>
video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  background-size: cover;
  object-fit: cover;
}
</style>
