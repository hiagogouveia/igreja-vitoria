/* ============================================================
   VITÓRIA CONFERENCE 2026 · RESTORE — Landing V1
   Vanilla JS. Motion equivalents of Framer Motion:
   fade/blur reveal, parallax, glass restoration, drift,
   glow pulse, light rays, scroll reveal. Elegance > spectacle.
   ============================================================ */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Navbar scroll state ---------- */
    var nav = document.getElementById('nav');
    function onNav() { nav.classList.toggle('scrolled', window.scrollY > 40); }
    onNav();
    window.addEventListener('scroll', onNav, { passive: true });

    /* ---------- Mobile drawer ---------- */
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');
    var drawerClose = document.getElementById('drawerClose');
    function closeDrawer() { drawer.classList.remove('open'); }
    if (burger) burger.addEventListener('click', function () { drawer.classList.add('open'); });
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });

    /* ---------- Countdown → opening night 26 Aug 2026, 19:00 (BRT) ---------- */
    var target = new Date('2026-08-26T19:00:00-03:00').getTime();
    var cd = {
      days: document.querySelector('[data-cd="days"]'),
      hours: document.querySelector('[data-cd="hours"]'),
      mins: document.querySelector('[data-cd="mins"]'),
      secs: document.querySelector('[data-cd="secs"]')
    };
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function set(el, v) { if (el) { var s = pad(v); if (el.textContent !== s) el.textContent = s; } }
    function tick() {
      var diff = Math.max(0, target - Date.now());
      set(cd.days, Math.floor(diff / 86400000));
      set(cd.hours, Math.floor((diff % 86400000) / 3600000));
      set(cd.mins, Math.floor((diff % 3600000) / 60000));
      set(cd.secs, Math.floor((diff % 60000) / 1000));
    }
    tick();
    setInterval(tick, 1000);

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (o) {
          if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = '0'; }
        });
        if (open) { item.classList.remove('open'); a.style.maxHeight = '0'; }
        else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });

    /* ---------- Scroll reveals (render-loop gated) ----------
       Content is visible by default. We only switch to the
       hide-then-animate path after confirming requestAnimationFrame
       actually ticks — so nothing is ever stuck hidden in a
       paused/throttled context. */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var litEls = Array.prototype.slice.call(document.querySelectorAll('[data-lit]'));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // Manifesto: lines light up sequentially as the section enters.
    var litIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          litEls.forEach(function (l, i) { setTimeout(function () { l.classList.add('lit'); }, 200 + i * 600); });
          litIO.disconnect();
        }
      });
    }, { threshold: 0.4 });

    var frames = 0;
    function probe() {
      frames++;
      if (frames >= 2) {
        document.documentElement.classList.add('js-anim');
        revealEls.forEach(function (el) { io.observe(el); });
        var manifesto = document.querySelector('.manifesto');
        if (manifesto) litIO.observe(manifesto); else litEls.forEach(function (l) { l.classList.add('lit'); });
        setTimeout(function () {
          revealEls.forEach(function (el) {
            if (!el.classList.contains('in') && el.getBoundingClientRect().top < window.innerHeight * 0.96) el.classList.add('in');
          });
        }, 2600);
      } else { requestAnimationFrame(probe); }
    }
    if (reduce) { litEls.forEach(function (l) { l.classList.add('lit'); }); }
    else requestAnimationFrame(probe);

    /* ---------- Parallax ---------- */
    var pEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    var ticking = false;
    function applyParallax() {
      var vh = window.innerHeight;
      pEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var ratio = (r.top + r.height / 2 - vh / 2) / vh;
        var depth = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.transform = 'translate3d(0,' + (-ratio * depth * 100).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    function reqParallax() { if (!ticking && !reduce) { ticking = true; requestAnimationFrame(applyParallax); } }
    if (!reduce) {
      applyParallax();
      window.addEventListener('scroll', reqParallax, { passive: true });
      window.addEventListener('resize', reqParallax, { passive: true });
    }

    /* ---------- Modal de confirmação de ingresso (antes do checkout) ---------- */
    var buyModal = document.getElementById('buyModal');
    if (buyModal) {
      var buyLastFocus = null;
      var buyRules = buyModal.querySelectorAll('.buy-rules li');
      var openBuy = function (ticket) {
        buyRules.forEach(function (li) {
          li.classList.toggle('hl', !!ticket && li.getAttribute('data-rule') === ticket);
        });
        buyModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        buyLastFocus = document.activeElement;
      };
      var closeBuy = function () {
        buyModal.classList.remove('open');
        document.body.style.overflow = '';
        if (buyLastFocus && buyLastFocus.focus) buyLastFocus.focus();
      };
      document.querySelectorAll('[data-buy]').forEach(function (b) {
        b.addEventListener('click', function () { openBuy(b.getAttribute('data-ticket')); });
      });
      document.getElementById('buyClose').addEventListener('click', closeBuy);
      document.getElementById('buyBack').addEventListener('click', closeBuy);
      buyModal.addEventListener('click', function (e) { if (e.target === buyModal) closeBuy(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && buyModal.classList.contains('open')) closeBuy(); });
      // "Continuar para a inscrição" é o botão da e-inscrição (o widget abre o checkout);
      // aqui apenas fechamos o modal de orientação.
      document.getElementById('buyGo').addEventListener('click', closeBuy);
    }

    /* ---------- Modal de cadastro de patrocinadores ---------- */
    var sponsorModal = document.getElementById('sponsorModal');
    if (sponsorModal) {
      // Número oficial reaproveitado do link de WhatsApp já presente no rodapé
      // (sem duplicar o número no código).
      var waAnchor = document.querySelector('a[href*="wa.me/"]');
      var waDigits = waAnchor ? (waAnchor.getAttribute('href').match(/wa\.me\/(\d+)/) || [])[1] : '';

      var spForm = document.getElementById('sponsorForm');
      var spBody = document.getElementById('sponsorBody');
      var spSuccess = document.getElementById('sponsorSuccess');
      var spLastFocus = null;

      var openSponsor = function () {
        // sempre reabre no estado de formulário
        spBody.hidden = false;
        spSuccess.hidden = true;
        sponsorModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        spLastFocus = document.activeElement;
      };
      var closeSponsor = function () {
        sponsorModal.classList.remove('open');
        document.body.style.overflow = '';
        if (spLastFocus && spLastFocus.focus) spLastFocus.focus();
      };

      document.querySelectorAll('[data-sponsor]').forEach(function (b) {
        b.addEventListener('click', openSponsor);
      });
      document.getElementById('sponsorClose').addEventListener('click', closeSponsor);
      document.getElementById('sponsorBack').addEventListener('click', closeSponsor);
      document.getElementById('sponsorDone').addEventListener('click', closeSponsor);
      sponsorModal.addEventListener('click', function (e) { if (e.target === sponsorModal) closeSponsor(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sponsorModal.classList.contains('open')) closeSponsor(); });

      /* ----- Máscaras ----- */
      var spCnpj = document.getElementById('spCnpj');
      var spZap = document.getElementById('spZap');
      var spUf = document.getElementById('spUf');

      function maskCnpj(v) {
        v = v.replace(/\D/g, '').slice(0, 14);
        return v
          .replace(/^(\d{2})(\d)/, '$1.$2')
          .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }
      function maskPhone(v) {
        v = v.replace(/\D/g, '').slice(0, 11);
        if (v.length <= 10) return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
        return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
      }
      if (spCnpj) spCnpj.addEventListener('input', function () { spCnpj.value = maskCnpj(spCnpj.value); });
      if (spZap) spZap.addEventListener('input', function () { spZap.value = maskPhone(spZap.value); });
      if (spUf) spUf.addEventListener('input', function () { spUf.value = spUf.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2); });

      /* ----- Validações ----- */
      function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
      function isPhone(v) { return v.replace(/\D/g, '').length >= 10; }
      function isCNPJ(v) {
        var c = v.replace(/\D/g, '');
        if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;
        function dig(base, len) {
          var sum = 0, pos = len - 7;
          for (var i = len; i >= 1; i--) { sum += base.charAt(len - i) * pos--; if (pos < 2) pos = 9; }
          var r = sum % 11;
          return r < 2 ? 0 : 11 - r;
        }
        var d1 = dig(c, 12);
        if (d1 !== parseInt(c.charAt(12), 10)) return false;
        var d2 = dig(c, 13);
        return d2 === parseInt(c.charAt(13), 10);
      }

      function setErr(input, msg) {
        input.classList.toggle('err', !!msg);
        var holder = input.parentNode.querySelector('[data-err]');
        if (holder) holder.textContent = msg || '';
      }
      // limpa o erro ao corrigir
      spForm.querySelectorAll('.inp').forEach(function (inp) {
        inp.addEventListener('input', function () { if (inp.classList.contains('err')) setErr(inp, ''); });
      });

      function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

      spForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        function req(id, cond, msg) {
          var el = document.getElementById(id);
          var bad = !cond;
          setErr(el, bad ? msg : '');
          if (bad && ok) { ok = false; el.focus(); }
          else if (bad) ok = false;
        }
        req('spEmpresa', val('spEmpresa').length > 1, 'Informe o nome da empresa.');
        req('spCnpj', isCNPJ(val('spCnpj')), 'CNPJ inválido.');
        req('spResp', val('spResp').length > 1, 'Informe o responsável.');
        req('spZap', isPhone(val('spZap')), 'WhatsApp inválido.');
        req('spEmail', isEmail(val('spEmail')), 'E-mail inválido.');
        req('spSegmento', val('spSegmento').length > 1, 'Informe o segmento.');
        req('spCidade', val('spCidade').length > 1, 'Informe a cidade.');
        req('spUf', val('spUf').length === 2, 'UF inválida.');
        if (!ok) return;

        var linha = function (rotulo, valor) { return '• ' + rotulo + ': ' + (valor || '—'); };
        var msg = [
          'Olá!',
          'Tenho interesse em patrocinar a VitóriaCon 2026.',
          '',
          'Segue os dados da empresa:',
          linha('Empresa', val('spEmpresa')),
          linha('CNPJ', val('spCnpj')),
          linha('Responsável', val('spResp')),
          linha('WhatsApp', val('spZap')),
          linha('E-mail', val('spEmail')),
          linha('Segmento', val('spSegmento')),
          linha('Cidade', val('spCidade')),
          linha('Estado', val('spUf')),
          linha('Instagram/Site', val('spLink')),
          linha('Observações', val('spMsg')),
          '',
          'Gostaria de receber mais informações sobre o espaço para patrocinadores.'
        ].join('\n');

        if (waDigits) window.open('https://wa.me/' + waDigits + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');

        spBody.hidden = true;
        spSuccess.hidden = false;
      });
    }
  });
})();
