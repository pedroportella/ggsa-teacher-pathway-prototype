import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@ggsa/services',
    '@ggsa/ui-assets',
    '@ggsa/ui-library',
    '@ggsa/ui-tokens',
    '@ggsa/utils',
  ],
};

export default nextConfig;
