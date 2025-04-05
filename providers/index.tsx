'use client'

import { ReactNode } from 'react'
import { ParamStoreProvider } from './param-store'
import { ThemeStoreProvider } from './theme-store'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ParamStoreProvider>
      <ThemeStoreProvider>{children}</ThemeStoreProvider>
    </ParamStoreProvider>
  )
}

export default Providers
