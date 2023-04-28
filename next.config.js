/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    isLocal: process.env.MONGODB_URI.includes("italy"),
  },
};

module.exports = nextConfig;
