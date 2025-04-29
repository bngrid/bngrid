'use client'

import cx from '@/utils/cx'
import { memo, ReactNode } from 'react'

import Button from './button'

const Tabs = memo(function Tab({
  className,
  items,
  onChange,
  selected
}: {
  className?: string
  items: { key: string; value: ReactNode }[]
  onChange: (key: string) => void
  selected: string
}) {
  return (
    <div className={cx('flex gap-2', className)}>
      {items.map(({ key, value }) => (
        <Button
          className={cx('cursor-pointer bg-transparent p-0.5! transition-[background-color]!', selected === key ? 'text-theme' : 'text-current')}
          key={key}
          onTap={() => onChange(key)}
        >
          {value}
        </Button>
      ))}
    </div>
  )
})
export default Tabs
