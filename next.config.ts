import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-fa494a3b296345cdb20796e5eafa3316.r2.dev',
      },
    ],
  },
};

export default nextConfig;
