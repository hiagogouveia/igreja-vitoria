import type { MetadataRoute } from 'next';
import { ministries } from '@/lib/site-data';

const BASE = 'https://www.igrejavitoriacg.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ['', '/quem-somos', '/ministerios', '/cav', '/cav-enderecos', '/aovivo', '/programacao', '/eventos', '/mensagens', '/contato', '/contribua', '/deep', '/ceus-abertos'];
  return [
    ...paginas.map((p) => ({ url: `${BASE}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...ministries.map((m) => ({ url: `${BASE}/ministerios/${m.id}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
