'use client'

import usePointer from '@/hooks/pointer'
import useValue from '@/hooks/value'
import cx from '@/utils/cx'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { memo, ReactNode, useId } from 'react'

const Button = memo(function Button({
  children,
  className,
  disabled,
  href,
  icon,
  loading,
  onPress,
  onTap
}: {
  children?: ReactNode
  className?: string
  disabled?: boolean
  href?: string
  icon?: ReactNode
  loading?: boolean
  onPress?: (event: PointerEvent) => void
  onTap?: (event: PointerEvent) => void
}) {
  const {
    anime,
    update,
    value: style
  } = useValue({
    left: 0,
    opacity: 1,
    scale: 1,
    size: 0,
    top: 0
  })
  const router = useRouter()
  const id = useId()
  const buttonPointer = usePointer(id, (data, bubble) => ({
    down: (event, element) => {
      if (disabled || loading) {
        data.timer = undefined
        return bubble(event)
      }
      data.initial = {
        x: event.clientX,
        y: event.clientY
      }
      data.timer = setTimeout(() => {
        if (onPress) {
          data.timer = undefined
          onPress(event)
        }
      }, 500)
      update(value => ({
        ...value,
        left: event.offsetX,
        opacity: 1,
        size: 0,
        top: event.offsetY
      }))
      anime({
        onComplete: () =>
          onPress &&
          anime({
            duration: 200,
            easing: 'back',
            target: value => ({
              ...value,
              opacity: 0,
              scale: 1.05
            })
          }),
        target: value => ({
          ...value,
          scale: 0.95,
          size: 2 * (element.offsetWidth ** 2 + element.offsetHeight ** 2) ** 0.5
        })
      })
    },
    move: event => {
      if (
        (event.clientX - data.initial.x) ** 2 + (event.clientY - data.initial.y) ** 2 <=
        81
      ) {
        return
      }
      data.timer = clearTimeout(data.timer)
      return bubble(event)
    },
    up: async event => {
      clearTimeout(data.timer)
      if (data.timer) {
        onTap?.(event)
        if (href) {
          router.push(
            href.startsWith('http') ? `/redirect?to=${encodeURIComponent(href)}` : href
          )
        }
      }
      anime({
        target: value => ({
          ...value,
          opacity: 0,
          scale: 1
        })
      })
    }
  }))
  return (
    <div
      className={cx(
        'bg-foreground text-background relative inline-flex items-center justify-center gap-1 overflow-hidden rounded-[0.675rem] py-1.5',
        children ? 'px-2' : 'px-1.5',
        disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className
      )}
      ref={buttonPointer}
      style={{
        transform: `scale3d(${style.scale}, ${style.scale}, 1)`
      }}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : icon}
      {children}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-current/30"
        style={{
          height: `${style.size}px`,
          left: `${style.left}px`,
          opacity: style.opacity,
          top: `${style.top}px`,
          width: `${style.size}px`
        }}
      />
    </div>
  )
})

export default Button
