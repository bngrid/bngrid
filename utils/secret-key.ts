import { generateKeyPairSync } from 'crypto'
import { existsSync, readFileSync, writeFileSync } from 'fs'

function secretKey() {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  })
  const escapedPublicKey = publicKey.replace(/\n/g, '\\n')
  const escapedPrivateKey = privateKey.replace(/\n/g, '\\n')

  let envContent = existsSync('.env') ? readFileSync('.env', 'utf8') : ''
  envContent = envContent
    .split('\n')
    .map(line => {
      if (line.startsWith('JWT_PUBLIC_KEY=')) {
        return `JWT_PUBLIC_KEY="${escapedPublicKey}"`
      }
      if (line.startsWith('JWT_PRIVATE_KEY=')) {
        return `JWT_PRIVATE_KEY="${escapedPrivateKey}"`
      }
      return line
    })
    .join('\n')
  writeFileSync('.env', envContent)
}

try {
  secretKey()
  console.log('密钥生成成功')
} catch (error) {
  console.error('发生异常：', error)
}
