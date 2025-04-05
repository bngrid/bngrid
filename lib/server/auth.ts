'use server'

import { Data } from '@/types/server'
import { cookies } from 'next/headers'

export async function login(): Data<any> {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  if (!theme) {
    return { success: false, result: '未登录' }
  }
  return { success: true, result: JSON.parse(theme.value) }
}
