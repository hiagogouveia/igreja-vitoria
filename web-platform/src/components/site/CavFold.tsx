import Link from 'next/link';
import { wrap } from '@/lib/site-ui';

/**
 * Destaque das CAVs (Casas de Vitória), logo abaixo do topo da home.
 * Minimalista de propósito: foto, um título e um caminho só, o mapa.
 * Dias, horários e endereços ficam no mapa, que lê o cadastro do admin.
 */
export default function CavFold() {
  return (
    <section
      className="reveal cav-fold"
      style={{
        position: 'relative', overflow: 'hidden',
        borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)',
        padding: 'clamp(96px,12vw,170px) 28px',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/igreja-adorando.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '60% 62%' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(100deg,rgba(5,5,5,.94) 28%,rgba(5,5,5,.6) 64%,rgb(var(--glow-rgb) / .16))',
      }} />

      <div style={{ ...wrap, position: 'relative', width: '100%' }}>
        <h2 style={{
          margin: 0, fontFamily: 'var(--head)', fontWeight: 800,
          fontSize: 'clamp(40px,6vw,80px)', lineHeight: .98, letterSpacing: '-.035em',
        }}>
          Encontre<br />uma <span className="luz">CAV.</span>
        </h2>

        <p style={{ marginTop: 18, fontSize: 'clamp(17px,1.8vw,20px)', color: 'var(--dim)' }}>
          Um pequeno grupo perto de você.
        </p>

        <Link
          href="/cav-enderecos"
          className="btn-glow"
          style={{
            marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--text)', color: '#050505',
            fontFamily: 'var(--head)', fontWeight: 700, fontSize: 'clamp(14px,1.6vw,16px)',
            padding: '15px 28px', borderRadius: 99, textDecoration: 'none',
          }}
        >
          Ver no mapa <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
