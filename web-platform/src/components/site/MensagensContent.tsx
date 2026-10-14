'use client';

import { useMemo, useState } from 'react';
import type { Video } from '@/lib/youtube';
import { dataCurta } from '@/lib/youtube';
import { site } from '@/lib/site-data';
import { btnPrimary, display, eyebrowLine, wrap } from '@/lib/site-ui';

/** Últimos vídeos do canal da igreja no YouTube, com busca por título e pregador. */
export default function MensagensContent({ videos }: { videos: Video[] }) {
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();

  const filtered = useMemo(
    () => (q ? videos.filter((v) => `${v.titulo} ${v.autor ?? ''}`.toLowerCase().includes(q)) : videos),
    [q, videos],
  );

  return (
    <>
      <section style={{ padding: '130px 28px 24px' }}>
        <div style={wrap}>
          <div style={eyebrowLine}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Mensagens</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,6.5vw,82px)', maxWidth: '16ch', marginBottom: 30 }}>Últimas<br /><span className="luz">pregações.</span></h1>
          {videos.length > 0 && (
            <div className="searchbar" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: '5px 6px 5px 18px', maxWidth: 520 }}>
              <span aria-hidden="true" style={{ color: 'var(--faint)', fontSize: 16 }}>⌕</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título ou pregador" aria-label="Buscar mensagens" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'var(--body)', fontSize: 15, padding: '11px 0' }} />
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '40px 28px 100px' }}>
        <div style={wrap}>
          <div className="grade-videos" style={{ rowGap: 40 }}>
            {filtered.map((v, i) => (
              <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="video">
                <span className="video-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.thumb} alt="" loading={i < 3 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} decoding="async" width={480} height={360} />
                  <span className="video-play" aria-hidden="true">▶</span>
                </span>
                <strong>{v.titulo}</strong>
                <span className="video-meta">{[v.autor, dataCurta(v.publicado)].filter(Boolean).join(' · ')}</span>
              </a>
            ))}
          </div>
          {videos.length > 0 && filtered.length === 0 && (
            <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--faint)', fontSize: 16 }}>Nenhuma mensagem com esse nome.</p>
          )}
          <div style={{ marginTop: 48 }}>
            {videos.length === 0 && <p style={{ color: 'var(--dim)', fontSize: 17, marginBottom: 20 }}>Os vídeos estão no canal da igreja no YouTube.</p>}
            <a href={`${site.youtube}/videos`} target="_blank" rel="noreferrer" className="btn-glow" style={btnPrimary}>Ver todas no YouTube</a>
          </div>
        </div>
      </section>
    </>
  );
}
