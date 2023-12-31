/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async rewrites () {
    return [
      {
        source: '/api/:slug*/',
        destination: 'http://127.0.0.1:8000/api/:slug*/'
      }
    ]
  }
}

module.exports = nextConfig
