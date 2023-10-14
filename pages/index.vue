<script setup lang="ts">
  useHead({
    title: 'Home'
  })
  onMounted(() => {
    screenWidth = innerWidth
    addEventListener('resize', () => {
      screenWidth = innerWidth
      pageLeft.value = -screenWidth * pageNumber
    })
  })
  onUnmounted(() => {
    removeEventListener('resize', () => {
      screenWidth = innerWidth
      pageLeft.value = -screenWidth * pageNumber
    })
  })
  const pageStyle = computed(() => ({
    translate: `${pageLeft.value}px`
  }))
  const siteStyle = computed(() => ({
    gridTemplateColumns: `repeat(${store.site[0]}, ${store.site[2]}px)`,
    gridTemplateRows: `repeat(${store.site[1]}, ${store.site[2]}px)`,
    gap: `${store.site[3]}px`,
    width: `${store.site[0] * store.site[2] + (store.site[0] - 1) * store.site[3]}px`,
    height: `${store.site[1] * store.site[2] + (store.site[1] - 1) * store.site[3]}px`
  }))
  const store = useStore()
  const pageLeft = ref(0)
  let isPageDown = false
  let isPageDelay = false
  let pointerNum = 0
  let screenWidth = 0
  let pageNumber = 0
  let initialLeft = 0
  let pageTimer = 0
  const pageDown = (event: PointerEvent) => {
    pointerNum++
    isPageDown = true
    if (pointerNum === 1) {
      initialLeft = event.clientX
      pageTimer = +setTimeout(() => {
        isPageDelay = true
      }, 600)
    }
  }
  const pageMove = (event: PointerEvent) => {
    if (pointerNum === 1) {
      pageLeft.value =
        -screenWidth * pageNumber +
        (event.clientX - initialLeft) /
          (pageLeft.value > 0 || pageLeft.value < -screenWidth * (store.list.length - 1)
            ? 2
            : 1)
    }
  }
  const pageUp = (event: PointerEvent) => {
    const distance = event.clientX - initialLeft
    if (pointerNum === 1) {
      if (distance) {
        pageNumber = Math.max(
          Math.min(
            isPageDelay
              ? Math.floor(-pageLeft.value / screenWidth + 0.5)
              : distance > 0
              ? pageNumber - Math.ceil(distance / screenWidth)
              : pageNumber - Math.floor(distance / screenWidth),
            store.list.length - 1
          ),
          0
        )
        pageLeft.value = -screenWidth * pageNumber
      }
      isPageDown = false
    }
    pointerNum--
    clearTimeout(pageTimer)
    isPageDelay = false
  }
  const pageCancel = () => {
    pointerNum = 0
    pageLeft.value = -screenWidth * pageNumber
    isPageDown = false
    clearTimeout(pageTimer)
    isPageDelay = false
  }
</script>

<template>
  <div
    class="relative h-[100dvh] bg-gray-100 overflow-hidden touch-none select-none"
    @pointerdown.left="pageDown"
    @pointermove="pageMove"
    @pointerup="pageUp"
    @pointercancel="pageCancel"
  >
    <div
      class="absolute flex h-full"
      :class="isPageDown ? 'duration-0' : 'duration-300'"
      :style="pageStyle"
    >
      <div
        v-for="pageIndex in store.list.length"
        class="grid place-content-center w-screen"
      >
        <div
          class="relative grid"
          :style="siteStyle"
        >
          {{ pageIndex }}
        </div>
      </div>
    </div>
  </div>
</template>
