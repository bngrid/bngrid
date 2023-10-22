<script setup lang="ts">
  const time = ref('')
  let timer = 0
  onMounted(() => {
    timer = +setInterval(() => {
      time.value = new Date().toLocaleTimeString()
    }, 1000)
  })
  onUnmounted(() => {
    clearInterval(timer)
  })
</script>

<template>
  <div class="p-3 text-5xl leading-[110px]">{{ time }}</div>
</template>
