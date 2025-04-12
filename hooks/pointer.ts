import { useEffect, useRef } from 'react'

const pointerManager = new Map()
function bubble(element: HTMLDivElement, event: PointerEvent) {
  element.onpointercancel?.(event)
  let parent = element.parentElement
  while (parent) {
    if (parent.onpointerdown) {
      parent.onpointerdown(event)
      break
    }
    parent = parent.parentElement
  }
}

const usePointer = (
  id: string,
  handler: (
    data: Record<string, any>,
    bubble: (event: PointerEvent) => void
  ) => {
    down: (event: PointerEvent, element: HTMLDivElement) => void
    move: (event: PointerEvent, element: HTMLDivElement) => void
    up: (event: PointerEvent, element: HTMLDivElement) => void
  }
) => {
  const ref = useRef<HTMLDivElement>(null)
  const data = useRef<Record<string, any>>({})
  useEffect(() => {
    const element = ref.current
    if (!element) {
      throw new Error('指针元素不存在')
    }
    element.style.pointerEvents = 'auto'
    const { down, move, up } = handler(data.current, event => bubble(element, event))
    element.onpointerdown = event => {
      event.stopPropagation()
      if (pointerManager.has(id)) {
        return bubble(element, event)
      }
      element.setPointerCapture(event.pointerId)
      pointerManager.set(id, event.pointerId)
      down(event, element)
    }
    element.onpointermove = event => {
      if (pointerManager.get(id) === event.pointerId) {
        move(event, element)
      }
    }
    element.onpointerup = element.onpointercancel = event => {
      if (pointerManager.get(id) === event.pointerId) {
        element.releasePointerCapture(event.pointerId)
        pointerManager.delete(id)
        up(event, element)
      }
    }
    return () => {
      element.onpointerdown =
        element.onpointermove =
        element.onpointerup =
        element.onpointercancel =
          null
      element.style.pointerEvents = 'none'
    }
  }, [ref, id, handler])
  return ref
}

export default usePointer
