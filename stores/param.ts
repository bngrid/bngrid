import { createStore } from 'zustand/vanilla'

export type ParamStore = ParamActions & ParamState

type ParamActions = {
  setParam: (width: number, height: number) => void
}

type ParamState = {
  column: number
  height: number
  size: number
  width: number
}

function computeParam(width: number, height: number) {
  const ratio = width / height

  const size = ratio < 13 / 24 ? Math.min(60, width / 13) : Math.min(60, height / 24)
  const column = ratio < 13 / 12 ? 1 : ratio < 39 / 24 ? 2 : 3

  return {
    column,
    height,
    size,
    width
  }
}

const defaultInitState: ParamState = {
  column: 0,
  height: 0,
  size: 0,
  width: 0
}

export const createParamStore = (initState: ParamState = defaultInitState) => {
  return createStore<ParamStore>()(set => ({
    ...initState,
    setParam: (width, height) => set(computeParam(width, height))
  }))
}
