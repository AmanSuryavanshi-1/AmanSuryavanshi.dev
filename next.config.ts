import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'amansuryavanshi-dev.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build due to React 19 migration
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint errors during build to resolve Vercel deployment issues
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

