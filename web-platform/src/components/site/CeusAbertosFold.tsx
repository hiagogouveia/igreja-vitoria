import { wrap } from '@/lib/site-ui';

/**
 * Dobra de destaque da Conferência Céus Abertos 2026.
 * Traz a identidade própria da conferência (papel off-white, Archivo pesado,
 * laranja de destaque) para dentro do site escuro — mesmo recurso que a dobra
 * anterior usava para espelhar a landing do evento.
 * O bloco inteiro leva para a landing estática em /ceus-abertos
 * (servida de public/ceus-abertos, fora do router do Next — por isso <a>).
 */
const PAPER = '#F0F0EE';
const INK = '#0B0B0B';
const ORANGE = '#F26522';

export default function CeusAbertosFold() {
  return (
    <a
      href="/ceus-abertos"
      aria-label="Conferência Céus Abertos · conte seu testemunho"
      style={{ display: 'block', textDecoration: 'none', color: INK }}
    >
      <section
        className="reveal ca-fold"
        style={{
          position: 'relative', background: PAPER, overflow: 'hidden',
          borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)',
          padding: 'clamp(38px,6vw,74px) 0',
        }}
      >
        <div style={{ ...wrap, padding: '0 28px', width: '100%' }}>
          {/* a conferência passou: sem datas e sem "entrada gratuita" */}
          <div style={{ borderBottom: '1px solid rgba(11,11,11,.18)' }} />

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            gap: 'clamp(16px,3vw,40px)', alignItems: 'end', paddingTop: 'clamp(20px,3.4vw,38px)',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(8px,1.6vw,20px)', flexWrap: 'wrap' }}>
                <h2 style={{
                  margin: 0, fontFamily: 'var(--head)', fontWeight: 900, fontStretch: '120%',
                  fontSize: 'clamp(46px,7vw,124px)', lineHeight: .82, letterSpacing: '-.035em',
                  textTransform: 'uppercase', color: INK,
                }}>
                  Céus<br />Abertos
                </h2>
                <span style={{
                  fontFamily: 'var(--head)', fontWeight: 800, fontStretch: '112%',
                  fontSize: 'clamp(14px,2.2vw,32px)', letterSpacing: '-.01em', textTransform: 'uppercase',
                  alignSelf: 'flex-start', paddingTop: 'clamp(5px,1.2vw,14px)', color: INK,
                }}>
                  Conferência
                </span>
              </div>

              <div style={{
                marginTop: 'clamp(8px,1.4vw,16px)', fontFamily: 'var(--head)', fontWeight: 900,
                fontStretch: '118%', fontSize: 'clamp(18px,3vw,40px)', letterSpacing: '.01em',
                textTransform: 'uppercase', color: ORANGE,
              }}>
                Campo Grande
              </div>

              <div style={{ marginTop: 'clamp(20px,3vw,32px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
                <span className="ca-cta" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, background: INK, color: '#fff',
                  fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(13px,1.5vw,16px)',
                  letterSpacing: '.1em', textTransform: 'uppercase', padding: '16px 30px',
                }}>
                  Conte seu testemunho <span aria-hidden="true" style={{ fontSize: 17, lineHeight: 1 }}>→</span>
                </span>
                <span style={{
                  fontFamily: 'var(--head)', fontWeight: 700, fontSize: 12, letterSpacing: '.16em',
                  textTransform: 'uppercase', color: '#5A5852',
                }}>
                  O que Deus fez em você?
                </span>
              </div>

              <div style={{
                marginTop: 'clamp(18px,2.6vw,30px)', borderTop: '1px solid rgba(11,11,11,.18)', paddingTop: 12,
                fontFamily: 'var(--head)', fontWeight: 800, fontSize: 11, letterSpacing: '.22em',
                textTransform: 'uppercase', color: ORANGE,
              }}>
                Welcome to the victory
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <picture>
                <source srcSet="/ceus-abertos/assets/palestrantes.webp" type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ceus-abertos/assets/palestrantes.png"
                  alt="Preletores da Conferência Céus Abertos 2026"
                  loading="lazy"
                  width={900}
                  height={600}
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </picture>
            </div>
          </div>
        </div>
      </section>
    </a>
  );
}
