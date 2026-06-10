'use client';

import { useEffect, useState } from 'react';
import { services } from '@/lib/site-data';

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const pad = (n: number) => String(n).padStart(2, '0');

type CD = { days: string; hours: string; mins: string; secs: string; label: string; date: string };

function nextService(now: Date) {
  let best: { t: Date; label: string } | null = null;
  for (let add = 0; add < 14; add++) {
    const d = new Date(now);
    d.setDate(now.getDate() + add);
    for (const [day, h, m, label] of services) {
      if (d.getDay() === day) {
        const t = new Date(d);
        t.setHours(h, m, 0, 0);
        if (t.getTime() > now.getTime() && (!best || t.getTime() < best.t.getTime())) best = { t, label };
      }
    }
  }
  return best;
}

function compute(nowMs: number): CD {
  const ns = nextService(new Date(nowMs));
  if (!ns) return { days: '00', hours: '00', mins: '00', secs: '00', label: 'Culto da Família', date: 'Domingo 18h' };
  let diff = Math.max(0, ns.t.getTime() - nowMs);
  const dd = Math.floor(diff / 86400000); diff -= dd * 86400000;
  const hh = Math.floor(diff / 3600000); diff -= hh * 3600000;
  const mm = Math.floor(diff / 60000); diff -= mm * 60000;
  const ss = Math.floor(diff / 1000);
  return { days: pad(dd), hours: pad(hh), mins: pad(mm), secs: pad(ss), label: ns.label, date: `${WEEKDAYS[ns.t.getDay()]} ${pad(ns.t.getHours())}h` };
}

export default function Countdown({ dark = false }: { dark?: boolean }) {
  // Start null to avoid SSR/client hydration mismatch on time-based values.
  const [cd, setCd] = useState<CD | null>(null);

  useEffect(() => {
    setCd(compute(Date.now()));
    const id = setInterval(() => setCd(compute(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  const c = cd ?? { days: '--', hours: '--', mins: '--', secs: '--', label: 'Próximo culto', date: '' };
  const boxBg = dark ? 'var(--void)' : 'var(--s1)';

  return (
    <div style={{ background: dark ? 'var(--s1)' : 'var(--void)', border: '1px solid var(--border)', borderRadius: 18, padding: 26 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 6 }}>Próximo culto</div>
      <div style={{ fontFamily: 'var(--head)', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>
        {c.label}<span style={{ color: 'var(--glow)' }}>{c.date ? ` · ${c.date}` : ''}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {([['Dias', c.days], ['Horas', c.hours], ['Min', c.mins], ['Seg', c.secs]] as const).map(([lbl, val]) => (
          <div key={lbl} style={{ background: boxBg, border: '1px solid var(--border)', borderRadius: 12, padding: '14px 6px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, color: 'var(--glow)', lineHeight: 1 }}>{val}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)', marginTop: 5 }}>{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
