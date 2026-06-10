// Shared inline-style objects derived from the Glow design system.
import type { CSSProperties } from 'react';

export const wrap: CSSProperties = { maxWidth: 1180, margin: '0 auto' };

export const kicker: CSSProperties = { fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--faint)', letterSpacing: '.1em' };

export const sectionTitle: CSSProperties = { fontFamily: 'var(--head)', fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.02 };

export const display: CSSProperties = { fontFamily: 'var(--display)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-.02em', lineHeight: .92 };

export const btnPrimary: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15.5, padding: '16px 32px', borderRadius: 99, cursor: 'pointer', textDecoration: 'none', border: 'none' };

export const btnPrimarySm: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--glow)', color: '#050505', fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, padding: '14px 26px', borderRadius: 99, cursor: 'pointer', textDecoration: 'none', border: 'none' };

export const btnGhost: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 15, padding: '15px 28px', borderRadius: 99, cursor: 'pointer', textDecoration: 'none' };

export const card: CSSProperties = { background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16 };

export const eyebrowLine: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 16 };

export const fieldLabel: CSSProperties = { fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--faint)' };

export const field: CSSProperties = { background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 11, padding: '13px 15px', color: 'var(--text)', fontFamily: 'var(--body)', fontSize: 15, outline: 'none', width: '100%' };
