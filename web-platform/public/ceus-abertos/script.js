/* ============================================================
   CONFERÊNCIA CÉUS ABERTOS 2026 — Igreja Vitória
   Vanilla JS, sem dependências. Reveal on scroll + inscrição.
   A inscrição é gratuita: o formulário valida e entrega os dados
   no WhatsApp oficial (mesmo padrão já usado no restante do site).
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP = '5567998318450'; // número oficial (src/lib/site-data.ts)

  /* Endpoint do Apps Script vinculado à planilha "Inscrições · Conferência
     Céus Abertos 2026" (Drive do Hiago). Grava a linha e deduplica pelo
     telefone. Enviamos como form-urlencoded de propósito: é uma "simple
     request", então não dispara preflight CORS — que o Apps Script não
     responde. Se um dia a URL mudar, é só trocar aqui. */
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

    /* ---------- Inscrição gratuita ---------- */
    var form = document.getElementById('inscForm');
    if (!form) return;

    var fNome = document.getElementById('fNome');
    var fZap = document.getElementById('fZap');
    var fSexo = document.getElementById('fSexo');
    var fSister = document.getElementById('fSister');
    var fEndereco = document.getElementById('fEndereco');
    var fBairro = document.getElementById('fBairro');
    var fCidade = document.getElementById('fCidade');
    var fCav = document.getElementById('fCav');
    var fQualCav = document.getElementById('fQualCav');
    var fldSister = document.getElementById('fldSister');
    var fldQualCav = document.getElementById('fldQualCav');
    var formNote = document.getElementById('formNote');

    /* Campos condicionais: o Sister é exclusivo para mulheres, então a pergunta
       só aparece quando o sexo informado é feminino. "Qual CAV" só aparece
       para quem já participa de uma. */
    function syncCondicionais() {
      var ehMulher = fSexo.value === 'Feminino';
      fldSister.hidden = !ehMulher;
      if (!ehMulher) { fSister.value = ''; setErr(fSister, ''); }

      var temCav = fCav.value === 'Sim';
      fldQualCav.hidden = !temCav;
      if (!temCav) fQualCav.value = '';
    }
    fSexo.addEventListener('change', syncCondicionais);
    fCav.addEventListener('change', syncCondicionais);

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
      var limpa = function () { if (inp.classList.contains('err')) setErr(inp, ''); };
      inp.addEventListener('input', limpa);
      inp.addEventListener('change', limpa);
    });
    syncCondicionais();

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
      req(fSexo, !!fSexo.value, 'Selecione uma opção.');
      req(fBairro, fBairro.value.trim().length > 1, 'Informe seu bairro.');
      req(fCidade, fCidade.value.trim().length > 1, 'Informe sua cidade.');
      req(fCav, !!fCav.value, 'Selecione uma opção.');
      if (fSexo.value === 'Feminino') {
        req(fSister, !!fSister.value, 'Selecione uma opção.');
      }
      if (fCav.value === 'Sim') {
        req(fQualCav, !!fQualCav.value, 'Selecione a sua CAV.');
      }
      if (!ok) return;

      var dados = new URLSearchParams();
      dados.set('nome', fNome.value.trim());
      dados.set('telefone', fZap.value.trim());
      dados.set('sexo', fSexo.value);
      dados.set('sister', fSexo.value === 'Feminino' ? fSister.value : '');
      dados.set('endereco', fEndereco.value.trim());
      dados.set('bairro', fBairro.value.trim());
      dados.set('cidade', fCidade.value.trim());
      dados.set('cav', fCav.value);
      dados.set('qualCav', fCav.value === 'Sim' ? fQualCav.value.trim() : '');
      dados.set('origem', 'site');

      enviando(true);
      nota('Enviando sua inscrição...', '');

      // form-urlencoded evita preflight CORS (o Apps Script não responde OPTIONS)
      fetch(INSCRICAO_URL, { method: 'POST', body: dados })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok === false) throw new Error(res.erro || 'falha');
          concluir(res && res.duplicado);
        })
        .catch(function () {
          /* Se o navegador bloquear a leitura da resposta (CORS no redirect do
             Google), reenviamos em no-cors: não dá para ler o retorno, mas a
             linha é gravada do mesmo jeito. A duplicidade é tratada no servidor,
             então reenviar não gera linha repetida. */
          return fetch(INSCRICAO_URL, { method: 'POST', mode: 'no-cors', body: dados })
            .then(function () { concluir(false); })
            .catch(function () { falhar(); });
        });
    });

    function enviando(estado) {
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.disabled = estado;
      btn.style.opacity = estado ? '.6' : '';
      btn.style.cursor = estado ? 'progress' : '';
      btn.textContent = estado ? 'Enviando...' : 'Fazer minha inscrição';
    }

    function nota(texto, classe) {
      if (!formNote) return;
      formNote.className = classe || 'form-note';
      formNote.textContent = texto;
    }

    function concluir(duplicado) {
      enviando(false);
      form.querySelectorAll('.inp').forEach(function (i) { i.disabled = true; });
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Inscrição enviada'; btn.style.opacity = '.6'; }
      nota(duplicado
        ? 'Você já estava inscrito com esse telefone. Está tudo certo, não precisa se inscrever de novo. Nos vemos em setembro!'
        : 'Inscrição confirmada! Em breve a Igreja Vitória entra em contato pelo WhatsApp com mais informações.', 'form-ok');
    }

    function falhar() {
      enviando(false);
      var texto = [
        'Olá! Quero fazer minha inscrição na Conferência Céus Abertos 2026.',
        '',
        '• Nome: ' + fNome.value.trim(),
        '• WhatsApp: ' + fZap.value.trim(),
        '• Sexo: ' + fSexo.value,
        fSexo.value === 'Feminino' ? '• Sister (sábado, 18h): ' + fSister.value : '',
        '• Endereço: ' + (fEndereco.value.trim() || 'Não informado'),
        '• Bairro: ' + fBairro.value.trim(),
        '• Cidade: ' + fCidade.value.trim(),
        '• Já participa de CAV: ' + fCav.value
      ].filter(Boolean).join('\n');
      nota('Não conseguimos enviar agora. Toque aqui para concluir pelo WhatsApp.', 'form-err');
      if (formNote) {
        formNote.style.cursor = 'pointer';
        formNote.onclick = function () {
          window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
        };
      }
    }
  });
})();
