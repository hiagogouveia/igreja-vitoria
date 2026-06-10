import type { Metadata } from 'next';
import Link from 'next/link';
import SiteShell from '@/components/site/SiteShell';
import PixCopy from '@/components/site/PixCopy';
import { site } from '@/lib/site-data';
import { display, eyebrowLine, wrap } from '@/lib/site-ui';

export const metadata: Metadata = { title: 'Contribua · Igreja Vitória', description: 'Dízimos, ofertas e projetos sociais. Faça parte da missão da Igreja Vitória.' };

export default function Contribua() {
  return (
    <SiteShell>
      <header style={{ position: 'relative', minHeight: '48vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 46px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/altar-prayer.jpg" alt="Generosidade" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 28%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.82) 0%,rgba(5,5,5,.4) 45%,rgba(5,5,5,.97) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ ...eyebrowLine, marginTop: 90 }}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Generosidade</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,7vw,90px)' }}>Faça parte<br />da missão.</h1>
        </div>
      </header>

      <section className="reveal" style={{ padding: '70px 28px 40px' }}>
        <div data-split style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, padding: 34 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 12 }}>Dízimos &amp; Ofertas</div>
            <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 23, letterSpacing: '-.01em', marginBottom: 10 }}>Sustente a casa</h3>
            <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 22 }}>Seu dízimo e oferta mantêm os cultos, ministérios e a missão da igreja vivos e em movimento.</p>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 8 }}>Chave PIX</div>
            <PixCopy value="pix@igrejavitoria.com.br" />
          </div>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, padding: 34 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--beam)', marginBottom: 12 }}>Projetos Sociais</div>
            <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 23, letterSpacing: '-.01em', marginBottom: 10 }}>Ação que transforma</h3>
            <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 22 }}>Cestas básicas, apoio comunitário e misericórdia para famílias em situação de vulnerabilidade.</p>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 8 }}>Chave PIX</div>
            <PixCopy value="social@igrejavitoria.com.br" tint="var(--beam)" hoverClass="hov-beam" />
          </div>
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 100px' }}>
        <div style={{ ...wrap, background: 'linear-gradient(135deg,var(--s1),var(--ink))', border: '1px solid var(--border)', borderRadius: 20, padding: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 30, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 10 }}>PIX · CNPJ (geral)</div>
            <div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 24, letterSpacing: '-.01em' }}>{site.pixCnpj}</div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--faint)', marginTop: 10, letterSpacing: '.04em' }}>Transparência total · prestação de contas trimestral</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: 220 }}>
              <PixCopy value={site.pixCnpj} display="Copiar CNPJ" />
            </div>
            <Link href="/contribua-pagamento" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 14.5, padding: '14px 26px', borderRadius: 99, textDecoration: 'none' }}>Cartão ou boleto →</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
