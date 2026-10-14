import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import PixCopy from '@/components/site/PixCopy';
import { site } from '@/lib/site-data';
import { display, eyebrowLine, wrap } from '@/lib/site-ui';

export const metadata: Metadata = { title: 'Contribua · Igreja Vitória', description: 'Dízimos e ofertas para a Igreja Vitória pelo PIX.' };

export default function Contribua() {
  return (
    <SiteShell>
      <header style={{ position: 'relative', minHeight: '48vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 46px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/altar-prayer.webp" alt="Oração no altar da Igreja Vitória" fetchPriority="high" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 28%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.82) 0%,rgba(5,5,5,.4) 45%,rgba(5,5,5,.97) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ ...eyebrowLine, marginTop: 90 }}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Contribua</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,7vw,90px)' }}>Dízimos<br /><span className="luz">e ofertas.</span></h1>
        </div>
      </header>

      <section className="reveal" style={{ padding: '70px 28px 100px' }}>
        <div style={{ ...wrap, background: 'linear-gradient(135deg,var(--s1),var(--ink))', border: '1px solid var(--border)', borderRadius: 20, padding: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 30, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 10 }}>PIX · CNPJ (geral)</div>
            <div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 24, letterSpacing: '-.01em' }}>{site.pixCnpj}</div>
            <p style={{ fontSize: 15, color: 'var(--dim)', marginTop: 12, maxWidth: 420, lineHeight: 1.55 }}>“Cada um dê conforme determinou em seu coração, não com tristeza ou por obrigação, pois Deus ama quem dá com alegria.” 2 Coríntios 9:7</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: 220 }}>
              <PixCopy value={site.pixCnpj} display="Copiar CNPJ" />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
