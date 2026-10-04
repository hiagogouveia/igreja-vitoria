'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Pop-up da home — agora convida para a Caravana Anastácio (ônibus para a
 * Conferência Mercosul, 10/10), no lugar do convite de testemunho.
 * Aparece na 1ª visita; após fechar OU clicar em "Ir na Caravana",
 * não reaparece por 24h (controle via localStorage). Glassmorphism, fade +
 * scale, ESC/scroll-lock/focus-trap.
 */
// chave nova: quem já fechou o pop-up do testemunho também vê o da caravana
const KEY = 'caravana-popup-until';
const AZUL = '#2F7BFF';
const DAY_MS = 24 * 60 * 60 * 1000;

export default function ConferencePopup() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLAnchorElement>(null);

  // 1ª visita / fora da janela de 24h → agenda exibição
  useEffect(() => {
    let until = 0;
    try { until = Number(localStorage.getItem(KEY)) || 0; } catch { /* ignore */ }
    if (Date.now() < until) return;
    const t = setTimeout(() => setMounted(true), 700);
    return () => clearTimeout(t);
  }, []);

  // entrada (fade + scale)
  useEffect(() => {
    if (!mounted) return;
    const r = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(r);
  }, [mounted]);

  const persist = () => { try { localStorage.setItem(KEY, String(Date.now() + DAY_MS)); } catch { /* ignore */ } };

  // scroll-lock + ESC + focus-trap enquanto montado
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => primaryRef.current?.focus(), 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { dismiss(); return; }
      if (e.key === 'Tab') {
        const el = dialogRef.current;
        if (!el) return;
        const f = el.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      clearTimeout(focusTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const dismiss = () => {
    persist();
    setOpen(false);
    setTimeout(() => setMounted(false), 300);
  };

  if (!mounted) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, background: 'rgba(5,5,5,.82)', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)',
        opacity: open ? 1 : 0, transition: 'opacity .3s ease',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vc-pop-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440, maxHeight: '92vh', overflowY: 'auto', overflowX: 'hidden',
          position: 'relative', padding: 'clamp(26px,5vw,34px)', paddingTop: 0, borderRadius: 22,
          background: 'rgba(16,16,18,.72)', border: '1px solid var(--border)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)', backdropFilter: 'blur(22px) saturate(140%)',
          boxShadow: '0 40px 90px -30px rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.06)',
          transform: open ? 'scale(1)' : 'scale(.95)', opacity: open ? 1 : 0,
          transition: 'transform .3s var(--ease), opacity .3s ease',
        }}
      >
        <button onClick={dismiss} aria-label="Fechar" style={{ position: 'absolute', zIndex: 3, top: 14, right: 16, fontSize: 24, lineHeight: 1, color: 'var(--text)', background: 'rgba(5,5,5,.45)', width: 34, height: 34, borderRadius: 99, border: 'none', cursor: 'pointer' }}>×</button>

        {/* Arte da Conferência Mercosul (a mesma da página da caravana). A foto é
            recortada numa curva; o "planeta" com borda de luz cobre esse corte. */}
        <div style={{
          position: 'relative', overflow: 'hidden', margin: '0 calc(clamp(26px,5vw,34px) * -1) 18px',
          padding: '22px 14px 0',
          background: 'radial-gradient(80% 70% at 50% 100%, rgba(47,123,255,.55), transparent 70%), linear-gradient(180deg,#0B2A6B,#081A33)',
        }}>
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/caravana/assets/preletores-640.webp"
              alt="Conferência Mercosul: Ap. Neila, Ap. Samuel, Pr. Geisson, Ap. Rayssa, Ap. Eberson Luiz e Pra. Jennefer Matos."
              width={640} height={482}
              style={{ position: 'relative', display: 'block', width: '100%', height: 'auto' }}
            />
            {/* mesmo círculo da página da caravana, em proporção à largura da arte */}
            <span aria-hidden="true" style={{
              position: 'absolute', left: '50%', top: '86.37%', width: '257.8%', aspectRatio: '1',
              transform: 'translateX(-50%)', borderRadius: '50%', background: '#101012',
              borderTop: '2px solid rgba(190,215,255,.95)',
              boxShadow: '0 -4px 22px rgba(80,150,255,.9), 0 -2px 60px rgba(47,123,255,.55)',
            }} />
          </div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: AZUL, marginBottom: 12 }}>Caravana · Conferência Mercosul</div>
        <h2 id="vc-pop-title" style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(21px,4.4vw,25px)', lineHeight: 1.15, letterSpacing: '-.01em', color: 'var(--text)', marginBottom: 12 }}>
          Vamos juntos de ônibus para Anastácio?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--dim)', marginBottom: 26 }}>
          Sábado, 10 de outubro. Saída às 14h30 da Igreja Vitória, com ida e volta.
          R$ 60,00 por poltrona. As vagas são limitadas: garanta a sua.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            ref={primaryRef}
            href="/caravana#reserva"
            onClick={persist}
            className="vc-pop-cta"
            // nowrap: a seta não pode cair sozinha para a linha de baixo
            style={{ flex: '1 1 180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap', background: AZUL, color: '#fff', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, padding: '14px 22px', borderRadius: 99, textDecoration: 'none' }}
          >
            Ir na Caravana <span aria-hidden="true">→</span>
          </a>
          <button
            onClick={dismiss}
            style={{ flex: '1 1 120px', whiteSpace: 'nowrap', background: 'transparent', border: '1px solid var(--border)', color: 'var(--dim)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 14.5, padding: '14px 22px', borderRadius: 99, cursor: 'pointer' }}
          >
            Talvez depois
          </button>
        </div>
      </div>
    </div>
  );
}
