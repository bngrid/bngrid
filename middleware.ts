import { verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const { JWT_PUBLIC_KEY: pub } = process.env
if (!pub) throw new Error('未找到 JWT_PUBLIC_KEY 环境变量')

const paths = ['/login', '/register', '/verify', '/redirect']

export async function middleware(request: NextRequest) {
  try {
    if (paths.includes(request.nextUrl.pathname)) return NextResponse.next()
    verify(request.cookies.get('token')?.value ?? '', pub ?? '', {
      algorithms: ['RS256'],
      issuer: 'banno'
    })
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: '/((?!_next|.*\\.).*)'
}
