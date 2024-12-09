import type { NextConfig } from "next";
const SITE_URL = "https://amansuryavanshi-dev.vercel.app/";
const nextConfig: NextConfig = {
  images: {
    domains: [SITE_URL, 'avatars.githubusercontent.com', 'cdn.sanity.io'],
  },
};

export default nextConfig;
