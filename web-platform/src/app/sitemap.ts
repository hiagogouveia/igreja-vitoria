import type { MetadataRoute } from 'next';

const BASE = 'https://www.igrejavitoriacg.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ['', '/quem-somos', '/cav', '/cav-enderecos', '/aovivo', '/programacao', '/eventos', '/mensagens', '/contato', '/contribua', '/deep', '/ceus-abertos'];
  return [
    ...paginas.map((p) => ({ url: `${BASE}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
  ];
}
