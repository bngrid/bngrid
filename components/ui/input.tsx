'use client'

import cx from '@/utils/cx'
import { Eye, EyeOff, LoaderCircle, X } from 'lucide-react'
import { memo, ReactNode, useId, useMemo, useState } from 'react'
import { ZodString } from 'zod'

import Button from './button'

const Input = memo(function Input({
  className,
  disabled = false,
  field,
  loading = false,
  onChange,
  prefix,
  suffix,
  type,
  value,
  verify
}: {
  className?: string
  disabled?: boolean
  field?: string
  loading?: boolean
  onChange?: (value: string) => void
  prefix?: ReactNode
  suffix?: ReactNode
  type?: 'code' | 'password' | 'text'
  value?: string
  verify?: ZodString
}) {
  const id = useId()
  const parse = useMemo(() => verify?.safeParse(value), [value, verify])
  const [visible, setVisible] = useState(false)
  return (
    <label
      className={cx(
        'text-foreground focus-within:inset-ring-theme pointer-events-auto! relative inline-flex w-44 items-center justify-center gap-1 rounded-[0.675rem] bg-transparent py-1.5 pr-1.5 inset-ring-[0.1rem] transition-[color,box-shadow] duration-300',
        prefix || loading ? 'pl-1.5' : 'pl-2',
        disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-text',
        value && verify && (parse?.success ? 'focus-within:inset-ring-success!' : 'focus-within:inset-ring-error!'),
        className
      )}
      htmlFor={id}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : prefix}
      <input
        autoComplete="off"
        className={cx(
          'peer pointer-events-auto! min-w-0 flex-1 outline-none placeholder:tracking-normal placeholder:text-inherit disabled:cursor-not-allowed',
          type === 'code' && 'tracking-[0.6rem]'
        )}
        disabled={disabled || loading}
        id={id}
        maxLength={type === 'code' ? 6 : undefined}
        onChange={e => onChange?.(e.target.value)}
        placeholder={field}
        type={type === 'password' && !visible ? 'password' : 'text'}
        value={value}
      />
      <Button
        className={cx(
          'rounded-full! bg-transparent p-0!',
          value ? 'text-inherit' : 'text-transparent',
          (!value || disabled || loading) && 'pointer-events-none!'
        )}
        icon={<X />}
        onTap={() => onChange?.('')}
      />
      {type === 'password' && (
        <Button
          className={cx(
            'rounded-full! bg-transparent p-0!',
            value ? 'text-inherit' : 'text-transparent',
            (!value || disabled || loading) && 'pointer-events-none!'
          )}
          icon={visible ? <EyeOff /> : <Eye />}
          onTap={() => setVisible(!visible)}
        />
      )}
      {suffix}
      <div className="absolute top-[calc(100%+0.2rem)] left-0 text-[0.8rem] break-all opacity-0 transition-[opacity] duration-300 peer-focus:opacity-100">
        {parse?.error?.errors[0]?.message}
      </div>
    </label>
  )
})

export default Input
