import { ministries } from '../lib/data';
import useReveal from '../lib/useReveal';
import { useModal } from '../context/ModalContext';
import { btnPrimary, display, eyebrowLine, kicker, sectionTitle, wrap } from '../lib/ui';

const pillars = [
  { tag: 'História', title: 'De onde viemos', text: 'A Igreja Vitória nasceu do desejo de ver Campo Grande transformada pelo evangelho. De um pequeno grupo reunido em oração a uma comunidade vibrante, cada passo foi marcado pela fidelidade de Deus.' },
  { tag: 'Visão', title: 'Para onde vamos', text: 'Ser uma igreja que alcança pessoas, forma discípulos e levanta uma geração que ama a Jesus acima de tudo — influenciando a cidade e as nações.' },
  { tag: 'Valores', title: 'O que nos guia', text: 'Jesus no centro · Família como base · Adoração como estilo de vida · Discipulado intencional · Generosidade e serviço · Excelência com o coração.' },
];

export default function QuemSomos() {
  useReveal();
  const { openVisit } = useModal();

  return (
    <div>
      <header style={{ position: 'relative', minHeight: '62vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 56px' }}>
        <img src="/assets/welcome-stage.jpg" alt="Igreja Vitória" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', animation: 'kenburns 20s var(--ease) infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.85) 0%,rgba(5,5,5,.35) 45%,rgba(5,5,5,.96) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ ...eyebrowLine, paddingTop: 90 }}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Quem Somos</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,7vw,92px)', maxWidth: '16ch' }}>Uma igreja em<br />movimento.</h1>
        </div>
      </header>

      <section className="reveal" style={{ padding: '90px 28px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--head)', fontWeight: 500, fontSize: 'clamp(22px,3.2vw,34px)', lineHeight: 1.32, letterSpacing: '-.015em', color: 'var(--text)' }}>
            Existimos para que cada pessoa <span style={{ color: 'var(--glow)' }}>encontre Deus</span>, seja restaurada e descubra o propósito para o qual foi criada — vivendo isso em <span style={{ color: 'var(--glow)' }}>família</span>.
          </p>
        </div>
      </section>

      <section className="reveal" style={{ padding: '80px 28px' }}>
        <div data-grid3 style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {pillars.map((p) => (
            <div key={p.tag} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 14 }}>{p.tag}</div>
              <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 21, letterSpacing: '-.01em', marginBottom: 12 }}>{p.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.6 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 90px' }}>
        <div style={wrap}>
          <div style={{ marginBottom: 36 }}>
            <span style={kicker}>NOSSA LIDERANÇA</span>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(28px,4vw,44px)', marginTop: 14 }}>Pastores que caminham com você.</h2>
          </div>
          <div data-grid-min style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {ministries.slice(0, 4).map((m) => (
              <div key={m.id} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,var(--glow),var(--glow-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16, color: '#050505', marginBottom: 14 }}>{m.tag.slice(0, 2)}</div>
                <h4 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16 }}>{m.leaders}</h4>
                <p style={{ fontSize: 13, color: 'var(--dim)' }}>Ministério {m.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 100px' }}>
        <div style={{ ...wrap, background: 'linear-gradient(135deg,var(--s1),var(--ink))', border: '1px solid var(--border)', borderRadius: 22, padding: '54px 46px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 500, height: 340, maxWidth: '90%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(240,168,72,.12),transparent 64%)', animation: 'breathe 6s var(--ease) infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(26px,3.6vw,40px)', marginBottom: 14 }}>Sua primeira vez é por nossa conta.</h2>
            <p style={{ fontSize: 17, color: 'var(--dim)', maxWidth: 480, margin: '0 auto 28px' }}>Planeje sua visita e prepararemos uma recepção especial pra você e sua família.</p>
            <button onClick={openVisit} className="btn-glow" style={btnPrimary}>Planejar minha visita →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
