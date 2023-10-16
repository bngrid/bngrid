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
    addEventListener('keyup', keyup)
  })
  onUnmounted(() => {
    removeEventListener('resize', () => {
      screenWidth = innerWidth
      pageLeft.value = -screenWidth * pageNumber
    })
    removeEventListener('keyup', keyup)
  })
  const pageStyle = computed(() => ({
    left: `${pageLeft.value}px`
  }))
  const siteStyle = computed(() => ({
    gridTemplateColumns: `repeat(${store.site[0]}, ${store.site[2]}px)`,
    gridTemplateRows: `repeat(${store.site[1]}, ${store.site[2]}px)`,
    gap: `${store.site[3]}px`,
    width: `${store.site[0] * store.site[2] + (store.site[0] - 1) * store.site[3]}px`,
    height: `${store.site[1] * store.site[2] + (store.site[1] - 1) * store.site[3]}px`
  }))
  const paginationStyle = computed(() => ({
    width: `${(2 * store.list.length + 1) * 6}px`
  }))
  const pointerStyle = computed(() => ({
    left: `${pointerLeft.value}px`
  }))
  const store = useStore()
  const colorMode = useColorMode()
  const pageLeft = ref(0)
  const pointerLeft = computed(() => (-pageLeft.value * 12) / screenWidth)
  let isPageDown = false
  let isPageDelay = false
  let pointerNumber = 0
  let screenWidth = 0
  let pageNumber = 0
  let initialLeft = 0
  let pageTimer = 0
  const toggleMode = () => {
    colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
  }
  const pageDown = (event: PointerEvent) => {
    pointerNumber++
    isPageDown = true
    if (pointerNumber === 1) {
      initialLeft = event.clientX
      pageTimer = +setTimeout(() => {
        isPageDelay = true
      }, 600)
    }
  }
  const pageMove = (event: PointerEvent) => {
    if (pointerNumber === 1) {
      pageLeft.value =
        pageLeft.value +
        event.movementX /
          (pageLeft.value > 0 || pageLeft.value < -screenWidth * (store.list.length - 1)
            ? 3
            : 1)
    }
  }
  const pageUp = (event: PointerEvent) => {
    if (pointerNumber === 1) {
      const distance = event.clientX - initialLeft
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
      isPageDelay = false
      clearTimeout(pageTimer)
    }
    if (pointerNumber > 0) pointerNumber--
  }
  const pageleave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') pageUp(event)
  }
  const pageCancel = () => {
    pointerNumber = 0
    pageLeft.value = -screenWidth * pageNumber
    isPageDown = false
    clearTimeout(pageTimer)
    isPageDelay = false
  }
  const keyup = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        if (pageNumber > 0) pageNumber--
        break
      case 'ArrowRight':
        if (pageNumber < store.list.length - 1) pageNumber++
        break
    }
    pageLeft.value = -screenWidth * pageNumber
  }
  const wheel = (event: WheelEvent) => {
    if (event.deltaY > 0 && pageNumber < store.list.length - 1) pageNumber++
    if (event.deltaY < 0 && pageNumber > 0) pageNumber--
    pageLeft.value = -screenWidth * pageNumber
  }
  const toPage = (pageIndex: number) => {
    pageNumber = pageIndex > pageNumber ? pageIndex - 2 : pageIndex - 1
    pageLeft.value = -screenWidth * pageNumber
  }
</script>

<template>
  <div
    class="relative h-[100dvh] bg-zinc-100 dark:bg-zinc-800 overflow-hidden touch-none select-none duration-300"
    @pointerdown.left="pageDown"
    @pointermove="pageMove"
    @pointerup="pageUp"
    @pointerleave="pageleave"
    @pointercancel="pageCancel"
    @wheel="wheel"
  >
    <a
      class="absolute top-[20px] right-[20px] w-[24px] h-[24px] bg-white i-charm-github z-10 mix-blend-difference"
      href="https://github.com/bngrid/bngrid"
    ></a>
    <button
      class="absolute top-[20px] right-[60px] w-[24px] h-[24px] bg-white i-charm-sun dark:i-charm-moon dark:w-[24px] dark:h-[24px] dark:bg-white z-10 mix-blend-difference"
      @click="toggleMode"
    ></button>
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
          <div
            v-for="_ in store.site[0] * store.site[1]"
            class="rounded-[25%] border-2 border-white border-solid duration-300 opacity-60 mix-blend-difference"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="flex justify-between absolute inset-x-0 bottom-[30px] mx-auto mix-blend-difference"
      :style="paginationStyle"
    >
      <div
        v-for="pageIndex in store.list.length + 1"
        class="w-[6px] h-[6px] rounded-[1.5px] bg-white opacity-60 cursor-pointer"
        @click="toPage(pageIndex)"
      ></div>
      <div
        class="absolute bg-white w-[18px] h-[6px] rounded-[1.5px]"
        :class="isPageDown ? 'duration-0' : 'duration-300'"
        :style="pointerStyle"
      ></div>
    </div>
  </div>
</template>
