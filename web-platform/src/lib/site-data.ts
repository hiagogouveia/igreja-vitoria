// Conteúdo do site público. Os ministérios são fixos (sem cadastro no admin);
// os ids são estáveis para as URLs /ministerios/:id. As mensagens vêm do canal
// do YouTube (src/lib/youtube.ts), não deste arquivo.

export const ministries = [
  { id: 'louvor', name: 'Louvor', tag: 'Adoração', leaders: 'Profeta Milena', photo: '/assets/hero-vitoria.webp', desc: 'Cantores, músicos e técnicos que conduzem a igreja na adoração em cada culto.' },
  { id: 'welcome', name: 'Welcome', tag: 'Acolhimento', leaders: 'Evangelista Wagner', photo: '/assets/welcome-stage.webp', desc: 'O time que recebe quem chega pela primeira vez, para ninguém se sentir um estranho.' },
  { id: 'recepcao', name: 'Recepção', tag: 'Hospitalidade', leaders: 'Pr Hiago e Pra Isabela', photo: '/assets/community-prayer.webp', desc: 'Orienta e acolhe cada pessoa da porta até o lugar no culto.' },
  { id: 'intercessao', name: 'Intercessão', tag: 'Oração', leaders: 'Pra Ivone', photo: '/assets/altar-prayer.webp', desc: 'Ora antes, durante e depois dos cultos pelas pessoas, pelas famílias e pela cidade.' },
  { id: 'kids', name: 'Vitória Kids', tag: 'Crianças', leaders: 'Profeta Leandro e Profeta Carol', photo: '/assets/worship-arms.webp', desc: 'Ensina as crianças a conhecer e amar Jesus, num ambiente seguro e alegre.' },
  { id: 'midia', name: 'Mídia', tag: 'Comunicação', leaders: 'Pastor Leonardo e Pastora Linda', photo: '/assets/welcome-stage.webp', desc: 'Transmissões ao vivo, fotografia, design e redes sociais da igreja.' },
  { id: 'operacionais', name: 'Operacionais', tag: 'Estrutura', leaders: 'Profeta Johnny e Profeta Hila', photo: '/assets/community-prayer.webp', desc: 'Cuida da estrutura e da organização para o culto acontecer.' },
] as const;

export type Ministry = (typeof ministries)[number];

export const beliefs = [
  { n: '01', title: 'Adoração', desc: 'O louvor está no centro dos nossos cultos.' },
  { n: '02', title: 'Palavra', desc: 'A Bíblia ensinada de um jeito que dá para viver.' },
  { n: '03', title: 'Casa de Vitória', desc: 'Durante a semana, a igreja se encontra nas casas.' },
  { n: '04', title: 'Ação social', desc: 'Servir a cidade e cuidar de quem precisa.' },
  { n: '05', title: 'Juventude', desc: 'Uma geração que vive o evangelho de verdade.' },
];

// Eventos em destaque na home e na agenda (curados).
export const fallbackEvents: SiteEvent[] = [
  { id: 'ceus-abertos-2026', title: 'Conferência Céus Abertos', date: 'JÁ ACONTECEU', time: 'Conferência', place: 'Igreja Vitória', featured: true, badge: 'Testemunhos', photo: '/assets/worship-team.webp', desc: 'O que Deus fez na sua vida nesses dias? Conte para a igreja.', href: '/ceus-abertos#testemunhos', cta: 'Contar meu testemunho' },
  { id: 'deep-membresia', title: 'Deep · Curso de Membresia', date: 'PRÓXIMA TURMA', time: 'Curso de membresia', place: 'Igreja Vitória', featured: true, badge: 'Lista da próxima turma', photo: '/assets/altar-prayer.webp', art: { bg: 'radial-gradient(120% 80% at 78% 8%, rgba(191,221,240,.55), transparent 62%), linear-gradient(165deg,#2E7FB8 0%,#12507F 48%,#0B3760 100%)', fg: '#FFFFFF', label: 'Deep', sub: 'Curso de membresia' }, desc: 'A turma atual já começou. Entre na lista e avisamos quando a próxima abrir.', href: '/deep', cta: 'Entrar na lista' },
];

/**
 * Identidade gráfica própria de um evento (Sister, Deep). Quando presente, o card
 * usa esse bloco no lugar da foto: é mais fiel à arte oficial do que uma foto
 * genérica de culto, e evita inventar uma imagem que o evento não tem.
 */
export type SiteEventArt = { bg: string; fg: string; label: string; sub?: string; serif?: boolean };

export type SiteEvent = {
  id: string; title: string; date: string; time: string; place: string;
  featured: boolean; photo: string; desc: string; href?: string; cta?: string;
  /** Texto da etiqueta no canto do card. Sem isso, um evento em destaque mostra "Destaque". */
  badge?: string;
  /** A partir deste instante (ISO com fuso) o evento some da home e da agenda. */
  ate?: string;
  art?: SiteEventArt;
};

/** Eventos curados que ainda estão no ar (os que têm `ate` somem sozinhos depois da data). */
export function eventosAtuais(agora: Date = new Date()): SiteEvent[] {
  return fallbackEvents.filter((e) => !e.ate || agora.getTime() < new Date(e.ate).getTime());
}

const FALLBACK_PHOTOS = ['/assets/worship-team.webp', '/assets/worship-arms.webp', '/assets/community-prayer.webp'];

/** Map a Prisma Event row to the design's event shape. */
export function mapDbEvent(e: {
  id: string; title: string; description: string | null; startDate: Date | string;
  location: string | null; imageUrl: string | null;
}, index: number): SiteEvent {
  const d = new Date(e.startDate);
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase();
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return {
    id: e.id,
    title: e.title,
    date,
    time,
    place: e.location || 'Igreja Vitória',
    featured: index === 0,
    photo: e.imageUrl || FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length],
    desc: e.description || '',
  };
}

// Weekly services: [weekday (0=Sun), hour, minute, label]
export const services: [number, number, number, string][] = [
  [3, 19, 30, 'Quarta Flow'],
  [0, 18, 0, 'Culto da Família'],
];

export const site = {
  pixCnpj: '60.753.546/0001-45',
  whatsapp: '5567998318450',
  whatsappLabel: '(67) 99831-8450',
  email: 'contato@igrejavitoria.com.br',
  instagram: 'https://instagram.com/igrejavitoriacg',
  youtube: 'https://youtube.com/@igrejavitoriacampogrande',
  // canal "Igreja Vitória em Campo Grande" (o @ acima aponta para ele)
  youtubeChannelId: 'UCczJ5h3nD-8Aw2xDiqgP_sQ',
  youtubeHandle: '@igrejavitoriacampogrande',
  address: 'R. Mal. Rondon, 163 · Amambai',
  city: 'Campo Grande, MS',
  cep: '79008-000',
  mapsQuery: 'R.+Mal.+Rondon,+163+-+Amambai,+Campo+Grande+-+MS',
};
