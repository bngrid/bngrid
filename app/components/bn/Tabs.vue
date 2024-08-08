<script setup lang="ts">
  const option = defineModel<number>()
  defineProps<{
    options: string[]
  }>()
</script>

<template>
  <div class="pack">
    <template v-for="(o, i) in options" :key="o">
      <span v-if="i" class="divider">|</span>
      <span
        class="button"
        @click="option = i"
        :style="{ color: option === i ? 'var(--theme-color)' : '#ffffff' }"
        >{{ o }}</span
      >
    </template>
  </div>
</template>

<style scoped>
  .pack {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .divider {
    font-size: 36px;
  }
</style>
