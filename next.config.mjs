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

  // Tell webpack to ignore optional packages not installed
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "openai"];
    }
    // Ensure Prisma binaries are included in the bundle
    config.externals.push({
      "@prisma/client": "commonjs @prisma/client",
    });
    return config;
  },

  // Output configuration for Vercel deployments
  output: "standalone",

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
