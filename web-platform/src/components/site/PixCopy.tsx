'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

/** Click-to-copy PIX/CNPJ row. `tint` controls the accent color of the label. */
export default function PixCopy({
  value,
  display,
  tint = 'var(--glow)',
  hoverClass = 'hov-glow',
  style,
}: {
  value: string;
  display?: string;
  tint?: string;
  hoverClass?: string;
  style?: CSSProperties;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = () => {
    try { navigator.clipboard?.writeText(value); } catch { /* noop */ }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div
      onClick={copy}
      className={hoverClass}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--void)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', ...style }}
    >
      <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text)', letterSpacing: '.02em' }}>{display ?? value}</span>
      <span style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 12, color: tint, whiteSpace: 'nowrap' }}>{copied ? '✓ Copiado' : 'Copiar'}</span>
    </div>
  );
}
