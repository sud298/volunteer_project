import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore ESLint errors during the build process
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: Enable TypeScript type checking during the build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add redirects configuration
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // Set to true if this is a permanent redirect
      },
    ];
  },
};

export default nextConfig;