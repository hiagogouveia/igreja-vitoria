import { wrap } from '@/lib/site-ui';
import { tlcEncerrado } from '@/lib/site-data';

/**
 * Destaque das inscrições do TLC (Treinamento de Líderes de CAV), logo abaixo
 * da hero da home. Sem a classe "reveal" de propósito: ele precisa estar
 * visível desde a abertura, sem depender da rolagem. A hero foi encurtada
 * para o topo deste bloco já aparecer na primeira tela.
 * Identidade oficial do TLC: azul, logo em bege e foto com tratamento azulado.
 */
export default function TlcFold() {
  // passado 27/11 o card deixa de chamar para a inscrição (a home é renovada a cada 10 minutos)
  const encerrado = tlcEncerrado();
  return (
    <section className="tlc-fold" aria-labelledby="tlc-fold-titulo">
      <div className="tlc-fold-in" style={wrap}>
        <a href="/tlc" className="tlc-card">
          <span className="tlc-foto" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/cav-familia.webp" alt="" width={1200} height={1600} decoding="async" />
          </span>
          <span className="tlc-texto">
            <span className="tlc-selo">{encerrado ? 'Inscrições encerradas' : 'Inscrições abertas'}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tlc-marca" src="/tlc/logo-tlc-bege.png" alt="TLC" width={1000} height={413} decoding="async" />
            <strong id="tlc-fold-titulo" className="tlc-titulo">Treinamento de Líderes de CAV</strong>
            <span className="tlc-faixa">Acolhimento e expansão</span>
            <span className="tlc-info">Início 19 de novembro · 19h30 · Igreja Vitória</span>
            <span className="tlc-botao">{encerrado ? 'Saiba mais' : 'Quero me inscrever'} <span aria-hidden="true">→</span></span>
          </span>
        </a>
      </div>
    </section>
  );
}
