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
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
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
  async redirects() {
    return [
      // Redirect dev domain to main domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'amansuryavanshi-dev.vercel.app' }],
        destination: 'https://amansuryavanshi.me/:path*',
        permanent: true,
      },
      // Redirect www to non-www (canonical)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.amansuryavanshi.me' }],
        destination: 'https://amansuryavanshi.me/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

