<script setup lang="ts">
  useHead({
    title: 'Home'
  })
  onMounted(() => {
    resizeObserver = new ResizeObserver(() => {
      pageWidth.value = page.value!.clientWidth
      pageLeft.value = -pageWidth.value * pageNumber
    })
    resizeObserver.observe(page.value!)
    onkeyup = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (pageNumber > 0) pageNumber--
          break
        case 'ArrowRight':
          if (pageNumber < store.list.length - 1) pageNumber++
          break
      }
      pageLeft.value = -pageWidth.value * pageNumber
    }
  })
  onUnmounted(() => {
    resizeObserver.unobserve(page.value!)
    onkeyup = null
  })
  const pageStyle = computed(() => ({
    left: `${pageLeft.value}px`,
    width: `${(pageWidth.value ?? 0) * store.list.length}px`
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
  let resizeObserver: ResizeObserver
  const store = useStore()
  const colorMode = useColorMode()
  const page = ref<HTMLElement | null>(null)
  const pageLeft = ref(0)
  const pageWidth = ref(0)
  const isCompMove = ref(false)
  const pointerLeft = computed(() => (-pageLeft.value * 12) / pageWidth.value)
  let pointerList: {
    id: number
    x: number
  }[] = []
  let isPageDelay = false
  let initialLeft = 0
  let pageNumber = 0
  let pageTimer = 0
  const toggleMode = () => {
    colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
  }
  const pageDown = (event: PointerEvent) => {
    page.value!.setPointerCapture(event.pointerId)
    pointerList.push({ id: event.pointerId, x: event.clientX })
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
      (event.clientX - pointerList.find((pointer) => pointer.id === event.pointerId)!.x) /
      (pageLeft.value > 0 || pageLeft.value < -pageWidth.value * (store.list.length - 1)
        ? 3
        : 1)
    pointerList.find((pointer) => pointer.id === event.pointerId)!.x = event.clientX
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
              ? Math.floor(-pageLeft.value / pageWidth.value + 0.5)
              : distance > 0
              ? pageNumber - Math.ceil(distance / pageWidth.value)
              : pageNumber - Math.floor(distance / pageWidth.value),
            store.list.length - 1
          ),
          0
        )
        pageLeft.value = -pageWidth.value * pageNumber
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
    page.value!.releasePointerCapture(event.pointerId)
    page.value!.onpointermove = null
    pointerList = []
    pageLeft.value = -pageWidth.value * pageNumber
    clearTimeout(pageTimer)
    isPageDelay = false
  }
  const wheel = (event: WheelEvent) => {
    if (event.deltaY > 0 && pageNumber < store.list.length - 1) pageNumber++
    if (event.deltaY < 0 && pageNumber > 0) pageNumber--
    pageLeft.value = -pageWidth.value * pageNumber
  }
  const toPage = (pageIndex: number) => {
    pageNumber = pageIndex > pageNumber ? pageIndex - 2 : pageIndex - 1
    pageLeft.value = -pageWidth.value * pageNumber
  }
  const compDown = (pageIndex: number) => {
    store.list.push([])
  }
  const compMove = (pageIndex: number, compIndex: number, position: number[]) => {
    isCompMove.value = true
  }
  const compUp = (pageIndex: number, compIndex: number, position: number[]) => {
    isCompMove.value = false
    position[0] += pageWidth.value * (pageIndex - pageNumber)
    const tempScope = [
      Math.max(
        Math.min(
          Math.floor(
            (position[0] + (store.site[2] + store.site[3]) / 2) /
              (store.site[2] + store.site[3]) +
              1
          ),
          store.site[0] + 1 - store.list[pageIndex][compIndex].scope[2]
        ),
        1
      ),
      Math.max(
        Math.min(
          Math.floor(
            (position[1] + (store.site[2] + store.site[3]) / 2) /
              (store.site[2] + store.site[3]) +
              1
          ),
          store.site[1] + 1 - store.list[pageIndex][compIndex].scope[3]
        ),
        1
      ),
      store.list[pageIndex][compIndex].scope[2],
      store.list[pageIndex][compIndex].scope[3]
    ]
    let isOverlap = false
    for (let i = 0; i < store.list[pageNumber].length; i++) {
      if (
        store.list[pageNumber][i].id !== store.list[pageIndex][compIndex].id &&
        store.list[pageNumber][i].scope[0] <
          tempScope[0] +
            tempScope[2] &&
        store.list[pageNumber][i].scope[0] + store.list[pageNumber][i].scope[2] >
          tempScope[0] &&
        store.list[pageNumber][i].scope[1] <
          tempScope[1] +
            tempScope[3] &&
        store.list[pageNumber][i].scope[1] + store.list[pageNumber][i].scope[3] >
          tempScope[1]
      ) {
        isOverlap = true
      }
    }
    if (!isOverlap) {
      store.list[pageIndex][compIndex].scope = tempScope
      if (pageNumber !== pageIndex) {
        store.list[pageNumber].push(store.list[pageIndex].splice(compIndex, 1)[0])
      }
    }
    store.list = store.list.filter((page) => page.length > 0)
    if (pageNumber > store.list.length - 1) {
      pageNumber = store.list.length - 1
      pageLeft.value = -pageWidth.value * pageNumber
    }
  }
</script>

<template>
  <div
    class="relative h-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden touch-none select-none duration-300"
    ref="page"
    @pointerdown.left.stop="pageDown"
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
      :title="`切换到${colorMode.preference === 'dark' ? '浅' : '深'}色模式`"
      @click="toggleMode"
      @pointerdown.stop
    ></button>
    <div
      class="absolute flex h-full transition-[left,opacity]"
      :class="[
        pointerList.length ? 'duration-0' : 'duration-300',
        page ? 'opacity-100' : 'opacity-0'
      ]"
      :style="pageStyle"
    >
      <div
        v-for="(page, pageIndex) in store.list"
        class="grid place-content-center flex-auto"
      >
        <div
          class="relative grid"
          :style="siteStyle"
        >
          <div
            v-for="_ in store.site[0] * store.site[1]"
            class="rounded-[25%] border-2 border-white border-solid duration-300 mix-blend-difference"
            :class="isCompMove ? 'opacity-60' : 'opacity-0'"
          ></div>
          <Layout
            v-for="(comp, compIndex) in page"
            :key="comp.id"
            :comp="comp"
            @comp-down="compDown(pageIndex)"
            @comp-move="(position) => compMove(pageIndex, compIndex, position)"
            @comp-up="(position) => compUp(pageIndex, compIndex, position)"
          />
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
