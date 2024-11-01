/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-image-domains-if-any.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig 