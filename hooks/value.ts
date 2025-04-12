import { useRef, useState } from 'react'

const easings = {
  linear: (x: number) => x,
  easeIn: (x: number) => x ** 3,
  easeOut: (x: number) => 1 - (1 - x) ** 3,
  easeInOut: (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - 0.5 * (-2 * x + 2) ** 3),
  circle: (x: number) => (1 - (x - 1) ** 2) ** 0.5,
  back: (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2,
  elastic: (x: number) =>
    x === 0
      ? 0
      : x === 1
        ? 1
        : 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  bounce: (x: number) => {
    const n = 7.5625
    const d = 2.75
    if (x < 1 / d) return n * x ** 2
    if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75
    if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375
    return n * (x -= 2.625 / d) * x + 0.984375
  }
}

const useValue = <Value extends object>(initial: Value) => {
  const { 0: value, 1: setValue } = useState(initial)
  const current = useRef(initial)
  const animeId = useRef(0)
  function stop() {
    cancelAnimationFrame(animeId.current)
    animeId.current = 0
  }
  function update(newValue: (value: Value) => Value) {
    stop()
    current.current = newValue(current.current)
    setValue(newValue(current.current))
  }
  function anime({
    target,
    duration = 300,
    easing = 'easeOut',
    onUpdate,
    onComplete
  }: {
    target: (value: Value) => Value
    duration?: number
    easing?: keyof typeof easings
    onUpdate?: (x: Value) => void
    onComplete?: () => void
  }) {
    stop()
    const initial = current.current
    const start = Date.now()
    function run() {
      const progress = Math.min((Date.now() - start) / duration, 1)
      const result = <Value>Object.fromEntries(
        Object.entries(initial).map(([key, value]) => {
          if (typeof value !== 'number') return [key, value]
          return [
            key,
            value +
              ((<{ [key: string]: number }>target(current.current))[key] - value) *
                easings[easing](progress)
          ]
        })
      )
      update(() => result)
      onUpdate?.(result)
      if (progress < 1) {
        animeId.current = requestAnimationFrame(run)
      } else {
        stop()
        update(target)
        onComplete?.()
      }
    }
    run()
  }
  return {
    value,
    update,
    anime,
    stop
  }
}

export default useValue
