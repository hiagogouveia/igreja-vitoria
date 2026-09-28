/* ============================================================
   CONFERÊNCIA CÉUS ABERTOS 2026 — Igreja Vitória
   Vanilla JS, sem dependências. Reveal on scroll + testemunhos.
   A conferência já aconteceu: o formulário desta página recolhe os
   testemunhos e grava na aba "Testemunhos" da planilha.
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP = '5567998318450'; // número oficial (src/lib/site-data.ts)

  /* Endpoint do Apps Script ligado à planilha do Drive. Enviamos como
     form-urlencoded de propósito: é uma "simple request", então não dispara
     preflight CORS, que o Apps Script não responde. Se a URL da implantação
     mudar, é só trocar aqui. */
  var INSCRICAO_URL = 'https://script.google.com/macros/s/AKfycbwTMAjrbR4CH8uhM6WUmjAm1GFQmzPCudRzaszOUDgw3Ush8IHJYpNkdw-_Wi6WYDuicg/exec';

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

    /* ---------- Testemunhos ----------
       Envio independente da inscrição: grava na aba "Testemunhos" pelo mesmo
       Apps Script (destino=testemunho). */
    (function testemunhos() {
      var f = document.getElementById('testForm');
      if (!f) return;
      var fNome = document.getElementById('tNome');
      var fZap = document.getElementById('tZap');
      var fTexto = document.getElementById('tTexto');
      var fSugestao = document.getElementById('tSugestao');
      var fComp = document.getElementById('tCompartilhar');
      var nota = document.getElementById('testNote');
      var notaOriginal = nota ? nota.textContent : '';
      var tela = document.getElementById('testOk');
      var telaTitulo = document.getElementById('testOkTitle');
      var telaMsg = document.getElementById('testOkMsg');
      var botaoOutro = document.getElementById('testOutro');
      var btn = f.querySelector('button[type="submit"]');
      var campos = Array.prototype.filter.call(f.children, function (el) { return el !== tela; });

      /* O campo de elogio/sugestão só aparece quando o servidor confirma que
         tem onde guardá-lo; senão a pessoa escreveria e nada seria gravado. */
      var campoSugestao = document.getElementById('fldSugestao');
      fetch(INSCRICAO_URL)
        .then(function (r) { return r.json(); })
        .then(function (res) { if (res && res.aceitaSugestao && campoSugestao) campoSugestao.hidden = false; })
        .catch(function () { /* sem resposta: o campo fica escondido */ });

      function erro(el, msg) {
        el.classList.toggle('err', !!msg);
        var holder = el.parentNode.querySelector('[data-err]');
        if (holder) holder.textContent = msg || '';
      }
      f.querySelectorAll('.inp').forEach(function (inp) {
        var limpa = function () { if (inp.classList.contains('err')) erro(inp, ''); };
        inp.addEventListener('input', limpa);
        inp.addEventListener('change', limpa);
      });
      fZap.addEventListener('input', function () {
        var v = fZap.value.replace(/\D/g, '').slice(0, 11);
        fZap.value = v.length <= 10
          ? v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
          : v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
      });

      function enviando(estado) {
        if (!btn) return;
        btn.disabled = estado;
        btn.style.opacity = estado ? '.6' : '';
        btn.style.cursor = estado ? 'progress' : '';
        btn.textContent = estado ? 'Enviando...' : 'Enviar meu testemunho';
      }
      function aviso(texto, classe) {
        if (!nota) return;
        nota.className = classe || 'form-note';
        nota.textContent = texto;
      }
      function concluir(nome) {
        telaTitulo.textContent = 'Obrigado, ' + nome + '!';
        telaMsg.textContent = 'Seu testemunho chegou para a equipe da Igreja Vitória. Que bom poder celebrar isso com você.';
        f.reset();
        f.querySelectorAll('.inp').forEach(function (i) { erro(i, ''); });
        enviando(false);
        aviso(notaOriginal, 'form-note');
        tela.classList.remove('saindo');
        tela.hidden = false;
        campos.forEach(function (el) { el.inert = true; });
        if (tela.scrollHeight > f.offsetHeight) f.style.minHeight = tela.scrollHeight + 'px';
        var nav = document.getElementById('nav');
        window.scrollTo({
          top: f.getBoundingClientRect().top + window.pageYOffset - (nav ? nav.offsetHeight : 0) - 16,
          behavior: reduce ? 'auto' : 'smooth'
        });
        telaTitulo.focus({ preventScroll: true });
      }
      function falhar() {
        enviando(false);
        var texto = ['Olá! Quero deixar meu testemunho da Conferência Céus Abertos.', '',
          '• Nome: ' + fNome.value.trim(), '', fTexto.value.trim()].join('\n');
        aviso('Não conseguimos enviar agora. Toque aqui para mandar pelo WhatsApp.', 'form-err');
        if (nota) {
          nota.style.cursor = 'pointer';
          nota.onclick = function () {
            window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
          };
        }
      }

      botaoOutro.addEventListener('click', function () {
        var fechar = function () {
          tela.hidden = true;
          tela.classList.remove('saindo');
          campos.forEach(function (el) { el.inert = false; });
          f.style.minHeight = '';
          fNome.focus();
        };
        if (reduce) return fechar();
        tela.classList.add('saindo');
        setTimeout(fechar, 280);
      });

      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        function exige(el, cond, msg) {
          var ruim = !cond;
          erro(el, ruim ? msg : '');
          if (ruim) { if (ok) el.focus(); ok = false; }
        }
        exige(fNome, fNome.value.trim().length > 2, 'Diga como podemos te chamar.');
        exige(fTexto, fTexto.value.trim().length > 9, 'Conte um pouco do que aconteceu.');
        exige(fComp, !!fComp.value, 'Selecione uma opção.');
        var digitos = fZap.value.replace(/\D/g, '');
        exige(fZap, digitos.length === 0 || digitos.length >= 10, 'Informe um WhatsApp válido ou deixe em branco.');
        if (!ok) return;

        var dados = new URLSearchParams();
        dados.set('destino', 'testemunho');
        dados.set('nome', fNome.value.trim());
        dados.set('telefone', fZap.value.trim());
        dados.set('testemunho', fTexto.value.trim());
        dados.set('compartilhar', fComp.value);
        if (campoSugestao && !campoSugestao.hidden) dados.set('sugestao', fSugestao.value.trim());
        dados.set('origem', 'site');

        var nome = fNome.value.trim().split(/\s+/)[0];
        nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
        enviando(true);
        aviso('Enviando seu testemunho...', 'form-note');

        fetch(INSCRICAO_URL, { method: 'POST', body: dados })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.ok === false) throw new Error(res.erro || 'falha');
            concluir(nome);
          })
          .catch(function () {
            return fetch(INSCRICAO_URL, { method: 'POST', mode: 'no-cors', body: dados })
              .then(function () { concluir(nome); })
              .catch(falhar);
          });
      });
    })();

  });
})();
