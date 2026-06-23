'use client';

import { useState } from 'react';
import MapEmbed from './MapEmbed';
import { site } from '@/lib/site-data';
import { display, eyebrowLine, field, fieldLabel, wrap } from '@/lib/site-ui';

export default function ContatoContent() {
  const [sent, setSent] = useState(false);
  const [nome, setNome] = useState('');
  const [zap, setZap] = useState('');
  const [assunto, setAssunto] = useState('Quero visitar');
  const [mensagem, setMensagem] = useState('');

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Olá! Mensagem pelo site.\n\n*Assunto:* ${assunto}\n*Nome:* ${nome}\n*WhatsApp:* ${zap}\n*Mensagem:* ${mensagem}`;
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
  };

  return (
    <>
      <section style={{ padding: '120px 28px 0' }}>
        <div style={wrap}>
          <div style={eyebrowLine}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Fale Conosco</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,6.5vw,82px)', maxWidth: '14ch' }}>Estamos aqui<br />por você.</h1>
        </div>
      </section>

      <section className="reveal" style={{ padding: '44px 28px 60px' }}>
        <div data-split style={{ ...wrap, display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="hov-wa" style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textDecoration: 'none' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(37,211,102,.12)', border: '1px solid rgba(37,211,102,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 13 }}>WA</div>
              <div><div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16 }}>WhatsApp</div><div style={{ fontSize: 13, color: 'var(--dim)' }}>{site.whatsappLabel}</div></div>
            </a>
            <a href={`mailto:${site.email}`} className="hov-glow" style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textDecoration: 'none' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(240,168,72,.12)', border: '1px solid rgba(240,168,72,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--glow)', fontSize: 18 }}>@</div>
              <div><div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16 }}>E-mail</div><div style={{ fontSize: 13, color: 'var(--dim)' }}>{site.email}</div></div>
            </a>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(91,141,239,.12)', border: '1px solid rgba(91,141,239,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--beam)', fontSize: 18, flexShrink: 0 }}>⌖</div>
              <div><div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 16 }}>Endereço</div><div style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.5 }}>{site.address}<br />{site.city} · {site.cep}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="icon-box" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, padding: 15, fontFamily: 'var(--head)', fontWeight: 600, fontSize: 13.5, color: 'var(--dim)', textDecoration: 'none' }}>Instagram</a>
              <a href={site.youtube} target="_blank" rel="noreferrer" className="icon-box" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, padding: 15, fontFamily: 'var(--head)', fontWeight: 600, fontSize: 13.5, color: 'var(--dim)', textDecoration: 'none' }}>YouTube</a>
            </div>
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, padding: 34 }}>
            <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 22, letterSpacing: '-.01em', marginBottom: 6 }}>Envie uma mensagem</h3>
            <p style={{ fontSize: 14, color: 'var(--dim)', marginBottom: 24 }}>Dúvidas, pedidos ou só pra dizer oi — respondemos com carinho.</p>
            {sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(240,168,72,.14)', border: '1px solid rgba(240,168,72,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, fontSize: 28, color: 'var(--glow)' }}>✓</div>
                <h4 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Mensagem enviada!</h4>
                <p style={{ fontSize: 14, color: 'var(--dim)', maxWidth: 320 }}>Recebemos seu contato e responderemos em breve pelo canal informado.</p>
              </div>
            ) : (
              <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div data-split style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <label style={fieldLabel}>Nome</label>
                    <input className="field" type="text" required placeholder="Seu nome" style={field} value={nome} onChange={(e) => setNome(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <label style={fieldLabel}>WhatsApp</label>
                    <input className="field" type="text" required placeholder="(67) 9 0000-0000" style={field} value={zap} onChange={(e) => setZap(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <label style={fieldLabel}>Assunto</label>
                  <select className="field" style={field} value={assunto} onChange={(e) => setAssunto(e.target.value)}>
                    <option>Quero visitar</option>
                    <option>Pedido de oração</option>
                    <option>Quero servir</option>
                    <option>Casa de Vitória</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <label style={fieldLabel}>Mensagem</label>
                  <textarea className="field" rows={4} required placeholder="Escreva aqui…" style={{ ...field, resize: 'vertical' }} value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
                </div>
                <button type="submit" className="btn-glow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 11, cursor: 'pointer', border: 'none' }}>Enviar pelo WhatsApp →</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="reveal" style={{ padding: '0 28px 100px' }}>
        <div style={{ ...wrap, border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', position: 'relative', minHeight: 340, background: 'var(--s2)' }}>
          <MapEmbed query={site.mapsQuery} title="Mapa contato" />
        </div>
      </section>
    </>
  );
}
