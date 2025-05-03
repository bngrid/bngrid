'use client'

import { ParamStoreProvider } from './param-store'
import { ThemeStoreProvider } from './theme-store'
import { ToastStoreProvider } from './toast-store'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ParamStoreProvider>
      <ThemeStoreProvider>
        <ToastStoreProvider>{children}</ToastStoreProvider>
      </ThemeStoreProvider>
    </ParamStoreProvider>
  )
}

export default Providers
