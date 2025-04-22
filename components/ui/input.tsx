'use client'

import cx from '@/utils/cx'
import { X } from 'lucide-react'
import { ReactNode, useRef } from 'react'

import Button from './button'

const Input = ({
  className,
  field,
  hint,
  onChange,
  prefix,
  suffix,
  value
}: {
  className?: string
  disabled?: boolean
  field: string
  hint?: string
  onChange?: (value: string) => void
  prefix?: ReactNode
  suffix?: ReactNode
  type?: 'area' | 'number' | 'password' | 'text'
  value?: string
  verify?: (value: string) => boolean
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <Button
      className={cx(
        'text-foreground w-30 cursor-text bg-transparent inset-ring-[0.1rem]',
        className,
        prefix ? 'pl-1.5' : 'pl-2'
      )}
      onTap={() => inputRef.current?.focus()}
    >
      <div
        className={cx(
          'absolute',
          value ? 'bottom-[calc(100%+0.3rem)] left-0' : 'bottom-1.5 left-5'
        )}
      >
        {field}
      </div>
      {prefix}
      <input
        autoComplete="off"
        className="min-w-0 flex-1 outline-none"
        onChange={e => onChange?.(e.target.value)}
        ref={inputRef}
        type="text"
        value={value}
      />
      {suffix}

      <Button
        className={cx(
          'rounded-[0.3rem] bg-transparent p-0!',
          value ? 'text-inherit' : 'pointer-events-none! text-transparent'
        )}
        disabled={!value}
        icon={<X />}
        onTap={() => onChange?.('')}
      />
      {hint && (
        <div className="absolute top-[calc(100%+0.3rem)] left-0 w-full text-[0.8rem] break-all">
          {hint}
        </div>
      )}
    </Button>
  )
}

export default Input
