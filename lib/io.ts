import { Client } from 'minio'

type Global = typeof globalThis & {
  minio?: Client
}

const { MINIO_SECRET: secretKey, USER_NAME: accessKey } = process.env
if (!accessKey || !secretKey) {
  throw new Error('未找到 USER_NAME 和 MINIO_SECRET 环境变量')
}

const globalWithMinio = <Global>global
const minio =
  globalWithMinio.minio ??
  new Client({
    accessKey,
    endPoint: 'store.bngrid.com',
    secretKey
  })
if (process.env.NODE_ENV !== 'production') {
  globalWithMinio.minio = minio
}

export default minio
