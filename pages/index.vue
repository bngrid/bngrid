<script setup lang="ts">
  useHead({
    title: 'Home'
  })
  onMounted(() => {
    pageWidth = page.value!.offsetWidth
    onresize = () => {
      pageWidth = page.value!.offsetWidth
      pageLeft.value = -pageWidth * pageNumber
    }
    onkeyup = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (pageNumber > 0) pageNumber--
          break
        case 'ArrowRight':
          if (pageNumber < store.list.length - 1) pageNumber++
          break
      }
      pageLeft.value = -pageWidth * pageNumber
    }
  })
  onUnmounted(() => {
    onresize = null
    onkeyup = null
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
  const page = ref<HTMLElement | null>(null)
  const pageLeft = ref(0)
  const pointerLeft = computed(() => (-pageLeft.value * 12) / pageWidth)
  let pointerList: {
    id: number
    x: number
  }[] = []
  let isPageDelay = false
  let pageWidth = 0
  let initialLeft = 0
  let pageNumber = 0
  let pageTimer = 0
  const toggleMode = () => {
    colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
  }
  const pageDown = (event: PointerEvent) => {
    page.value!.setPointerCapture(event.pointerId)
    pointerList.push({ id: event.pointerId, x: event.screenX })
    if (pointerList.length === 1) {
      initialLeft = event.clientX
      page.value!.onpointermove = pageMove
      pageTimer = +setTimeout(() => {
        isPageDelay = true
      }, 600)
    }
  }
  const pageMove = (event: PointerEvent) => {
    pageLeft.value +=
      (event.screenX - pointerList.find((pointer) => pointer.id === event.pointerId)!.x) /
      (pageLeft.value > 0 || pageLeft.value < -pageWidth * (store.list.length - 1)
        ? 3
        : 1)
    pointerList.find((pointer) => pointer.id === event.pointerId)!.x = event.screenX
  }
  const pageUp = (event: PointerEvent) => {
    page.value!.releasePointerCapture(event.pointerId)
    if (pointerList.length === 1) {
      page.value!.onpointermove = null
      const distance = event.clientX - initialLeft
      if (distance) {
        pageNumber = Math.max(
          Math.min(
            isPageDelay
              ? Math.floor(-pageLeft.value / pageWidth + 0.5)
              : distance > 0
              ? pageNumber - Math.ceil(distance / pageWidth)
              : pageNumber - Math.floor(distance / pageWidth),
            store.list.length - 1
          ),
          0
        )
        pageLeft.value = -pageWidth * pageNumber
      }
      isPageDelay = false
      clearTimeout(pageTimer)
    }
    pointerList.splice(
      pointerList.findIndex((pointer) => pointer.id === event.pointerId),
      1
    )
  }
  const pageCancel = (event: PointerEvent) => {
    page.value!.onpointermove = null
    pointerList = []
    pageLeft.value = -pageWidth * pageNumber
    clearTimeout(pageTimer)
    isPageDelay = false
  }
  const wheel = (event: WheelEvent) => {
    if (event.deltaY > 0 && pageNumber < store.list.length - 1) pageNumber++
    if (event.deltaY < 0 && pageNumber > 0) pageNumber--
    pageLeft.value = -pageWidth * pageNumber
  }
  const toPage = (pageIndex: number) => {
    pageNumber = pageIndex > pageNumber ? pageIndex - 2 : pageIndex - 1
    pageLeft.value = -pageWidth * pageNumber
  }
</script>

<template>
  <div
    class="relative h-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden touch-none select-none duration-300"
    ref="page"
    @pointerdown.left="pageDown"
    @pointerup="pageUp"
    @pointercancel="pageCancel"
    @wheel="wheel"
  >
    <a
      class="absolute top-[20px] right-[20px] w-[24px] h-[24px] bg-white i-charm-github z-10 mix-blend-difference"
      href="https://github.com/bngrid/bngrid"
      title="访问该项目的开源社区"
      @pointerdown.stop
    ></a>
    <button
      class="absolute top-[20px] right-[60px] w-[24px] h-[24px] bg-white i-charm-sun dark:i-charm-moon dark:w-[24px] dark:h-[24px] dark:bg-white z-10 mix-blend-difference"
      :title="`切换到${colorMode.preference === 'dark' ? '浅色模式' : '深色模式'}`"
      @click="toggleMode"
      @pointerdown.stop
    ></button>
    <div
      class="absolute flex h-full"
      :class="pointerList.length ? 'duration-0' : 'duration-300'"
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
      class="flex justify-between absolute inset-x-0 bottom-[30px] rounded-[1.5px] mx-auto mix-blend-difference overflow-hidden"
      :style="paginationStyle"
    >
      <div
        v-for="pageIndex in store.list.length + 1"
        class="w-[6px] h-[6px] rounded-[1.5px] bg-white opacity-60 cursor-pointer"
        :title="`跳转到第${pageIndex > pageNumber ? pageIndex - 1 : pageIndex}页`"
        @click="toPage(pageIndex)"
        @pointerdown.stop
      ></div>
      <div
        class="absolute bg-white w-[18px] h-[6px] rounded-[1.5px]"
        :class="pointerList.length ? 'duration-0' : 'duration-300'"
        :style="pointerStyle"
      ></div>
    </div>
  </div>
</template>
