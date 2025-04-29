'use client'

import { ParamStoreProvider } from './param-store'
import { ThemeStoreProvider } from './theme-store'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ParamStoreProvider>
      <ThemeStoreProvider>{children}</ThemeStoreProvider>
    </ParamStoreProvider>
  )
}

export default Providers
