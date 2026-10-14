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
      // A Caravana Anastácio (Conferência Mercosul, 10/10/2026) já passou: quem
      // tiver o link antigo cai na home.
      { source: '/caravana', destination: '/', permanent: false },
      { source: '/caravana/:path*', destination: '/', permanent: false },
      // Página de pagamento de demonstração removida (não cobrava nada de verdade):
      // a contribuição é pelo PIX, em /contribua.
      { source: '/contribua-pagamento', destination: '/contribua', permanent: true },
      // A página de ministérios saiu; quem lidera cada um aparece em Quem Somos.
      { source: '/ministerios', destination: '/quem-somos', permanent: true },
      { source: '/ministerios/:path*', destination: '/quem-somos', permanent: true },
    ];
  },
};

export default nextConfig;
