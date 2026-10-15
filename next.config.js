/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8080' }
    ]
  },
  env: {
    DRUPAL_BASE_URL: process.env.DRUPAL_BASE_URL || 'http://localhost:8080'
  }
}

module.exports = nextConfig
