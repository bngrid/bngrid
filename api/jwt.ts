// 'use server'

// import { data } from '@/api/data'
// import { User } from '@/generated/prisma'
// import db from '@/lib/db'
// import generateRandomCode from '@/utils/random-string'
// import { sign, verify } from 'jsonwebtoken'
// import { cookies } from 'next/headers'

// type Token = {
//   token: string
//   type: 'access' | 'refresh'
//   userid: number
// }

// export async function checkJWT() {
//   let accessToken = await verifyAccessJWT()
//   if (accessToken.success) {
//     return accessToken
//   }
//   const refreshResult = await verifyRefreshJWT()
//   const cookieStore = await cookies()
//   if (!refreshResult.success) {
//     return clearJWT(refreshResult.result)
//   }
//   const { id, token } = refreshResult.result
//   accessToken = await signAccessJWT(id, token)
//   if (!accessToken.success) {
//     cookieStore.delete('access')
//     cookieStore.delete('refresh')
//     return data(false, '登录已过期')
//   }
//   cookieStore.set('access', accessToken.result, {
//     httpOnly: true,
//     maxAge: 30 * 60,
//     sameSite: true,
//     secure: true
//   })
//   accessToken = await verifyAccessJWT()
//   if (!accessToken.success) {
//     cookieStore.delete('access')
//     cookieStore.delete('refresh')
//     return data(false, '登录已过期')
//   }
//   return accessToken
// }

// export async function clearJWT(userid: string) {
//   const cookieStore = await cookies()
//   cookieStore.delete('access')
//   cookieStore.delete('refresh')
//   try {
//     await db.user.update({
//       data: {
//         token: generateRandomCode()
//       },
//       where: {
//         id: userid
//       }
//     })
//     return data(true, '登出成功')
//   } catch {
//     return data(false, '数据库错误')
//   }
// }

// export async function setJWT({ id }: User) {
//   const { 0: accessToken, 1: refreshToken } = await Promise.all([
//     signAccessJWT(id, token),
//     signRefreshJWT(id, token)
//   ])
//   if (!accessToken.success || !refreshToken.success) {
//     return data(false, 'TOKEN 生成失败')
//   }
//   const cookieStore = await cookies()
//   const cookieOptions = { httpOnly: true, sameSite: true, secure: true }
//   cookieStore.set('access', accessToken.result, {
//     ...cookieOptions,
//     maxAge: 30 * 60
//   })
//   cookieStore.set('refresh', refreshToken.result, {
//     ...cookieOptions,
//     maxAge: 30 * 24 * 60 * 60
//   })
//   return data(true, '登录成功')
// }

// export async function signAccessJWT(userid: number, token: string) {
//   const publicKey = process.env.JWT_PUBLIC_KEY
//   if (!publicKey) {
//     throw new Error('未找到 JWT_PUBLIC_KEY 环境变量')
//   }
//   try {
//     return data(
//       true,
//       sign(
//         {
//           token,
//           type: 'access',
//           userid
//         },
//         publicKey,
//         {
//           expiresIn: '30m',
//           issuer: 'banno'
//         }
//       )
//     )
//   } catch {
//     return data(false, 'TOKEN 生成失败')
//   }
// }

// export async function signRefreshJWT(userid: number, token: string) {
//   const publicKey = process.env.JWT_PUBLIC_KEY
//   if (!publicKey) {
//     throw new Error('未找到 JWT_PUBLIC_KEY 环境变量')
//   }
//   try {
//     return data(
//       true,
//       sign(
//         {
//           token,
//           type: 'refresh',
//           userid
//         },
//         publicKey,
//         {
//           expiresIn: '30d',
//           issuer: 'banno'
//         }
//       )
//     )
//   } catch {
//     return data(false, 'TOKEN 生成失败')
//   }
// }

// export async function verifyAccessJWT() {
//   const privateKey = process.env.JWT_PRIVATE_KEY
//   if (!privateKey) {
//     throw new Error('未找到 JWT_PRIVATE_KEY 环境变量')
//   }
//   const cookieStore = await cookies()
//   const jwt = cookieStore.get('access')?.value
//   if (!jwt) {
//     return data(false, 'TOKEN 不存在')
//   }
//   try {
//     const result = <Token>verify(jwt, privateKey, {
//       issuer: 'banno'
//     })
//     if (result.type !== 'access') {
//       return data(false, 'TOKEN 类型错误')
//     }
//     const user = await db.user.findUnique({
//       where: {
//         id: result.userid
//       }
//     })
//     if (!user) {
//       return data(false, '用户不存在')
//     }
//     if (user.status === 'pending') {
//       return data(false, '邮箱未验证')
//     }
//     if (user.status === 'banned') {
//       return data(false, '用户已被封禁')
//     }
//     if (user.status === 'deleted') {
//       return data(false, '用户已被删除')
//     }
//     return data(true, result.userid)
//   } catch {
//     return data(false, 'TOKEN 解析失败')
//   }
// }

// export async function verifyRefreshJWT() {
//   const privateKey = process.env.JWT_PRIVATE_KEY
//   if (!privateKey) {
//     throw new Error('未找到 JWT_PRIVATE_KEY 环境变量')
//   }
//   const cookieStore = await cookies()
//   const jwt = cookieStore.get('refresh')?.value
//   if (!jwt) {
//     return data(false, 'TOKEN 不存在')
//   }
//   try {
//     const result = <Token>verify(jwt, privateKey, {
//       issuer: 'banno'
//     })
//     if (result.type !== 'access') {
//       return data(false, 'TOKEN 类型错误')
//     }
//     const user = await db.user.findUnique({
//       where: {
//         id: result.userid
//       }
//     })
//     if (!user) {
//       return data(false, '用户不存在')
//     }
//     return data(true, user)
//   } catch {
//     return data(false, 'TOKEN 解析失败')
//   }
// }
