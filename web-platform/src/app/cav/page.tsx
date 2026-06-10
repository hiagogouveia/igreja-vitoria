export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import SiteShell from '@/components/site/SiteShell';
import RegisterModal from '@/components/site/RegisterModal';
import MapEmbed from '@/components/site/MapEmbed';
import { display, sectionTitle, wrap } from '@/lib/site-ui';

export const metadata: Metadata = { title: 'Casa de Vitória · Igreja Vitória', description: 'As Casas de Vitória — nossos grupos de comunhão durante a semana. Encontre uma perto de você.' };

const infoCards = [
  { icon: '◷', tint: 'beam', title: 'Dias de Encontro', text: 'Nossas casas se reúnem durante a semana — terças, quintas e sextas. Escolha o dia e o bairro mais perto de você.' },
  { icon: '♡', tint: 'glow', title: 'Comunhão', text: 'Mais que um grupo: uma família. Oração, palavra, comida e amizade que sustentam você o ano inteiro.' },
  { icon: '⌖', tint: 'glow', title: 'Perto de Você', text: 'Espalhadas por Campo Grande, há sempre uma casa pertinho da sua. Encontre a sua e seja bem-vindo.' },
];

async function getCavs() {
  try {
    return await prisma.cav.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  } catch {
    return [];
  }
}

export default async function CavPage() {
  const cavs = await getCavs();

  return (
    <SiteShell>
      <header style={{ position: 'relative', minHeight: '56vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 50px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/community-prayer.jpg" alt="Casa de Vitória" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', animation: 'kenburns 22s var(--ease) infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.8) 0%,rgba(5,5,5,.3) 45%,rgba(5,5,5,.96) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--beam)', background: 'rgba(91,141,239,.12)', border: '1px solid rgba(91,141,239,.28)', padding: '7px 14px', borderRadius: 99, marginBottom: 18, marginTop: 90 }}>Perto de você</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,7vw,90px)' }}>Casa de Vitória</h1>
        </div>
      </header>

      <section className="reveal" style={{ padding: '80px 28px' }}>
        <div data-grid3 style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {infoCards.map((c) => (
            <div key={c.title} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.tint === 'beam' ? 'rgba(91,141,239,.12)' : 'rgba(240,168,72,.12)', border: `1px solid ${c.tint === 'beam' ? 'rgba(91,141,239,.25)' : 'rgba(240,168,72,.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.tint === 'beam' ? 'var(--beam)' : 'var(--glow)', fontSize: 20, marginBottom: 18 }}>{c.icon}</div>
              <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>{c.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.6 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 80px' }}>
        <div style={wrap}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 26 }}>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(24px,3.4vw,38px)' }}>Casas abertas agora</h2>
            <Link href="/cav-enderecos" className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em', color: 'var(--glow)', textDecoration: 'none' }}>Ver no mapa →</Link>
          </div>

          {cavs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--faint)', border: '1px solid var(--border)', borderRadius: 16, background: 'var(--s1)' }}>
              <p style={{ fontSize: 16 }}>Nenhuma casa cadastrada no momento. Em breve, novidades!</p>
            </div>
          ) : (
            <div data-split style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {cavs.map((cav) => (
                <div key={cav.id} className="hov-beam" style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                    <h4 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 20 }}>{cav.name}</h4>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--beam)', whiteSpace: 'nowrap', background: 'rgba(91,141,239,.1)', border: '1px solid rgba(91,141,239,.25)', padding: '6px 12px', borderRadius: 99 }}>{cav.dayOfWeek} · {cav.time}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 8 }}>{cav.address}{cav.neighborhood ? ` · ${cav.neighborhood}` : ''}</p>
                  {cav.leaderName && <p style={{ fontSize: 13, color: 'var(--faint)', marginBottom: 18 }}>Líder: {cav.leaderName}</p>}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 4 }}>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cav.address} ${cav.city}`)}`} target="_blank" rel="noreferrer" className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em', color: 'var(--glow)', textDecoration: 'none' }}>Abrir no GPS →</a>
                    <RegisterModal kicker="Casa de Vitória" title={`Participar · ${cav.name}`} sub={`${cav.dayOfWeek} às ${cav.time} · ${cav.address}`} triggerClass="link-glow" triggerStyle={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em', color: 'var(--beam)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>Quero participar →</RegisterModal>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 80px' }}>
        <div style={{ ...wrap, border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', position: 'relative', minHeight: 320, background: 'var(--s2)' }}>
          <MapEmbed query="Campo+Grande+-+MS" title="Mapa Casas de Vitória" />
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 100px' }}>
        <div style={{ ...wrap, background: 'linear-gradient(135deg,var(--s1),var(--ink))', border: '1px solid var(--border)', borderRadius: 22, padding: '48px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 30, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(24px,3.2vw,36px)', marginBottom: 8 }}>Quer abrir sua casa?</h2>
            <p style={{ fontSize: 16, color: 'var(--dim)', maxWidth: 440 }}>Seja anfitrião de uma Casa de Vitória e veja sua sala virar um lugar de transformação.</p>
          </div>
          <RegisterModal kicker="Casa de Vitória" title="Quero ser anfitrião" sub="Abra sua casa para receber uma CAV. Nossa equipe entra em contato." triggerClass="btn-glow" triggerStyle={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15.5, padding: '16px 30px', borderRadius: 99, cursor: 'pointer', border: 'none' }}>Quero ser anfitrião →</RegisterModal>
        </div>
      </section>
    </SiteShell>
  );
}
