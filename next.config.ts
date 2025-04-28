import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['bngrid.com', '*.bngrid.com'], bodySizeLimit: '10mb' }
  }
}

export default nextConfig
