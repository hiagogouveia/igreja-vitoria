import { wrap } from '@/lib/site-ui';

/**
 * Faixa de destaque do Deep, o curso de membresia da Igreja Vitória.
 * Traz a identidade própria do curso (gradiente azul, Archivo pesado) para
 * dentro do site escuro — mesmo recurso usado na dobra da conferência.
 * O bloco inteiro leva para a landing estática em /deep
 * (servida de public/deep, fora do router do Next — por isso <a>).
 */
const AZUL_CLARO = '#BFDDF0';
const AZUL_DEEP = '#0B3760';

export default function DeepFold() {
  return (
    <a
      href="/deep"
      aria-label="Deep · Curso de membresia da Igreja Vitória · Nova turma em 21 de setembro, 6 aulas, R$ 50"
      style={{ display: 'block', textDecoration: 'none', color: '#fff' }}
    >
      <section
        className="reveal deep-fold"
        style={{
          position: 'relative', overflow: 'hidden',
          borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)',
          padding: 'clamp(38px,6vw,72px) 0',
          backgroundImage:
            'radial-gradient(120% 80% at 82% 10%, rgba(191,221,240,.5), transparent 62%),' +
            'linear-gradient(165deg,#2E7FB8 0%,#12507F 48%,#0B3760 100%)',
        }}
      >
        <div style={{ ...wrap, padding: '0 28px', width: '100%' }}>
          {/* faixa superior: nova turma + inscrições abertas */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
            borderBottom: '1px solid rgba(255,255,255,.28)', paddingBottom: 14,
          }}>
            <span style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(11px,1.3vw,14px)', letterSpacing: '.2em', textTransform: 'uppercase' }}>
              Nova turma
            </span>
            <span style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(11px,1.3vw,14px)', letterSpacing: '.2em', textTransform: 'uppercase', color: AZUL_CLARO, marginLeft: 'auto' }}>
              Inscrições abertas
            </span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 'clamp(20px,3vw,48px)', alignItems: 'end', paddingTop: 'clamp(18px,3vw,32px)',
          }}>
            <div style={{ minWidth: 0 }}>
              <h2 style={{
                margin: 0, fontFamily: 'var(--head)', fontWeight: 900, fontStretch: '118%',
                fontSize: 'clamp(64px,12vw,168px)', lineHeight: .82, letterSpacing: '-.05em',
              }}>
                Deep
              </h2>
              <div style={{
                fontFamily: 'var(--head)', fontWeight: 900, fontStretch: '112%',
                fontSize: 'clamp(15px,2.4vw,30px)', letterSpacing: '-.01em', textTransform: 'uppercase',
                marginTop: 4,
              }}>
                Curso de membresia
              </div>

              <p style={{
                marginTop: 'clamp(14px,2vw,22px)', maxWidth: 460, fontSize: 'clamp(15px,1.7vw,18px)',
                lineHeight: 1.6, color: '#EAF3FA',
              }}>
                Já frequenta a igreja há um tempo ou participa de uma CAV, mas ainda não é membro?
                Chegou a sua hora. São 6 aulas, sempre às segundas.
              </p>
            </div>

            <div style={{ minWidth: 0, display: 'grid', gap: 18, justifyItems: 'start' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.62)' }}>
                  Início
                </span>
                <span style={{ fontFamily: 'var(--head)', fontWeight: 900, fontStretch: '118%', fontSize: 'clamp(40px,6vw,84px)', lineHeight: .85, letterSpacing: '-.03em' }}>
                  21.09
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                {['6 aulas', '6 segundas'].map((t) => (
                  <span key={t} style={{
                    border: '1px solid rgba(255,255,255,.28)', borderRadius: 999, padding: '8px 16px',
                    fontFamily: 'var(--head)', fontWeight: 800, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase',
                  }}>{t}</span>
                ))}
                {/* o valor é a dúvida nº 1 de quem vê o banner: contraste invertido para não passar batido */}
                <span style={{
                  background: '#fff', color: AZUL_DEEP, border: '1px solid #fff', borderRadius: 999, padding: '8px 16px',
                  fontFamily: 'var(--head)', fontWeight: 800, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase',
                }}>R$ 50</span>
              </div>

              <span className="deep-cta" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: AZUL_DEEP,
                fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(13px,1.5vw,15px)',
                letterSpacing: '.08em', textTransform: 'uppercase', padding: '15px 28px', borderRadius: 999,
              }}>
                Fazer minha inscrição <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </a>
  );
}
