import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.nordcreative.dk',
      },
    ],
  },
};

export default nextConfig;
