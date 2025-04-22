export default function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const max = chars.length
  return Array.from({ length }, () => chars[Math.floor(Math.random() * max)]).join('')
}
