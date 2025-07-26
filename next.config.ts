import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Ensure ESLint errors fail the build
  },
};

export default nextConfig;
