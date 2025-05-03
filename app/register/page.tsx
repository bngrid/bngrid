'use client'

import { register } from '@/api/user'
import ThemeButton from '@/components/theme-button'
import Button from '@/components/ui/button'
import Image from '@/components/ui/image'
import Input from '@/components/ui/input'
import { useToastStore } from '@/providers/toast-store'
import { EmailSchema, PasswordSchema, UsernameSchema } from '@/schemas/user'
import { Lock, Mail, SquarePen, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const RegisterPage = () => {
  const { addToast } = useToastStore(state => state)
  const router = useRouter()
  const { 0: form, 1: setForm } = useState({
    email: '',
    loading: false,
    password: '',
    username: ''
  })
  async function submit() {
    setForm(form => ({
      ...form,
      loading: true
    }))
    const data = await register(form)
    setForm(form => ({
      ...form,
      loading: false
    }))
    if (!data.success) {
      return addToast({
        message: data.result,
        type: 'error'
      })
    }
    addToast({
      message: data.result,
      type: 'success'
    })
    router.replace('/verify')
  }
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-8">
      <ThemeButton className="absolute! top-4 right-4" />
      <div className="animate-in fade-in flex items-center gap-1.5 transition-[opacity] duration-600">
        <Image alt="logo" size={1.2} src="/icon.svg" />
        <div className="text-theme text-4xl">BNGRID</div>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-[3rem] flex w-44 flex-col gap-3 transition-[opacity,transform] duration-600">
        <div className="flex justify-between">
          <Button href="/verify" target="replace" type="text">
            邮箱验证
          </Button>
          <Button href="/login" target="replace" type="text">
            前往登录
          </Button>
        </div>
        <Input field="邮箱" onChange={email => setForm({ ...form, email })} prefix={<Mail />} value={form.email} verify={EmailSchema} />
        <Input
          field="用户名"
          onChange={usernasme => setForm({ ...form, username: usernasme })}
          prefix={<User />}
          value={form.username}
          verify={UsernameSchema}
        />
        <Input
          field="密码"
          onChange={password => setForm({ ...form, password })}
          prefix={<Lock />}
          type="password"
          value={form.password}
          verify={PasswordSchema}
        />
        <Button className="w-44" icon={<SquarePen />} loading={form.loading} onTap={submit}>
          注册
        </Button>
      </div>
    </div>
  )
}

export default RegisterPage
