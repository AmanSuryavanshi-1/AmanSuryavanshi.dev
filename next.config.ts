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
        destination: 'https://www.amansuryavanshi.me/:path*',
        permanent: true,
      },
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'amansuryavanshi.me' }],
        destination: 'https://www.amansuryavanshi.me/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

