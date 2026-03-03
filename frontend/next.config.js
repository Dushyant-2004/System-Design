/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Increase serverless function timeout for AI generation
  serverExternalPackages: ['mongoose'],
};

module.exports = nextConfig;
