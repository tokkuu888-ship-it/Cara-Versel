/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    EXPRESS_API_URL: process.env.EXPRESS_API_URL,
  },
};

export default nextConfig;
