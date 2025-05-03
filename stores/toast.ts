import { createStore } from 'zustand/vanilla'

export type ToastStore = ToastActions & ToastState

type Toast = { timer?: number; type: 'success' | 'error' | 'info' | 'warning'; message: string; animate?: 'in' | 'out' }

type ToastActions = {
  addToast: (toast: Toast) => void
  removeToast: (timer?: number) => void
}

type ToastState = {
  toasts: Toast[]
}

const defaultInitState: ToastState = {
  toasts: []
}

export const createToastStore = (initState: ToastState = defaultInitState) => {
  return createStore<ToastStore>()(set => ({
    ...initState,
    addToast: toast =>
      set(state => {
        const timer = +setTimeout(() => {
          state.removeToast(timer)
        }, 3000)
        return {
          toasts: [
            ...state.toasts,
            {
              timer,
              message: toast.message,
              type: toast.type,
              animate: 'in'
            }
          ]
        }
      }),
    removeToast: timer => {
      timer && clearTimeout(timer)
      setTimeout(() => {
        set(state => ({
          toasts: state.toasts.filter(item => item.timer !== timer)
        }))
      }, 300)
      set(state => ({
        toasts: state.toasts.map(item => {
          if (item.timer === timer) {
            return {
              ...item,
              animate: 'out'
            }
          }
          return item
        })
      }))
    }
  }))
}
