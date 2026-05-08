/** @type {import('next').NextConfig} */
const nextConfig = {
  // Faster dev builds
  experimental: {
    optimizePackageImports: ["@prisma/client"],
  },

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
};

export default nextConfig;
