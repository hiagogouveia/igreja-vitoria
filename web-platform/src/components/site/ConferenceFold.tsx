import { display, wrap } from '@/lib/site-ui';

/**
 * Highlighted full-fold teaser for the Vitória Conference 2026 (RESTORE).
 * Identidade clara / liquid glass (espelha a landing /conference): foto de fundo
 * mantida, lavagem clara por cima e o conteúdo num card de vidro fosco.
 * O bloco inteiro é um link para a landing estática em /conference.
 */
export default function ConferenceFold() {
  return (
    <a href="/conference" aria-label="VitóriaCon 2026 — RESTORE" style={{ display: 'block', textDecoration: 'none', color: 'var(--ink)' }}>
      <section className="reveal conf-fold" style={{ position: 'relative', minHeight: '86vh', display: 'flex', alignItems: 'center', overflow: 'hidden', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/worship-team.jpg" alt="VitóriaCon 2026 — RESTORE" loading="lazy" className="conf-kv" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        {/* Lavagem clara — identidade branca / liquid glass */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(238,240,241,.94) 0%, rgba(238,240,241,.8) 42%, rgba(238,240,241,.5) 70%, rgba(238,240,241,.3) 100%)' }} />
        {/* Brilho dourado sutil */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 16% 45%, rgba(240,168,72,.16), transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 0, left: '32%', width: 2, height: '70%', transform: 'rotate(-18deg)', transformOrigin: 'top', background: 'linear-gradient(180deg,rgba(240,168,72,.35),transparent 75%)', animation: 'beamSweep 8s var(--ease) infinite' }} />

        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          {/* Card de vidro líquido */}
          <div style={{
            maxWidth: 660, padding: 'clamp(28px,4vw,52px)', borderRadius: 32,
            background: 'rgba(255,255,255,.55)',
            WebkitBackdropFilter: 'blur(26px) saturate(170%)', backdropFilter: 'blur(26px) saturate(170%)',
            border: '1px solid rgba(255,255,255,.75)',
            boxShadow: '0 26px 70px -28px rgba(26,30,38,.5), inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 1px rgba(255,255,255,.3)',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#050505', background: 'var(--glow)', padding: '7px 14px', borderRadius: 99, fontWeight: 700, marginBottom: 20 }}>
              Destaque · Conferência
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--glow-deep)', marginBottom: 14 }}>
              <span style={{ width: 26, height: 1, background: 'var(--glow-deep)', opacity: .7 }} />26 a 30 de Agosto · 2026 · Campo Grande
            </div>
            <h2 style={{ fontFamily: "'Pirata One', serif", fontWeight: 400, fontSize: 'clamp(54px,10vw,150px)', lineHeight: .9, margin: 0, color: 'var(--glow-deep)', textShadow: '0 1px 1px rgba(255,255,255,.6)' }}>
              VitóriaCon
            </h2>
            <div style={{ ...display, fontSize: 'clamp(28px,5vw,68px)', lineHeight: 1, marginBottom: 16, color: 'var(--ink)' }}>2026</div>
            <p style={{ fontFamily: 'var(--head)', fontWeight: 600, fontSize: 'clamp(17px,2.2vw,24px)', letterSpacing: '-.01em', color: 'var(--ink)', marginBottom: 12 }}>
              Conferência Profética de Adoração e Mover Sobrenatural — Restore
            </p>
            <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: '#3A3E42', maxWidth: 520, lineHeight: 1.55, marginBottom: 30 }}>
              Cinco dias de adoração, palavra e presença marcando os 6 anos da Igreja Vitória. Vem viver um tempo de restauração com a gente.
            </p>
            <span style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="conf-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16, padding: '16px 34px', borderRadius: 99 }}>Garanta seu lugar →</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B7075' }}>Vitória Worship · 5 dias</span>
            </span>
          </div>
        </div>
      </section>
    </a>
  );
}
