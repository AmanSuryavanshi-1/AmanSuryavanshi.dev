// import type { NextConfig } from "next";
// const SITE_URL = "https://amansuryavanshi-dev.vercel.app/";
// const nextConfig: NextConfig = {
//   images: {
//     domains: [SITE_URL, 'avatars.githubusercontent.com', 'cdn.sanity.io'],
//   },
// };

// export default nextConfig;
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
      }
    ],
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build due to React 19 migration
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

