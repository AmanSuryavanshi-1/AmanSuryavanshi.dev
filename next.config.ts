import type { NextConfig } from "next";

const nextConfig: NextConfig & { eslint?: { ignoreDuringBuilds?: boolean } } = {
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
  reactStrictMode: true,
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
      // Redirect singular /blog to plural /blogs (supporting Notion formula canonicals)
      {
        source: '/blog/:slug*',
        destination: '/blogs/:slug*',
        permanent: true,
      },
      // Redirect old /contact URL to homepage contact section
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      },
      // Redirect old OmniPost docs
      {
        source: '/docs/series/omnipost/:id',
        destination: '/docs/projects/personal/omnipost/:id',
        permanent: true,
      },
      // Redirect old Flat Documentation URLs
      {
        source: '/projects/aviators-training-centre-executive-summary',
        destination: '/docs/projects/clientele/aviators-training-centre/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/aviators-training-centre-technical-documentation',
        destination: '/docs/projects/clientele/aviators-training-centre/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/n8n-github-backup-executive-summary',
        destination: '/docs/projects/personal/n8n-github-backup/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/n8n-github-backup-technical-documentation',
        destination: '/docs/projects/personal/n8n-github-backup/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/dental-ai-executive-summary',
        destination: '/docs/projects/clientele/dental-ai-automation/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/dental-ai-technical-documentation',
        destination: '/docs/projects/clientele/dental-ai-automation/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/barkat-enterprise-technical-documentation',
        destination: '/docs/projects/clientele/barkat-enterprise/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/av-newsstream-technical-documentation',
        destination: '/docs/projects/personal/av-newsstream/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/foodah-technical-documentation',
        destination: '/docs/projects/personal/foodah/technical-documentation',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

