/* ============================================================
   LINE-UP · animação cinematográfica ligada ao scroll (GSAP ScrollTrigger)
   Onda por linha: esquerda → centro → direita. Cada card sobe ~120px,
   sai do blur, ganha opacidade e vai de scale .96 → 1. Scrub real-time
   (reversível ao subir). Mobile: distância/blur reduzidos.
   Fallback: sem GSAP ou reduced-motion, os cards ficam visíveis (CSS padrão).
   ============================================================ */
(function () {
  'use strict';

  function init() {
    if (!window.gsap || !window.ScrollTrigger) return;            // fallback: cards visíveis
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    var grid = document.querySelector('.lineup-grid');
    if (!grid) return;

    // Agrupa os cards em linhas pela posição vertical (responsivo: 4/3/2 colunas)
    function buildRows() {
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.speaker'));
      var byTop = {};
      cards.forEach(function (c) {
        var key = Math.round(c.offsetTop / 6);
        (byTop[key] = byTop[key] || []).push(c);
      });
      return Object.keys(byTop)
        .map(Number).sort(function (a, b) { return a - b; })
        .map(function (k) {
          return byTop[k].sort(function (a, b) { return a.offsetLeft - b.offsetLeft; });
        });
    }

    function makeSetup(dist, blur) {
      return function () {
        var rows = buildRows();
        rows.forEach(function (row) {
          gsap.fromTo(row,
            { y: dist, autoAlpha: 0, scale: 0.96, filter: 'blur(' + blur + 'px)' },
            {
              y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)',
              ease: 'power2.out', stagger: 0.12,
              scrollTrigger: {
                trigger: row[0],
                start: 'top 88%',
                end: 'top 50%',
                scrub: 1.2
              }
            }
          );
        });
      };
    }

    // Breakpoints alinhados ao grid: 4 col (>1080) · 3 col (721–1080) · 2 col (≤720)
    var mm = gsap.matchMedia();
    mm.add('(min-width:1081px)', makeSetup(120, 8));
    mm.add('(min-width:721px) and (max-width:1080px)', makeSetup(120, 8));
    mm.add('(max-width:720px)', makeSetup(60, 3));

    // Posições corretas após o load (fontes/imagens)
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
