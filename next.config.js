/** @type {import('next').NextConfig} */

require('dotenv').config();

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    RAPID_API_KEY: process.env.RAPID_API_KEY,
  },
};

// export default nextConfig
