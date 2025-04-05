'use client'

import { ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { type TokenStore, createTokenStore } from '@/stores/token'

export type TokenStoreApi = ReturnType<typeof createTokenStore>

export const TokenStoreContext = createContext<TokenStoreApi | null>(null)

export const TokenStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<TokenStoreApi>(null)

  if (!storeRef.current) {
    storeRef.current = createTokenStore()
  }

  return <TokenStoreContext value={storeRef.current}>{children}</TokenStoreContext>
}

export const useTokenStore = <T,>(selector: (store: TokenStore) => T): T => {
  const counterStoreContext = useContext(TokenStoreContext)

  if (!counterStoreContext) {
    throw new Error('useTokenStore 必须在 TokenStoreProvider 中使用')
  }

  return useStore(counterStoreContext, selector)
}
