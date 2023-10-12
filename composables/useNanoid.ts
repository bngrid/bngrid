import { nanoid } from 'nanoid'

export const useNanoid = () => {
  return 'BNID' + nanoid()
}
