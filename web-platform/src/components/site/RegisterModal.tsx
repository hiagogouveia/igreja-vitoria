'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

const field: CSSProperties = { background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 11, padding: '13px 15px', color: 'var(--text)', fontFamily: 'var(--body)', fontSize: 15, outline: 'none', width: '100%' };
const label: CSSProperties = { fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--faint)' };

/**
 * A trigger element that opens a self-contained registration modal (form +
 * success state). Encapsulates all interactivity so server pages can drop it in.
 */
export default function RegisterModal({
  kicker,
  title,
  sub,
  children,
  triggerStyle,
  triggerClass,
}: {
  kicker: string;
  title: string;
  sub: string;
  children: ReactNode;
  triggerStyle?: CSSProperties;
  triggerClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const close = () => { setOpen(false); setDone(false); };

  return (
    <>
      <button type="button" className={triggerClass} style={triggerStyle} onClick={() => { setDone(false); setOpen(true); }}>
        {children}
      </button>

      {open && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(5,5,5,.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'rise .3s var(--ease)' }}
        >
          <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" style={{ width: '100%', maxWidth: 460, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 20, padding: 34, position: 'relative' }}>
            <span onClick={close} aria-label="Fechar" style={{ position: 'absolute', top: 18, right: 20, fontSize: 26, color: 'var(--faint)', cursor: 'pointer', lineHeight: 1 }}>×</span>

            {done ? (
              <div style={{ textAlign: 'center', padding: '14px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(240,168,72,.14)', border: '1px solid rgba(240,168,72,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, color: 'var(--glow)' }}>✓</div>
                <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 24, marginBottom: 10 }}>Inscrição confirmada!</h3>
                <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.55, marginBottom: 24 }}>Enviamos os detalhes para o seu WhatsApp. Mal podemos esperar para te ver, {title}!</p>
                <span onClick={close} style={{ display: 'inline-block', background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 99, cursor: 'pointer' }}>Fechar</span>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 8 }}>{kicker}</div>
                <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 23, letterSpacing: '-.01em', marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--dim)', marginBottom: 24 }}>{sub}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <label style={label}>Nome completo</label>
                    <input className="field" type="text" required placeholder="Como podemos te chamar?" style={field} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <label style={label}>WhatsApp</label>
                    <input className="field" type="text" required placeholder="(67) 9 0000-0000" style={field} />
                  </div>
                  <button type="submit" className="btn-glow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 11, cursor: 'pointer', marginTop: 6, border: 'none' }}>Confirmar inscrição →</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
