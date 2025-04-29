'use client'

import ThemeButton from '@/components/theme-button'
import Button from '@/components/ui/button'
import Image from '@/components/ui/image'
import Input from '@/components/ui/input'
import Tabs from '@/components/ui/tabs'
import useValue from '@/hooks/value'
import { CodeSchema, EmailSchema, PasswordSchema, UsernameSchema } from '@/schemas/user'
import { Lock, LogIn, Mail, RectangleEllipsis, User } from 'lucide-react'
import { useEffect, useState } from 'react'

const LoginPage = () => {
  const { 0: selected, 1: setSelected } = useState('username')
  const { anime, value: style } = useValue({
    left: 0
  })
  useEffect(() => {
    anime({
      easing: 'easeInOut',
      target: () => ({
        left: selected === 'username' ? 0 : -24
      })
    })
  }, [selected])
  const items = [
    { key: 'username', value: '密码登录' },
    { key: 'email', value: '验证码登录' }
  ]
  const { 0: form1, 1: setForm1 } = useState({
    password: '',
    usernasme: ''
  })
  const { 0: form2, 1: setForm2 } = useState({
    code: '',
    email: ''
  })
  function login1() {
    console.log(form1)
  }
  function login2() {
    console.log(form2)
  }
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-8">
      <ThemeButton className="absolute! top-4 right-4" />
      <div className="flex items-center gap-1">
        <Image alt="logo" size={1.2} src="/icon.svg" />
        <div className="text-theme text-4xl">BNGRID</div>
      </div>
      <div className="flex w-44 flex-col gap-3 overflow-hidden">
        <div className="flex justify-between">
          <Tabs items={items} onChange={setSelected} selected={selected} />
          <Button className="bg-transparent p-0.5! text-current transition-[background-color]!">注册</Button>
        </div>
        <div className="flex w-92 justify-between" style={{ transform: `translate3d(${style.left}rem, 0, 0)` }}>
          <div className="flex flex-col gap-3">
            <Input
              field="用户名"
              onChange={usernasme => setForm1({ ...form1, usernasme })}
              prefix={<User />}
              value={form1.usernasme}
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
            <Input
              field="验证码"
              onChange={code => setForm2({ ...form2, code })}
              prefix={<RectangleEllipsis />}
              type="code"
              value={form2.code}
              verify={CodeSchema}
            />
          </div>
        </div>
        <Button className="w-44" icon={<LogIn />} onTap={selected === 'username' ? login1 : login2}>
          登录
        </Button>
      </div>
    </div>
  )
}

export default LoginPage
