'use server'

import { Data } from '@/types/server'
import { cookies } from 'next/headers'

const user = {
  _id: '1',
  username: 'admin',
  password: '123456',
  email: 'example@email.com',
  coin: 100,
  status: 'active',
  token: '123456',
  avatar: 'https://avatars.githubusercontent.com/u/146823537',
  role: 'admin',
  create: '2025-01-15 15:17:36.641',
  update: '2025-01-15 15:17:36.641'
}

export async function login(): Data<{ state: { theme: string } }> {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  if (!theme) {
    return { success: false, result: '未登录' }
  }
  return { success: true, result: JSON.parse(theme.value) }
}
