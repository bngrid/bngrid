<script setup lang="ts">
const props = defineProps<{
  isClick: boolean
}>()
  watch(props, (newProps) => {
    if(newProps.isClick) {
      open('https://nuxt.com/')
    }
  })
</script>

<template>
  <div class="h-full grid place-items-center">
    <div class="w-[30px] h-[30px] i-charm-globe"></div>
  </div>
</template>
