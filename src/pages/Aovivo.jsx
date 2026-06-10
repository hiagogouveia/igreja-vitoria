import { Link } from 'react-router-dom';
import { site } from '../lib/data';
import useReveal from '../lib/useReveal';
import useCountdown from '../lib/useCountdown';
import { CountdownCard } from './Home';
import { display, wrap } from '../lib/ui';

export default function Aovivo() {
  useReveal();
  const countdown = useCountdown();

  return (
    <div>
      <section style={{ padding: '120px 28px 0' }}>
        <div style={wrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--pulse)', background: 'rgba(232,71,91,.1)', border: '1px solid rgba(232,71,91,.28)', padding: '7px 14px', borderRadius: 99 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pulse)', animation: 'pulse 1.4s infinite' }} />Offline · próximo culto
            </span>
          </div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,6.5vw,84px)', marginBottom: 34 }}>Culto Ao Vivo</h1>
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 90px' }}>
        <div data-split style={{ ...wrap, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
              <iframe
                title="Transmissão Igreja Vitória"
                src="https://www.youtube.com/embed?listType=user_uploads&list=igrejavitoriacampogrande"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 18 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 19, marginBottom: 3 }}>Igreja Vitória · Campo Grande</h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--faint)', letterSpacing: '.04em' }}>{site.youtubeHandle}</p>
              </div>
              <a href={site.youtube} target="_blank" rel="noreferrer" className="btn-pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--pulse)', color: '#fff', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 14, padding: '12px 22px', borderRadius: 99, textDecoration: 'none' }}>Inscrever-se no canal</a>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CountdownCard countdown={countdown} dark />
            <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, padding: 26 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 16 }}>Próximos cultos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid var(--border-soft)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15 }}>Culto da Família</div>
                    <div style={{ fontSize: 12, color: 'var(--dim)' }}>Domingo</div>
                  </div>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 18, color: 'var(--glow)' }}>18:00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15 }}>Quarta-Flow</div>
                    <div style={{ fontSize: 12, color: 'var(--dim)' }}>Quarta-feira</div>
                  </div>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 18, color: 'var(--glow)' }}>19:30</span>
                </div>
              </div>
            </div>
            <Link to="/programacao" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 14.5, padding: 14, borderRadius: 12, textDecoration: 'none' }}>Ver programação completa →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
