import { Link } from 'react-router-dom';
import { site } from '../lib/data';
import useReveal from '../lib/useReveal';
import usePixCopy from '../lib/usePixCopy';
import { display, eyebrowLine, wrap } from '../lib/ui';

export default function Contribua() {
  useReveal();
  const { label, copy } = usePixCopy(site.pixCnpj);

  return (
    <div>
      <header style={{ position: 'relative', minHeight: '48vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 46px' }}>
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
            <div onClick={copy} className="hov-glow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--void)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text)' }}>pix@igrejavitoria.com.br</span>
              <span style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 12, color: 'var(--glow)' }}>{label}</span>
            </div>
          </div>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, padding: 34 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--beam)', marginBottom: 12 }}>Projetos Sociais</div>
            <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 23, letterSpacing: '-.01em', marginBottom: 10 }}>Ação que transforma</h3>
            <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 22 }}>Cestas básicas, apoio comunitário e misericórdia para famílias em situação de vulnerabilidade.</p>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 8 }}>Chave PIX</div>
            <div onClick={copy} className="hov-beam" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--void)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text)' }}>social@igrejavitoria.com.br</span>
              <span style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 12, color: 'var(--beam)' }}>Copiar</span>
            </div>
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
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={copy} className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 14.5, padding: '14px 24px', borderRadius: 99, cursor: 'pointer' }}>{label} CNPJ</button>
            <Link to="/contribua-pagamento" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 14.5, padding: '14px 26px', borderRadius: 99, textDecoration: 'none' }}>Cartão ou boleto →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
