import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts') 

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.152'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zovtgxhczyrwbwsaaxhn.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig)