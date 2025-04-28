import '@/assets/globals.css'

import type { Metadata, Viewport } from 'next'

import Setup from '@/components/setup'
import Providers from '@/providers'
import cx from '@/utils/cx'
import localFont from 'next/font/local'
import { ReactNode } from 'react'

const font = localFont({
  src: '../assets/font.woff2',
  variable: '--font'
})

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent'
  },
  applicationName: 'BNGRID',
  authors: { name: 'Banno', url: 'https://bngrid.com/banno' },
  description: 'Huarong Grid & Atomic Widgets & Smooth Animation, Your modern browser launcher.',
  formatDetection: {
    address: false,
    date: false,
    email: false,
    telephone: false,
    url: false
  },
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: { follow: false, index: false },
  title: 'BNGRID'
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  interactiveWidget: 'overlays-content',
  themeColor: [
    { color: '#FFFFFF', media: '(prefers-color-scheme: light)' },
    { color: '#1E1E1E', media: '(prefers-color-scheme: dark)' }
  ]
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html className="dark h-full" lang="zh-CN">
      <body className={cx('font-family bg-background text-foreground relative h-full touch-none antialiased select-none', font.variable)}>
        <Providers>
          <Setup />
          {children}
        </Providers>
        <div className="absolute inset-0 bg-transparent dark:bg-black/30" />
      </body>
    </html>
  )
}

export default RootLayout
