// Shared style objects derived from the design system. Plain objects so they
// can be spread into inline `style` props across pages.

export const wrap = { maxWidth: 1180, margin: '0 auto' };

export const kicker = {
  fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--faint)', letterSpacing: '.1em',
};

export const sectionTitle = {
  fontFamily: 'var(--head)', fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.02,
};

export const display = {
  fontFamily: 'var(--display)', fontWeight: 800, textTransform: 'uppercase',
  letterSpacing: '-.02em', lineHeight: .92,
};

export const lead = { fontSize: 18, color: 'var(--dim)' };

export const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--glow)', color: '#050505',
  fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15.5, padding: '16px 32px', borderRadius: 99,
  cursor: 'pointer', textDecoration: 'none', border: 'none',
};

export const btnPrimarySm = {
  display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--glow)', color: '#050505',
  fontFamily: 'var(--head)', fontWeight: 700, fontSize: 15, padding: '14px 26px', borderRadius: 99,
  cursor: 'pointer', textDecoration: 'none', border: 'none',
};

export const btnGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.05)',
  border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 600,
  fontSize: 15, padding: '15px 28px', borderRadius: 99, cursor: 'pointer', textDecoration: 'none',
};

export const card = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16,
};

export const eyebrowLine = {
  display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 12,
  letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 16,
};

export const fieldLabel = {
  fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--faint)',
};

export const field = {
  background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 11, padding: '13px 15px',
  color: 'var(--text)', fontFamily: 'var(--body)', fontSize: 15, outline: 'none', width: '100%',
};
