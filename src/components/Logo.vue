<script setup lang='ts'>
const word = '26-CANVAS'
</script>

<template>
  <div class="logo-box font-mono text-zinc-600 dark:text-zinc-300 absolute top-6 left-0 text-sm right-0  mx-auto flex-center select-none">
    <p class="tracking-widest">
      {{ word }}
    </p>
    <div class="     rotate-45 origin-center grid grid-cols-3 grid-rows-3 w-16 h-16 p-1 mx-8 border-zinc-400 dark:border-zinc-600   border-solid border-[1.5px]">
      <span v-for="letter in word" :key="letter" class="text-center align-middle ">{{ letter }}</span>
    </div>
    <p class="tracking-widest  scale-x-[-1]">
      {{ word }}
    </p>
  </div>
</template>
