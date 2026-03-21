import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;