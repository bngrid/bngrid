'use server'

import sharp from 'sharp'

import { data } from './data'

const imageTypes = new Set([
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp'
])

const maxSize = {
  avatar: 5 * 1024 * 1024,
  wallpaper: 10 * 1024 * 1024
}

export async function convertAvatar(file: File) {
  if (!imageTypes.has(file.type)) {
    return data(false, '头像格式错误')
  }
  if (file.size > maxSize.avatar) {
    return data(false, '头像大小不能超过5MB')
  }
  try {
    const buffer = await sharp(await file.arrayBuffer())
      .resize(300, 300)
      .flatten({ background: '#FFFFFF' })
      .webp({ lossless: true })
      .toBuffer()
    return data(true, buffer)
  } catch {
    return data(false, '头像转换失败')
  }
}

export async function convertWallpaper(file: File) {
  if (!imageTypes.has(file.type)) {
    return data(false, '壁纸格式错误')
  }
  if (file.size > maxSize.wallpaper) {
    return data(false, '壁纸大小不能超过10MB')
  }
  try {
    const buffer = await sharp(await file.arrayBuffer())
      .flatten({ background: '#FFFFFF' })
      .webp({ lossless: true })
      .toBuffer()
    return data(true, buffer)
  } catch {
    return data(false, '壁纸转换失败')
  }
}
