// Central content for the public "Glow" site. Ministries are static (no admin
// CRUD for them); ids are stable for /ministerios/:id URLs. Events come from the
// DB (Prisma Event) — see app/eventos and the home teaser.

export const ministries = [
  { id: 'louvor', name: 'Louvor', tag: 'Adoração', leaders: 'Profeta Milena', photo: '/assets/worship-team.jpg', desc: 'O ministério de Louvor conduz a igreja à presença de Deus através da adoração. Cantores, músicos e técnicos servem com excelência para criar uma atmosfera onde o céu toca a terra.' },
  { id: 'welcome', name: 'Welcome', tag: 'Acolhimento', leaders: 'Evangelista Wagner', photo: '/assets/welcome-stage.jpg', desc: 'O time Welcome existe para que ninguém chegue e se sinta um estranho. Recebemos cada visitante com um sorriso, um café e a certeza de que aqui há lugar para ele.' },
  { id: 'recepcao', name: 'Recepção', tag: 'Hospitalidade', leaders: 'Pr Hiago e Pra Isabela', photo: '/assets/community-prayer.jpg', desc: 'A Recepção cuida da primeira impressão — orientando, acolhendo e conduzindo cada pessoa com cuidado desde a porta até o seu assento.' },
  { id: 'intercessao', name: 'Intercessão', tag: 'Oração', leaders: 'Pra Ivone', photo: '/assets/altar-prayer.jpg', desc: 'A Intercessão é a sala de máquinas da igreja. Antes, durante e depois dos cultos, esse time guerreia em oração por vidas, famílias e pela cidade.' },
  { id: 'kids', name: 'Vitória Kids', tag: 'Crianças', leaders: 'Profeta Leandro e Profeta Carol', photo: '/assets/worship-arms.jpg', desc: 'O Vitória Kids ensina as crianças a amarem a Jesus de forma criativa, segura e divertida — para que cresçam conhecendo o Deus que as ama.' },
  { id: 'midia', name: 'Mídia', tag: 'Comunicação', leaders: 'Pastor Leonardo e Pastora Linda', photo: '/assets/welcome-stage.jpg', desc: 'A Mídia leva a mensagem para além das paredes: transmissões ao vivo, fotografia, design e redes sociais que alcançam quem ainda não chegou.' },
  { id: 'operacionais', name: 'Operacionais', tag: 'Estrutura', leaders: 'Profeta Johnny e Profeta Hila', photo: '/assets/community-prayer.jpg', desc: 'Os Operacionais cuidam de tudo o que faz o culto acontecer — estrutura, organização e serviço para que cada encontro flua com excelência.' },
] as const;

export type Ministry = (typeof ministries)[number];

export const beliefs = [
  { n: '01', title: 'Adoração Vibrante', desc: 'Louvor intenso e uma atmosfera onde a presença de Deus é real e palpável.' },
  { n: '02', title: 'Palavra Transformadora', desc: 'Mensagens bíblicas práticas que tocam o coração e mudam histórias.' },
  { n: '03', title: 'Casa de Vitória', desc: 'Comunidade, discipulado e famílias caminhando juntas durante a semana.' },
  { n: '04', title: 'Ação Social', desc: 'Apoio comunitário, cestas básicas e misericórdia para quem precisa.' },
  { n: '05', title: 'Juventude Vitória', desc: 'Um movimento jovem, criativo e relevante que vive o evangelho com paixão.' },
];

export const testimonials = [
  { quote: 'Cheguei quebrado e encontrei uma família. Hoje sirvo no mesmo lugar onde fui restaurado.', name: 'João Silva', role: 'MEMBRO · 2 ANOS', initials: 'JS', av: 'linear-gradient(135deg,var(--glow),var(--glow-deep))' },
  { quote: 'A Casa de Vitória me ensinou o que é caminhar com Deus em comunidade. Não estou mais sozinha.', name: 'Maria Oliveira', role: 'LÍDER DE JOVENS', initials: 'MO', av: 'linear-gradient(135deg,var(--glow),var(--beam))' },
  { quote: 'Comecei a servir e descobri um propósito que nem sabia que tinha. Minha vida tem direção.', name: 'Pedro Santos', role: 'VOLUNTÁRIO', initials: 'PS', av: 'linear-gradient(135deg,var(--beam),var(--glow))' },
];

export const messages = [
  { id: 1, title: 'No Nome de Jesus Rendemos Glória', series: 'Adoração', speaker: 'Pr. Leonardo', duration: '48 min', date: '02 JUN', type: 'video', thumb: '/assets/worship-team.jpg' },
  { id: 2, title: 'Jesus Está Aqui', series: 'Presença', speaker: 'Pr. Leonardo', duration: '52 min', date: '26 MAI', type: 'video', thumb: '/assets/welcome-stage.jpg' },
  { id: 3, title: 'Uma Casa Sobre a Rocha', series: 'Família', speaker: 'Pra. Linda', duration: '44 min', date: '19 MAI', type: 'audio', thumb: '/assets/bible.jpg' },
  { id: 4, title: 'O Poder da Oração no Altar', series: 'Intercessão', speaker: 'Pra. Ivone', duration: '39 min', date: '12 MAI', type: 'video', thumb: '/assets/altar-prayer.jpg' },
  { id: 5, title: 'Vem Como Você Está', series: 'Família', speaker: 'Pr. Leonardo', duration: '46 min', date: '05 MAI', type: 'video', thumb: '/assets/community-prayer.jpg' },
  { id: 6, title: 'A Fé Que Vence o Mundo', series: 'Vitória', speaker: 'Ev. Wagner', duration: '41 min', date: '28 ABR', type: 'audio', thumb: '/assets/worship-arms.jpg' },
];

// Fallback events used only when the DB has no active events.
export const fallbackEvents = [
  { id: 'conf-vitoria', title: 'Conferência Vitória', date: '15 AGO', time: '19:00', place: 'Auditório Principal', featured: true, photo: '/assets/worship-team.jpg', desc: 'O maior encontro do ano. Três noites de adoração profunda, palavra restauradora e a presença de Deus enchendo a casa.' },
  { id: 'noite-adoracao', title: 'Noite de Adoração', date: '22 AGO', time: '20:00', place: 'Sede', featured: false, photo: '/assets/worship-arms.jpg', desc: 'Uma noite inteira dedicada a adorar. Sem pressa, sem agenda — só nós e a presença Dele.' },
  { id: 'acampamento-jovem', title: 'Acampamento Jovem', date: '10 SET', time: '18:00', place: 'Sítio Vitória', featured: false, photo: '/assets/community-prayer.jpg', desc: 'A juventude Vitória reunida para um fim de semana de fé, amizade e diversão que marca a vida.' },
];

export type SiteEvent = {
  id: string; title: string; date: string; time: string; place: string;
  featured: boolean; photo: string; desc: string;
};

const FALLBACK_PHOTOS = ['/assets/worship-team.jpg', '/assets/worship-arms.jpg', '/assets/community-prayer.jpg'];

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
  [3, 19, 30, 'Culto de Ensino'],
  [0, 18, 0, 'Culto da Família'],
];

export const site = {
  pixCnpj: '60.753.546/0001-45',
  whatsapp: '5567998318450',
  whatsappLabel: '(67) 99831-8450',
  email: 'contato@igrejavitoria.com.br',
  instagram: 'https://instagram.com/igrejavitoriacg',
  youtube: 'https://youtube.com/@igrejavitoriacampogrande',
  youtubeHandle: '@igrejavitoriacampogrande',
  address: 'R. Mal. Rondon, 163 · Amambai',
  city: 'Campo Grande — MS',
  cep: '79008-000',
  mapsQuery: 'R.+Mal.+Rondon,+163+-+Amambai,+Campo+Grande+-+MS',
};
