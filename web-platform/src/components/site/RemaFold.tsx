import { wrap } from '@/lib/site-ui';
import { remaNightEncerrado } from '@/lib/site-data';

/**
 * Banner do Rema Night na home, logo abaixo da hero e acima do card do TLC.
 * Identidade do evento: preto, nome em caligrafia prateada, cantos retos.
 * Some sozinho quando as inscrições fecham (04/12, 22h; a home é renovada a cada 10 minutos).
 */
export default function RemaFold() {
  if (remaNightEncerrado()) return null;
  return (
    <section className="rema-fold" aria-labelledby="rema-fold-titulo">
      <div className="rema-fold-in" style={wrap}>
        <a href="/rema-night" className="rema-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rema-v" src="/logo-v-final.png" alt="" aria-hidden="true" width={377} height={661} />
          <span className="rema-marca">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rema-night/marca-rema-night.png" alt="Rema Night" width={900} height={567} decoding="async" />
          </span>
          <span className="rema-texto">
            <span className="rema-selo">Inscrições abertas</span>
            <strong id="rema-fold-titulo" className="rema-titulo">Uma noite para quem faz acontecer</strong>
            <span className="rema-info">05 de dezembro · 20h · Igreja Vitória</span>
            <span className="rema-info rema-info-2">Ingresso R$ 35 · Dress code gala</span>
            <span className="rema-botao">Faça sua inscrição <span aria-hidden="true">→</span></span>
          </span>
        </a>
      </div>
    </section>
  );
}
