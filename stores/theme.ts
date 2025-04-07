import cookieStore from '@/lib/client/cookie-store'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

type ThemeState = {
  theme: 'light' | 'dark'
}

type ThemeActions = {
  toggleTheme: () => void
}

export type ThemeStore = ThemeState & ThemeActions

const defaultInitState: ThemeState = {
  theme: 'dark'
}

export const createThemeStore = (initState: ThemeState = defaultInitState) => {
  return createStore<ThemeStore>()(
    persist(
      set => ({
        ...initState,
        toggleTheme: () =>
          set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
      }),
      {
        name: 'theme',
        storage: createJSONStorage(() => cookieStore)
      }
    )
  )
}
