'use client'

import { useParamStore } from '@/providers/param-store'
import { useThemeStore } from '@/providers/theme-store'
import debounce from '@/utils/debounce'
import { useEffect } from 'react'

const Setup = () => {
  const { setParam, size } = useParamStore(state => state)
  const { theme } = useThemeStore(state => state)
  useEffect(() => {
    document.oncontextmenu = event => event.preventDefault()
    function initParam() {
      setParam(innerWidth, innerHeight)
    }
    initParam()
    onresize = debounce(initParam)
    return () => {
      onresize = null
    }
  }, [setParam])
  useEffect(() => {
    document.documentElement.style.fontSize = `${0.5 * size}px`
  }, [size])
  useEffect(() => {
    const classList = document.documentElement.classList
    if (theme === 'dark') {
      classList.add('dark')
    } else {
      classList.remove('dark')
    }
  }, [theme])
  return <></>
}

export default Setup
