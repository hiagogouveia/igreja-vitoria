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

    /* ---------- Camada inteligente de validação de ingressos (antes do checkout) ----------
       Cada ingresso tem sua própria CONFIGURAÇÃO (regras, campos, validação, evento).
       Adicionar/alterar um ingresso no futuro = mexer só em TICKETS — sem duplicar lógica.
       Fluxo: clique no card → valida → abre EXATAMENTE o Event ID correspondente.
       A integração da e-inscrição é reaproveitada: os data-attrs de infra ficam no
       #eiLauncher (idênticos aos anteriores) e só o Event ID muda por ingresso. */
    var tkModal = document.getElementById('tkModal');
    var eiLauncher = document.getElementById('eiLauncher');
    if (tkModal && eiLauncher) {
      var UF_LIST = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

      // Abre o widget do evento pedido. O widget da e-inscrição escuta cliques no
      // document e lê data-einscricao-event do alvo; então definimos o evento no
      // lançador oculto e disparamos um clique que borbulha até o document.
      // (dispatchEvent é usado no lugar de .click() porque um elemento hidden não
      // propaga .click() até o listener global do widget.)
      var openEvent = function (eventId) {
        eiLauncher.setAttribute('data-einscricao-event', eventId);
        eiLauncher.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      };

      // ---- Configuração declarativa por ingresso (fonte única da verdade) ----
      var TICKETS = {
        // Founders: sem validação → abre direto (o limite de 100 é controlado na e-inscrição).
        founders: { event: '132317' },
        // Legacy: mesmo público do Founders (geral, acima de 18 anos) → sem validação.
        legacy: { event: '133336' },
        winners: {
          event: '133005',
          title: 'Ingresso Winners',
          intro: 'O Winners é destinado a participantes de 13 a 18 anos. Confirme a idade para continuar.',
          fields: [{ key: 'age', label: 'Qual é a idade do participante?', type: 'number', min: 0, max: 120, placeholder: 'Ex.: 15' }],
          validate: function (v) {
            var a = parseInt(v.age, 10);
            if (isNaN(a)) return 'Informe a idade do participante.';
            if (a < 13 || a > 18) return 'O ingresso Winners é exclusivo para participantes de 13 a 18 anos. Para outras idades, escolha o ingresso correspondente.';
            return null;
          }
        },
        family: {
          event: '133006',
          title: 'Ingresso Family',
          intro: 'O Family vale para famílias com no mínimo 3 participantes pagantes da mesma família.',
          fields: [{ key: 'qtd', label: 'Quantos participantes pagantes da mesma família irão participar?', type: 'number', min: 1, max: 50, placeholder: 'Ex.: 4' }],
          validate: function (v) {
            var n = parseInt(v.qtd, 10);
            if (isNaN(n)) return 'Informe a quantidade de participantes pagantes.';
            if (n < 3) return 'O ingresso Family exige no mínimo 3 participantes pagantes da mesma família. Para menos pessoas, o ingresso Founders é o ideal.';
            return null;
          }
        },
        kids: {
          event: '133008',
          title: 'Espaço Kids',
          intro: 'O Kids é gratuito e exclusivo para crianças de até 12 anos. Informe quantas crianças e a idade de cada uma.',
          fields: [{ key: 'count', label: 'Quantas crianças irão participar?', type: 'number', min: 1, max: 10, placeholder: 'Ex.: 2', ages: true }],
          validate: function (v) {
            var n = parseInt(v.count, 10);
            if (isNaN(n) || n < 1) return 'Informe quantas crianças irão participar.';
            for (var i = 0; i < n; i++) {
              var a = parseInt(v['age' + i], 10);
              if (isNaN(a)) return 'Informe a idade de todas as crianças.';
              if (a > 12) return 'O Espaço Kids é exclusivo para crianças de até 12 anos. Para 13 anos ou mais, o ingresso Winners é o indicado.';
            }
            return null;
          }
        },
        caravana: {
          event: '133007',
          title: 'Caravana',
          intro: 'A Caravana é para grupos de uma mesma igreja. Preencha os dados abaixo para confirmarmos o grupo.',
          fields: [
            { key: 'igreja', label: 'Nome da igreja', type: 'text', placeholder: 'Ex.: Igreja Vitória' },
            { key: 'cidade', label: 'Cidade', type: 'text', placeholder: 'Ex.: Campo Grande' },
            { key: 'estado', label: 'Estado', type: 'select', options: UF_LIST, placeholder: 'UF' },
            { key: 'qtd', label: 'Quantidade aproximada de participantes', type: 'number', min: 1, placeholder: 'Ex.: 20' }
          ],
          // Sem validação de quantidade: os dados só confirmam que se trata de uma caravana.
          validate: function (v) {
            if (!v.igreja) return 'Informe o nome da igreja.';
            if (!v.cidade) return 'Informe a cidade.';
            if (!v.estado) return 'Selecione o estado.';
            if (!v.qtd) return 'Informe a quantidade aproximada de participantes.';
            return null;
          }
        }
      };

      var tkFields = document.getElementById('tkFields');
      var tkTitle = document.getElementById('tkTitle');
      var tkIntro = document.getElementById('tkIntro');
      var tkAlert = document.getElementById('tkAlert');
      var tkSubmit = document.getElementById('tkSubmit');
      var tkForm = document.getElementById('tkForm');
      var tkLastFocus = null;
      var currentCfg = null;

      var showAlert = function (msg) { tkAlert.textContent = msg; tkAlert.hidden = false; };
      var hideAlert = function () { tkAlert.hidden = true; tkAlert.textContent = ''; };

      // Monta o HTML de um campo a partir da config (input, number ou select).
      var fieldHTML = function (f) {
        var id = 'tk_' + f.key, inner;
        if (f.type === 'select') {
          var opts = '<option value="" disabled selected>' + (f.placeholder || 'Selecione') + '</option>' +
            f.options.map(function (o) { return '<option value="' + o + '">' + o + '</option>'; }).join('');
          inner = '<select class="inp" id="' + id + '" name="' + f.key + '">' + opts + '</select>';
        } else {
          var attrs = 'type="' + f.type + '"';
          if (f.type === 'number') attrs += ' inputmode="numeric"';
          if (f.min != null) attrs += ' min="' + f.min + '"';
          if (f.max != null) attrs += ' max="' + f.max + '"';
          if (f.placeholder) attrs += ' placeholder="' + f.placeholder + '"';
          inner = '<input class="inp" id="' + id + '" name="' + f.key + '" ' + attrs + '>';
        }
        return '<div class="fld"><label for="' + id + '">' + f.label + '</label>' + inner + '</div>';
      };

      // Renderiza os campos do ingresso e, no Kids, gera as idades conforme a quantidade.
      var renderFields = function (cfg) {
        tkFields.innerHTML = cfg.fields.map(fieldHTML).join('');
        var ageField = cfg.fields.filter(function (f) { return f.ages; })[0];
        if (ageField) {
          var countEl = document.getElementById('tk_' + ageField.key);
          var host = document.createElement('div');
          host.className = 'tk-ages';
          countEl.closest('.fld').insertAdjacentElement('afterend', host);
          var syncAges = function () {
            var max = ageField.max || 10;
            var n = Math.max(0, Math.min(parseInt(countEl.value, 10) || 0, max));
            var cur = host.querySelectorAll('.fld').length;
            for (var k = cur - 1; k >= n; k--) { if (host.children[k]) host.children[k].remove(); } // remove excedente (preserva o que já foi digitado)
            for (var i = cur; i < n; i++) {
              host.insertAdjacentHTML('beforeend',
                '<div class="fld"><label for="tk_age' + i + '">Idade da criança ' + (i + 1) + '</label>' +
                '<input class="inp" id="tk_age' + i + '" name="age' + i + '" type="number" inputmode="numeric" min="0" max="12" placeholder="Até 12"></div>');
            }
            hideAlert();
          };
          countEl.addEventListener('input', syncAges);
        }
        // some com a mensagem ao editar qualquer campo
        tkFields.addEventListener('input', hideAlert);
        tkFields.addEventListener('change', hideAlert);
      };

      var openTicket = function (slug) {
        var cfg = TICKETS[slug];
        if (!cfg) return;
        if (!cfg.fields) { openEvent(cfg.event); return; } // Founders: abre direto, sem validação
        currentCfg = cfg;
        tkTitle.textContent = cfg.title;
        tkIntro.textContent = cfg.intro;
        hideAlert();
        renderFields(cfg);
        tkModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        tkLastFocus = document.activeElement;
        var first = tkFields.querySelector('.inp');
        if (first) setTimeout(function () { first.focus(); }, 60);
      };
      var closeTicket = function () {
        tkModal.classList.remove('open');
        document.body.style.overflow = '';
        if (tkLastFocus && tkLastFocus.focus) tkLastFocus.focus();
      };

      tkForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!currentCfg) return;
        var v = {};
        tkFields.querySelectorAll('.inp').forEach(function (inp) { v[inp.name] = (inp.value || '').trim(); });
        var err = currentCfg.validate ? currentCfg.validate(v) : null;
        if (err) { showAlert(err); return; }
        closeTicket();
        openEvent(currentCfg.event); // aprovado → abre o evento correspondente
      });

      document.getElementById('tkClose').addEventListener('click', closeTicket);
      document.getElementById('tkBack').addEventListener('click', closeTicket);
      tkModal.addEventListener('click', function (e) { if (e.target === tkModal) closeTicket(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && tkModal.classList.contains('open')) closeTicket(); });

      /* Disponibilidade de lotes (genérico): tudo derivado de data-availability no .tk.
         Estados: available (padrão) · coming-soon · unavailable · sold-out.
         Reativar/mudar um lote = só trocar o atributo no card. */
      var UNAVAIL_MSG = {
        'coming-soon': 'Este ingresso estará disponível em outro momento.',
        'unavailable': 'Este ingresso não está disponível no momento.',
        'sold-out': 'As vagas deste ingresso se esgotaram.'
      };
      var UNAVAIL_BTN_LABEL = {
        'coming-soon': 'Em breve',
        'unavailable': 'Indisponível',
        'sold-out': 'Esgotado'
      };
      var soldState = function (el) {
        var card = el.closest ? el.closest('.tk[data-availability]') : null;
        var st = card && card.getAttribute('data-availability');
        return st && st !== 'available' ? st : null;
      };
      document.querySelectorAll('.tk[data-availability]').forEach(function (card) {
        var st = card.getAttribute('data-availability');
        if (!st || st === 'available') return;
        var btn = card.querySelector('[data-buy]');
        if (btn) {
          btn.setAttribute('aria-disabled', 'true');
          btn.setAttribute('tabindex', '-1');
          // texto do botão passa a dizer o motivo (em vez de manter "Comprar" cinza sem contexto)
          var label = UNAVAIL_BTN_LABEL[st];
          if (label) btn.textContent = (st === 'sold-out' && card.classList.contains('featured')) ? 'Vagas Encerradas' : label;
        }
        if (!card.getAttribute('title')) card.setAttribute('title', UNAVAIL_MSG[st] || UNAVAIL_MSG['coming-soon']);
      });
      document.querySelectorAll('[data-buy]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          if (soldState(b)) { e.preventDefault(); return; } // lote indisponível → não abre nada
          var slug = b.getAttribute('data-ticket');
          if (slug) openTicket(slug);
        });
      });
    }

    /* ---------- Almoço Especial (sábado): abre direto o checkout do evento (sem validação,
       mesmo padrão do Founders/Legacy) — reaproveita o #eiLauncher/openEvent já existente. */
    var lunchCta = document.getElementById('lunchCta');
    if (lunchCta && typeof openEvent === 'function') {
      lunchCta.addEventListener('click', function () { openEvent('135118'); });
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
