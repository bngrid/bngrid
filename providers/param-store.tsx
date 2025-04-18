'use client'

import { type ParamStore, createParamStore } from '@/stores/param'
import { ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type ParamStoreApi = ReturnType<typeof createParamStore>

const ParamStoreContext = createContext<ParamStoreApi | null>(null)

export const ParamStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<ParamStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createParamStore()
  }
  return <ParamStoreContext value={storeRef.current}>{children}</ParamStoreContext>
}
export const useParamStore = <T,>(selector: (store: ParamStore) => T): T => {
  const counterStoreContext = useContext(ParamStoreContext)
  if (!counterStoreContext) {
    throw new Error('useParamStore 必须在 ParamStoreProvider 中使用')
  }
  return useStore(counterStoreContext, selector)
}
