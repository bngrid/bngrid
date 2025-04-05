import usePointer from '@/hooks/pointer'
import clsx from 'clsx'
import { LoaderCircle } from 'lucide-react'
import { ReactNode } from 'react'

const Button = ({
  children,
  className,
  icon,
  disabled,
  loading
}: {
  children: ReactNode
  className?: string
  icon?: ReactNode
  disabled?: boolean
  loading?: boolean
}) => {
  const buttonRef = usePointer('button', (data, bubble) => ({
    down: () => {
      console.log('button down')
    },
    move: () => {
      console.log('button move')
    },
    up: () => {
      console.log('button up')
    }
  }))
  return (
    <div
      ref={buttonRef}
      className={clsx(
        'flex h-8 items-center gap-2 rounded-md px-3',
        (loading || disabled) && 'opacity-60',
        className
      )}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : icon}
      {children}
    </div>
  )
}

export default Button
