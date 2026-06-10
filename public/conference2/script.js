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
   HERO V2 — reprodutor de sequência de imagens (canvas + rAF)
   40 frames em loop infinito simulando vídeo. Preload completo,
   fallback no 1º frame, sem flicker/tela branca, desktop + mobile.
   ============================================================ */
(function () {
  'use strict';
  var canvas = document.getElementById('heroSeq');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var FRAME_COUNT = 40;
  var FPS = 6;                        // slow-motion cinematográfico: 6fps → loop de ~6.7s
  var frameDuration = 1000 / FPS;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pad(n) { return ('00' + n).slice(-3); }
  function srcFor(i) { return 'frames/frame-' + pad(i + 1) + '.jpg'; }

  var images = new Array(FRAME_COUNT);
  var loaded = 0, ready = false, current = 0, rafId = null, lastTime = 0, acc = 0;

  function resize() {
    var w = canvas.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    var img = images[current];
    if (img && img.complete && img.naturalWidth) drawCover(img);
  }

  // Enquadramento: os frames são um vídeo do pôster (texto embutido à
  // esquerda + marca "Veo" no canto). Damos zoom e focamos à direita para
  // mostrar a restauração (vidro → pomba) e cortar o texto/marca embutidos,
  // deixando o lado esquerdo livre para o conteúdo do hero.
  var ZOOM = 1.5, FOCUS_X = 0.92, FOCUS_Y = 0.42;
  function drawCover(img) {
    if (!img || !img.naturalWidth) return;
    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var scale = Math.max(cw / iw, ch / ih) * ZOOM;
    var dw = iw * scale, dh = ih * scale;
    ctx.drawImage(img, (cw - dw) * FOCUS_X, (ch - dh) * FOCUS_Y, dw, dh);
  }

  function loop(t) {
    if (!lastTime) lastTime = t;
    acc += t - lastTime;
    lastTime = t;
    if (acc >= frameDuration) {
      var steps = Math.min(Math.floor(acc / frameDuration), 3); // evita "spiral" após blur
      current = (current + steps) % FRAME_COUNT;
      acc %= frameDuration;
      drawCover(images[current]);
    }
    rafId = requestAnimationFrame(loop);
  }

  function start() { if (rafId || reduce) return; lastTime = 0; acc = 0; rafId = requestAnimationFrame(loop); }
  function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  function onLoaded(idx, img) {
    loaded++;
    if (idx === 0) { resize(); drawCover(img); }      // 1º frame imediato (fallback)
    if (loaded >= FRAME_COUNT && !ready) {
      ready = true;
      if (reduce) drawCover(images[0]); else start(); // só inicia com todos prontos
    }
  }

  for (var i = 0; i < FRAME_COUNT; i++) {
    (function (idx) {
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () { onLoaded(idx, im); };
      im.onerror = function () { onLoaded(idx, im); };
      im.src = srcFor(idx);
      images[idx] = im;
    })(i);
  }

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else if (ready && !reduce) start();
  });
})();
