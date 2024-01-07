<script setup lang="ts">
</script>

<template>
  <div bg-repeat flex-center wh-full class="stars">
    <div z-10>
      <h1 text="gray/40 center 4xl" mb-20 style="font-family: 'sacramento';">
        Van Gogh 3D Gallery
      </h1>
      <div class="container">
        <div id="carousel">
          <div v-for="i in 9" :key="i" class="item" :class="`item${i}`" />
        </div>
      </div>
    </div>
    <div class="twinkling" />
    <div class="clouds" />
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Sacramento');
.container {
  margin: 10% auto;
  width: 240px;
  height: 180px;
  position: relative;
  top: 10px;
  perspective: 1000px;
}
#carousel {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  animation: rotation 20s infinite linear;
  &:hover {
    animation-play-state: paused;
  }

  .item {
    display: block;
    position: absolute;
    width: 200px;
    height: 150px;
    left: 10px;
    top: 10px;
    background-size: 100% 100% !important;
    background-repeat: no-repeat;
    background-position: center;
    overflow: hidden;
  }
  .item1 {
    background-image: url(/m/1.jpg);
  }
  .item2 {
    background-image: url(/m/2.jpg);
  }
  .item3 {
    background-image: url(/m/3.jpg);
  }
  .item4 {
    background-image: url(/m/4.jpg);
  }
  .item5 {
    background-image: url(/m/5.jpg);
  }
  .item6 {
    background-image: url(/m/6.jpg);
  }
  .item7 {
    background-image: url(/m/7.jpg);
  }

  .item8 {
    background-image: url(/m/8.jpg);
  }
  .item9 {
    background-image: url(/m/9.jpg);
  }

  @for $i from 1 through 9 {
    .item:nth-child(#{$i}) {
      transform: rotateY(40deg * ($i - 1)) translateZ(288px);
    }
  }
}
@keyframes rotation {
  to {
    transform: rotateY(360deg);
  }
}

.twinkling,
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.stars {
  background: #000 url(/m/stars.png) repeat top center;
  z-index: 0;
}

.twinkling {
  background: transparent url(/m/twinkling.png) repeat top center;
  z-index: 1;
  animation: move-twink-back 200s linear infinite;
}

.clouds {
  background: transparent url(/m/clouds.png) repeat top center;
  z-index: 2;
  opacity: 0.4;
  animation: move-clouds-back 200s linear infinite;
}
@keyframes move-twink-back {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 10000px 0px;
  }
}

@keyframes move-clouds-back {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 10000px 0;
  }
}
</style>
