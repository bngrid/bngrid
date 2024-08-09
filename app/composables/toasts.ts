type Toast = {
  id: string
  flag: boolean
  msg: string
}

export const useToasts = () => useState<Toast[]>('toasts', () => [])
