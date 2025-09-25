import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    // Disable server-side features for static export
    experimental: {
      esmExternals: false
    }
  })
};

export default nextConfig;
