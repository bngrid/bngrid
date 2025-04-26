'use client'

import Button from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const RedirectPage = () => {
  const searchParams = useSearchParams()
  const targetUrl = searchParams.get('to')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!targetUrl) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = targetUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [targetUrl])

  if (!targetUrl) {
    return <div className="flex h-screen items-center justify-center">无效的跳转链接</div>
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <h1 className="text-2xl font-bold">您即将离开本站</h1>
      <p>您将被重定向到：</p>
      <div className="max-w-lg rounded-lg bg-gray-100 p-4 break-all dark:bg-gray-800">{targetUrl}</div>
      <p>{countdown > 0 ? `${countdown}秒后自动跳转` : '正在跳转...'}</p>
      <div className="flex gap-4">
        <Button className="bg-foreground text-background" onTap={() => (window.location.href = targetUrl)}>
          立即前往
        </Button>
        <Button className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200" onTap={() => window.history.back()}>
          返回上页
        </Button>
      </div>
    </div>
  )
}

export default RedirectPage
