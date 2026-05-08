/** @type {import('next').NextConfig} */
const nextConfig = {
  // Faster dev builds
  experimental: {
    optimizePackageImports: ["@prisma/client"],
  },

  // Ignore ESLint errors during build (warnings only)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Force all pages to be dynamic — no DB calls at build time
  output: "standalone",

  // Tell webpack to ignore optional packages not installed
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "openai"];
    }
    return config;
  },

  // Allow images from any domain (for Unsplash demo images etc.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // Suppress specific warnings
  logging: {
    fetches: { fullUrl: false },
  },
  // v2
};

export default nextConfig;
