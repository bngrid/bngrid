<script setup lang="ts">
  const props = defineProps<{
    comp: {
      id: string
      name: string
      scope: number[]
    }
  }>()
  const emit = defineEmits<{
    (e: 'compDown'): void
    (e: 'compMove', position: number[]): void
    (e: 'compUp', position: number[]): void
  }>()
  const compStyle = computed(() => ({
    left: isCompMove.value
      ? `${compPosition.value[0]}px`
      : `${(props.comp.scope[0] - 1) * (store.site[2] + store.site[3])}px`,
    top: isCompMove.value
      ? `${compPosition.value[1]}px`
      : `${(props.comp.scope[1] - 1) * (store.site[2] + store.site[3])}px`,
    width: `${
      props.comp.scope[2] * store.site[2] + (props.comp.scope[2] - 1) * store.site[3]
    }px`,
    height: `${
      props.comp.scope[3] * store.site[2] + (props.comp.scope[3] - 1) * store.site[3]
    }px`,
    borderRadius: `${store.site[2] * 0.25}px`
  }))
  const store = useStore()
  const comp = ref<HTMLElement | null>(null)
  const pointerNumber = ref(0)
  const compPosition = ref([0, 0])
  let compTimer = 0
  let isCompCancel = false
  let isCompDelay = false
  const isCompMove = ref(false)
  let initialPosition = [0, 0]
  const compDown = (event: PointerEvent) => {
    pointerNumber.value++
    comp.value!.setPointerCapture(event.pointerId)
    if (pointerNumber.value === 1) {
      initialPosition = [event.offsetX, event.offsetY]
      comp.value!.onpointermove = compMove
      compTimer = +setTimeout(() => {
        isCompDelay = true
        emit('compDown')
      }, 600)
    }
  }
  const compMove = (event: PointerEvent) => {
    if (pointerNumber.value === 1) {
      if (
        !isCompDelay &&
        (event.offsetX - initialPosition[0]) ** 2 +
          (event.offsetY - initialPosition[1]) ** 2 >
          36
      ) {
        clearTimeout(compTimer)
        isCompCancel = true
      } else if (isCompDelay) {
        event.stopPropagation()
        isCompMove.value = true
        compPosition.value = [
          event.clientX -
            comp.value!.offsetParent!.getBoundingClientRect().x -
            initialPosition[0],
          event.clientY -
            comp.value!.offsetParent!.getBoundingClientRect().y -
            initialPosition[1]
        ]
        emit('compMove', compPosition.value)
      }
    }
  }
  const compUp = (event: PointerEvent) => {
    comp.value!.releasePointerCapture(event.pointerId)
    if (pointerNumber.value === 1) {
      comp.value!.onpointermove = null
      if (!isCompCancel && !isCompDelay) {
        clearTimeout(compTimer)
      } else if (isCompDelay && !isCompMove.value) {
      } else if (isCompMove.value) {
        emit('compUp', compPosition.value)
      } else {
      }
      isCompCancel = false
      isCompDelay = false
      isCompMove.value = false
    }
    if (pointerNumber.value > 0) pointerNumber.value--
  }
  const compCancel = (event: PointerEvent) => {
    emit('compUp', compPosition.value)
    pointerNumber.value = 0
    comp.value!.releasePointerCapture(event.pointerId)
    comp.value!.onpointermove = null
    console.log('cancel')
    isCompCancel = false
    isCompDelay = false
    isCompMove.value = false
  }
</script>

<template>
  <div
    ref="comp"
    class="absolute bg-zinc-100 dark:bg-zinc-800 shadow-light dark:shadow-dark text-zinc-800 dark:text-zinc-100"
    :class="[
      isCompMove ? 'duration-0' : 'duration-300',
      isCompMove ? 'z-10' : 'z-0',
      pointerNumber ? 'animate-press' : 'animate-lift'
    ]"
    :style="compStyle"
    @pointerdown.left.stop="compDown"
    @pointerup="compUp"
    @pointercancel="compCancel"
  >
    <component :is="props.comp.name" />
  </div>
</template>
