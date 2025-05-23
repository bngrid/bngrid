'use client'

import { createParamStore, ParamStore } from '@/stores/param'
import { createContext, ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type ParamStoreApi = ReturnType<typeof createParamStore>

const ParamStoreContext = createContext<null | ParamStoreApi>(null)

export const ParamStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<ParamStoreApi>(null)
  if (!storeRef.current) storeRef.current = createParamStore()
  return <ParamStoreContext value={storeRef.current}>{children}</ParamStoreContext>
}
export const useParamStore = <T,>(selector: (store: ParamStore) => T): T => {
  const paramStoreContext = useContext(ParamStoreContext)
  if (!paramStoreContext) throw new Error('useParamStore 必须在 ParamStoreProvider 中使用')
  return useStore(paramStoreContext, selector)
}
