// 'use server'

// import { data } from '@/api/data'
// import { verifyEmail } from '@/api/email'
// import { checkJWT, clearJWT, setJWT } from '@/api/jwt'
// import db from '@/lib/db'
// import { LoginByCodeSchema, LoginByPasswordSchema, RegisterSchema } from '@/schemas/user'
// import { compare, genSaltSync, hashSync } from 'bcryptjs'

// export async function loginByCode(email: string, code: string) {
//   const { error, success } = LoginByCodeSchema({ code, email })
//   if (!success) {
//     return data(success, error.errors.map(err => err.message).join('，'))
//   }
//   try {
//     const user = await db.user.findUnique({
//       where: {
//         email
//       }
//     })
//     if (!user) {
//       return data(false, '用户不存在')
//     }
//     const verify = await verifyEmail(user, 'login', code)
//     if (!verify.success) {
//       return verify
//     }
//     return setJWT(user)
//   } catch {
//     return data(false, '数据库错误')
//   }
// }

// export async function loginByPassword(username: string, password: string) {
//   const { error, success } = LoginByPasswordSchema({ password, username })
//   if (!success) {
//     return data(success, error.errors.map(err => err.message).join('，'))
//   }
//   try {
//     const user = await db.user.findUnique({
//       where: {
//         username
//       }
//     })
//     if (!user || !(await compare(password, user.password))) {
//       return data(false, '用户名或密码错误')
//     }
//     return setJWT(user)
//   } catch {
//     return data(false, '数据库错误')
//   }
// }

// export async function logout() {
//   const check = await checkJWT()
//   if (!check.success) {
//     return check
//   }
//   return clearJWT(check.result)
// }

// export async function register(username: string, password: string, email: string) {
//   const { error, success } = RegisterSchema({ email, password, username })
//   if (!success) {
//     return data(false, error.errors.map(err => err.message).join('，'))
//   }
//   try {
//     const user = await db.user.findFirst({
//       where: {
//         OR: [{ username }, { email }]
//       }
//     })
//     if (user) {
//       if (user.username === username) {
//         return data(false, '用户名已被注册')
//       }
//       return data(false, '邮箱已被注册')
//     }
//     const salt = genSaltSync()
//     const newUser = await db.user.create({
//       data: {
//         email,
//         password: hashSync(password, salt),
//         username
//       }
//     })
//     return setJWT(newUser)
//   } catch (error) {
//     console.error('注册失败:', error)
//     return data(false, '注册失败，请稍后再试')
//   }
// }
