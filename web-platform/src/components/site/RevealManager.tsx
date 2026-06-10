'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Progressive-enhancement reveal-on-scroll. Adds `.js-reveal` to <html> so the
 * hidden state only kicks in once JS is running (SSR/crawlers see content).
 * Reveals `.reveal` elements as they enter the viewport, and re-checks on
 * scroll/resize so nothing can stay stuck hidden. Re-scans on route change.
 */
export default function RevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js-reveal');

    const revealInView = () => {
      const margin = window.innerHeight * 0.92;
      document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < margin) el.classList.add('in');
      });
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.1 },
    );

    let raf = 0;
    const scan = () => {
      revealInView();
      document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach((el) => io.observe(el));
    };
    raf = requestAnimationFrame(scan);

    const onChange = () => revealInView();
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, [pathname]);

  return null;
}
