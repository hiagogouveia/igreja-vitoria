import { useEffect, useState } from 'react';
import { services } from './data';

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const pad = (n) => String(n).padStart(2, '0');

function nextService(now) {
  let best = null;
  for (let add = 0; add < 14; add++) {
    const d = new Date(now);
    d.setDate(now.getDate() + add);
    for (const [day, h, m, label] of services) {
      if (d.getDay() === day) {
        const t = new Date(d);
        t.setHours(h, m, 0, 0);
        if (t.getTime() > now.getTime() && (!best || t.getTime() < best.t.getTime())) {
          best = { t, label };
        }
      }
    }
  }
  return best;
}

function compute(nowMs) {
  const ns = nextService(new Date(nowMs));
  if (!ns) {
    return { days: '00', hours: '00', mins: '00', secs: '00', label: 'Culto da Família', date: 'Domingo 18h' };
  }
  let diff = Math.max(0, ns.t.getTime() - nowMs);
  const dd = Math.floor(diff / 86400000); diff -= dd * 86400000;
  const hh = Math.floor(diff / 3600000); diff -= hh * 3600000;
  const mm = Math.floor(diff / 60000); diff -= mm * 60000;
  const ss = Math.floor(diff / 1000);
  return {
    days: pad(dd), hours: pad(hh), mins: pad(mm), secs: pad(ss),
    label: ns.label,
    date: `${WEEKDAYS[ns.t.getDay()]} ${pad(ns.t.getHours())}h`,
  };
}

/** Live countdown to the next real church service. Ticks every second. */
export default function useCountdown() {
  const [countdown, setCountdown] = useState(() => compute(Date.now()));

  useEffect(() => {
    const id = setInterval(() => setCountdown(compute(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return countdown;
}
