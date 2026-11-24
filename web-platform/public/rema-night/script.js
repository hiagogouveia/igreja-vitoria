/* ============================================================
   REMA NIGHT · Igreja Vitória
   Vanilla JS, sem dependências.
   ============================================================ */

/* ----------------------------------------------------------------
   CONFIGURAÇÃO DO EVENTO — é aqui que se atualiza a página.
   Campo vazio aparece como "a confirmar". Nada é presumido.
   ---------------------------------------------------------------- */
var RN = {
  nome: 'Rema Night',          // nome do evento
  data: '05 de dezembro',       // dados do convite oficial
  horario: '20h',
  local: 'Igreja Vitória',
  traje: 'Formal',              // dress code (vazio = linha some)

  /* Times da igreja (lista oficial passada pela liderança). Para mudar, edite
     aqui; a ordem é a da tela. A pessoa pode marcar mais de um. */
  times: ['Apoio', 'Backstage', 'Dança', 'Intercessão', 'Kids', 'Louvor', 'Manager',
          'Multimídia', 'Produção', 'Recepção', 'Welcome'],

  /* Fim das inscrições: 04/12/2026 às 22h (UTC-4). Depois disso a página
     mostra "encerradas" sozinha e o servidor também recusa. Manter igual a
     REMA_NIGHT_ENCERRA_EM no Apps Script. */
  encerraEm: '2026-12-04T22:00:00-04:00',

  whatsapp: '5567998318450',    // WhatsApp oficial da igreja
  whatsappVisivel: '(67) 99831-8450',

  /* Mesmo Apps Script das outras inscrições (destino=rema-night). O site só
     grava na planilha se a implantação responder aceitaRemaNight:true; antes
     disso a inscrição vai inteira pelo WhatsApp. */
  inscricaoUrl: 'https://script.google.com/macros/s/AKfycbwTMAjrbR4CH8uhM6WUmjAm1GFQmzPCudRzaszOUDgw3Ush8IHJYpNkdw-_Wi6WYDuicg/exec'
};

(function () {
  'use strict';
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    /* ---------- dados do evento ---------- */
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var v = String(RN[el.getAttribute('data-cfg')] || '').trim();
      el.textContent = v || 'a confirmar';
      el.classList.toggle('pend', !v);
    });
    document.querySelectorAll('[data-cfg-linha]').forEach(function (el) {
      if (!String(RN[el.getAttribute('data-cfg-linha')] || '').trim()) el.hidden = true;
    });
    // nome do evento: cada palavra numa linha da caligrafia
    var partes = RN.nome.trim().split(/\s+/);
    var l1 = document.querySelector('[data-nome="1"]'), l2 = document.querySelector('[data-nome="2"]');
    if (l1 && l2) {
      l1.textContent = partes[0] || '';
      l2.textContent = partes.slice(1).join(' ');
      l2.hidden = !l2.textContent;
      document.querySelector('.nome').setAttribute('aria-label', RN.nome);
    }

    // lockup do encerramento (como "ROCKET Gala"): 1ª palavra em versal, o resto na caligrafia
    var lkA = document.querySelector('[data-lk="a"]'), lkB = document.querySelector('[data-lk="b"]');
    if (lkA && lkB) { lkA.textContent = partes[0] || ''; lkB.textContent = partes.slice(1).join(' '); }
    var linhaData = document.querySelector('[data-cfg-data-longa]');
    if (linhaData) {
      var pedacos = [RN.data, RN.horario, RN.local].filter(function (x) { return String(x || '').trim(); });
      linhaData.textContent = pedacos.join(' · ');
      linhaData.hidden = !pedacos.length;
    }

    /* ---------- revelar ao rolar ---------- */
    var rvs = document.querySelectorAll('.rv');
    if ('IntersectionObserver' in window && !reduz) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
      rvs.forEach(function (el) { io.observe(el); });
    } else { rvs.forEach(function (el) { el.classList.add('in'); }); }

    /* ---------- parallax discreto do monograma ---------- */
    var v = document.querySelector('.hero-v');
    if (v && !reduz) {
      var tic = false;
      addEventListener('scroll', function () {
        if (tic) return; tic = true;
        requestAnimationFrame(function () {
          tic = false;
          var y = Math.min(scrollY, innerHeight);
          v.style.transform = 'translate(-50%,calc(-50% + ' + (y * 0.18).toFixed(1) + 'px)) scale(' + (1 + y / innerHeight * 0.06).toFixed(3) + ')';
        });
      }, { passive: true });
    }

    /* ============================================================
       INSCRIÇÃO
       ============================================================ */
    var form = document.getElementById('snForm');
    if (!form) return;
    var fNome = document.getElementById('fNome');
    var fZap = document.getElementById('fZap');
    var fTimes = document.getElementById('fTimes');
    var fLgpd = document.getElementById('fLgpd');
    var lgpdBox = document.getElementById('fLgpdBox');
    var nota = document.getElementById('nota');
    var btn = document.getElementById('btnEnviar');
    var comp = document.getElementById('comprovante');

    // monta as opções de time
    var lista = document.getElementById('listaTimes');
    RN.times.forEach(function (t, i) {
      var lab = document.createElement('label');
      lab.className = 'chip';
      lab.innerHTML = '<input type="checkbox" name="time" id="time' + i + '"><span></span>';
      lab.querySelector('input').value = t;
      lab.querySelector('span').textContent = t;
      lista.appendChild(lab);
    });
    var chkOutro = null; // lista oficial completa: sem opção "Outro"

    function times() {
      var out = [];
      lista.querySelectorAll('input:checked').forEach(function (c) {
        out.push(c.value);
      });
      return out;
    }

    function erro(el, msg) {
      el.classList.toggle('err', !!msg);
      var h = el.querySelector('[data-err]') || (el.parentNode && el.parentNode.querySelector('[data-err]'));
      if (h) h.textContent = msg || '';
    }
    lista.addEventListener('change', function () { if (times().length) erro(fTimes, ''); });
    [fNome, fZap].forEach(function (i) { i.addEventListener('input', function () { if (i.classList.contains('err')) erro(i, ''); }); });
    fLgpd.addEventListener('change', function () { if (fLgpd.checked) erro(lgpdBox, ''); });

    function mascara(v) {
      v = v.replace(/\D/g, '').slice(0, 11);
      if (v.length <= 10) return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
      return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    }
    fZap.addEventListener('input', function () { fZap.value = mascara(fZap.value); });

    /* ---------- inscrições encerradas ---------- */
    var encerrado = false;
    function passouPrazo() { return Date.now() >= new Date(RN.encerraEm).getTime(); }
    function encerrar() {
      if (encerrado) return;
      encerrado = true;
      document.querySelectorAll('[data-cta]').forEach(function (el) { el.setAttribute('hidden', ''); });
      document.getElementById('inscTitulo').innerHTML = 'Inscrições <em class="cromo">encerradas.</em>';
      document.getElementById('inscSub').textContent = 'O prazo para confirmar presença terminou. Se tiver alguma dúvida, fale com a igreja pelo WhatsApp ' + RN.whatsappVisivel + '.';
      document.querySelector('.passos').hidden = true;
      if (comp.hidden) document.querySelector('.painel').hidden = true;
    }
    if (passouPrazo()) encerrar();

    /* A planilha só é usada se a implantação já souber gravar o Rema Night.
       O servidor também diz se o prazo acabou, e vale mais que o relógio do aparelho. */
    var planilha = false;
    var sondagem = RN.inscricaoUrl
      ? fetch(RN.inscricaoUrl).then(function (r) { return r.json(); })
          .then(function (res) {
            planilha = !!(res && res.aceitaRemaNight);
            if (res && res.remaNightAberto === false) encerrar();
          })
          .catch(function () { planilha = false; })
      : Promise.resolve();

    var enviandoAgora = false;
    function enviando(on) {
      enviandoAgora = on;
      btn.disabled = on;
      btn.querySelector('span').textContent = on ? 'Enviando…' : 'Confirmar minha inscrição';
    }
    function aviso(t, cls) { nota.textContent = t; nota.className = 'nota' + (cls ? ' ' + cls : ''); }

    function nomeBonito(n) {
      var min = ['de', 'da', 'do', 'das', 'dos', 'e'];
      return n.trim().toLowerCase().split(/\s+/).map(function (p, i) {
        return i > 0 && min.indexOf(p) !== -1 ? p : p.charAt(0).toUpperCase() + p.slice(1);
      }).join(' ');
    }

    /* Comprovante: a mensagem que a pessoa envia para o WhatsApp da igreja. */
    var dados = null;
    function textoZap() {
      return [
        'Olá! Fiz minha inscrição na ' + RN.nome + '. Segue meu comprovante:',
        '',
        '• Nome: ' + dados.nome,
        '• Telefone: ' + dados.telefone,
        '• Time: ' + dados.times.join(', '),
        '• Comprovante: ' + dados.codigo,
        '',
        'Quero confirmar minha presença.'
      ].join('\n');
    }

    function mostrarComprovante(opts) {
      document.getElementById('cpTag').textContent = opts.duplicado ? 'Você já estava inscrito' : 'Inscrição recebida';
      document.getElementById('cpQuem').textContent = dados.nome;
      document.getElementById('cpTimes').textContent = dados.times.join(' · ');
      document.getElementById('cpCod').textContent = dados.codigo;
      document.getElementById('cpFalta').innerHTML = opts.duplicado
        ? '<strong>Sua inscrição já existia</strong> com esse telefone. Se ainda não enviou o comprovante, envie agora pelo WhatsApp: é isso que confirma sua presença.'
        : '<strong>Falta um passo:</strong> envie o comprovante para o WhatsApp da igreja. Sua presença só é confirmada depois dessa mensagem.';
      document.getElementById('cpZap').href = 'https://wa.me/' + RN.whatsapp + '?text=' + encodeURIComponent(textoZap());
      document.getElementById('inscTitulo').innerHTML = 'Que alegria ter <em class="cromo">você.</em>';
      document.getElementById('inscSub').textContent = 'Agora é só enviar o comprovante para o WhatsApp da igreja.';
      form.hidden = true;
      comp.hidden = false;
      comp.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'center' });
      comp.focus({ preventScroll: true });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (enviandoAgora) return; // impede envio duplo
      if (passouPrazo()) { encerrar(); return; }
      var ok = true;
      function req(el, cond, msg) { erro(el, cond ? '' : msg); if (!cond && ok) { ok = false; (el.focus ? el : el.querySelector('input')).focus(); } }
      req(fNome, fNome.value.trim().split(/\s+/).length >= 2 && fNome.value.trim().length >= 5, 'Escreva seu nome e sobrenome.');
      req(fZap, fZap.value.replace(/\D/g, '').length >= 10, 'Informe um telefone com DDD.');
      var ts = times();
      req(fTimes, ts.length > 0, 'Escolha pelo menos um time.');
      if (!fLgpd.checked) { erro(lgpdBox, 'Para continuar, autorize o uso dos dados.'); if (ok) { ok = false; fLgpd.focus(); } }
      if (!ok) { aviso('Confira os campos destacados.', 'err-t'); return; }

      dados = {
        nome: nomeBonito(fNome.value),
        telefone: fZap.value.trim(),
        digitos: fZap.value.replace(/\D/g, ''),
        times: ts,
        codigo: 'RN-' + fZap.value.replace(/\D/g, '').slice(-4) // provisório; o servidor devolve o oficial
      };
      enviando(true);
      aviso('Enviando sua inscrição…');

      sondagem.then(function () {
        if (!planilha) { enviando(false); aviso(''); mostrarComprovante({}); return; }
        var d = new URLSearchParams();
        d.set('destino', 'rema-night');
        d.set('nome', dados.nome);
        d.set('telefone', dados.telefone);
        d.set('times', dados.times.join(', '));
        d.set('consentimento', 'Sim');
        d.set('origem', 'site');
        /* form-urlencoded: sem preflight CORS (o Apps Script não responde
           preflight). Se o navegador não deixar ler a resposta, reenvia em
           no-cors; o servidor barra duplicidade pelo telefone. */
        return fetch(RN.inscricaoUrl, { method: 'POST', body: d })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.erro === 'rema-night-encerrado') { enviando(false); encerrar(); return; }
            if (res && res.ok === false) throw new Error(res.erro || 'falha');
            if (res && res.codigo) dados.codigo = res.codigo;
            enviando(false); aviso('');
            mostrarComprovante({ duplicado: !!(res && res.duplicado) });
          })
          .catch(function () {
            return fetch(RN.inscricaoUrl, { method: 'POST', mode: 'no-cors', body: d })
              .then(function () { enviando(false); aviso(''); mostrarComprovante({}); })
              .catch(function () {
                enviando(false);
                aviso('Não conseguimos enviar agora. Verifique sua internet e tente de novo.', 'err-t');
              });
          });
      });
    });

    /* ---------- convite em imagem (para guardar ou anexar) ---------- */
    document.getElementById('cpImg').addEventListener('click', function () {
      var bt = this;
      var fonte = (document.fonts && document.fonts.load)
        ? Promise.all([document.fonts.load('200px "Pinyon Script"'), document.fonts.load('500 60px "Cormorant Garamond"')]).catch(function () {})
        : Promise.resolve();
      fonte.then(function () {
        var W = 1080, H = 1350, c = document.createElement('canvas');
        c.width = W; c.height = H;
        var x = c.getContext('2d');
        var g = x.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.45, H * 0.8);
        g.addColorStop(0, '#1d1d1d'); g.addColorStop(1, '#050505');
        x.fillStyle = g; x.fillRect(0, 0, W, H);
        x.strokeStyle = 'rgba(200,200,200,.28)'; x.lineWidth = 2; x.strokeRect(60, 60, W - 120, H - 120);
        x.strokeStyle = 'rgba(200,200,200,.1)'; x.strokeRect(76, 76, W - 152, H - 152);
        function prata(y0, y1) {
          var p = x.createLinearGradient(0, y0, W, y1);
          ['#7a7a7a', '#f4f4f4', '#9b9b9b', '#ffffff', '#808080', '#e9e9e9'].forEach(function (cor, i, a) { p.addColorStop(i / (a.length - 1), cor); });
          return p;
        }
        x.textAlign = 'center';
        x.fillStyle = 'rgba(245,245,245,.62)'; x.font = '500 26px Manrope, sans-serif';
        espacado('IGREJA VITÓRIA APRESENTA', W / 2, 190, 10);
        var p = RN.nome.split(/\s+/);
        x.fillStyle = prata(300, 700); x.font = '220px "Pinyon Script", cursive';
        x.fillText(p[0] || '', W / 2 - 40, 410);
        if (p[1]) x.fillText(p.slice(1).join(' '), W / 2 + 60, 585);
        x.fillStyle = '#C8C8C8'; x.font = '500 28px "Cormorant Garamond", serif';
        espacado('UMA NOITE PARA QUEM FAZ ACONTECER', W / 2, 745, 8);
        x.fillStyle = 'rgba(200,200,200,.3)'; x.fillRect(W / 2 - 200, 790, 400, 1);
        x.fillStyle = 'rgba(245,245,245,.62)'; x.font = '500 22px Manrope, sans-serif';
        espacado('CONVITE DE', W / 2, 850, 8);
        x.fillStyle = '#F5F5F5'; x.font = '500 64px "Cormorant Garamond", serif';
        x.fillText(dados.nome, W / 2, 935, W - 200);
        x.fillStyle = 'rgba(245,245,245,.7)'; x.font = '500 24px Manrope, sans-serif';
        espacado(dados.times.join(' · ').toUpperCase(), W / 2, 995, 4);
        x.fillStyle = 'rgba(200,200,200,.3)'; x.fillRect(W / 2 - 200, 1050, 400, 1);
        x.fillStyle = '#F5F5F5'; x.font = '600 30px Manrope, sans-serif';
        espacado('COMPROVANTE ' + dados.codigo, W / 2, 1120, 6);
        x.fillStyle = 'rgba(245,245,245,.62)'; x.font = '400 24px Manrope, sans-serif';
        x.fillText('Envie para o WhatsApp da igreja ' + RN.whatsappVisivel, W / 2, 1180);
        function espacado(t, cx, y, gap) {
          var larg = 0, i; for (i = 0; i < t.length; i++) larg += x.measureText(t[i]).width + gap;
          var cur = cx - (larg - gap) / 2; x.textAlign = 'left';
          for (i = 0; i < t.length; i++) { x.fillText(t[i], cur, y); cur += x.measureText(t[i]).width + gap; }
          x.textAlign = 'center';
        }
        c.toBlob(function (blob) {
          var nomeArq = 'rema-night-convite.png';
          var arq = window.File ? new File([blob], nomeArq, { type: 'image/png' }) : null;
          if (arq && navigator.canShare && navigator.canShare({ files: [arq] })) {
            navigator.share({ files: [arq], title: RN.nome }).catch(function () {});
          } else {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = nomeArq;
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
          }
          bt.querySelector('span').textContent = 'Convite salvo';
        }, 'image/png');
      });
    });
  });
})();
