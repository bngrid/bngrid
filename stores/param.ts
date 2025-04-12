import { createStore } from 'zustand/vanilla'

type ParamState = {
  width: number
  height: number
  column: number
  size: number
}

type ParamActions = {
  setParam: (width: number, height: number) => void
}

export type ParamStore = ParamState & ParamActions

function computeParam(width: number, height: number) {
  const ratio = width / height
  let size = 60
  let column = 1

  if (ratio < 13 / 24) {
    size = Math.min(size, width / 13)
  } else {
    size = Math.min(size, height / 24)
    column = ratio < 37 / 24 ? 2 : 3
  }

  return {
    width,
    height,
    column,
    size
  }
}

const defaultInitState: ParamState = {
  width: 0,
  height: 0,
  column: 0,
  size: 0
}

export const createParamStore = (initState: ParamState = defaultInitState) => {
  return createStore<ParamStore>()(set => ({
    ...initState,
    setParam: (width, height) => set(computeParam(width, height))
  }))
}
