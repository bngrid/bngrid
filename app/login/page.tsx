'use client'

import { login } from '@/api/auth'
import Button from '@/components/ui/button'

const LoginPage = () => {
  async function getTheme() {
    const data = await login()
    if (!data.success) {
      return console.log('未找到')
    }
    console.log(data.result.state.theme)
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h3 className="font-bold">Login Page</h3>
      <Button onTap={getTheme}>获取theme</Button>
    </div>
  )
}

export default LoginPage
