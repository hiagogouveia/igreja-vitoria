import Link from 'next/link';
import SiteShell from './SiteShell';
import RegisterModal from './RegisterModal';
import { ministries } from '@/lib/site-data';
import { btnPrimarySm, display, eyebrowLine, kicker, sectionTitle, wrap } from '@/lib/site-ui';

export default function MinistryDetail({ id }: { id?: string }) {
  const ministry = ministries.find((m) => m.id === id) ?? ministries[0];

  return (
    <SiteShell>
      <header style={{ position: 'relative', minHeight: '54vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 50px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ministry.photo} alt={ministry.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.82) 0%,rgba(5,5,5,.3) 45%,rgba(5,5,5,.96) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ ...eyebrowLine, paddingTop: 90 }}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Ministério · {ministry.tag}</div>
          <h1 style={{ ...display, fontSize: 'clamp(40px,7vw,96px)' }}>{ministry.name}</h1>
        </div>
      </header>

      <div style={{ position: 'sticky', top: 58, zIndex: 40, background: 'rgba(11,11,12,.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ ...wrap, padding: '14px 28px', display: 'flex', gap: 9, overflowX: 'auto' }}>
          {ministries.map((m) => {
            const active = m.id === ministry.id;
            return (
              <Link key={m.id} href={`/ministerios/${m.id}`} className="tab-pill" style={{ fontFamily: 'var(--head)', fontWeight: 600, fontSize: 13.5, padding: '9px 17px', borderRadius: 99, border: `1px solid ${active ? 'var(--glow)' : 'var(--border)'}`, background: active ? 'rgba(240,168,72,.12)' : 'var(--s1)', color: active ? 'var(--glow)' : 'var(--dim)', whiteSpace: 'nowrap', textDecoration: 'none' }}>{m.name}</Link>
            );
          })}
        </div>
      </div>

      <section className="reveal" style={{ padding: '70px 28px 90px' }}>
        <div data-split style={{ ...wrap, display: 'grid', gridTemplateColumns: '1.3fr .7fr', gap: 48, alignItems: 'start' }}>
          <div>
            <span style={kicker}>SOBRE O MINISTÉRIO</span>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(26px,3.6vw,40px)', lineHeight: 1.05, margin: '14px 0 18px' }}>Um lugar para servir<br />e crescer junto.</h2>
            <p style={{ fontSize: 18, color: 'var(--dim)', lineHeight: 1.65, marginBottom: 30 }}>{ministry.desc}</p>
            <RegisterModal kicker="Quero servir" title={`Servir no ${ministry.name}`} sub="Dê o próximo passo e faça parte do time. Entraremos em contato pelo WhatsApp." triggerClass="btn-glow" triggerStyle={{ ...btnPrimarySm, padding: '15px 30px' }}>Quero servir aqui →</RegisterModal>
          </div>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, padding: 30 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 18 }}>Liderança</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg,var(--glow),var(--glow-deep))', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16 }}>{ministry.leaders}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--faint)', letterSpacing: '.06em' }}>Líderes do ministério</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Encontros', 'Domingos e cultos'], ['Idade mínima', '16+ (varia)'], ['Pré-requisito', 'Coração disposto']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--faint)', fontFamily: 'var(--mono)', letterSpacing: '.04em' }}>{k}</span>
                  <span style={{ fontSize: 13.5, color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
