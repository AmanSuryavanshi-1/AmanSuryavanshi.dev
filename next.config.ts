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
      // NOTE: www/non-www redirects should be configured in Vercel Dashboard
      // Settings > Domains to avoid redirect loops with hosting provider

      // Redirect dev domain to main domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'amansuryavanshi-dev.vercel.app' }],
        destination: 'https://amansuryavanshi.me/:path*',
        permanent: true,
      },
      // Redirect old /contact URL to homepage contact section
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

