<script setup lang="ts">
  const props = defineProps<{
    size: number
  }>()
</script>

<template>
  <div class="blocks" :style="{ '--size': `${size}px` }">
    <div class="block-a"></div>
    <div class="block-b"></div>
    <div class="block-c"></div>
  </div>
</template>

<style scoped>
  .blocks {
    position: relative;
    width: calc(9 * var(--size));
    height: calc(9 * var(--size));
  }
  .block-a,
  .block-b,
  .block-c {
    position: absolute;
    border: 2px solid #1e1e1e;
    backdrop-filter: blur(30px);
    border-radius: calc(var(--size));
    animation: 3s linear infinite;
  }
  .block-a {
    animation-name: loader-a;
  }
  .block-b {
    animation-name: loader-b;
  }
  .block-c {
    animation-name: loader-c;
  }
  @keyframes loader-a {
    0%,
    6.25% {
      transform: translate3d(0, 0, 0);
      width: calc(4 * var(--size));
      height: calc(9 * var(--size));
    }
    12.5%,
    68.75% {
      transform: translate3d(0, 0, 0);
      width: calc(4 * var(--size));
      height: calc(4 * var(--size));
    }
    75%,
    81.25% {
      transform: translate3d(0, 0, 0);
      width: calc(9 * var(--size));
      height: calc(4 * var(--size));
    }
    87.5%,
    100% {
      transform: translate3d(calc(5 * var(--size)), 0, 0);
      width: calc(4 * var(--size));
      height: calc(4 * var(--size));
    }
  }
  @keyframes loader-b {
    0%,
    43.75% {
      transform: translate3d(calc(5 * var(--size)), 0, 0);
      width: calc(4 * var(--size));
      height: calc(4 * var(--size));
    }
    50%,
    56.25% {
      transform: translate3d(calc(5 * var(--size)), 0, 0);
      width: calc(4 * var(--size));
      height: calc(9 * var(--size));
    }
    62.5%,
    100% {
      transform: translate3d(calc(5 * var(--size)), calc(5 * var(--size)), 0);
      width: calc(4 * var(--size));
      height: calc(4 * var(--size));
    }
  }
  @keyframes loader-c {
    0%,
    18.75% {
      transform: translate3d(calc(5 * var(--size)), calc(5 * var(--size)), 0);
      width: calc(4 * var(--size));
      height: calc(4 * var(--size));
    }
    25%,
    31.25% {
      transform: translate3d(0, calc(5 * var(--size)), 0);
      width: calc(9 * var(--size));
      height: calc(4 * var(--size));
    }
    37.5%,
    93.75% {
      transform: translate3d(0, calc(5 * var(--size)), 0);
      width: calc(4 * var(--size));
      height: calc(4 * var(--size));
    }
    100% {
      transform: translate3d(0, 0, 0);
      width: calc(4 * var(--size));
      height: calc(9 * var(--size));
    }
  }
</style>
