export const dynamic = 'force-dynamic';

import Link from 'next/link';
import prisma from '@/lib/prisma';
import SiteShell from '@/components/site/SiteShell';
import Countdown from '@/components/site/Countdown';
import PixCopy from '@/components/site/PixCopy';
import RegisterModal from '@/components/site/RegisterModal';
import MapEmbed from '@/components/site/MapEmbed';
import ConferenceFold from '@/components/site/ConferenceFold';
import { beliefs, fallbackEvents, mapDbEvent, messages, ministries, site, testimonials } from '@/lib/site-data';
import { btnGhost, btnPrimary, btnPrimarySm, card, display, kicker, sectionTitle, wrap } from '@/lib/site-ui';

async function getEvents() {
  try {
    const rows = await prisma.event.findMany({ where: { active: true }, orderBy: { startDate: 'asc' }, take: 3 });
    if (!rows.length) return fallbackEvents;
    return rows.map(mapDbEvent);
  } catch {
    return fallbackEvents;
  }
}

export default async function Home() {
  const events = await getEvents();

  return (
    <SiteShell>
      {/* ---------- HERO ---------- */}
      <header style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', padding: '0 0 64px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/worship-arms.jpg" alt="Adoração na Igreja Vitória" fetchPriority="high" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 28%', animation: 'kenburns 18s var(--ease) infinite alternate' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.72) 0%,rgba(5,5,5,.28) 35%,rgba(5,5,5,.55) 70%,rgba(5,5,5,.96) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 50% at 50% 38%, rgba(240,168,72,.16), transparent 70%)' }} />
        </div>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 2, height: '60%', transform: 'rotate(-20deg)', transformOrigin: 'top', background: 'linear-gradient(180deg,rgba(240,168,72,.5),transparent 75%)', animation: 'beamSweep 7s var(--ease) infinite', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 2, height: '60%', transform: 'rotate(14deg)', transformOrigin: 'top', background: 'linear-gradient(180deg,rgba(91,141,239,.4),transparent 75%)', animation: 'beamSweep 8s var(--ease) infinite', animationDelay: '-3s', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 3, ...wrap, padding: '0 28px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.26em', textTransform: 'uppercase', color: 'var(--glow)', fontWeight: 500, marginBottom: 22, animation: 'rise 1s var(--ease) both' }}>
            <span style={{ width: 26, height: 1, background: 'var(--glow)', opacity: .7 }} />Igreja Vitória · {site.city}
          </div>
          <h1 style={{ ...display, fontSize: 'clamp(44px,8.5vw,118px)', lineHeight: .9, maxWidth: '14ch', marginBottom: 26, animation: 'rise 1s var(--ease) .08s both' }}>
            Encontre Deus.<br />Viva em família.<br /><span style={{ color: 'var(--glow)', textShadow: '0 0 60px rgba(240,168,72,.45)' }}>Transforme sua história.</span>
          </h1>
          <p style={{ fontSize: 'clamp(17px,2.2vw,21px)', color: 'var(--text)', maxWidth: 620, lineHeight: 1.5, marginBottom: 38, animation: 'rise 1s var(--ease) .2s both' }}>
            Uma igreja formada de pessoas imperfeitas, mas que amam um Deus que é Perfeito. Seja bem-vindo(a) — aqui você encontra fé, propósito e família.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', animation: 'rise 1s var(--ease) .3s both' }}>
            <Link href="/quem-somos" className="btn-glow" style={btnPrimary}>Quero visitar →</Link>
            <Link href="/aovivo" className="btn-ghost-pulse" style={btnGhost}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pulse)', animation: 'pulse 1.4s infinite' }} />Assistir ao vivo
            </Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.2em', color: 'var(--faint)' }}>ROLE</span>
          <span style={{ width: 1, height: 36, background: 'linear-gradient(var(--glow),transparent)', animation: 'cue 2s var(--ease) infinite' }} />
        </div>
      </header>

      {/* ---------- HORÁRIOS STRIP ---------- */}
      <div style={{ borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)', background: 'var(--ink)' }}>
        <div style={{ ...wrap, padding: '22px 28px', display: 'flex', flexWrap: 'wrap', gap: '18px 40px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 36px' }}>
            {[['Domingo', '10h · Manhã  |  18h · Família'], ['Quarta-feira', '20h · Culto de Ensino'], ['Onde', 'R. Mal. Rondon, 163 · Amambai']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--faint)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16 }}>{v}</span>
              </div>
            ))}
          </div>
          <Link href="/contato" className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em', color: 'var(--glow)', whiteSpace: 'nowrap', textDecoration: 'none' }}>Como chegar →</Link>
        </div>
      </div>

      {/* ---------- CONFERÊNCIA 2026 (destaque) ---------- */}
      <ConferenceFold />

      {/* ---------- IDENTIDADE ---------- */}
      <section className="reveal" style={{ padding: '108px 28px', position: 'relative' }}>
        <div style={wrap}>
          <div style={{ maxWidth: 760, marginBottom: 52 }}>
            <span style={kicker}>01 — NOSSA IDENTIDADE</span>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(30px,4.6vw,52px)', margin: '16px 0 14px' }}>O que nos move<br />e o que acreditamos.</h2>
            <p style={{ fontSize: 18, color: 'var(--dim)', maxWidth: 560 }}>Cinco marcas que definem quem somos como igreja — vividas a cada encontro, dentro e fora do domingo.</p>
          </div>
          <div data-grid5 style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
            {beliefs.map((b) => (
              <div key={b.n} className="lift lift-soft" style={{ ...card, borderRadius: 14, padding: '26px 22px' }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(240,168,72,.12)', border: '1px solid rgba(240,168,72,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: 'var(--glow)', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 18 }}>{b.n}</div>
                <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 18, letterSpacing: '-.01em', marginBottom: 9 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--dim)', lineHeight: 1.55 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- QUEM SOMOS TEASER ---------- */}
      <section className="reveal" style={{ padding: '0 28px 108px' }}>
        <div data-split style={{ ...wrap, display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 54, alignItems: 'center' }}>
          <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', aspectRatio: '4/3', border: '1px solid var(--border)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/welcome-stage.jpg" alt="Recepção na Igreja Vitória" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,transparent 40%,rgba(5,5,5,.55))' }} />
            <div style={{ position: 'absolute', left: 22, bottom: 22, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--glow-soft)', background: 'rgba(5,5,5,.5)', backdropFilter: 'blur(6px)', padding: '8px 14px', borderRadius: 99, border: '1px solid var(--border)' }}>#WelcomeVictory</div>
          </div>
          <div>
            <span style={kicker}>02 — QUEM SOMOS</span>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1.04, margin: '16px 0 18px' }}>Uma igreja em movimento, construída como família.</h2>
            <p style={{ fontSize: 17.5, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 16 }}>A Igreja Vitória nasceu para ser um lugar onde pessoas reais encontram um Deus real. Adoração vibrante, palavra que transforma e uma comunidade que caminha junto durante toda a semana.</p>
            <p style={{ fontSize: 17.5, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 30 }}>Aqui ninguém precisa ter tudo resolvido para pertencer. Vem como você está.</p>
            <Link href="/quem-somos" className="btn-ghost" style={{ ...btnGhost, padding: '14px 26px' }}>Conheça nossa história →</Link>
          </div>
        </div>
      </section>

      {/* ---------- MINISTÉRIOS ---------- */}
      <section className="reveal" style={{ padding: '104px 28px', borderTop: '1px solid var(--border-soft)', background: 'linear-gradient(180deg,var(--ink),var(--void))' }}>
        <div style={wrap}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 46 }}>
            <div style={{ maxWidth: 620 }}>
              <span style={kicker}>03 — NOSSOS MINISTÉRIOS</span>
              <h2 style={{ ...sectionTitle, fontSize: 'clamp(30px,4.6vw,52px)', margin: '16px 0 12px' }}>Existe um lugar<br />para você servir e crescer.</h2>
            </div>
            <Link href="/ministerios" className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em', color: 'var(--glow)', whiteSpace: 'nowrap', textDecoration: 'none' }}>Ver todos →</Link>
          </div>
          <div data-grid-min style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {ministries.map((m) => (
              <Link key={m.id} href={`/ministerios/${m.id}`} className="lift zoom-parent" style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', aspectRatio: '3/4', border: '1px solid var(--border)', display: 'block', textDecoration: 'none', color: 'var(--text)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo} alt={m.name} loading="lazy" className="zoom-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s var(--ease)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.05) 30%,rgba(5,5,5,.92))' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 6 }}>{m.tag}</div>
                  <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 19, letterSpacing: '-.01em', marginBottom: 4 }}>{m.name}</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--dim)', lineHeight: 1.4 }}>{m.leaders}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CASA DE VITÓRIA ---------- */}
      <section className="reveal" style={{ padding: '104px 28px', borderTop: '1px solid var(--border-soft)' }}>
        <div data-split style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr .8fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--beam)', background: 'rgba(91,141,239,.1)', border: '1px solid rgba(91,141,239,.25)', padding: '7px 14px', borderRadius: 99, marginBottom: 22 }}>Perto de você</div>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(30px,4.6vw,50px)', marginBottom: 18 }}>A igreja não termina no domingo.</h2>
            <p style={{ fontSize: 18, color: 'var(--dim)', lineHeight: 1.6, marginBottom: 30, maxWidth: 520 }}>Durante a semana nos reunimos nas casas — as <b style={{ color: 'var(--text)' }}>Casas de Vitória</b> — para comunhão, oração e crescimento. É onde a fé vira família e ninguém caminha sozinho.</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/cav" className="btn-glow" style={btnPrimarySm}>Encontrar uma CAV</Link>
              <RegisterModal kicker="Casa de Vitória" title="Quero ser anfitrião" sub="Abra sua casa para receber uma CAV. Nossa equipe entra em contato." triggerClass="btn-ghost" triggerStyle={{ ...btnGhost, padding: '13px 24px' }}>Quero ser anfitrião</RegisterModal>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[{ bairro: 'Bairro Universitário', addr: 'Av. Vitor Meireles, 163 · Casa 03', when: 'Sexta · 19:30' }, { bairro: 'Centro', addr: 'Próximo à sede · grupo aberto', when: 'Quinta · 19:30' }].map((c) => (
              <div key={c.bairro} className="hov-beam" style={{ ...card, borderRadius: 14, padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{c.bairro}</h4>
                    <p style={{ fontSize: 13, color: 'var(--dim)' }}>{c.addr}</p>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--beam)', textAlign: 'right', whiteSpace: 'nowrap', letterSpacing: '.04em' }}>{c.when}</div>
                </div>
              </div>
            ))}
            <Link href="/cav" className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em', color: 'var(--glow)', paddingTop: 4, textDecoration: 'none' }}>Ver todas as casas →</Link>
          </div>
        </div>
      </section>

      {/* ---------- AO VIVO + COUNTDOWN ---------- */}
      <section className="reveal" style={{ padding: '0 28px 104px' }}>
        <div style={{ ...wrap, background: 'linear-gradient(135deg,var(--s1),var(--ink))', border: '1px solid var(--border)', borderRadius: 24, padding: 46, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -80, top: -80, width: 340, height: 340, background: 'radial-gradient(circle,rgba(232,71,91,.18),transparent 65%)', pointerEvents: 'none' }} />
          <div data-split style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 44, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--pulse)', marginBottom: 18 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--pulse)', animation: 'pulse 1.4s infinite' }} />Offline · próximo culto
              </div>
              <h2 style={{ ...sectionTitle, fontSize: 'clamp(28px,4vw,44px)', marginBottom: 12 }}>Adore de onde<br />você estiver.</h2>
              <p style={{ fontSize: 17, color: 'var(--dim)', lineHeight: 1.55, marginBottom: 26, maxWidth: 440 }}>Não conseguiu vir? Assista nossos cultos ao vivo pelo YouTube e viva uma experiência com Deus em qualquer lugar.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={`${site.youtube}/live`} target="_blank" rel="noreferrer" className="btn-pulse" style={{ ...btnPrimarySm, background: 'var(--pulse)', color: '#fff' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.4s infinite' }} />Assistir agora
                </a>
                <Link href="/programacao" className="btn-ghost" style={{ ...btnGhost, padding: '13px 24px' }}>Ver programação</Link>
              </div>
            </div>
            <Countdown />
          </div>
        </div>
      </section>

      {/* ---------- EVENTOS ---------- */}
      <section className="reveal" style={{ padding: '104px 28px', borderTop: '1px solid var(--border-soft)', background: 'linear-gradient(180deg,var(--ink),var(--void))' }}>
        <div style={wrap}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 46 }}>
            <div style={{ maxWidth: 620 }}>
              <span style={kicker}>04 — PRÓXIMOS EVENTOS</span>
              <h2 style={{ ...sectionTitle, fontSize: 'clamp(30px,4.6vw,52px)', margin: '16px 0 0' }}>Não perca o que está<br />por vir na nossa família.</h2>
            </div>
            <Link href="/eventos" className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em', color: 'var(--glow)', whiteSpace: 'nowrap', textDecoration: 'none' }}>Agenda completa →</Link>
          </div>
          <div data-grid-ev style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }}>
            {events.map((e) => (
              <div key={e.id} className="lift" style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.photo} alt={e.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,5,.15) 25%,rgba(5,5,5,.94))' }} />
                {e.featured && <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#050505', background: 'var(--glow)', padding: '6px 12px', borderRadius: 99, fontWeight: 600 }}>Destaque</div>}
                <div style={{ position: 'relative', padding: 22 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.06em', color: 'var(--glow)', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 13, background: 'var(--void)', padding: '6px 11px', borderRadius: 8 }}>{e.date}</span><span>{e.time} · {e.place}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 22, letterSpacing: '-.01em', marginBottom: 14 }}>{e.title}</h3>
                  <RegisterModal kicker="Inscrição em evento" title={e.title} sub={`${e.date} · ${e.time} · ${e.place}`} triggerClass="btn-fill-glow" triggerStyle={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.08)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 13.5, padding: '10px 20px', borderRadius: 99, cursor: 'pointer', backdropFilter: 'blur(6px)' }}>Fazer inscrição →</RegisterModal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- MENSAGENS TEASER ---------- */}
      <section className="reveal" style={{ padding: '104px 28px', borderTop: '1px solid var(--border-soft)' }}>
        <div style={wrap}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 46 }}>
            <div style={{ maxWidth: 620 }}>
              <span style={kicker}>05 — ÚLTIMAS MENSAGENS</span>
              <h2 style={{ ...sectionTitle, fontSize: 'clamp(30px,4.6vw,52px)', margin: '16px 0 0' }}>Palavra que transforma,<br />onde e quando quiser.</h2>
            </div>
            <Link href="/mensagens" className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em', color: 'var(--glow)', whiteSpace: 'nowrap', textDecoration: 'none' }}>Biblioteca completa →</Link>
          </div>
          <div data-grid-msg style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {messages.slice(0, 3).map((msg) => (
              <Link key={msg.id} href="/mensagens" className="lift-sm" style={{ cursor: 'pointer', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--s1)', display: 'block', textDecoration: 'none', color: 'var(--text)' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={msg.thumb} alt={msg.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(5,5,5,.6))' }} />
                  <div style={{ position: 'absolute', left: 14, top: 14, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--glow-soft)', background: 'rgba(5,5,5,.55)', backdropFilter: 'blur(4px)', padding: '5px 11px', borderRadius: 99, border: '1px solid var(--border)' }}>{msg.series}</div>
                  <div style={{ position: 'absolute', right: 14, bottom: 14, width: 42, height: 42, borderRadius: '50%', background: 'rgba(240,168,72,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050505', fontSize: 14 }}>▶</div>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 17, letterSpacing: '-.01em', marginBottom: 7, lineHeight: 1.25 }}>{msg.title}</h3>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.04em', color: 'var(--faint)' }}>{msg.speaker} · {msg.duration}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CONTRIBUA ---------- */}
      <section className="reveal" style={{ padding: '0 28px 104px' }}>
        <div style={{ ...wrap, border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/altar-prayer.jpg" alt="" aria-hidden="true" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg,rgba(5,5,5,.96) 38%,rgba(5,5,5,.6))' }} />
          <div data-split style={{ position: 'relative', padding: '54px 46px', display: 'grid', gridTemplateColumns: '1fr .9fr', gap: 44, alignItems: 'center' }}>
            <div>
              <span style={kicker}>06 — GENEROSIDADE</span>
              <h2 style={{ ...sectionTitle, fontSize: 'clamp(30px,4.4vw,48px)', margin: '16px 0 16px' }}>Faça parte da missão.</h2>
              <p style={{ fontSize: 17.5, color: 'var(--dim)', lineHeight: 1.6, maxWidth: 460, marginBottom: 14 }}>Sua generosidade sustenta vidas sendo transformadas, projetos sociais e a expansão do Reino em Campo Grande e além.</p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--faint)', letterSpacing: '.04em' }}>Transparência total · prestação de contas a cada trimestre</p>
            </div>
            <div style={{ background: 'rgba(11,11,12,.7)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', borderRadius: 18, padding: 26 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 8 }}>PIX · CNPJ</div>
              <PixCopy value={site.pixCnpj} style={{ marginBottom: 14 }} />
              <Link href="/contribua-pagamento" className="btn-glow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 12, cursor: 'pointer', textDecoration: 'none' }}>Contribuir com cartão →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TESTEMUNHOS ---------- */}
      <section className="reveal" style={{ padding: '104px 28px', borderTop: '1px solid var(--border-soft)', background: 'linear-gradient(180deg,var(--ink),var(--void))' }}>
        <div style={wrap}>
          <div style={{ maxWidth: 680, marginBottom: 46 }}>
            <span style={kicker}>07 — HISTÓRIAS DE TRANSFORMAÇÃO</span>
            <h2 style={{ ...sectionTitle, fontSize: 'clamp(30px,4.6vw,52px)', margin: '16px 0 0' }}>Vidas reais.<br />Histórias verdadeiras.</h2>
          </div>
          <div data-grid3 style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {testimonials.map((t) => (
              <div key={t.name} className="hov-glow" style={{ ...card, padding: 30 }}>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 54, color: 'var(--glow)', lineHeight: .4, opacity: .45, height: 28 }}>“</div>
                <blockquote style={{ fontFamily: 'var(--head)', fontWeight: 500, fontSize: 18, lineHeight: 1.45, color: 'var(--text)', margin: '10px 0 22px', letterSpacing: '-.01em' }}>{t.quote}</blockquote>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: t.av, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, color: '#050505' }}>{t.initials}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--head)', fontWeight: 600, fontSize: 14.5 }}>{t.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--faint)', letterSpacing: '.06em' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA + LOCALIZAÇÃO ---------- */}
      <section className="reveal" style={{ padding: '0 28px 104px' }}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', padding: '60px 0 56px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: '40%', width: 560, height: 420, maxWidth: '90%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(240,168,72,.14),transparent 64%)', filter: 'blur(10px)', animation: 'breathe 6s var(--ease) infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <h2 style={{ ...display, fontSize: 'clamp(32px,6vw,76px)', lineHeight: .94, marginBottom: 20 }}>Venha viver uma<br />experiência com <span style={{ color: 'var(--glow)' }}>Deus</span></h2>
              <p style={{ fontSize: 18, color: 'var(--dim)', maxWidth: 480, margin: '0 auto 32px' }}>Te esperamos no domingo às 18h. Vem como você está — aqui você é família.</p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/quem-somos" className="btn-glow" style={btnPrimary}>Planejar minha visita →</Link>
                <Link href="/aovivo" className="btn-ghost" style={btnGhost}>Assistir ao vivo</Link>
              </div>
            </div>
          </div>
          <div data-split style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 0, border: '1px solid var(--border)', borderRadius: 22, overflow: 'hidden' }}>
            <div style={{ padding: '38px 36px', background: 'var(--s1)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--glow)' }}>Onde estamos</span>
              <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 24, letterSpacing: '-.01em', margin: '14px 0 18px' }}>R. Mal. Rondon, 163<br />Amambai · {site.city}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {[['DOMINGO', '10h · Culto da Manhã  ·  18h · Culto da Família'], ['QUARTA', '20h · Culto de Ensino'], ['CEP', site.cep]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--faint)', letterSpacing: '.1em', minWidth: 78, paddingTop: 2 }}>{k}</span>
                    <span style={{ fontSize: 15, color: 'var(--text)' }}>{v}</span>
                  </div>
                ))}
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${site.mapsQuery}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ ...btnGhost, fontSize: 14, padding: '12px 22px' }}>Abrir no Google Maps →</a>
            </div>
            <div style={{ position: 'relative', minHeight: 300, background: 'var(--s2)' }}>
              <MapEmbed query={site.mapsQuery} title="Mapa Igreja Vitória" />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
