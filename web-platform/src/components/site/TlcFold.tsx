import { wrap } from '@/lib/site-ui';

/**
 * Destaque das inscrições do TLC (Treinamento de Líderes de CAV), logo abaixo
 * da hero da home. Sem a classe "reveal" de propósito: ele precisa estar
 * visível desde a abertura, sem depender da rolagem. A hero foi encurtada
 * para o topo deste bloco já aparecer na primeira tela.
 * Visual da campanha /tlc: preto, laranja e foto em preto e branco.
 */
export default function TlcFold() {
  return (
    <section className="tlc-fold" aria-labelledby="tlc-fold-titulo">
      <div className="tlc-fold-in" style={wrap}>
        <a href="/tlc" className="tlc-card">
          <span className="tlc-foto" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tlc/img/f1.webp" alt="" width={1000} height={667} decoding="async" />
          </span>
          <span className="tlc-texto">
            <span className="tlc-selo">Inscrições abertas</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tlc-marca" src="/tlc/logo-tlc-claro.png" alt="TLC" width={1200} height={324} decoding="async" />
            <strong id="tlc-fold-titulo" className="tlc-titulo">Treinamento de Líderes de CAV</strong>
            <span className="tlc-faixa">Acolhimento e expansão</span>
            <span className="tlc-info">Início 19 de novembro · 19h30 · Igreja Vitória</span>
            <span className="tlc-botao">Quero me inscrever <span aria-hidden="true">→</span></span>
          </span>
        </a>
      </div>
    </section>
  );
}
