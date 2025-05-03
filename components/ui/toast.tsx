'use client'

import { useToastStore } from '@/providers/toast-store'
import cx from '@/utils/cx'
import { CircleAlert, CircleCheck, CircleX, Info, X } from 'lucide-react'
import { memo } from 'react'

import Button from './button'

const types = {
  error: {
    icon: <CircleX />,
    style: 'text-error bg-error/10'
  },
  info: {
    icon: <Info />,
    style: 'text-info bg-info/10'
  },
  success: {
    icon: <CircleCheck />,
    style: 'text-success bg-success/10'
  },
  warning: {
    icon: <CircleAlert />,
    style: 'text-warning bg-warning/10'
  }
}

const Toast = memo(
  function Toast() {
    const { removeToast, toasts } = useToastStore(state => state)
    return (
      <div className="absolute inset-x-0 top-4 mx-auto w-44">
        {toasts.map(item => (
          <div
            className={cx('grid transition-[grid-template-rows] duration-300', item.animate === 'in' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
            key={item.timer}
          >
            <div
              className={cx(
                'relative flex items-center gap-1 overflow-hidden rounded-[0.675rem] px-1.5 inset-ring-[0.1rem] backdrop-blur-lg transition-[padding-block,margin-bottom,opacity] duration-300',
                item.animate === 'in' ? 'animate-in slide-in-from-top fade-in mb-2 py-1.5' : 'mb-0 py-0 opacity-0',
                types[item.type].style
              )}
            >
              {types[item.type].icon}
              <div className="text-foreground flex-1">{item.message}</div>
              <Button
                className="text-foreground rounded-full! bg-transparent p-0!"
                icon={<X />}
                onTap={() => {
                  removeToast(item.timer)
                }}
              />
              <div className="animate-progress-bar absolute bottom-0 left-0 h-0.5 bg-current"></div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  () => true
)

export default Toast
