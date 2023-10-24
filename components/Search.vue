<script setup lang="ts">
  const props = defineProps<{
    isClick: boolean
  }>()
  watch(
    () => props.isClick,
    (newIsClick) => {
      if(newIsClick) {
        isInput.value = true
        bar.value?.focus()
      }
      if (newIsClick && isSearch.value && context.value) {
        open('https://www.baidu.com/s?wd=' + context.value)
        context.value = ''
      }
    }
  )
  const bar = ref<HTMLInputElement | null>(null)
  const isInput = ref(false)
  const context = ref('')
  const isSearch = ref(false)
  const search = () => {
    console.log(1)
    isSearch.value = true
    setTimeout(() => {
      isSearch.value = false
    }, 500)
  }
</script>

<template>
  <div class="flex">
    <input
      ref="bar"
      class="w-[240px] h-[40px] m-[10px] rounded-[5px] duration-300 p-[5px] border-none outline-none bg-transparent shadow-inner-light dark:shadow-inner-dark"
      type="text"
      placeholder="百度搜索"
      v-model.trim="context"
      @blur="isInput = false"
    />
    <button class="i-charm-search w-[24px] h-[24px] my-[18px]" @pointerdown="search"></button>
    <div class="absolute w-full h-full" v-if="!isInput"></div>
  </div>
</template>
