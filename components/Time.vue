<script setup lang="ts">
  const time = ref('')
  onMounted(() => {
    setInterval(() => {
      time.value = new Date().toLocaleTimeString()
    }, 1000)
  })
</script>

<template>
  <div class="p-3 text-5xl">{{ time }}</div>
</template>
