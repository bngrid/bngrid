<script setup lang="ts">
  const props = defineProps<{
    isClick: boolean
  }>()
  watch(
    () => props.isClick,
    (newIsClick) => {
      if (newIsClick) {
        open('https://nuxt.com/')
      }
    }
  )
</script>

<template>
  <div class="h-full grid place-items-center">
    <div class="w-[30px] h-[30px] i-charm-globe"></div>
    <div class="absolute w-full h-full"></div>
  </div>
</template>
