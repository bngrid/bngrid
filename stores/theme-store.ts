import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

type ThemeState = {
  theme: 'light' | 'dark'
}

type ThemeActions = {
  toggleTheme: () => void
}

export type ThemeStore = ThemeState & ThemeActions

const cookieStore = {
  getItem: (key: string) => {
    const encoded = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&')
    const regex = new RegExp(`(?:(?:^|.*;)\\s*${encoded}\\s*=\\s*([^;]*).*$)|^.*$`)
    const result = decodeURIComponent(document.cookie.replace(regex, '$1'))
    return result || null
  },
  setItem: (key: string, value: string) => {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
      throw new Error('名称无效')
    }
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`
  },
  removeItem: (key: string) => {
    document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }
}

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
