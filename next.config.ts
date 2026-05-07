import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.152'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zovtgxhczyrwbwsaaxhn.supabase.co",
      },
    ],
  },
};

export default nextConfig;
