import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix Turbopack root directory warning
  turbopack: {
    root: process.cwd(),
  },

  // Image optimization for OpenGraph images
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apilon.com",
      },
    ],
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
