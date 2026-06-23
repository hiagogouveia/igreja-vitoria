'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Quem Somos', to: '/quem-somos' },
  { label: 'Ministérios', to: '/ministerios' },
  { label: 'Casa de Vitória', to: '/cav' },
  { label: 'Ao Vivo', to: '/aovivo' },
  { label: 'Eventos', to: '/eventos' },
  { label: 'Mensagens', to: '/mensagens' },
  { label: 'Contato', to: '/contato' },
];

const logoImg: CSSProperties = { width: 24, height: 'auto', filter: 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(240,168,72,.4))' };

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const go = (to: string) => { setOpen(false); router.push(to); };

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 28px', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'linear-gradient(180deg,rgba(5,5,5,.9),rgba(5,5,5,.45))', borderBottom: '1px solid var(--border-soft)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', textDecoration: 'none', color: 'var(--text)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-white.png" alt="Igreja Vitória" style={logoImg} />
          <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase' }}>Vitória</span>
        </Link>

        <div data-desknav style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} href={item.to} className="nav-pill" style={{ fontSize: 13, color: 'var(--dim)', padding: '9px 13px', borderRadius: 99, cursor: 'pointer', fontWeight: 500, fontFamily: 'var(--head)', textDecoration: 'none' }}>{item.label}</Link>
          ))}
          <Link href="/contribua" className="btn-glow" style={{ marginLeft: 8, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 13.5, padding: '10px 20px', borderRadius: 99, cursor: 'pointer', textDecoration: 'none' }}>Contribua</Link>
        </div>

        <div data-mobnav onClick={() => setOpen(true)} role="button" aria-label="Abrir menu" style={{ display: 'none', flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 8 }}>
          <span style={{ width: 24, height: 2, background: 'var(--text)', borderRadius: 2 }} />
          <span style={{ width: 24, height: 2, background: 'var(--text)', borderRadius: 2 }} />
          <span style={{ width: 16, height: 2, background: 'var(--glow)', borderRadius: 2 }} />
        </div>
      </nav>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(5,5,5,.97)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', padding: '24px 28px', animation: 'rise .4s var(--ease)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-white.png" alt="Igreja Vitória" style={logoImg} />
              <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase' }}>Vitória</span>
            </div>
            <span onClick={() => setOpen(false)} aria-label="Fechar menu" style={{ fontSize: 30, color: 'var(--dim)', cursor: 'pointer', lineHeight: 1 }}>×</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV_ITEMS.map((item, i) => (
              <span key={item.to} onClick={() => go(item.to)} style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 30, textTransform: 'uppercase', letterSpacing: '-.01em', color: 'var(--text)', padding: '10px 0', cursor: 'pointer', borderBottom: '1px solid var(--border-soft)', animation: `rise .5s var(--ease) ${0.04 * i + 0.05}s both` }}>{item.label}</span>
            ))}
          </div>
          <span onClick={() => go('/contribua')} style={{ marginTop: 32, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 17, padding: 16, borderRadius: 99, cursor: 'pointer', textAlign: 'center' }}>Contribua →</span>
          <div style={{ marginTop: 'auto', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', color: 'var(--faint)', textTransform: 'uppercase' }}>Domingo 18h · Quarta 19h30 · Campo Grande — MS</div>
        </div>
      )}
    </>
  );
}
