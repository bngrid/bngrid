export default function generateAvatar(seed: string) {
  let hash = 0x811c9dc5
  for (const char of seed) {
    hash = ((hash ^ char.charCodeAt(0)) * 0x01000193) >>> 0
  }

  const hue = hash % 360
  const fill = `hsl(${hue},60%,50%)`
  const bg = `hsl(${(hue + 180) % 360},30%,90%)`

  const half = Math.ceil(0.5 * 9)
  const bits = hash.toString(2).padStart(9 * half, '0')

  const rects = []
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < half; x++) {
      const idx = y * half + x
      if (bits[idx] === '1') {
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`)
        if (x !== 4) {
          rects.push(`<rect x="${8 - x}" y="${y}" width="1" height="1" fill="${fill}"/>`)
        }
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9"><rect width="100%" height="100%" fill="${bg}"/>${rects.join('')}</svg>`
}
