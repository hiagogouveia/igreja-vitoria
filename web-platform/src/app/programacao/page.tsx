import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import SiteShell from '@/components/site/SiteShell';
import { btnPrimarySm, display, eyebrowLine, wrap } from '@/lib/site-ui';

export const metadata: Metadata = { title: 'Programação · Igreja Vitória', description: 'Programação semanal dos cultos da Igreja Vitória: domingos 10h e 18h, quartas 20h.' };

const slotTitle: CSSProperties = { fontFamily: 'var(--display)', fontWeight: 800, fontSize: 32, color: 'var(--glow)' };
const cardHead: CSSProperties = { padding: '22px 30px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const dayLabel: CSSProperties = { fontFamily: 'var(--display)', fontWeight: 800, textTransform: 'uppercase', fontSize: 22, letterSpacing: '-.01em' };
const tag: CSSProperties = { fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--glow)' };

function Slot({ time, title, sub, border }: { time: string; title: string; sub: string; border?: boolean }) {
  return (
    <div style={{ padding: '26px 30px', borderRight: border ? '1px solid var(--border-soft)' : undefined, display: 'flex', alignItems: 'center', gap: 20 }}>
      <span style={slotTitle}>{time}</span>
      <div>
        <div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 17 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--dim)' }}>{sub}</div>
      </div>
    </div>
  );
}

export default function Programacao() {
  return (
    <SiteShell>
      <section style={{ padding: '130px 28px 24px' }}>
        <div style={wrap}>
          <div style={eyebrowLine}><span style={{ width: 24, height: 1, background: 'var(--glow)' }} />Programação Semanal</div>
          <h1 style={{ ...display, fontSize: 'clamp(38px,6.5vw,82px)', maxWidth: '14ch' }}>Toda semana,<br />uma palavra.</h1>
        </div>
      </section>

      <section className="reveal" style={{ padding: '50px 28px 100px' }}>
        <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            <div style={cardHead}><span style={dayLabel}>Domingo</span><span style={tag}>2 cultos</span></div>
            <div data-split style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <Slot time="10h" title="Culto da Manhã" sub="Adoração e palavra para começar a semana" border />
              <Slot time="18h" title="Culto da Família" sub="O culto principal, para toda a família" />
            </div>
          </div>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            <div style={cardHead}><span style={dayLabel}>Quarta-feira</span><span style={tag}>Quarta-Flow</span></div>
            <Slot time="20h" title="Culto de Ensino" sub="Aprofundamento na palavra e renovo no meio da semana" />
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8 }}>
            <Link href="/aovivo" className="btn-glow" style={{ ...btnPrimarySm, padding: '14px 28px' }}>Assistir ao vivo</Link>
            <Link href="/contato" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--head)', fontWeight: 600, fontSize: 15, padding: '13px 26px', borderRadius: 99, textDecoration: 'none' }}>Como chegar →</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
