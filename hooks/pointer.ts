import { useEffect, useRef } from 'react'

const pointerManager = new Map()

const usePointer = (
  id: string,
  handler: (
    data: Record<string, any>,
    bubble: (event: PointerEvent) => void
  ) => {
    down: (event: PointerEvent) => void
    move: (event: PointerEvent) => void
    up: (event: PointerEvent) => void
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
    const { down, move, up } = handler(data.current, bubble)

    function bubble(event: PointerEvent) {
      if (element) {
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
    }

    element.onpointerdown = event => {
      event.stopPropagation()
      if (pointerManager.has(id)) {
        return bubble(event)
      }
      element.setPointerCapture(event.pointerId)
      pointerManager.set(id, event.pointerId)
      down(event)
    }

    element.onpointermove = event => {
      if (pointerManager.get(id) === event.pointerId) {
        move(event)
      }
    }

    element.onpointerup = element.onpointercancel = event => {
      if (pointerManager.get(id) === event.pointerId) {
        element.releasePointerCapture(event.pointerId)
        pointerManager.delete(id)
        up(event)
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
