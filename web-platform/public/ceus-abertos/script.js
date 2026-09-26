/* ============================================================
   CONFERÊNCIA CÉUS ABERTOS 2026 — Igreja Vitória
   Vanilla JS, sem dependências. Reveal on scroll + inscrição.
   A inscrição é gratuita: o formulário valida e entrega os dados
   no WhatsApp oficial (mesmo padrão já usado no restante do site).
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP = '5567998318450'; // número oficial (src/lib/site-data.ts)

  /* O Sister tem 160 vagas, contadas no servidor. Começa fechado e só abre
     quando o servidor responde que ainda há vaga: assim, se a consulta falhar
     ou a implantação do Apps Script for antiga (sem a contagem), ninguém entra
     na lista por engano. */
  var SISTER_ABERTO = false;
  var sisterInfo = null;

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
    var fPrato = document.getElementById('fPrato');
    var fldSister = document.getElementById('fldSister');
    var fldSisterFechado = document.getElementById('fldSisterFechado');
    var sisterAberto = document.getElementById('sisterAberto');
    var sisterFechado = document.getElementById('sisterFechado');
    var sisterVagas = document.getElementById('sisterVagas');
    var labelSister = document.querySelector('label[for="fSister"] small');
    var labelSisterOriginal = labelSister ? labelSister.textContent : '';

    /* Mostra na seção do Sister e no formulário quantas vagas restam. */
    function aplicarSister() {
      if (sisterAberto) sisterAberto.hidden = !SISTER_ABERTO;
      if (sisterFechado) sisterFechado.hidden = SISTER_ABERTO;

      var vagas = sisterInfo ? sisterInfo.vagas : null;
      if (sisterVagas) {
        var poucas = vagas !== null && vagas <= 20;
        sisterVagas.textContent = vagas === null
          ? 'Entrada gratuita · vagas limitadas'
          : (poucas ? (vagas === 1 ? 'Última vaga' : 'Últimas ' + vagas + ' vagas')
                    : 'Entrada gratuita · ' + vagas + ' vagas restantes');
        sisterVagas.classList.toggle('ultimas', poucas);
      }
      if (labelSister) {
        labelSister.textContent = (vagas !== null && vagas <= 20)
          ? '(sábado, 18h · só para mulheres · ' + (vagas === 1 ? 'última vaga' : 'últimas ' + vagas + ' vagas') + ')'
          : labelSisterOriginal;
      }
      syncCondicionais();
    }
    var fldPrato = document.getElementById('fldPrato');
    var fldQualCav = document.getElementById('fldQualCav');
    var formNote = document.getElementById('formNote');
    var notaOriginal = formNote ? formNote.textContent : '';

    /* Campos condicionais: o Sister é exclusivo para mulheres, então a pergunta
       só aparece quando o sexo informado é feminino. "Qual CAV" só aparece
       para quem já participa de uma. */
    /* Pratos do brunch do Sister. A aba "Sister · Pratos" da planilha diz quais
       estão abertos; o que estiver fechado aparece como esgotado.
       - null: ainda não sabemos (ou a consulta falhou) → oferece todos e o
         servidor confere na hora de gravar;
       - pratosSuportado=false: a implantação do Apps Script ainda é a antiga,
         que não grava o prato → a pergunta não aparece. */
    var pratosAbertos = null;
    var pratosSuportado = true;

    function perguntaPrato() {
      return SISTER_ABERTO && pratosSuportado && fSister.value === 'Sim' && fSexo.value === 'Feminino' &&
        !(pratosAbertos && pratosAbertos.length === 0);
    }

    function aplicarPratos() {
      Array.prototype.forEach.call(fPrato.options, function (opt) {
        if (!opt.value) return;
        var aberto = !pratosAbertos || pratosAbertos.indexOf(opt.value) !== -1;
        opt.disabled = !aberto;
        opt.textContent = aberto ? opt.value : opt.value + ' · esgotado';
      });
      if (fPrato.value && fPrato.options[fPrato.selectedIndex].disabled) fPrato.value = '';
      syncCondicionais();
    }

    fetch(INSCRICAO_URL)
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && Array.isArray(res.pratos)) pratosAbertos = res.pratos;
        else if (res && res.ok) pratosSuportado = false;
        if (res && res.sister) { sisterInfo = res.sister; SISTER_ABERTO = !!res.sister.aberto; }
        aplicarPratos();
        aplicarSister();
      })
      .catch(function () { /* segue oferecendo todos; o servidor valida */ });

    function syncCondicionais() {
      var ehMulher = fSexo.value === 'Feminino';
      fldSister.hidden = !ehMulher || !SISTER_ABERTO;
      fldSisterFechado.hidden = !ehMulher || SISTER_ABERTO;
      if (!ehMulher || !SISTER_ABERTO) { fSister.value = ''; setErr(fSister, ''); }

      var comPrato = perguntaPrato();
      fldPrato.hidden = !comPrato;
      if (!comPrato) { fPrato.value = ''; setErr(fPrato, ''); }

      var temCav = fCav.value === 'Sim';
      fldQualCav.hidden = !temCav;
      if (!temCav) fQualCav.value = '';
    }
    fSexo.addEventListener('change', syncCondicionais);
    fSister.addEventListener('change', syncCondicionais);
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
      if (SISTER_ABERTO && fSexo.value === 'Feminino') {
        req(fSister, !!fSister.value, 'Selecione uma opção.');
      }
      if (perguntaPrato()) {
        req(fPrato, !!fPrato.value, 'Escolha o prato que você vai levar.');
      }
      if (fCav.value === 'Sim') {
        req(fQualCav, !!fQualCav.value, 'Selecione a sua CAV.');
      }
      if (!ok) return;

      var dados = new URLSearchParams();
      dados.set('nome', fNome.value.trim());
      dados.set('telefone', fZap.value.trim());
      dados.set('sexo', fSexo.value);
      dados.set('sister', (SISTER_ABERTO && fSexo.value === 'Feminino') ? fSister.value : '');
      // só manda o campo quando a pergunta faz sentido: sem ele, o servidor
      // entende que é um site antigo e grava "Não informado"
      if (SISTER_ABERTO && pratosSuportado && fSister.value === 'Sim') dados.set('prato', fPrato.value);
      dados.set('endereco', fEndereco.value.trim());
      dados.set('bairro', fBairro.value.trim());
      dados.set('cidade', fCidade.value.trim());
      dados.set('cav', fCav.value);
      dados.set('qualCav', fCav.value === 'Sim' ? fQualCav.value.trim() : '');
      dados.set('origem', 'site');

      enviando(true);
      nota('Enviando sua inscrição...', '');
      enviar(dados, '');
    });

    /* aviso: texto extra mostrado na confirmação (usado quando o Sister lota
       enquanto a pessoa preenchia o formulário) */
    function enviar(dados, aviso) {
      // form-urlencoded evita preflight CORS (o Apps Script não responde OPTIONS)
      var naoReenviar = false;
      fetch(INSCRICAO_URL, { method: 'POST', body: dados })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.erro === 'sister-lotado') {
            // as vagas acabaram no meio do preenchimento: nada foi gravado.
            // Fecha o Sister na tela e reenvia só a inscrição da conferência.
            naoReenviar = true;
            sisterInfo = res.sister || { vagas: 0, aberto: false };
            SISTER_ABERTO = false;
            aplicarSister();
            dados.set('sister', '');
            dados.delete('prato');
            enviar(dados, 'As vagas do Sister se esgotaram enquanto você preenchia, então sua inscrição vale para as outras sessões da conferência.');
            return;
          }
          if (res && res.erro === 'prato-indisponivel') {
            // a opção fechou enquanto a página estava aberta: nada foi gravado
            naoReenviar = true;
            pratosAbertos = res.pratos || [];
            aplicarPratos();
            enviando(false);
            nota(notaOriginal, 'form-note');
            if (perguntaPrato()) {
              setErr(fPrato, 'Esse prato acabou de esgotar. Escolha outra opção.');
              fPrato.focus();
            }
            return;
          }
          if (res && res.ok === false) throw new Error(res.erro || 'falha');
          concluir(res && res.duplicado, aviso);
        })
        .catch(function () {
          if (naoReenviar) return;
          // sem ler a resposta, o servidor grava e sinaliza em vez de recusar
          dados.set('envio', 'cego');
          /* Se o navegador bloquear a leitura da resposta (CORS no redirect do
             Google), reenviamos em no-cors: não dá para ler o retorno, mas a
             linha é gravada do mesmo jeito. A duplicidade é tratada no servidor,
             então reenviar não gera linha repetida. */
          return fetch(INSCRICAO_URL, { method: 'POST', mode: 'no-cors', body: dados })
            .then(function () { concluir(false, aviso); })
            .catch(function () { falhar(); });
        });
    }

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

    /* ---------- Tela de sucesso ----------
       Cobre o formulário com a confirmação e já devolve os campos limpos por
       baixo: quem quiser inscrever outra pessoa só toca em "Fazer outra". */
    var telaOk = document.getElementById('inscOk');
    var okTitle = document.getElementById('okTitle');
    var okMsg = document.getElementById('okMsg');
    var okSister = document.getElementById('okSister');
    var okPrato = document.getElementById('okPrato');
    var okNova = document.getElementById('okNova');
    var camposForm = Array.prototype.filter.call(form.children, function (el) { return el !== telaOk; });

    function ajustarAltura() {
      // se a confirmação (com a paleta) for mais alta que o formulário, o
      // formulário cresce para ela não vazar por cima do rodapé
      form.style.minHeight = '';
      if (!telaOk.hidden && telaOk.scrollHeight > form.offsetHeight) form.style.minHeight = telaOk.scrollHeight + 'px';
    }

    function concluir(duplicado, aviso) {
      var nome = fNome.value.trim().split(/\s+/)[0];
      nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
      var vaiAoSister = SISTER_ABERTO && fSexo.value === 'Feminino' && fSister.value === 'Sim';
      var prato = fPrato.value;

      okTitle.textContent = duplicado ? 'Você já tinha se inscrito' : 'Inscrição confirmada!';
      okMsg.textContent = duplicado
        ? nome + ', encontramos uma inscrição com esse telefone. Está tudo certo, não precisa fazer de novo.'
        : 'Que alegria, ' + nome + '! Sua inscrição está garantida. Nos vemos de 25 a 27 de setembro.';
      if (aviso) okMsg.textContent += ' ' + aviso;

      okSister.hidden = !vaiAoSister;
      // em inscrição repetida o prato novo não é gravado, então não confirmamos
      var mostraPrato = vaiAoSister && prato && !duplicado;
      okPrato.hidden = !mostraPrato;
      if (mostraPrato) okPrato.textContent = 'Seu prato para o brunch: ' + prato + (prato === 'Doce' ? ' 🍰' : ' 🥐') + '. Não esqueça de levar no sábado!';

      limparFormulario();

      telaOk.classList.remove('saindo');
      telaOk.hidden = false;
      camposForm.forEach(function (el) { el.inert = true; });
      ajustarAltura();
      window.addEventListener('resize', ajustarAltura);

      // traz o topo da confirmação para a tela, descontando o menu fixo
      var nav = document.getElementById('nav');
      var topo = form.getBoundingClientRect().top + window.pageYOffset - (nav ? nav.offsetHeight : 0) - 16;
      window.scrollTo({ top: topo, behavior: reduce ? 'auto' : 'smooth' });
      okTitle.focus({ preventScroll: true });
    }

    function limparFormulario() {
      form.reset();
      form.querySelectorAll('.inp').forEach(function (i) { setErr(i, ''); });
      syncCondicionais();
      enviando(false);
      nota(notaOriginal, 'form-note');
      if (formNote) { formNote.style.cursor = ''; formNote.onclick = null; }
    }

    okNova.addEventListener('click', function () {
      var fechar = function () {
        telaOk.hidden = true;
        telaOk.classList.remove('saindo');
        camposForm.forEach(function (el) { el.inert = false; });
        window.removeEventListener('resize', ajustarAltura);
        form.style.minHeight = '';
        fNome.focus();
      };
      if (reduce) return fechar();
      telaOk.classList.add('saindo');
      setTimeout(fechar, 280);
    });

    function falhar() {
      enviando(false);
      var texto = [
        'Olá! Quero fazer minha inscrição na Conferência Céus Abertos 2026.',
        '',
        '• Nome: ' + fNome.value.trim(),
        '• WhatsApp: ' + fZap.value.trim(),
        '• Sexo: ' + fSexo.value,
        (SISTER_ABERTO && fSexo.value === 'Feminino') ? '• Sister (sábado, 18h): ' + fSister.value : '',
        fPrato.value ? '• Prato para o brunch: ' + fPrato.value : '',
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
