<script setup lang="ts">
  const props = defineProps<{
    isClick: boolean
  }>()
  watch(
    () => props.isClick,
    (newIsClick) => {
      if (newIsClick) {
        isInput.value = true
      }
    }
  )
  const isInput = ref(false)
  const text = useCookie('text')
  text.value = text.value || '文字'
</script>

<template>
  <input
    v-if="isInput"
    class="w-full bg-transparent border-none outline-none text-center text-5xl leading-[140px]"
    type="text"
    v-model="text"
    @blur="isInput = false"
  />
  <div
    v-else
    class="text-center text-5xl leading-[140px]"
  >
    {{ text }}
  </div>
</template>
