/* ============================================================
   CONFERÊNCIA CÉUS ABERTOS 2026 — Igreja Vitória
   Vanilla JS, sem dependências. Reveal on scroll + inscrição.
   A inscrição é gratuita: o formulário valida e entrega os dados
   no WhatsApp oficial (mesmo padrão já usado no restante do site).
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP = '5567998318450'; // número oficial (src/lib/site-data.ts)

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Reveal on scroll (gated pelo render loop) ----------
       O conteúdo é visível por padrão; só entramos no caminho
       "esconde e anima" depois de confirmar que o rAF realmente
       roda, para nada ficar preso invisível. */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!reduce && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      var frames = 0;
      (function probe() {
        frames++;
        if (frames >= 2) {
          document.documentElement.classList.add('js-anim');
          revealEls.forEach(function (el) { io.observe(el); });
          // rede de segurança: nada fica escondido se o observer não disparar
          setTimeout(function () {
            revealEls.forEach(function (el) {
              if (!el.classList.contains('in') && el.getBoundingClientRect().top < window.innerHeight * 0.96) {
                el.classList.add('in');
              }
            });
          }, 2600);
        } else { requestAnimationFrame(probe); }
      })();
    }

    /* ---------- Inscrição gratuita ---------- */
    var form = document.getElementById('inscForm');
    if (!form) return;

    var fNome = document.getElementById('fNome');
    var fZap = document.getElementById('fZap');
    var fCidade = document.getElementById('fCidade');
    var fSister = document.getElementById('fSister');
    var formNote = document.getElementById('formNote');

    function maskPhone(v) {
      v = v.replace(/\D/g, '').slice(0, 11);
      if (v.length <= 10) return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
      return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    }
    fZap.addEventListener('input', function () { fZap.value = maskPhone(fZap.value); });

    function setErr(input, msg) {
      input.classList.toggle('err', !!msg);
      var holder = input.parentNode.querySelector('[data-err]');
      if (holder) holder.textContent = msg || '';
    }
    form.querySelectorAll('.inp').forEach(function (inp) {
      inp.addEventListener('input', function () { if (inp.classList.contains('err')) setErr(inp, ''); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      function req(el, cond, msg) {
        var bad = !cond;
        setErr(el, bad ? msg : '');
        if (bad) { if (ok) el.focus(); ok = false; }
      }
      req(fNome, fNome.value.trim().length > 2, 'Informe seu nome completo.');
      req(fZap, fZap.value.replace(/\D/g, '').length >= 10, 'Informe um WhatsApp válido.');
      req(fCidade, fCidade.value.trim().length > 1, 'Informe sua cidade.');
      if (!ok) return;

      var linha = function (rotulo, valor) { return '• ' + rotulo + ': ' + (valor || 'Não informado'); };
      var msg = [
        'Olá! Quero fazer minha inscrição na Conferência Céus Abertos 2026.',
        '',
        linha('Nome', fNome.value.trim()),
        linha('WhatsApp', fZap.value.trim()),
        linha('Cidade', fCidade.value.trim()),
        linha('Sister (sábado, 18h)', fSister.value),
        '',
        '25, 26 e 27 de setembro · Campo Grande · Entrada gratuita'
      ].join('\n');

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');

      if (formNote) {
        formNote.className = 'form-ok';
        formNote.textContent = 'Abrimos o WhatsApp da Igreja Vitória com seus dados. É só enviar a mensagem para concluir sua inscrição.';
      }
    });
  });
})();
