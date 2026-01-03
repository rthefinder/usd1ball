/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@usd1ball/shared", "@usd1ball/analytics"],
};

module.exports = nextConfig;
