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

const projectName = process.env.PROJECT_NAME
if (!projectName) {
  throw new Error('未找到 PROJECT_NAME 环境变量')
}

const embedBits = (() => {
  const bits = []
  for (const byte of Buffer.from(projectName)) {
    for (let b = 7; b >= 0; b--) bits.push((byte >> b) & 1)
  }
  return bits
})()

export async function convertAvatar(file: File) {
  if (!imageTypes.has(file.type)) {
    return data(false, '头像格式错误')
  }
  if (file.size > maxSize.avatar) {
    return data(false, '头像大小不能超过5MB')
  }
  try {
    const { data: pix, info } = await sharp(await file.arrayBuffer())
      .resize(300, 300)
      .flatten({ background: '#FFFFFF' })
      .raw()
      .toBuffer({ resolveWithObject: true })
    return await embedLSBInBlueChannel(pix, info)
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
    const { data: pix, info } = await sharp(await file.arrayBuffer())
      .flatten({ background: '#FFFFFF' })
      .raw()
      .toBuffer({ resolveWithObject: true })
    return await embedLSBInBlueChannel(pix, info)
  } catch {
    return data(false, '壁纸转换失败')
  }
}

export async function extractWatermark(file: File) {
  try {
    const {
      data: pix,
      info: { channels, height, width }
    } = await sharp(await file.arrayBuffer())
      .raw()
      .toBuffer({ resolveWithObject: true })
    const maxBits = Math.min(embedBits.length, width * height)
    const bits = new Array(maxBits)
    for (let i = 0; i < maxBits; i++) {
      const idx = i * channels + 2
      bits[i] = pix[idx] & 1
    }
    const bytes: number[] = []
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0
      for (let b = 0; b < 8; b++) {
        byte = (byte << 1) | bits[i + b]
      }
      bytes.push(byte)
    }
    return data(true, Buffer.from(bytes).toString())
  } catch {
    return data(false, '提取水印失败')
  }
}

async function embedLSBInBlueChannel(pix: Buffer, info: sharp.OutputInfo) {
  const maxBits = Math.min(embedBits.length, info.width * info.height)
  for (let i = 0; i < maxBits; i++) {
    const idx = i * info.channels + 2
    pix[idx] = (pix[idx] & 0xfe) | embedBits[i]
  }
  try {
    const out = await sharp(pix, { raw: info })
      .webp({ lossless: true, quality: 100 })
      .toBuffer()
    return data(true, out)
  } catch {
    return data(false, '嵌入水印失败')
  }
}
