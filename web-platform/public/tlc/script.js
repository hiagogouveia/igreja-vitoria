/* ============================================================
   TLC · Treinamento de Líderes de CAV — Igreja Vitória
   Vanilla JS, sem dependências.
   ============================================================ */

/* ----------------------------------------------------------------
   DADOS DO TREINAMENTO — é aqui que se atualiza a página.
   Texto que aparece no "ingresso" (data-info em index.html). Campo
   vazio mostra "a confirmar". Para voltar a mostrar duração, requisitos
   ou valor, é só recriar o ingresso no HTML e preencher a chave aqui.
   ---------------------------------------------------------------- */
var TLC = {
  info: {
    data: '19 de novembro',
    horarios: '19h30',
    local: 'Igreja Vitória'
  },
  whatsapp: '5567998318450', // número oficial (src/lib/site-data.ts)
  /* Fim das inscrições: 27/11/2026 às 00h (Campo Grande, UTC-4). Depois disso a
     página mostra "encerradas" sozinha e o servidor (Apps Script) também recusa.
     Manter igual a TLC_ENCERRA_EM no Apps Script e tlcEncerraEm no site-data.ts. */
  encerraEm: '2026-11-27T00:00:00-04:00',
  /* Mesmo endpoint do Deep e da conferência (Apps Script → planilha).
     O site só grava lá se a implantação responder aceitaTlc:true; antes disso
     a inscrição vai por WhatsApp, para nunca cair na aba errada. */
  inscricaoUrl: 'https://script.google.com/macros/s/AKfycbwTMAjrbR4CH8uhM6WUmjAm1GFQmzPCudRzaszOUDgw3Ush8IHJYpNkdw-_Wi6WYDuicg/exec'
};

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  ready(function () {
    /* ---------- informações do ingresso ---------- */
    document.querySelectorAll('[data-info]').forEach(function (el) {
      var v = (TLC.info[el.getAttribute('data-info')] || '').trim();
      el.textContent = v || 'a confirmar';
      if (!v) el.classList.add('tbd');
    });

    /* ---------- revelar ao rolar ---------- */
    var rvs = document.querySelectorAll('.rv');
    rvs.forEach(function (el, i) { el.style.setProperty('--d', ((i % 4) * 0.07) + 's'); });
    if ('IntersectionObserver' in window && !reduz) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      rvs.forEach(function (el) { io.observe(el); });
    } else {
      rvs.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- progresso, paralaxe e indicador de seção ---------- */
    var bar = document.getElementById('progBar');
    var pars = Array.prototype.slice.call(document.querySelectorAll('.par[data-par]'));
    var desk = window.matchMedia('(min-width: 900px)');
    var tick = false;
    function atualizar() {
      tick = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(scrollY / h, 1) : 0) + ')';
      if (desk.matches && !reduz) {
        pars.forEach(function (p) {
          var r = p.getBoundingClientRect();
          if (r.bottom < -200 || r.top > innerHeight + 200) return;
          var centro = r.top + r.height / 2 - innerHeight / 2;
          p.style.setProperty('--py', (centro * parseFloat(p.getAttribute('data-par'))).toFixed(1) + 'px');
        });
      }
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(atualizar); } }, { passive: true });
    addEventListener('resize', atualizar);
    atualizar();

    var dots = document.querySelectorAll('#dots a');
    if ('IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          dots.forEach(function (d) { d.classList.toggle('on', d.getAttribute('data-sec') === e.target.id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      document.querySelectorAll('[data-obs]').forEach(function (s) { so.observe(s); });
    }

    /* ---------- CTA fixo no celular: some no topo e no formulário ---------- */
    var sticky = document.getElementById('stickyCta');
    var hero = document.getElementById('top');
    var insc = document.getElementById('inscricao');
    var fecho = document.getElementById('fecho');
    if (sticky && 'IntersectionObserver' in window) {
      var visto = { top: true, inscricao: false, fecho: false };
      var chave = function (el) { return el === hero ? 'top' : el === insc ? 'inscricao' : 'fecho'; };
      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) { visto[chave(e.target)] = e.isIntersecting; });
        sticky.classList.toggle('on', !visto.top && !visto.inscricao && !visto.fecho);
      }, { threshold: 0.15 });
      [hero, insc, fecho].forEach(function (el) { if (el) co.observe(el); });
    }

    /* ============================================================
       FORMULÁRIO
       ============================================================ */
    var form = document.getElementById('tlcForm');
    if (!form) return;
    var fNome = document.getElementById('fNome');
    var fZap = document.getElementById('fZap');
    var fEmail = document.getElementById('fEmail');
    var fNasc = document.getElementById('fNasc');
    var fEndereco = document.getElementById('fEndereco');
    var fSexo = document.getElementById('fSexo');
    var fAnfitriao = document.getElementById('fAnfitriao');
    var nota = document.getElementById('formNote');
    var okCard = document.getElementById('okCard');

    /* ---------- inscrições encerradas ---------- */
    var encerrado = false;
    function passouPrazo() { return Date.now() >= new Date(TLC.encerraEm).getTime(); }
    function encerrar() {
      if (encerrado) return;
      encerrado = true;
      document.documentElement.classList.add('encerrado');
      // setAttribute (e não .hidden) porque a seta é um SVG
      document.querySelectorAll('[data-cta]').forEach(function (el) { el.setAttribute('hidden', ''); });
      document.getElementById('inscTag').textContent = '06 · Inscrições';
      document.getElementById('inscTitulo').innerHTML = 'Inscrições <em>encerradas.</em>';
      document.getElementById('inscTexto').textContent = 'O prazo para se inscrever no TLC terminou.';
      document.getElementById('encerradoZap').href = 'https://wa.me/' + TLC.whatsapp + '?text=' +
        encodeURIComponent('Olá! Tenho uma dúvida sobre o TLC (Treinamento de Líderes de CAV).');
      form.hidden = true;
      okCard.hidden = true;
      document.getElementById('encerradoCard').hidden = false;
    }
    if (passouPrazo()) encerrar();

    /* A planilha só é usada se a implantação do Apps Script já souber gravar o
       TLC. Senão cairia na aba da conferência. O servidor também diz se o prazo
       acabou (tlcAberto), e vale mais que o relógio do aparelho. */
    var planilha = false;
    var sondagem = TLC.inscricaoUrl
      ? fetch(TLC.inscricaoUrl).then(function (r) { return r.json(); })
          .then(function (res) {
            planilha = !!(res && res.aceitaTlc);
            if (res && res.tlcAberto === false) encerrar();
          })
          .catch(function () { planilha = false; })
      : Promise.resolve();

    function mascara(v) {
      v = v.replace(/\D/g, '').slice(0, 11);
      if (v.length <= 10) return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
      return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    }
    fZap.addEventListener('input', function () { fZap.value = mascara(fZap.value); });

    function setErr(el, msg) {
      el.classList.toggle('err', !!msg);
      var h = el.querySelector ? el.querySelector('[data-err]') : null;
      if (!h && el.parentNode) h = el.parentNode.querySelector('[data-err]');
      if (h) h.textContent = msg || '';
    }
    form.querySelectorAll('.inp').forEach(function (inp) {
      var limpa = function () { if (inp.classList.contains('err')) setErr(inp, ''); };
      inp.addEventListener('input', limpa);
    });
    [[fSexo, 'sexo'], [fAnfitriao, 'anfitriao']].forEach(function (par) {
      form.querySelectorAll('input[name="' + par[1] + '"]').forEach(function (r) {
        r.addEventListener('change', function () { setErr(par[0], ''); });
      });
    });

    function msg(t, cls) { nota.textContent = t; nota.className = 'form-note' + (cls ? ' ' + cls : ''); }
    function enviando(on) {
      var b = form.querySelector('button[type="submit"]');
      b.disabled = on;
      b.textContent = on ? 'Enviando...' : 'Garantir minha inscrição';
    }
    function ehEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function sexo() { var r = form.querySelector('input[name="sexo"]:checked'); return r ? r.value : ''; }
    function anfitriao() { var r = form.querySelector('input[name="anfitriao"]:checked'); return r ? r.value : ''; }
    /* a planilha é lida por pessoas: dd/mm/aaaa comunica melhor que aaaa-mm-dd */
    function dataBR(iso) { var p = (iso || '').split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso; }

    /* `feita` = a inscrição já foi gravada: a mensagem vira o comprovante dela. */
    function textoZap(feita) {
      return [
        feita
          ? 'Olá! Acabei de fazer minha inscrição no TLC (Treinamento de Líderes de CAV). Seguem meus dados:'
          : 'Olá! Quero me inscrever no TLC (Treinamento de Líderes de CAV).',
        '',
        '• Nome: ' + fNome.value.trim(),
        '• Nascimento: ' + dataBR(fNasc.value),
        '• Sexo: ' + sexo(),
        '• WhatsApp: ' + fZap.value.trim(),
        '• E-mail: ' + fEmail.value.trim(),
        '• Endereço: ' + fEndereco.value.trim(),
        '• Anfitrião (CAV na minha casa): ' + anfitriao()
      ].join('\n');
    }
    function linkZap(feita) { return 'https://wa.me/' + TLC.whatsapp + '?text=' + encodeURIComponent(textoZap(feita)); }

    /* Confirmação visual. `viaZap` = a inscrição ainda não foi gravada, falta
       enviar a mensagem pelo WhatsApp. */
    function concluir(opts) {
      var primeiro = fNome.value.trim().split(/\s+/)[0];
      document.getElementById('okNome').textContent = opts.viaZap ? 'Falta um passo, ' + primeiro
        : opts.duplicado ? primeiro + ', você já está inscrito!'
        : primeiro + ', você está dentro!';
      document.getElementById('okTag').textContent = opts.viaZap ? 'Quase lá'
        : opts.duplicado ? 'Inscrição já realizada'
        : 'Inscrição confirmada';
      document.getElementById('okMsg').textContent = opts.viaZap
        ? 'Toque no botão abaixo para enviar seus dados pelo WhatsApp da igreja. Sua inscrição só é concluída depois dessa mensagem.'
        : (opts.duplicado
            ? 'Já existe uma inscrição no TLC com esse WhatsApp ou e-mail, então não fizemos outra. Sua vaga continua garantida. Se quiser, envie seus dados pelo WhatsApp da igreja como comprovante.'
            : 'Recebemos a sua inscrição no TLC. Agora envie seus dados pelo WhatsApp da igreja: a mensagem fica como o comprovante da sua inscrição.');
      // O botão aparece sempre: com a inscrição gravada, a mensagem é o comprovante;
      // sem a planilha, é por ela que a inscrição é concluída.
      var z = document.getElementById('okZap');
      z.hidden = false;
      z.href = linkZap(!opts.viaZap);
      form.hidden = true;
      okCard.hidden = false;
      okCard.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'center' });
      okCard.focus({ preventScroll: true });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (passouPrazo()) { encerrar(); return; }
      var ok = true;
      function req(el, cond, t) { setErr(el, cond ? '' : t); if (!cond && ok) { (el.focus || function () {}).call(el); ok = false; } }
      req(fNome, fNome.value.trim().length > 2, 'Informe seu nome completo.');
      req(fZap, fZap.value.replace(/\D/g, '').length >= 10, 'Informe um WhatsApp válido.');
      req(fNasc, !!fNasc.value, 'Informe sua data de nascimento.');
      if (!sexo()) { setErr(fSexo, 'Escolha uma opção.'); if (ok) { fSexo.querySelector('input').focus(); ok = false; } }
      req(fEmail, ehEmail(fEmail.value.trim()), 'Informe um e-mail válido.');
      req(fEndereco, fEndereco.value.trim().length > 4, 'Informe seu endereço.');
      if (!anfitriao()) { setErr(fAnfitriao, 'Escolha uma opção.'); if (ok) { fAnfitriao.querySelector('input').focus(); ok = false; } }
      if (!ok) return;

      enviando(true);
      msg('Enviando sua inscrição...');

      sondagem.then(function () {
        if (!planilha) { enviando(false); concluir({ viaZap: true }); return; }

        var d = new URLSearchParams();
        d.set('destino', 'tlc');
        d.set('nome', fNome.value.trim());
        d.set('telefone', fZap.value.trim());
        d.set('email', fEmail.value.trim());
        d.set('nascimento', dataBR(fNasc.value));
        d.set('sexo', sexo());
        d.set('endereco', fEndereco.value.trim());
        d.set('anfitriao', anfitriao());
        d.set('origem', 'site');

        /* form-urlencoded: simple request, sem preflight CORS (o Apps Script não
           responde preflight). Se o navegador bloquear a leitura da resposta,
           reenvia em no-cors; o servidor barra duplicidade pelo telefone. */
        return fetch(TLC.inscricaoUrl, { method: 'POST', body: d })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.erro === 'tlc-encerrado') { enviando(false); encerrar(); return; }
            if (res && res.ok === false) throw new Error(res.erro || 'falha');
            enviando(false); concluir({ duplicado: !!(res && res.duplicado) });
          })
          .catch(function () {
            return fetch(TLC.inscricaoUrl, { method: 'POST', mode: 'no-cors', body: d })
              .then(function () { enviando(false); concluir({}); })
              .catch(function () {
                enviando(false);
                msg('Não conseguimos enviar agora. Toque aqui para concluir pelo WhatsApp.', 'err-t');
                nota.style.cursor = 'pointer';
                nota.onclick = function () { window.open(linkZap(false), '_blank', 'noopener'); };
              });
          });
      });
    });
  });
})();
