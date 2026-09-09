/* ============================================================
   DEEP · Curso de Membresia — Igreja Vitória
   Vanilla JS, sem dependências. A inscrição grava na aba "Deep"
   da mesma planilha usada pela conferência (parâmetro destino=deep).
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP = '5567998318450'; // número oficial (src/lib/site-data.ts)

  /* Mesmo endpoint da conferência: o Apps Script escolhe a aba pelo
     parâmetro "destino". Enviamos form-urlencoded de propósito — é uma
     simple request, então não dispara preflight CORS, que o Apps Script
     não responde. Se a URL da implantação mudar, é só trocar aqui. */
  var INSCRICAO_URL = 'https://script.google.com/macros/s/AKfycbwTMAjrbR4CH8uhM6WUmjAm1GFQmzPCudRzaszOUDgw3Ush8IHJYpNkdw-_Wi6WYDuicg/exec';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* Copiar a chave PIX. Usa a API moderna quando disponível e cai para o
       execCommand em navegadores antigos ou fora de contexto seguro. */
    var pixBtn = document.getElementById('pixCopy');
    var pixKey = document.getElementById('pixKey');
    if (pixBtn && pixKey) {
      pixBtn.addEventListener('click', function () {
        var texto = pixKey.textContent.trim();
        var feito = function () {
          pixBtn.textContent = 'Copiado!';
          pixBtn.classList.add('ok');
          setTimeout(function () { pixBtn.textContent = 'Copiar'; pixBtn.classList.remove('ok'); }, 2200);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(texto).then(feito).catch(copiaAntiga);
        } else { copiaAntiga(); }

        function copiaAntiga() {
          var ta = document.createElement('textarea');
          ta.value = texto;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); feito(); } catch (e) { /* sem clipboard */ }
          document.body.removeChild(ta);
        }
      });
    }

    var form = document.getElementById('deepForm');
    if (!form) return;

    var fNome = document.getElementById('dNome');
    var fZap = document.getElementById('dZap');
    var fEmail = document.getElementById('dEmail');
    var fEndereco = document.getElementById('dEndereco');
    var fNasc = document.getElementById('dNasc');
    var nota = document.getElementById('deepNote');

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

    function ehEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

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
      req(fEmail, ehEmail(fEmail.value.trim()), 'Informe um e-mail válido.');
      req(fEndereco, fEndereco.value.trim().length > 4, 'Informe seu endereço.');
      req(fNasc, !!fNasc.value, 'Informe sua data de nascimento.');
      if (!ok) return;

      var dados = new URLSearchParams();
      dados.set('destino', 'deep');
      dados.set('nome', fNome.value.trim());
      dados.set('telefone', fZap.value.trim());
      dados.set('email', fEmail.value.trim());
      dados.set('endereco', fEndereco.value.trim());
      dados.set('nascimento', formatarData(fNasc.value));
      dados.set('origem', 'site');

      enviando(true);
      msg('Enviando sua inscrição...', 'form-note');

      fetch(INSCRICAO_URL, { method: 'POST', body: dados })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok === false) throw new Error(res.erro || 'falha');
          concluir(res && res.duplicado);
        })
        .catch(function () {
          /* Se o navegador bloquear a leitura da resposta (CORS no redirect do
             Google), reenviamos em no-cors: não dá para ler o retorno, mas a
             linha é gravada. A duplicidade é tratada no servidor, então
             reenviar não cria linha repetida. */
          return fetch(INSCRICAO_URL, { method: 'POST', mode: 'no-cors', body: dados })
            .then(function () { concluir(false); })
            .catch(falhar);
        });
    });

    /* A planilha é lida por pessoas: dd/mm/aaaa comunica melhor que aaaa-mm-dd. */
    function formatarData(iso) {
      if (!iso) return '';
      var p = iso.split('-');
      return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
    }

    function enviando(estado) {
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.disabled = estado;
      btn.style.opacity = estado ? '.6' : '';
      btn.style.cursor = estado ? 'progress' : '';
      btn.textContent = estado ? 'Enviando...' : 'Fazer minha inscrição';
    }

    function msg(texto, classe) {
      if (!nota) return;
      nota.className = classe;
      nota.textContent = texto;
    }

    function concluir(duplicado) {
      enviando(false);
      form.querySelectorAll('.inp').forEach(function (i) { i.disabled = true; });
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Inscrição enviada'; btn.style.opacity = '.6'; }
      msg(duplicado
        ? 'Você já estava inscrito com esse telefone. Para concluir, faça o PIX de R$ 50 e envie o comprovante no WhatsApp da igreja (veja os passos logo abaixo).'
        : 'Inscrição registrada! Agora faltam dois passos: fazer o PIX de R$ 50 e enviar o comprovante no WhatsApp da igreja. Veja como logo abaixo.', 'form-ok');
    }

    function falhar() {
      enviando(false);
      var texto = [
        'Olá! Quero me inscrever no Deep, o curso de membresia.',
        '',
        '• Nome: ' + fNome.value.trim(),
        '• WhatsApp: ' + fZap.value.trim(),
        '• E-mail: ' + fEmail.value.trim(),
        '• Endereço: ' + fEndereco.value.trim(),
        '• Nascimento: ' + formatarData(fNasc.value)
      ].join('\n');
      msg('Não conseguimos enviar agora. Toque aqui para concluir pelo WhatsApp.', 'form-err');
      if (nota) {
        nota.style.cursor = 'pointer';
        nota.onclick = function () {
          window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
        };
      }
    }
  });
})();
