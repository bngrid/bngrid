import '@/assets/globals.css'
import clsx from 'clsx'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'

const font = localFont({
  src: '../assets/font.woff2',
  variable: '--font'
})

export const metadata: Metadata = {
  title: 'BNGRID',
  description:
    'Huarong Grid & Atomic Widgets & Smooth Animation, Your modern browser launcher.',
  applicationName: 'BNGRID',
  authors: { name: 'Banno', url: 'https://bngrid.com/banno' },
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent'
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#1E1E1E' }
  ],
  interactiveWidget: 'overlays-content',
  colorScheme: 'dark light'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="zh-CN" className="h-full">
      <body
        className={clsx(
          'font-family bg-background text-foreground pointer-events-none h-full touch-none leading-[1.2rem] antialiased select-none',
          font.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}

export default RootLayout
