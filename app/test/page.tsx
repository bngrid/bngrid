'use client'

import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'

function TestPage() {
  const [value, setValue] = useState('')
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="text-xl font-bold">测试页面</h1>
      <Button icon={<Search />}>测试</Button>
      <Input
        field="账号"
        hint="请输入正确用户名11111111111111111111111111111111111111111111111111111111111"
        onChange={setValue}
        prefix={<Search />}
        value={value}
      />
      <Button href="/" onTap={() => console.log('aaa')}>
        跳转
      </Button>
    </div>
  )
}

export default TestPage
