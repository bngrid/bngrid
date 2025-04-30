import { type NextRequest, NextResponse } from 'next/server'

import { verifyToken } from './api/token'

// 定义不需要验证的路径
const PUBLIC_PATHS = ['/login', '/register', '/verify', '/redirect']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (PUBLIC_PATHS.includes(path)) {
    return NextResponse.next()
  }
  const data = await verifyToken()
  if (!data.success) {
    return NextResponse.redirect('/login')
  }
}

export const config = {
  matcher: ['/((?!\\.)[^.]*$)']
}
