import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // Rota antiga da conferência → nova rota oficial (permanente: 308, equivalente a 301 p/ SEO)
      { source: '/conference', destination: '/vitoriacon', permanent: true },
      { source: '/conference/:path*', destination: '/vitoriacon/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
