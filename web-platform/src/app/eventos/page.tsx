export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import RegisterModal from '@/components/site/RegisterModal';
import { fallbackEvents } from '@/lib/site-data';
import { display, eyebrowLine, wrap } from '@/lib/site-ui';

export const metadata: Metadata = { title: 'Eventos · Igreja Vitória', description: 'Agenda de eventos e conferências da Igreja Vitória.' };

export default async function Eventos() {
  const events = fallbackEvents;

  return (
    <SiteShell>
      <section style={{ padding: '130px 28px 24px' }}>
        <div style={wrap}>
          <div style={eyebrowLine}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Agenda · Eventos &amp; Conferências</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,6.5vw,82px)', maxWidth: '14ch' }}>O que está<br />por vir.</h1>
        </div>
      </section>

      <section className="reveal" style={{ padding: '46px 28px 100px' }}>
        <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {events.map((e) => {
            const rowStyle = { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' } as const;
            const inner = (
              <>
                <div style={{ position: 'relative', minHeight: 200 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.photo} alt={e.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(5,5,5,.1),rgba(16,16,18,.6))' }} />
                  {e.featured && <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#050505', background: 'var(--glow)', padding: '6px 12px', borderRadius: 99, fontWeight: 600 }}>Destaque</div>}
                </div>
                <div style={{ padding: '30px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.06em', color: 'var(--glow)', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 13, background: 'var(--void)', padding: '6px 12px', borderRadius: 8 }}>{e.date}</span><span>{e.time} · {e.place}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(22px,2.6vw,30px)', letterSpacing: '-.02em', marginBottom: 10 }}>{e.title}</h3>
                  {e.desc && <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 20, maxWidth: 560 }}>{e.desc}</p>}
                  <div>
                    {e.href ? (
                      <span className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 99 }}>{e.cta ?? 'Saiba mais'} →</span>
                    ) : (
                      <RegisterModal kicker="Inscrição em evento" title={e.title} sub={`${e.date} · ${e.time} · ${e.place}`} triggerClass="btn-glow" triggerStyle={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 99, cursor: 'pointer', border: 'none' }}>Fazer inscrição →</RegisterModal>
                    )}
                  </div>
                </div>
              </>
            );
            return e.href ? (
              <a key={e.id} href={e.href} target={e.href.startsWith('http') ? '_blank' : undefined} rel={e.href.startsWith('http') ? 'noreferrer' : undefined} data-evrow className="hov-glow" style={{ ...rowStyle, textDecoration: 'none', color: 'var(--text)', cursor: 'pointer' }}>{inner}</a>
            ) : (
              <div key={e.id} data-evrow className="hov-glow" style={rowStyle}>{inner}</div>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
