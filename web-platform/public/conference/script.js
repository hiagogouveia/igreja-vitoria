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
      mPrice.textContent = price || 'R$159';
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
