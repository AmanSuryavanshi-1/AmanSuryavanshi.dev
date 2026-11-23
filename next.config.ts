import type { NextConfig } from "next";

const nextConfig: NextConfig & { eslint?: { ignoreDuringBuilds?: boolean } } = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
      },
      {
        protocol: 'https',
        hostname: 'amansuryavanshi.com',
      },
      {
        protocol: 'https',
        hostname: 'www.amansuryavanshi.com',
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
        destination: 'https://amansuryavanshi.com/:path*',
        permanent: true,
      },
      // Redirect legacy apex and www domain to canonical apex domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'amansuryavanshi.me' }],
        destination: 'https://amansuryavanshi.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.amansuryavanshi.me' }],
        destination: 'https://amansuryavanshi.com/:path*',
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
      // Fallback for truncated docs paths
      {
        source: '/docs/projects',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/projects',
        permanent: true,
      },
      // Canonicalize legacy 4-segment physical docs paths to clean 2-segment URLs
      {
        source: '/docs/projects/clientele/:project/:doc*',
        destination: '/docs/:project/:doc*',
        permanent: true,
      },
      {
        source: '/docs/projects/personal/:project/:doc*',
        destination: '/docs/:project/:doc*',
        permanent: true,
      },
      // Anonymized & alias redirects for creator intelligence platform & omnipost
      {
        source: '/docs/vivek-onpoint-platform/:doc*',
        destination: '/docs/creator-intelligence-platform/:doc*',
        permanent: true,
      },
      {
        source: '/docs/omnipost-core/:doc*',
        destination: '/docs/omnipost/:doc*',
        permanent: true,
      },
      {
        source: '/projects/omnipost/:slug*',
        destination: '/docs/omnipost/:slug*',
        permanent: true,
      },
      {
        source: '/docs/series/omnipost/:id',
        destination: '/docs/omnipost/:id',
        permanent: true,
      },
      // Historical 404 Route Normalization
      {
        source: '/projects/aviators-training-centre',
        destination: '/docs/aviators-training-centre/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/omnipost-core',
        destination: '/docs/omnipost/01-executive-summary',
        permanent: true,
      },
      {
        source: '/projects/dental-ai-automation',
        destination: '/docs/dental-ai-automation/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/n8n-github-backup',
        destination: '/docs/n8n-github-backup/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/barkat-enterprise',
        destination: '/docs/barkat-enterprise/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/av-newsstream',
        destination: '/docs/av-newsstream/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/foodah',
        destination: '/docs/foodah/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/vivek-onpoint-platform',
        destination: '/projects#creator-intelligence-platform',
        permanent: true,
      },
      {
        source: '/projects/notebooklm-py-pr276',
        destination: 'https://github.com/teng-lin/notebooklm-py/pull/276',
        permanent: false,
      },
      {
        source: '/projects/omni-post-ai-executive-summary',
        destination: '/docs/omnipost/01-executive-summary',
        permanent: true,
      },
      {
        source: '/projects/omni-post-ai-technical-documentation',
        destination: '/docs/omnipost/02-architecture-and-flow',
        permanent: true,
      },
      {
        source: '/docs/omnipost/02-technical-architecture',
        destination: '/docs/omnipost/02-architecture-and-flow',
        permanent: true,
      },
      // Redirect old Flat Documentation URLs
      {
        source: '/projects/aviators-training-centre-executive-summary',
        destination: '/docs/aviators-training-centre/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/aviators-training-centre-technical-documentation',
        destination: '/docs/aviators-training-centre/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/n8n-github-backup-executive-summary',
        destination: '/docs/n8n-github-backup/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/n8n-github-backup-technical-documentation',
        destination: '/docs/n8n-github-backup/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/dental-ai-executive-summary',
        destination: '/docs/dental-ai-automation/executive-summary',
        permanent: true,
      },
      {
        source: '/projects/dental-ai-technical-documentation',
        destination: '/docs/dental-ai-automation/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/barkat-enterprise-technical-documentation',
        destination: '/docs/barkat-enterprise/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/av-newsstream-technical-documentation',
        destination: '/docs/av-newsstream/technical-documentation',
        permanent: true,
      },
      {
        source: '/projects/foodah-technical-documentation',
        destination: '/docs/foodah/technical-documentation',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

