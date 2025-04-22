import { generateKeyPairSync } from 'crypto'
import { existsSync, readFileSync, writeFileSync } from 'fs'

function generateSecretKey() {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
    publicKeyEncoding: { format: 'pem', type: 'spki' }
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
  generateSecretKey()
  console.log('密钥生成成功')
} catch (error) {
  console.error('密钥生成失败：', error)
}
