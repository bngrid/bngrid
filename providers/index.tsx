'use client'

import { ReactNode } from 'react'
import { ParamStoreProvider } from './param-store'
import { ThemeStoreProvider } from './theme-store'
import { TokenStoreProvider } from './token-store'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <TokenStoreProvider>
      <ParamStoreProvider>
        <ThemeStoreProvider>{children}</ThemeStoreProvider>
      </ParamStoreProvider>
    </TokenStoreProvider>
  )
}

export default Providers
