import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'elearningnew.cybersoft.edu.vn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
