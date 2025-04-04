'use client'

import { useParamStore } from '@/providers/param-store-provider'
import debounce from '@/utils/debounce'
import { useEffect } from 'react'

const Setup = () => {
  const { size, setParam } = useParamStore(state => state)
  useEffect(() => {
    function initParam() {
      setParam(innerWidth, innerHeight)
    }
    initParam()
    onresize = debounce(initParam)
    return () => {
      onresize = null
    }
  }, [])
  useEffect(() => {
    document.documentElement.style.fontSize = `${0.5 * size}px`
  }, [size])
  return <></>
}

export default Setup
