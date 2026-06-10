import type { ReactNode } from 'react';
import SiteNavbar from './SiteNavbar';
import SiteFooter from './SiteFooter';

/** Public-site chrome: glass navbar + ambient glow + footer. */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', color: 'var(--text)', position: 'relative', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'radial-gradient(120% 70% at 50% -10%, rgba(240,168,72,.05), transparent 55%),radial-gradient(90% 50% at 50% 115%, rgba(91,141,239,.04), transparent 60%)' }} />
      <SiteNavbar />
      <main style={{ position: 'relative', zIndex: 2 }}>{children}</main>
      <SiteFooter />
    </div>
  );
}
