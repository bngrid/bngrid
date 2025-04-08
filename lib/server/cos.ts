'use server'

import { Data } from '@/types/server'
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
): Data<string> {
  try {
    const data = await cos.putObject({
      ...generateObject(reason, name),
      Body: Buffer.from(await file.arrayBuffer()),
      ContentLength: file.size,
      onProgress: progress => onProgress?.(progress.percent)
    })
    return {
      success: true,
      result: data.Location
    }
  } catch {
    return {
      success: false,
      result: '图片上传失败'
    }
  }
}

export async function downloadImage(reason: ReasonType, name: string): Data<string> {
  try {
    const data = await cos.getObject(generateObject(reason, name))
    return {
      success: true,
      result: `data:image/bmp;base64,${data.Body.toString('base64')}`
    }
  } catch {
    return {
      success: false,
      result: '图片下载失败'
    }
  }
}
