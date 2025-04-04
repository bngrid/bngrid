'use client'

import { ReactNode } from 'react'
import { ParamStoreProvider } from './param-store-provider'
import { ThemeStoreProvider } from './theme-store-provider'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ParamStoreProvider>
      <ThemeStoreProvider>{children}</ThemeStoreProvider>
    </ParamStoreProvider>
  )
}

export default Providers
