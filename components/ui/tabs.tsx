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
    <div className={cx('flex gap-1.5', className)}>
      {items.map(({ key, value }) => (
        <Button className={selected === key ? 'text-theme' : ''} key={key} onTap={() => onChange(key)} type="text">
          {value}
        </Button>
      ))}
    </div>
  )
})
export default Tabs
