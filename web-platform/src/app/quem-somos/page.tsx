import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import RegisterModal from '@/components/site/RegisterModal';
import { ministries } from '@/lib/site-data';
import { btnPrimary, display, eyebrowLine, kicker, sectionTitle, wrap } from '@/lib/site-ui';

export const metadata: Metadata = { title: 'Quem Somos · Igreja Vitória', description: 'Quem é a Igreja Vitória: o que buscamos, o que nos guia e quem lidera cada ministério.' };

const pillars = [
  { tag: 'Visão', title: 'Para onde vamos', text: 'Alcançar pessoas, formar discípulos e levantar uma geração que ama Jesus acima de tudo.' },
  { tag: 'Valores', title: 'O que nos guia', text: 'Jesus no centro. Família como base. Adoração como estilo de vida. Discipulado. Generosidade e serviço. Excelência.' },
];

export default function QuemSomos() {
  return (
    <SiteShell>
      <header style={{ position: 'relative', minHeight: '62vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 56px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/welcome-stage.webp" alt="Culto na Igreja Vitória" fetchPriority="high" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', animation: 'kenburns 2.4s var(--ease) both' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.85) 0%,rgba(5,5,5,.35) 45%,rgba(5,5,5,.96) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ ...eyebrowLine, paddingTop: 90 }}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Quem Somos</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,7vw,92px)', maxWidth: '16ch' }}>Jesus<br /><span className="luz">no centro.</span></h1>
        </div>
      </header>

      <section className="reveal" style={{ padding: '90px 28px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--head)', fontWeight: 500, fontSize: 'clamp(22px,3.2vw,34px)', lineHeight: 1.32, letterSpacing: '-.015em', color: 'var(--text)' }}>
            Somos uma igreja de pessoas imperfeitas que amam um Deus perfeito. Queremos que cada pessoa <span className="luz">encontre Jesus</span> e caminhe com Ele em família.
          </p>
        </div>
      </section>

      <section className="reveal" style={{ padding: '80px 28px' }}>
        <div data-grid3 style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {pillars.map((p) => (
            <div key={p.tag} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 14 }}>{p.tag}</div>
              <h2 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 21, letterSpacing: '-.01em', marginBottom: 12 }}>{p.title}</h2>
              <p style={{ fontSize: 15, color: 'var(--dim)', lineHeight: 1.6 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 90px' }}>
        <div style={wrap}>
          <div style={{ marginBottom: 36 }}>
            <span style={kicker}>LIDERANÇA</span>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(28px,4vw,44px)', marginTop: 14 }}>Quem lidera os ministérios.</h2>
          </div>
          <div data-grid-min style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {ministries.map((m) => (
              <div key={m.id} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 10 }}>{m.name}</div>
                <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16 }}>{m.leaders}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 100px' }}>
        <div style={{ ...wrap, background: 'linear-gradient(135deg,var(--s1),var(--ink))', border: '1px solid var(--border)', borderRadius: 22, padding: '54px 46px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 500, height: 340, maxWidth: '90%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgb(var(--glow-rgb) / .12),transparent 64%)', animation: 'breathe 6s var(--ease) infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(26px,3.6vw,40px)', marginBottom: 14 }}>Vem conhecer a igreja.</h2>
            <p style={{ fontSize: 17, color: 'var(--dim)', maxWidth: 480, margin: '0 auto 28px' }}>Domingo às 18h e quarta às 19h30. Diga quando você vem e a gente te recebe.</p>
            <RegisterModal kicker="Primeira visita" title="Quero visitar" sub="Diga quando você vem e a gente te recebe." triggerClass="btn-glow" triggerStyle={btnPrimary}>Quero visitar</RegisterModal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
