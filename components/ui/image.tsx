'use client'

import { useParamStore } from '@/providers/param-store'
import NextImage from 'next/image'
import { memo } from 'react'

const Image = memo(function Image({ alt = '', size, src }: { alt: string; size: number; src: string }) {
  const { size: unit } = useParamStore(state => state)
  return <NextImage alt={alt} height={size * unit || 30 * size} priority src={src} width={size * unit || 30 * size} />
})

export default Image
