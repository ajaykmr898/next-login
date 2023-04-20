/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiUrl: "http://localhost:3000/api",
  },
};

module.exports = nextConfig;
