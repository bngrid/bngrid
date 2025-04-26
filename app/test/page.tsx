'use client'

import { getUserInfo } from '@/api/test'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import generateAvatar from '@/utils/avatar'
import Image from 'next/image'
import { useMemo, useState } from 'react'

function TestPage() {
  async function test() {
    const data = await getUserInfo()
    console.log(data)
  }
  const [name, setName] = useState('')
  const avatar = useMemo(() => {
    return generateAvatar(name)
  }, [name])
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <h1 className="text-xl font-bold">测试页面</h1>
      <Button onTap={test}>TEST</Button>
      <Input field="姓名" onChange={setName} value={name} />
      <Image alt="logo" height={100} src={avatar} width={100} />
    </div>
  )
}

export default TestPage
