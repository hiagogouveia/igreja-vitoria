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

    /* ---------- Hero glass restoration ---------- */
    // The shattered-glass overlay heals shortly after load → Broken→Restore in the hero itself.
    var hero = document.querySelector('.hero');
    if (hero) {
      setTimeout(function () { hero.classList.add('healed'); }, reduce ? 0 : 900);
    }

    /* ---------- Countdown → opening night 28 Aug 2026, 19:00 (BRT) ---------- */
    var target = new Date('2026-08-28T19:00:00-03:00').getTime();
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

    /* ---------- Checkout modal ---------- */
    var modal = document.getElementById('checkoutModal');
    var modalForm = document.getElementById('modalForm');
    var modalSuccess = document.getElementById('modalSuccess');
    var mTier = document.getElementById('mTier');
    var mPrice = document.getElementById('mPrice');
    var lastFocus = null;

    function clearErrors() {
      ['Name', 'Email', 'Phone'].forEach(function (k) {
        var i = document.getElementById('m' + k), e = document.getElementById('e' + k);
        if (i) i.classList.remove('err'); if (e) e.textContent = '';
      });
    }
    function openCheckout(tier, price) {
      mTier.textContent = tier || 'Founders';
      mPrice.textContent = price || 'R$149';
      modalForm.style.display = ''; modalSuccess.style.display = 'none';
      clearErrors();
      modal.classList.add('open'); document.body.style.overflow = 'hidden';
      lastFocus = document.activeElement;
      setTimeout(function () { var n = document.getElementById('mName'); if (n) n.focus(); }, 350);
    }
    function closeCheckout() {
      modal.classList.remove('open'); document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    document.querySelectorAll('[data-checkout]').forEach(function (b) {
      b.addEventListener('click', function () { openCheckout(b.getAttribute('data-tier'), b.getAttribute('data-price')); });
    });
    document.getElementById('modalClose').addEventListener('click', closeCheckout);
    var mDone = document.getElementById('mDone');
    if (mDone) mDone.addEventListener('click', closeCheckout);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeCheckout(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeCheckout(); });

    document.getElementById('mSubmit').addEventListener('click', function () {
      clearErrors();
      var name = document.getElementById('mName'), email = document.getElementById('mEmail'), phone = document.getElementById('mPhone');
      var ok = true;
      if (!name.value.trim()) { name.classList.add('err'); document.getElementById('eName').textContent = 'Informe seu nome'; ok = false; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) { email.classList.add('err'); document.getElementById('eEmail').textContent = 'E-mail inválido'; ok = false; }
      if (phone.value.replace(/\D/g, '').length < 10) { phone.classList.add('err'); document.getElementById('ePhone').textContent = 'WhatsApp inválido'; ok = false; }
      if (!ok) return;
      modalForm.style.display = 'none'; modalSuccess.style.display = '';
    });
  });
})();

/* ============================================================
   HERO V3 — sequência CONTROLADA PELO SCROLL (scroll-driven)
   A hero fica "presa" (sticky) numa seção alta; conforme o scroll
   avança, os 40 frames evoluem (vidro quebrado → restauração → pomba).
   Estratégia: sticky (pin) + scroll/rAF + canvas (cover com foco/zoom).
   Frames reaproveitados de /conference2/frames (sem duplicar assets).
   Fallback: 1º frame estático (poster + preload) se o JS não rodar.
   ============================================================ */
(function () {
  'use strict';
  var canvas = document.getElementById('heroSeq');
  var section = document.querySelector('.hero-scroll');
  if (!canvas || !canvas.getContext || !section) return;
  var ctx = canvas.getContext('2d');

  var FRAME_COUNT = 40;
  var BASE = '/conference2/frames/frame-';   // reaproveita os frames da V2
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Mesmo enquadramento da V2: corta texto/marca embutidos, foca a restauração.
  var ZOOM = 1.5, FOCUS_X = 0.92, FOCUS_Y = 0.42;

  function pad(n) { return ('00' + n).slice(-3); }
  function srcFor(i) { return BASE + pad(i + 1) + '.jpg'; }

  var images = new Array(FRAME_COUNT);
  var loadedFlags = new Array(FRAME_COUNT);
  var loaded = 0, current = -1, ticking = false;

  function drawCover(img) {
    if (!img || !img.naturalWidth) return;
    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var scale = Math.max(cw / iw, ch / ih) * ZOOM;
    var dw = iw * scale, dh = ih * scale;
    ctx.drawImage(img, (cw - dw) * FOCUS_X, (ch - dh) * FOCUS_Y, dw, dh);
  }

  // Procura o frame carregado mais próximo (≤ alvo) para nunca ficar em branco.
  function nearestLoaded(idx) {
    for (var i = idx; i >= 0; i--) if (loadedFlags[i]) return images[i];
    for (var j = idx + 1; j < FRAME_COUNT; j++) if (loadedFlags[j]) return images[j];
    return null;
  }

  function progress() {
    var rect = section.getBoundingClientRect();
    var total = section.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    var p = (-rect.top) / total;
    return p < 0 ? 0 : (p > 1 ? 1 : p);
  }

  function render() {
    ticking = false;
    var idx = Math.round(progress() * (FRAME_COUNT - 1));
    if (idx === current) return;
    var img = loadedFlags[idx] ? images[idx] : nearestLoaded(idx);
    if (img) { drawCover(img); current = idx; updatePhase(idx / (FRAME_COUNT - 1)); }
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }

  function resize() {
    canvas.width = Math.max(1, Math.round((canvas.clientWidth || window.innerWidth) * dpr));
    canvas.height = Math.max(1, Math.round((canvas.clientHeight || window.innerHeight) * dpr));
    current = -1; render();
  }

  // Bônus: o chip de fase acompanha a restauração (Broken → Restoration → Restore).
  var chip = document.querySelector('.hero .phase-chip');
  function updatePhase(p) {
    if (!chip) return;
    var label, cls;
    if (p < 0.4) { label = 'Fase · Broken'; cls = 'pc-broken'; }
    else if (p < 0.78) { label = 'Fase · Restoration'; cls = 'pc-restoration'; }
    else { label = 'Fase · Restore'; cls = 'pc-restore'; }
    if (chip.getAttribute('data-phase') === cls) return;
    chip.setAttribute('data-phase', cls);
    chip.className = 'phase-chip ' + cls;
    chip.innerHTML = '<span class="dot"></span>' + label;
  }

  // Preload de todos os frames; desenha o 1º assim que chegar (fallback vivo).
  for (var i = 0; i < FRAME_COUNT; i++) {
    (function (idx) {
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () { loadedFlags[idx] = true; loaded++; if (idx === 0 && current < 0) { resize(); } else if (idx === current) drawCover(im); };
      im.onerror = function () { loaded++; };
      im.src = srcFor(idx);
      images[idx] = im;
    })(i);
  }

  resize();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
})();
