'use server'

import { data } from '@/lib/data'
import COS from 'cos-nodejs-sdk-v5'

type ReasonType = 'icons' | 'wallpapers' | 'avatars'

const SecretId = process.env.COS_SECRET_ID
const SecretKey = process.env.COS_SECRET_KEY
if (!SecretId || !SecretKey) {
  throw new Error('未找到 COS_SECRET_ID 和 COS_SECRET_KEY 环境变量')
}
const cos = new COS({
  SecretId,
  SecretKey
})
function generateObject(reason: ReasonType, name: string) {
  return {
    Bucket: 'bngrid-1316584904',
    Region: 'ap-shanghai',
    Key: `${reason}/${name}.png`
  }
}

export async function uploadImage(
  reason: ReasonType,
  name: string,
  file: File,
  onProgress?: (percent: number) => void
) {
  try {
    const res = await cos.putObject({
      ...generateObject(reason, name),
      Body: Buffer.from(await file.arrayBuffer()),
      ContentLength: file.size,
      onProgress: progress => onProgress?.(progress.percent)
    })
    return data(true, res.Location)
  } catch {
    return data(false, '图片上传失败')
  }
}

export async function downloadImage(reason: ReasonType, name: string) {
  try {
    const res = await cos.getObject(generateObject(reason, name))
    return data(true, `data:image/bmp;base64,${res.Body.toString('base64')}`)
  } catch {
    return data(false, '图片下载失败')
  }
}
