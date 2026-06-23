import { display, wrap } from '@/lib/site-ui';

/**
 * Highlighted full-fold teaser for the Vitória Conference 2026 (RESTORE).
 * The whole fold is a link to the static landing at /conference (plain <a> for a
 * full navigation, since /conference is served from public/, not an app route).
 */
export default function ConferenceFold() {
  return (
    <a href="/conference" aria-label="VitóriaCon 2026 — RESTORE" style={{ display: 'block', textDecoration: 'none', color: 'var(--text)' }}>
      <section className="reveal conf-fold" style={{ position: 'relative', minHeight: '86vh', display: 'flex', alignItems: 'center', overflow: 'hidden', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/worship-team.jpg" alt="VitóriaCon 2026 — RESTORE" loading="lazy" className="conf-kv" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(95deg,rgba(5,5,5,.95) 28%,rgba(5,5,5,.6) 62%,rgba(5,5,5,.35))' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 60% at 18% 50%, rgba(240,168,72,.18), transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 0, left: '24%', width: 2, height: '70%', transform: 'rotate(-18deg)', transformOrigin: 'top', background: 'linear-gradient(180deg,rgba(240,168,72,.45),transparent 75%)', animation: 'beamSweep 8s var(--ease) infinite' }} />

        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#050505', background: 'var(--glow)', padding: '7px 14px', borderRadius: 99, fontWeight: 700, marginBottom: 22 }}>
            Destaque · Conferência
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 18 }}>
            <span style={{ width: 26, height: 1, background: 'var(--glow)', opacity: .7 }} />26 a 30 de Agosto · 2026 · Campo Grande
          </div>
          <h2 style={{ fontFamily: "'Pirata One', serif", fontWeight: 400, fontSize: 'clamp(60px,12vw,170px)', lineHeight: .9, margin: 0, color: 'var(--glow-soft)', textShadow: '0 2px 60px rgba(240,168,72,.5)' }}>
            VitóriaCon
          </h2>
          <div style={{ ...display, fontSize: 'clamp(30px,5.5vw,74px)', lineHeight: 1, marginBottom: 16, color: 'var(--text)' }}>2026</div>
          <p style={{ fontFamily: 'var(--head)', fontWeight: 600, fontSize: 'clamp(18px,2.4vw,26px)', letterSpacing: '-.01em', color: 'var(--text)', marginBottom: 14 }}>
            Conferência Profética de Adoração e Mover Sobrenatural — Restore
          </p>
          <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: 'var(--dim)', maxWidth: 540, lineHeight: 1.55, marginBottom: 34 }}>
            Cinco dias de adoração, palavra e presença marcando os 6 anos da Igreja Vitória. Vem viver um tempo de restauração com a gente.
          </p>
          <span style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="conf-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16, padding: '16px 34px', borderRadius: 99 }}>Garanta seu lugar →</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--faint)' }}>Vitória Worship · 5 dias</span>
          </span>
        </div>
      </section>
    </a>
  );
}
