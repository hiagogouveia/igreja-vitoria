'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Pop-up institucional da VitóriaCon 2026 — exibido apenas na home.
 * Aparece na 1ª visita; após fechar OU clicar em "Garantir minha vaga",
 * não reaparece por 24h (controle via localStorage). Glassmorphism, fade +
 * scale, ESC/scroll-lock/focus-trap. Reutilizável para futuras campanhas
 * (passe título/texto/cta via props se necessário).
 */
const KEY = 'vc26-popup-until';
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
          width: '100%', maxWidth: 440, position: 'relative', padding: 'clamp(26px,5vw,34px)', borderRadius: 22,
          background: 'rgba(16,16,18,.72)', border: '1px solid var(--border)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)', backdropFilter: 'blur(22px) saturate(140%)',
          boxShadow: '0 40px 90px -30px rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.06)',
          transform: open ? 'scale(1)' : 'scale(.95)', opacity: open ? 1 : 0,
          transition: 'transform .3s var(--ease), opacity .3s ease',
        }}
      >
        <button onClick={dismiss} aria-label="Fechar" style={{ position: 'absolute', top: 14, right: 16, fontSize: 24, lineHeight: 1, color: 'var(--faint)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 12 }}>Inscrições abertas</div>
        <h2 id="vc-pop-title" style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(21px,4.4vw,25px)', lineHeight: 1.15, letterSpacing: '-.01em', color: 'var(--text)', marginBottom: 12 }}>
          VitóriaCon 2026 já está com inscrições abertas!
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--dim)', marginBottom: 26 }}>
          Venha viver cinco dias de uma experiência transformadora com momentos de adoração, Palavra e comunhão. Garanta sua vaga e participe da VitóriaCon 2026.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            ref={primaryRef}
            href="/vitoriacon"
            onClick={persist}
            className="vc-pop-cta"
            style={{ flex: '1 1 180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, padding: '14px 22px', borderRadius: 99, textDecoration: 'none' }}
          >
            Garantir minha vaga →
          </a>
          <button
            onClick={dismiss}
            style={{ flex: '1 1 120px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--dim)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 14.5, padding: '14px 22px', borderRadius: 99, cursor: 'pointer' }}
          >
            Talvez depois
          </button>
        </div>
      </div>
    </div>
  );
}
