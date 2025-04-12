import usePointer from '@/hooks/pointer'
import useValue from '@/hooks/value'
import wrapHandler from '@/utils/wrap-handler'
import clsx from 'clsx'
import { LoaderCircle } from 'lucide-react'
import { ReactNode, useState } from 'react'

const Button = ({
  children,
  className,
  icon,
  disabled,
  onTap,
  onPress
}: {
  children?: ReactNode
  className?: string
  icon?: ReactNode
  disabled?: boolean
  onTap?: (event: PointerEvent) => void
  onPress?: (event: PointerEvent) => void
}) => {
  const {
    value: style,
    update,
    anime
  } = useValue({
    scale: 1,
    size: 0,
    opacity: 1,
    left: 0,
    top: 0
  })
  const { 0: loading, 1: setLoading } = useState(false)
  const buttonRef = usePointer('button', (data, bubble) => ({
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
        size: 0,
        opacity: 1,
        left: event.offsetX,
        top: event.offsetY
      }))
      anime({
        target: value => ({
          ...value,
          scale: 0.95,
          size: 2 * (element.offsetWidth ** 2 + element.offsetHeight ** 2) ** 0.5
        }),
        onComplete: () =>
          onPress &&
          anime({
            target: value => ({
              ...value,
              scale: 1.05,
              opacity: 0
            }),
            duration: 200,
            easing: 'back'
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
      if (data.timer && onTap) {
        wrapHandler(() => onTap(event), setLoading)
      }
      anime({
        target: value => ({
          ...value,
          scale: 1,
          opacity: 0
        })
      })
    }
  }))
  return (
    <div
      ref={buttonRef}
      className={clsx(
        'bg-foreground text-background relative flex cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-lg',
        children ? 'h-4 px-1.5' : 'size-4',
        (loading || disabled) && 'opacity-60',
        className
      )}
      style={{
        transform: `scale3d(${style.scale}, ${style.scale}, 1)`
      }}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : icon}
      {children}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-current/30"
        style={{
          width: `${style.size}px`,
          height: `${style.size}px`,
          left: `${style.left}px`,
          top: `${style.top}px`,
          opacity: style.opacity
        }}
      />
    </div>
  )
}

export default Button
