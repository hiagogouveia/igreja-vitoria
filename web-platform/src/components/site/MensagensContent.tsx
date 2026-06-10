'use client';

import { useMemo, useState } from 'react';
import { messages } from '@/lib/site-data';
import { display, eyebrowLine, wrap } from '@/lib/site-ui';

export default function MensagensContent() {
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();

  const filtered = useMemo(
    () => (q ? messages.filter((m) => `${m.title} ${m.speaker} ${m.series}`.toLowerCase().includes(q)) : messages),
    [q],
  );

  const resultCount = q
    ? `${filtered.length} resultado${filtered.length === 1 ? '' : 's'} para “${search.trim()}”`
    : `${messages.length} mensagens`;

  return (
    <>
      <section style={{ padding: '130px 28px 24px' }}>
        <div style={wrap}>
          <div style={eyebrowLine}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Biblioteca de Mensagens</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,6.5vw,82px)', maxWidth: '16ch', marginBottom: 30 }}>Palavra<br />sob demanda.</h1>
          <div className="searchbar" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: '5px 6px 5px 18px', maxWidth: 520 }}>
            <span style={{ color: 'var(--faint)', fontSize: 16 }}>⌕</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título, série ou pregador…" aria-label="Buscar mensagens" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'var(--body)', fontSize: 15, padding: '11px 0' }} />
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 28px 100px' }}>
        <div style={wrap}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 20 }}>{resultCount}</div>
          <div data-grid-msg style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {filtered.map((msg) => (
              <div key={msg.id} className="lift-sm" style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--s1)', cursor: 'pointer' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={msg.thumb} alt={msg.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%,rgba(5,5,5,.7))' }} />
                  <div style={{ position: 'absolute', left: 14, top: 14, display: 'flex', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--glow-soft)', background: 'rgba(5,5,5,.6)', backdropFilter: 'blur(4px)', padding: '5px 11px', borderRadius: 99, border: '1px solid var(--border)' }}>{msg.series}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dim)', background: 'rgba(5,5,5,.6)', backdropFilter: 'blur(4px)', padding: '5px 11px', borderRadius: 99, border: '1px solid var(--border)' }}>{msg.type}</span>
                  </div>
                  <div style={{ position: 'absolute', right: 14, bottom: 14, width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,168,72,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050505', fontSize: 15 }}>▶</div>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <h3 style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 18, letterSpacing: '-.01em', marginBottom: 9, lineHeight: 1.25 }}>{msg.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.04em', color: 'var(--faint)' }}>{msg.speaker}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--faint)' }}>{msg.date} · {msg.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--faint)' }}>
              <p style={{ fontSize: 16 }}>Nenhuma mensagem encontrada. Tente outra busca.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
