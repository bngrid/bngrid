'use client'

import { getHeaders } from '@/api/test'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { PasswordSchema, UsernameSchema } from '@/schemas/user'
import { Loader, Search } from 'lucide-react'
import { useState } from 'react'

function TestPage() {
  const [form, setForm] = useState({
    password: '',
    username: ''
  })
  const [loading, setLoading] = useState(false)
  async function handleGet() {
    const data = await getHeaders()
    console.log(data)
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <h1 className="text-xl font-bold">测试页面</h1>
      <Button
        icon={<Loader />}
        onTap={() => {
          setLoading(true)
          setTimeout(() => {
            setLoading(false)
          }, 3000)
        }}
      >
        加载
      </Button>
      <Input
        field="账号"
        loading={loading}
        onChange={username => setForm({ ...form, username })}
        prefix={<Search />}
        suffix={'hhh'}
        value={form.username}
        verify={UsernameSchema}
      />
      <Input
        field="密码"
        loading={loading}
        onChange={password => setForm({ ...form, password })}
        type="password"
        value={form.password}
        verify={PasswordSchema}
      />
      <Button href="/" loading={loading} onTap={() => console.log('aaa')}>
        跳转
      </Button>
      <Button onTap={handleGet}>获取headers</Button>
    </div>
  )
}

export default TestPage
