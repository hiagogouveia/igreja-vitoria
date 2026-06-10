import { useState } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../lib/useReveal';
import { display, field, fieldLabel, wrap } from '../lib/ui';

const PRESETS = ['50', '100', '250', '500'];

export default function ContribuaPagamento() {
  const [amount, setAmount] = useState('');
  const [custom, setCustom] = useState('');
  const [method, setMethod] = useState('pix');
  const [done, setDone] = useState(false);
  useReveal([done]);

  const value = amount || custom || '0';
  const valid = !!(amount || custom);

  const submit = (e) => { e.preventDefault(); setDone(true); };
  const reset = () => { setDone(false); setAmount(''); setCustom(''); };

  const methodPill = (active) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '15px 18px', borderRadius: 12,
    border: `1px solid ${active ? 'var(--glow)' : 'var(--border)'}`,
    background: active ? 'rgba(240,168,72,.12)' : 'var(--void)', cursor: 'pointer', transition: 'all .2s',
  });

  return (
    <div>
      <section style={{ padding: '120px 28px 0' }}>
        <div style={wrap}>
          <Link to="/contribua" className="link-glow" style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em', color: 'var(--faint)', textDecoration: 'none' }}>← Contribua</Link>
          <h1 style={{ ...display, fontSize: 'clamp(34px,5.5vw,70px)', lineHeight: .94, marginTop: 16 }}>Contribuição Online</h1>
        </div>
      </section>

      <section className="reveal" style={{ padding: '44px 28px 100px' }}>
        <div data-split style={{ ...wrap, display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 24, alignItems: 'start' }}>
          {done ? (
            <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 20, padding: '54px 40px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(240,168,72,.14)', border: '1px solid rgba(240,168,72,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', fontSize: 32, color: 'var(--glow)' }}>✓</div>
              <h2 style={{ fontFamily: 'var(--head)', fontWeight: 800, fontSize: 30, letterSpacing: '-.02em', marginBottom: 12 }}>Obrigado pela sua generosidade!</h2>
              <p style={{ fontSize: 16, color: 'var(--dim)', lineHeight: 1.6, maxWidth: 420, margin: '0 auto 28px' }}>Sua contribuição de <b style={{ color: 'var(--glow)' }}>R$ {value}</b> foi registrada. Que Deus multiplique cada semente plantada. 🌱</p>
              <button onClick={reset} className="btn-ghost" style={{ display: 'inline-block', background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 15, padding: '13px 28px', borderRadius: 99, cursor: 'pointer' }}>Fazer nova contribuição</button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 20, padding: 36 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 14 }}>Valor da contribuição</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
                {PRESETS.map((v) => {
                  const sel = amount === v;
                  return (
                    <span key={v} onClick={() => { setAmount(v); setCustom(''); }} style={{ textAlign: 'center', padding: '16px 4px', borderRadius: 12, border: `1px solid ${sel ? 'var(--glow)' : 'var(--border)'}`, background: sel ? 'rgba(240,168,72,.14)' : 'var(--void)', color: sel ? 'var(--glow)' : 'var(--text)', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 17, cursor: 'pointer', transition: 'all .2s' }}>R$ {v}</span>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--void)', border: '1px solid var(--border)', borderRadius: 12, padding: '4px 16px', marginBottom: 26 }}>
                <span style={{ fontFamily: 'var(--head)', fontWeight: 700, color: 'var(--faint)' }}>R$</span>
                <input type="number" min="0" value={custom} onChange={(e) => { setCustom(e.target.value); setAmount(''); }} placeholder="Outro valor" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16, padding: '13px 0' }} />
              </div>

              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 14 }}>Forma de pagamento</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 26 }}>
                <span onClick={() => setMethod('pix')} style={methodPill(method === 'pix')}>
                  <span style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, color: method === 'pix' ? 'var(--glow)' : 'var(--text)' }}>PIX</span>
                  <span style={{ fontSize: 12, color: 'var(--faint)' }}>instantâneo</span>
                </span>
                <span onClick={() => setMethod('card')} style={methodPill(method === 'card')}>
                  <span style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, color: method === 'card' ? 'var(--glow)' : 'var(--text)' }}>Cartão</span>
                  <span style={{ fontSize: 12, color: 'var(--faint)' }}>ou boleto</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <label style={fieldLabel}>Nome</label>
                  <input className="field" type="text" required placeholder="Seu nome" style={field} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <label style={fieldLabel}>E-mail</label>
                  <input className="field" type="email" required placeholder="voce@email.com" style={field} />
                </div>
              </div>

              <button type="submit" disabled={!valid} className="btn-glow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15.5, padding: 16, borderRadius: 12, cursor: valid ? 'pointer' : 'not-allowed', border: 'none', opacity: valid ? 1 : .55 }}>Contribuir R$ {value} →</button>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--faint)', textAlign: 'center', marginTop: 14, letterSpacing: '.04em' }}>🔒 Ambiente de demonstração · gateway de pagamento conectável</p>
            </form>
          )}

          <div style={{ background: 'linear-gradient(160deg,var(--s1),var(--ink))', border: '1px solid var(--border)', borderRadius: 20, padding: 34, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, background: 'radial-gradient(circle,rgba(240,168,72,.16),transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 46, color: 'var(--glow)', lineHeight: .5, opacity: .5, height: 24 }}>“</div>
              <p style={{ fontFamily: 'var(--head)', fontWeight: 500, fontSize: 19, lineHeight: 1.45, color: 'var(--text)', margin: '14px 0 24px', letterSpacing: '-.01em' }}>Cada um dê conforme determinou em seu coração, não com tristeza ou por obrigação, pois Deus ama quem dá com alegria.</p>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--faint)', letterSpacing: '.06em' }}>2 CORÍNTIOS 9:7</div>
              <div style={{ borderTop: '1px solid var(--border-soft)', marginTop: 26, paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['100% destinado à obra e aos projetos', 'Prestação de contas trimestral', 'Recibo enviado por e-mail'].map((t) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: 'var(--glow)' }}>✓</span>
                    <span style={{ fontSize: 14, color: 'var(--dim)' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
