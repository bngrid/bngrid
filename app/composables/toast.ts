import { nanoid } from 'nanoid'

export const useToast = () => {
  const toasts = useToasts()
  function add({ flag, msg }: { flag: boolean; msg: string }) {
    const id = nanoid()
    toasts.value.push({
      id,
      flag,
      msg
    })
    setTimeout(() => {
      toasts.value = toasts.value.filter(toast => toast.id !== id)
    }, 3000)
  }
  return add
}
