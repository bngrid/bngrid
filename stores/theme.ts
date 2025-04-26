import cookieStore from '@/utils/cookie-store'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

export type ThemeStore = ThemeActions & ThemeState

type ThemeActions = {
  toggleTheme: () => void
}

type ThemeState = {
  theme: 'dark' | 'light'
}

const defaultInitState: ThemeState = {
  theme: 'dark'
}

export const createThemeStore = (initState: ThemeState = defaultInitState) => {
  return createStore<ThemeStore>()(
    persist(
      set => ({
        ...initState,
        toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
      }),
      {
        name: 'theme',
        storage: createJSONStorage(() => cookieStore)
      }
    )
  )
}
