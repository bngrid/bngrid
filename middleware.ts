import { importSPKI, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const { JWT_PUBLIC_KEY: pubPem } = process.env
if (!pubPem) throw new Error('未找到 JWT_PUBLIC_KEY 环境变量')
const pubKey = importSPKI(pubPem, 'RS256')

const paths = ['/login', '/register', '/verify', '/redirect']

export async function middleware(request: NextRequest) {
  try {
    if (paths.includes(request.nextUrl.pathname)) return NextResponse.next()
    await jwtVerify(request.cookies.get('token')?.value ?? '', (await pubKey) ?? '', {
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
