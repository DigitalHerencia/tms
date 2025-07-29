// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for all components (React 19 best practice)
  reactStrictMode: true,

  // Allow specific origins for local development (File-System Access API, etc.)
  // Note: This is not a standard Next.js option—customize via headers() or middleware if needed.
  // Example using headers():
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Origin', value: 'chrome-extension://*' },
        ],
      },
    ];
  },

  // Server Components and Route Handler bundling: opt-out for Node-native packages
  serverExternalPackages: ['@babel/parser', '@babel/traverse'],

  // Advanced build performance toggles for Next.js 15+
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  // Lint/typecheck gating (CI should run lint/type-check separately!)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Images (no next/image optimization, use plain <img>)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
