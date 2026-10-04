import { wrap } from '@/lib/site-ui';

/**
 * Faixa de destaque da Caravana Anastácio (Conferência Mercosul, 10 de outubro).
 * Segue o mesmo padrão das outras dobras de evento, com a identidade da arte
 * oficial da caravana (azul profundo e azul vibrante) e os preletores da
 * conferência. Fica no topo da home porque é o evento mais próximo agora.
 * O bloco inteiro leva para a landing estática em /caravana
 * (servida de public/caravana, fora do router do Next — por isso <a>).
 */
const AZUL_CLARO = '#9FC4FF';
const AZUL_FUNDO = '#081A33';

/* Grade em duas colunas no desktop (texto | preletores) e empilhada no celular,
   com os preletores primeiro. Fica aqui porque o resto da dobra é inline. */
const css = `
.cf-grade{display:grid;grid-template-columns:1fr;gap:clamp(18px,3vw,40px);align-items:end}
.cf-arte{order:-1;max-width:560px;width:100%;justify-self:center}
@media(min-width:900px){
  .cf-grade{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .cf-arte{order:0;max-width:none;justify-self:end}
}
`;

export default function CaravanaFold() {
  return (
    <a
      href="/caravana"
      aria-label="Caravana Anastácio para a Conferência Mercosul · 10 de outubro · garantir vaga"
      style={{ display: 'block', textDecoration: 'none', color: '#fff' }}
    >
      <style>{css}</style>
      <section
        className="reveal caravana-fold"
        style={{
          position: 'relative', overflow: 'hidden',
          borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)',
          paddingTop: 'clamp(38px,6vw,72px)',
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

          <div className="cf-grade" style={{ paddingTop: 'clamp(18px,3vw,32px)' }}>
            {/* acima do "planeta": no celular o texto vem logo abaixo da curva */}
            <div style={{ position: 'relative', zIndex: 2, minWidth: 0, paddingBottom: 'clamp(38px,6vw,72px)' }}>
              <h2 style={{
                margin: 0, fontFamily: 'var(--head)', fontWeight: 900, fontStretch: '118%',
                fontSize: 'clamp(42px,6.4vw,96px)', letterSpacing: '-.045em', textTransform: 'uppercase',
                // .84 deixava o acento do Á encostar no CARAVANA de cima
                lineHeight: 1,
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

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 'clamp(16px,2.2vw,24px)' }}>
                {['10 de outubro', 'Saída 14h30', 'R$ 60 por poltrona'].map((t) => (
                  <span key={t} style={{
                    border: '1px solid rgba(255,255,255,.28)', borderRadius: 999, padding: '8px 16px',
                    fontFamily: 'var(--head)', fontWeight: 800, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase',
                  }}>{t}</span>
                ))}
              </div>

              <span className="deep-cta" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: AZUL_FUNDO,
                fontFamily: 'var(--head)', fontWeight: 800, fontSize: 'clamp(13px,1.5vw,15px)', textAlign: 'center',
                letterSpacing: '.08em', textTransform: 'uppercase', padding: '15px 28px', borderRadius: 999,
                marginTop: 'clamp(18px,2.4vw,26px)',
              }}>
                <span>Quero garantir minha <span style={{ whiteSpace: 'nowrap' }}>vaga <span aria-hidden="true">→</span></span></span>
              </span>
            </div>

            {/* Preletores, a mesma arte da página da caravana. A foto é recortada
                numa curva e o "planeta" com borda de luz cobre esse corte. */}
            <div className="cf-arte" style={{ position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/caravana/assets/preletores-1072.webp"
                srcSet="/caravana/assets/preletores-640.webp 640w, /caravana/assets/preletores-1072.webp 1072w"
                sizes="(min-width: 900px) 50vw, 100vw"
                width={1072} height={807} loading="lazy"
                alt="Preletores da Conferência Mercosul: Ap. Neila, Ap. Samuel, Pr. Geisson, Ap. Rayssa, Ap. Eberson Luiz e Pra. Jennefer Matos."
                style={{ position: 'relative', display: 'block', width: '100%', height: 'auto', filter: 'drop-shadow(0 0 22px rgba(47,123,255,.5))' }}
              />
              <span aria-hidden="true" style={{
                position: 'absolute', zIndex: 1, left: '50%', top: '86.37%', width: '257.8%', aspectRatio: '1',
                transform: 'translateX(-50%)', borderRadius: '50%', background: AZUL_FUNDO,
                borderTop: '2px solid rgba(190,215,255,.95)',
                boxShadow: '0 -4px 22px rgba(80,150,255,.9), 0 -2px 60px rgba(47,123,255,.55)',
              }} />
            </div>
          </div>
        </div>
      </section>
    </a>
  );
}
