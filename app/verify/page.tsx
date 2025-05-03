'use client'

import { signUserEmail, verifyUserEmail } from '@/api/user'
import ThemeButton from '@/components/theme-button'
import Button from '@/components/ui/button'
import Image from '@/components/ui/image'
import Input from '@/components/ui/input'
import { useToastStore } from '@/providers/toast-store'
import { CodeSchema, EmailSchema } from '@/schemas/user'
import { Mail, RectangleEllipsis, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const VerifyPage = () => {
  const { addToast } = useToastStore(state => state)
  const router = useRouter()
  const { 0: send, 1: setSend } = useState({
    loading: false,
    timer: 0
  })
  const { 0: form, 1: setForm } = useState({
    code: '',
    email: '',
    loading: false
  })
  async function submit() {
    setForm(form => ({
      ...form,
      loading: true
    }))
    const data = await verifyUserEmail(form)
    setForm(form => ({
      ...form,
      loading: false
    }))
    if (!data.success) {
      return addToast({
        type: 'error',
        message: data.result
      })
    }
    addToast({
      type: 'success',
      message: '验证成功'
    })
    router.replace('/')
  }
  async function sendEmail() {
    setSend(send => ({
      ...send,
      loading: true
    }))
    const data = await signUserEmail({ email: form.email, reason: 'verify' })
    setSend(send => ({
      ...send,
      loading: false
    }))
    if (!data.success) {
      return addToast({
        type: 'error',
        message: data.result
      })
    }
    addToast({
      type: 'success',
      message: '验证码发送成功'
    })
    setSend(send => ({
      ...send,
      timer: 60
    }))
    const interval = setInterval(() => {
      setSend(send => {
        if (!send.timer) {
          clearInterval(interval)
          return send
        }
        return {
          ...send,
          timer: send.timer - 1
        }
      })
    }, 1000)
  }
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-8">
      <ThemeButton className="absolute! top-4 right-4" />
      <div className="flex items-center gap-1.5">
        <Image alt="logo" size={1.2} src="/icon.svg" />
        <div className="text-theme text-4xl">BNGRID</div>
      </div>
      <div className="flex w-44 flex-col gap-3 overflow-hidden">
        <div className="flex justify-between">
          <Button href="/register" target="replace" type="text">
            前往注册
          </Button>
          <Button href="/login" target="replace" type="text">
            前往登录
          </Button>
        </div>
        <Input field="邮箱" onChange={email => setForm({ ...form, email })} prefix={<Mail />} value={form.email} verify={EmailSchema} />
        <div className="flex gap-3">
          <Input
            className="w-0! flex-1"
            field="验证码"
            onChange={code => setForm({ ...form, code })}
            prefix={<RectangleEllipsis />}
            type="code"
            value={form.code}
            verify={CodeSchema}
          />
          <Button className="flex-none" disabled={!!send.timer} loading={send.loading} onTap={sendEmail} type="outline">
            {send.timer ? `等待${send.timer}秒` : '发送验证码'}
          </Button>
        </div>
        <Button className="w-44" icon={<ShieldCheck />} loading={form.loading} onTap={submit}>
          验证
        </Button>
      </div>
    </div>
  )
}

export default VerifyPage
