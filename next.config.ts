/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "storage.googleapis.com", // ← 혹시 이후에 필요할 수도 있으니 함께 유지
    ],
  },
  webpack: (config: any) => {
    return config;
  },
  experimental: {
    turbo: false, // Turbopack 비활성화
  },
  transpilePackages: ["apollo-upload-client"],
};

module.exports = nextConfig;
