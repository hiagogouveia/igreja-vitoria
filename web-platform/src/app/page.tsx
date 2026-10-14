// Página gerada e guardada por 10 minutos: abre na hora para o visitante e
// continua acompanhando o cadastro de CAVs, a agenda e os vídeos do canal.
export const revalidate = 600;

import Link from 'next/link';
import SiteShell from '@/components/site/SiteShell';
import Countdown from '@/components/site/Countdown';
import PixCopy from '@/components/site/PixCopy';
import RegisterModal from '@/components/site/RegisterModal';
import MapEmbed from '@/components/site/MapEmbed';
import CavFold from '@/components/site/CavFold';
import EventArt from '@/components/site/EventArt';
import { beliefs, eventosAtuais, ministries, site } from '@/lib/site-data';
import { ultimosVideos, dataCurta } from '@/lib/youtube';
import { btnGhost, btnPrimary, display, wrap } from '@/lib/site-ui';

/* Rótulo pequeno das seções: mono, espaçado, com um traço de luz. */
function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rotulo">
      <span aria-hidden="true" />{children}
    </div>
  );
}

export default async function Home() {
  const events = eventosAtuais();
  const videos = (await ultimosVideos(3)).slice(0, 3);

  return (
    <SiteShell>
      {/* ---------- HERO ---------- */}
      <header style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', padding: '0 0 clamp(48px,8vh,88px)' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {/* Foto vertical do culto (palco, luzes e a igreja adorando). O enquadramento
              por tamanho de tela fica em .hero-foto, no globals.css. */}
          <div className="hero-foto-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/hero-vitoria.webp" alt="Banda e igreja adorando num culto da Igreja Vitória" width={941} height={1672} fetchPriority="high" decoding="async" className="hero-foto" style={{ animation: 'kenburns 2.4s var(--ease) both' }} />
          </div>
          <div className="hero-veu" />
        </div>
        <div style={{ position: 'relative', zIndex: 3, ...wrap, padding: '0 28px', width: '100%' }}>
          <div className="rotulo" style={{ animation: 'rise 1s var(--ease) both' }}>
            <span aria-hidden="true" />Igreja Vitória · {site.city}
          </div>
          {/* sem animação de entrada: o título é o maior elemento da primeira tela e precisa aparecer já */}
          <h1 className="hero-titulo" style={display}>
            Apaixonados<br /><span className="luz">por Jesus.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px,1.6vw,19px)', color: 'var(--text)', opacity: .86, lineHeight: 1.55, margin: '22px 0 34px', animation: 'rise 1s var(--ease) .18s both' }}>
            Domingo 18h · Quarta 19h30 · R. Mal. Rondon, 163
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', animation: 'rise 1s var(--ease) .26s both' }}>
            <RegisterModal kicker="Primeira visita" title="Quero visitar" sub="Diga quando você vem e a gente te recebe." triggerClass="btn-glow" triggerStyle={btnPrimary}>Quero visitar</RegisterModal>
            <Link href="/aovivo" className="btn-ghost" style={btnGhost}>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pulse)' }} />Assistir ao vivo
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- QUEM SOMOS (manifesto) ---------- */}
      <section className="reveal secao">
        <div style={wrap}>
          <Rotulo>Quem somos</Rotulo>
          <p className="manifesto">
            Somos uma igreja apaixonada por Jesus. Aqui a gente adora, aprende a Palavra e <span className="luz">caminha junto.</span>
          </p>
          <ol className="marcas">
            {beliefs.map((b) => (
              <li key={b.n}>
                <span className="marca-n">{b.n}</span>
                <strong>{b.title}</strong>
                <span>{b.desc}</span>
              </li>
            ))}
          </ol>
          <Link href="/quem-somos" className="link-seta">Conheça a igreja</Link>
        </div>
      </section>

      {/* ---------- LOUVOR (foto inteira, quase sem texto) ---------- */}
      <section className="reveal faixa-foto" aria-label="Adoração">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/worship-team.webp" alt="Time de louvor da Igreja Vitória no palco" loading="lazy" decoding="async" width={1600} height={1067} />
        <div className="faixa-veu" />
        <blockquote style={{ ...wrap, padding: '0 28px', width: '100%' }}>
          <p>Tudo o que tem fôlego louve ao Senhor.</p>
          <cite>Salmos 150:6</cite>
        </blockquote>
      </section>

      {/* ---------- AO VIVO + MENSAGENS ---------- */}
      <section className="reveal secao">
        <div style={wrap}>
          <div className="cabeca">
            <div>
              <Rotulo>No YouTube</Rotulo>
              <h2 className="titulo-secao">Cultos ao vivo<br />e mensagens.</h2>
            </div>
            <Countdown />
          </div>
          {videos.length > 0 && (
            <div className="grade-videos">
              {videos.map((v) => (
                <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="video">
                  <span className="video-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumb} alt="" loading="lazy" decoding="async" width={480} height={360} />
                    <span className="video-play" aria-hidden="true">▶</span>
                  </span>
                  <strong>{v.titulo}</strong>
                  <span className="video-meta">{[v.autor, dataCurta(v.publicado)].filter(Boolean).join(' · ')}</span>
                </a>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 36 }}>
            <Link href="/aovivo" className="btn-glow" style={btnPrimary}>Assistir ao vivo</Link>
            <Link href="/mensagens" className="btn-ghost" style={btnGhost}>Todas as mensagens</Link>
          </div>
        </div>
      </section>

      {/* ---------- CASA DE VITÓRIA ---------- */}
      <CavFold />

      {/* ---------- MINISTÉRIOS ---------- */}
      <section className="reveal secao">
        <div style={wrap}>
          <div className="cabeca">
            <div>
              <Rotulo>Ministérios</Rotulo>
              <h2 className="titulo-secao">Sirva com a gente.</h2>
            </div>
            <Link href="/ministerios" className="link-seta">Ver todos</Link>
          </div>
          <div className="grade-ministerios">
            {ministries.map((m) => (
              <Link key={m.id} href={`/ministerios/${m.id}`} className="ministerio zoom-parent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo} alt="" loading="lazy" decoding="async" className="zoom-img" />
                <span className="ministerio-texto">
                  <strong>{m.name}</strong>
                  <span>{m.leaders}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- AGENDA ---------- */}
      {events.length > 0 && (
        <section className="reveal secao">
          <div style={wrap}>
            <div className="cabeca">
              <div>
                <Rotulo>Agenda</Rotulo>
                <h2 className="titulo-secao">Na igreja.</h2>
              </div>
              <Link href="/eventos" className="link-seta">Ver agenda</Link>
            </div>
            <div className="grade-agenda">
              {events.map((e) => (
                <a key={e.id} href={e.href} className="agenda lift">
                  <span className="agenda-arte">
                    <EventArt event={e} variant="card" />
                  </span>
                  <span className="agenda-texto">
                    <span className="agenda-data">{e.date} · {e.time}</span>
                    <strong>{e.title}</strong>
                    <span>{e.desc}</span>
                    <span className="link-seta" style={{ marginTop: 14 }}>{e.cta ?? 'Saiba mais'}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- CONTRIBUA ---------- */}
      <section className="reveal secao">
        <div style={wrap}>
          <div className="contribua">
            <div>
              <Rotulo>Contribua</Rotulo>
              <h2 className="titulo-secao">Dízimos e ofertas.</h2>
              <p style={{ color: 'var(--dim)', fontSize: 17, lineHeight: 1.6, marginTop: 14, maxWidth: 420 }}>
                “Cada um dê conforme determinou em seu coração.” 2 Coríntios 9:7
              </p>
            </div>
            <div className="contribua-pix">
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 10 }}>PIX · CNPJ</div>
              <PixCopy value={site.pixCnpj} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- VISITE ---------- */}
      <section className="reveal secao" style={{ paddingTop: 0 }}>
        <div style={wrap}>
          <h2 className="convite" style={display}>
            Te esperamos<br /><span className="luz">no domingo.</span>
          </h2>
          <div className="visite">
            <div style={{ padding: 'clamp(28px,4vw,44px)' }}>
              <Rotulo>Onde estamos</Rotulo>
              <p style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 'clamp(22px,2.4vw,28px)', lineHeight: 1.25, margin: '6px 0 24px' }}>
                R. Mal. Rondon, 163<br />Amambai · {site.city}
              </p>
              <dl className="horarios">
                <div><dt>Domingo</dt><dd>18h · Culto da Família</dd></div>
                <div><dt>Quarta</dt><dd>19h30 · Quarta Flow</dd></div>
              </dl>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                <RegisterModal kicker="Primeira visita" title="Quero visitar" sub="Diga quando você vem e a gente te recebe." triggerClass="btn-glow" triggerStyle={btnPrimary}>Quero visitar</RegisterModal>
                <a href={`https://www.google.com/maps/search/?api=1&query=${site.mapsQuery}`} target="_blank" rel="noreferrer" className="btn-ghost" style={btnGhost}>Como chegar</a>
              </div>
            </div>
            <div style={{ position: 'relative', minHeight: 320, background: 'var(--s2)' }}>
              <MapEmbed query={site.mapsQuery} title="Mapa da Igreja Vitória" />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
