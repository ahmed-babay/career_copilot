/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable telemetry to avoid EPERM errors on Windows
  experimental: {
    disableOptimizedLoading: false,
  },
}

module.exports = nextConfig

