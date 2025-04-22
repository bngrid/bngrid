'use server'

import { data } from '@/api/data'
import minio from '@/lib/io'

import { convertAvatar, convertWallpaper } from './image'

type Bucket = 'avatar' | 'wallpaper'

const imageExpires = 24 * 60 * 60

const converters = {
  avatar: convertAvatar,
  wallpaper: convertWallpaper
}

export async function downloadImage(bucket: Bucket, name: string) {
  try {
    const url = await minio.presignedGetObject(bucket, `${name}.webp`, imageExpires)
    return data(true, url)
  } catch {
    return data(false, '图片下载失败')
  }
}

export async function uploadImage(bucket: Bucket, name: string, file: File) {
  if (!(bucket in converters)) {
    return data(false, '存储桶名称错误')
  }
  try {
    const res = await converters[bucket](file)
    if (!res.success) {
      return res
    }
    const { etag } = await minio.putObject(bucket, `${name}.webp`, res.result)
    return data(true, etag)
  } catch {
    return data(false, '图片上传失败')
  }
}
