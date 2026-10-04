import { wrap } from '@/lib/site-ui';

/**
 * Faixa de destaque da Caravana Anastácio (Conferência Mercosul, 10 de outubro).
 * Segue o mesmo padrão das outras dobras de evento, com a identidade da arte
 * oficial da caravana (azul profundo e azul vibrante). Fica no topo da home
 * porque é o evento mais próximo da igreja agora.
 * O bloco inteiro leva para a landing estática em /caravana
 * (servida de public/caravana, fora do router do Next — por isso <a>).
 */
const AZUL_CLARO = '#9FC4FF';
const AZUL_FUNDO = '#081A33';

export default function CaravanaFold() {
  return (
    <a
      href="/caravana"
      aria-label="Caravana Anastácio para a Conferência Mercosul · 10 de outubro · garantir vaga"
      style={{ display: 'block', textDecoration: 'none', color: '#fff' }}
    >
      <section
        className="reveal caravana-fold"
        style={{
          position: 'relative', overflow: 'hidden',
          borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)',
          padding: 'clamp(38px,6vw,72px) 0',
          backgroundImage:
            'radial-gradient(120% 80% at 80% 6%, rgba(159,196,255,.42), transparent 62%),' +
            'linear-gradient(165deg,#2F7BFF 0%,#1456C7 46%,#081A33 100%)',
        }}
      >
        <div style={{ ...wrap, padding: '0 28px', width: '100%' }}>
          {/* faixa superior: o evento e o aviso de vagas */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
            borderBottom: '1px solid rgba(255,255,255,.28)', paddingBottom: 14,
          }}>
            <span style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(11px,1.3vw,14px)', letterSpacing: '.2em', textTransform: 'uppercase' }}>
              Conferência Mercosul
            </span>
            <span style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(11px,1.3vw,14px)', letterSpacing: '.2em', textTransform: 'uppercase', color: AZUL_CLARO, marginLeft: 'auto' }}>
              Vagas limitadas
            </span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 'clamp(20px,3vw,48px)', alignItems: 'end', paddingTop: 'clamp(18px,3vw,32px)',
          }}>
            <div style={{ minWidth: 0 }}>
              <h2 style={{
                margin: 0, fontFamily: 'var(--head)', fontWeight: 900, fontStretch: '118%',
                fontSize: 'clamp(46px,9vw,124px)', lineHeight: .84, letterSpacing: '-.045em',
                textTransform: 'uppercase',
              }}>
                Caravana<br /><span style={{ color: AZUL_CLARO }}>Anastácio</span>
              </h2>

              <p style={{
                marginTop: 'clamp(14px,2vw,22px)', maxWidth: 460, fontSize: 'clamp(15px,1.7vw,18px)',
                lineHeight: 1.6, color: '#E6EEFB',
              }}>
                Vamos juntos de Campo Grande até Anastácio para a Conferência
                Mercosul. Ônibus com ida e volta: reserve a sua poltrona.
              </p>
            </div>

            <div style={{ minWidth: 0, display: 'grid', gap: 18, justifyItems: 'start' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                {['10 de outubro', 'Saída 14h30', 'R$ 60 por poltrona'].map((t) => (
                  <span key={t} style={{
                    border: '1px solid rgba(255,255,255,.28)', borderRadius: 999, padding: '8px 16px',
                    fontFamily: 'var(--head)', fontWeight: 800, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase',
                  }}>{t}</span>
                ))}
              </div>

              <span className="deep-cta" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: AZUL_FUNDO,
                fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(13px,1.5vw,15px)',
                letterSpacing: '.08em', textTransform: 'uppercase', padding: '15px 28px', borderRadius: 999,
              }}>
                Quero garantir minha vaga <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </a>
  );
}
