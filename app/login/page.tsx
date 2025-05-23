'use client'

import { loginByCode, loginByPassword, signUserEmail } from '@/api/user'
import ThemeButton from '@/components/theme-button'
import Button from '@/components/ui/button'
import Image from '@/components/ui/image'
import Input from '@/components/ui/input'
import Tabs from '@/components/ui/tabs'
import { useToastStore } from '@/providers/toast-store'
import { CodeSchema, EmailSchema, PasswordSchema, UsernameSchema } from '@/schemas/user'
import cx from '@/utils/cx'
import { Lock, LogIn, Mail, RectangleEllipsis, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const LoginPage = () => {
  const { addToast } = useToastStore(state => state)
  const router = useRouter()
  const { 0: selected, 1: setSelected } = useState('username')
  const { 0: send, 1: setSend } = useState({
    loading: false,
    timer: 0
  })
  const items = [
    { key: 'username', value: '密码登录' },
    { key: 'email', value: '验证码登录' }
  ]
  const { 0: form1, 1: setForm1 } = useState({
    loading: false,
    password: '',
    username: ''
  })
  const { 0: form2, 1: setForm2 } = useState({
    code: '',
    email: '',
    loading: false
  })
  async function login1() {
    setForm1(form1 => ({
      ...form1,
      loading: true
    }))
    const data = await loginByPassword(form1)
    setForm1(form1 => ({
      ...form1,
      loading: false
    }))
    if (!data.success) {
      return addToast({
        message: data.result,
        type: 'error'
      })
    }
    addToast({
      message: '登录成功',
      type: 'success'
    })
    router.replace('/')
  }
  async function login2() {
    setForm2(form2 => ({
      ...form2,
      loading: true
    }))
    const data = await loginByCode(form2)
    setForm2(form2 => ({
      ...form2,
      loading: false
    }))
    if (!data.success) {
      return addToast({
        message: data.result,
        type: 'error'
      })
    }
    addToast({
      message: '登录成功',
      type: 'success'
    })
    router.replace('/')
  }
  async function sendEmail() {
    setSend(send => ({
      ...send,
      loading: true
    }))
    const data = await signUserEmail({ email: form2.email, reason: 'login' })
    setSend(send => ({
      ...send,
      loading: false
    }))
    if (!data.success) {
      return addToast({
        message: data.result,
        type: 'error'
      })
    }
    addToast({
      message: '验证码发送成功',
      type: 'success'
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
      <div className="animate-in fade-in flex items-center gap-1.5 transition-[opacity] duration-600">
        <Image alt="logo" size={1.2} src="/icon.svg" />
        <div className="text-theme text-4xl">BNGRID</div>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-[3rem] flex w-44 flex-col gap-3 overflow-hidden transition-[opacity,transform] duration-600">
        <div className="flex justify-between">
          <Tabs items={items} onChange={setSelected} selected={selected} />
          <Button href="/register" target="replace" type="text">
            前往注册
          </Button>
        </div>
        <div
          className={cx(
            'flex w-92 justify-between transition-[translate] duration-300',
            selected === 'username' ? 'translate-x-0' : '-translate-x-48'
          )}
        >
          <div className="flex flex-col gap-3">
            <Input
              field="用户名"
              onChange={usernasme => setForm1({ ...form1, username: usernasme })}
              prefix={<User />}
              value={form1.username}
              verify={UsernameSchema}
            />
            <Input
              field="密码"
              onChange={password => setForm1({ ...form1, password })}
              prefix={<Lock />}
              type="password"
              value={form1.password}
              verify={PasswordSchema}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Input field="邮箱" onChange={email => setForm2({ ...form2, email })} prefix={<Mail />} value={form2.email} verify={EmailSchema} />
            <div className="flex gap-3">
              <Input
                className="w-0! flex-1"
                field="验证码"
                onChange={code => setForm2({ ...form2, code })}
                prefix={<RectangleEllipsis />}
                type="code"
                value={form2.code}
                verify={CodeSchema}
              />
              <Button className="flex-none" disabled={!!send.timer} loading={send.loading} onTap={sendEmail} type="outline">
                {send.timer ? `等待${send.timer}秒` : '发送验证码'}
              </Button>
            </div>
          </div>
        </div>
        <Button className="w-44" icon={<LogIn />} loading={form1.loading || form2.loading} onTap={selected === 'username' ? login1 : login2}>
          登录
        </Button>
      </div>
    </div>
  )
}

export default LoginPage
