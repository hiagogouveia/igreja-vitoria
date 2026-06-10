import useReveal from '../lib/useReveal';
import { useModal } from '../context/ModalContext';
import MapEmbed from '../components/MapEmbed';
import { display, sectionTitle, wrap } from '../lib/ui';

const infoCards = [
  { icon: '◷', tint: 'beam', title: 'Dias de Encontro', text: 'Nossas casas se reúnem durante a semana — terças, quintas e sextas. Escolha o dia e o bairro mais perto de você.' },
  { icon: '♡', tint: 'glow', title: 'Comunhão', text: 'Mais que um grupo: uma família. Oração, palavra, comida e amizade que sustentam você o ano inteiro.' },
  { icon: '⌖', tint: 'glow', title: 'Perto de Você', text: 'Espalhadas por Campo Grande, há sempre uma casa pertinho da sua. Encontre a sua e seja bem-vindo.' },
];

const openHouses = [
  { bairro: 'Bairro Universitário', when: 'Sexta · 19:30', text: 'Av. Vitor Meireles, 163 · Casa 03. Um grupo acolhedor para todas as idades, com louvor e palavra toda sexta.' },
  { bairro: 'Centro', when: 'Quinta · 19:30', text: 'Próximo à sede. Grupo aberto a novos membros, com foco em discipulado e amizade verdadeira.' },
];

export default function CavPage() {
  useReveal();
  const { openHost } = useModal();

  return (
    <div>
      <header style={{ position: 'relative', minHeight: '56vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 50px' }}>
        <img src="/assets/community-prayer.jpg" alt="Casa de Vitória" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', animation: 'kenburns 22s var(--ease) infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.8) 0%,rgba(5,5,5,.3) 45%,rgba(5,5,5,.96) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--beam)', background: 'rgba(91,141,239,.12)', border: '1px solid rgba(91,141,239,.28)', padding: '7px 14px', borderRadius: 99, marginBottom: 18, marginTop: 90 }}>Perto de você</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,7vw,90px)' }}>Casa de Vitória</h1>
        </div>
      </header>

      <section className="reveal" style={{ padding: '80px 28px' }}>
        <div data-grid3 style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {infoCards.map((c) => (
            <div key={c.title} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.tint === 'beam' ? 'rgba(91,141,239,.12)' : 'rgba(240,168,72,.12)', border: `1px solid ${c.tint === 'beam' ? 'rgba(91,141,239,.25)' : 'rgba(240,168,72,.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.tint === 'beam' ? 'var(--beam)' : 'var(--glow)', fontSize: 20, marginBottom: 18 }}>{c.icon}</div>
              <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>{c.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.6 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 80px' }}>
        <div style={wrap}>
          <h2 style={{ ...sectionTitle, fontSize: 'clamp(24px,3.4vw,38px)', marginBottom: 26 }}>Casas abertas agora</h2>
          <div data-split style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {openHouses.map((h) => (
              <div key={h.bairro} className="hov-beam" style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <h4 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 20 }}>{h.bairro}</h4>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--beam)', whiteSpace: 'nowrap', background: 'rgba(91,141,239,.1)', border: '1px solid rgba(91,141,239,.25)', padding: '6px 12px', borderRadius: 99 }}>{h.when}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 18 }}>{h.text}</p>
                <span onClick={openHost} className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em', color: 'var(--glow)', cursor: 'pointer' }}>Quero participar →</span>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', position: 'relative', minHeight: 280, background: 'var(--s2)' }}>
            <MapEmbed query="Av.+Vitor+Meireles,+163+-+Campo+Grande+-+MS" title="Mapa CAV" />
          </div>
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 100px' }}>
        <div style={{ ...wrap, background: 'linear-gradient(135deg,var(--s1),var(--ink))', border: '1px solid var(--border)', borderRadius: 22, padding: '48px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 30, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(24px,3.2vw,36px)', marginBottom: 8 }}>Quer abrir sua casa?</h2>
            <p style={{ fontSize: 16, color: 'var(--dim)', maxWidth: 440 }}>Seja anfitrião de uma Casa de Vitória e veja sua sala virar um lugar de transformação.</p>
          </div>
          <button onClick={openHost} className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15.5, padding: '16px 30px', borderRadius: 99, cursor: 'pointer', border: 'none' }}>Quero ser anfitrião →</button>
        </div>
      </section>
    </div>
  );
}
