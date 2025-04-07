import cookieStore from '@/lib/client/cookie-store'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

type TokenState = {
  token: string
}

type TokenActions = {
  setToken: (newToken: string) => void
}

export type TokenStore = TokenState & TokenActions

const defaultInitState: TokenState = {
  token: ''
}

export const createTokenStore = (initState: TokenState = defaultInitState) => {
  return createStore<TokenStore>()(
    persist(
      set => ({
        ...initState,
        setToken: newToken => set(() => ({ token: newToken }))
      }),
      {
        name: 'token',
        storage: createJSONStorage(() => cookieStore)
      }
    )
  )
}
