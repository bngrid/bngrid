'use client'

import { createThemeStore, type ThemeStore } from '@/stores/theme'
import { createContext, ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type ThemeStoreApi = ReturnType<typeof createThemeStore>

const ThemeStoreContext = createContext<null | ThemeStoreApi>(null)

export const ThemeStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<ThemeStoreApi>(null)
  if (!storeRef.current) storeRef.current = createThemeStore()
  return <ThemeStoreContext value={storeRef.current}>{children}</ThemeStoreContext>
}
export const useThemeStore = <T,>(selector: (store: ThemeStore) => T): T => {
  const counterStoreContext = useContext(ThemeStoreContext)
  if (!counterStoreContext) throw new Error('useThemeStore 必须在 ThemeStoreProvider 中使用')
  return useStore(counterStoreContext, selector)
}
