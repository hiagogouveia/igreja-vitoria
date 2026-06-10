import { useEffect } from 'react';

/**
 * Reveal-on-scroll. Adds `.in` to any `.reveal` element once it enters the
 * viewport. Elements already near the top on mount are revealed immediately so
 * nothing stays invisible after a route change. Re-runs whenever `deps` change.
 */
export default function useReveal(deps = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal:not(.in)'));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const raf = requestAnimationFrame(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92) el.classList.add('in');
        else io.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
