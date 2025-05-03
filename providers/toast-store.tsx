'use client'

import { createToastStore, ToastStore } from '@/stores/toast'
import { createContext, ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type ToastStoreApi = ReturnType<typeof createToastStore>

const ToastStoreContext = createContext<null | ToastStoreApi>(null)

export const ToastStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<ToastStoreApi>(null)
  if (!storeRef.current) storeRef.current = createToastStore()
  return <ToastStoreContext value={storeRef.current}>{children}</ToastStoreContext>
}
export const useToastStore = <T,>(selector: (store: ToastStore) => T): T => {
  const toastStoreContext = useContext(ToastStoreContext)
  if (!toastStoreContext) throw new Error('useToastStore 必须在 ToastStoreProvider 中使用')
  return useStore(toastStoreContext, selector)
}
