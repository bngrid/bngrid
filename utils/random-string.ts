export default function generateRandomString(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join('')
}
