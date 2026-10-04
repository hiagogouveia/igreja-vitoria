/* ============================================================
   CARAVANA ANASTÁCIO · Conferência Mercosul — Igreja Vitória
   Vanilla JS, sem dependências. A reserva grava na aba
   "Caravana Anastácio" da mesma planilha das outras inscrições
   (parâmetro destino=caravana).
   ============================================================ */
(function () {
  'use strict';

  var ZAP_DAYANE = '5567992382965'; // Dayane Felix · comprovantes e reservas
  var VALOR_POLTRONA = 60;          // mesmo valor do servidor (VALOR_POLTRONA no .gs)
  var IDADE_COLO = 5;               // até 5 anos pode ir no colo, sem poltrona

  /* Mesmo endpoint das outras páginas: o Apps Script escolhe a aba pelo
     parâmetro "destino". Enviamos form-urlencoded de propósito — é uma
     simple request, então não dispara preflight CORS, que o Apps Script
     não responde. Se a URL da implantação mudar, é só trocar aqui. */
  var INSCRICAO_URL = 'https://script.google.com/macros/s/AKfycbwTMAjrbR4CH8uhM6WUmjAm1GFQmzPCudRzaszOUDgw3Ush8IHJYpNkdw-_Wi6WYDuicg/exec';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function dinheiro(v) {
    return 'R$ ' + v.toFixed(2).replace('.', ',');
  }

  ready(function () {
    /* ---------- copiar a chave PIX ---------- */
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

    var form = document.getElementById('caravForm');
    var fora = document.getElementById('caravFora');
    var esgotado = document.getElementById('caravEsgotado');
    var carregando = document.getElementById('caravCarregando');
    if (!form) return;

    /* ---------- vagas ----------
       O total de vagas mora na planilha (aba "Caravana Anastácio", célula Q2)
       e o servidor desconta as poltronas já reservadas. Aqui não existe
       número nenhum: sem resposta do servidor, a página fica só com
       "Vagas limitadas". */
    var vagasRestantes = null; // null = planilha sem limite configurado

    function mostrarVagas(caravana) {
      var temLimite = !!(caravana && caravana.limite > 0 && typeof caravana.vagas === 'number');
      vagasRestantes = temLimite ? caravana.vagas : null;
      var texto = '';
      if (temLimite) {
        texto = caravana.vagas === 0 ? 'Vagas esgotadas'
          : caravana.vagas === 1 ? 'Resta 1 vaga'
          : 'Restam ' + caravana.vagas + ' vagas';
      }
      document.querySelectorAll('[data-vagas]').forEach(function (el) {
        el.textContent = texto;
        el.hidden = !temLimite;
      });
      return temLimite && caravana.vagas === 0;
    }

    /* Depois de uma reserva, pergunta de novo ao servidor em vez de
       descontar aqui: a conta certa é sempre a da planilha. */
    function atualizarVagas() {
      fetch(INSCRICAO_URL)
        .then(function (r) { return r.json(); })
        .then(function (res) { if (res && res.aceitaCaravana) mostrarVagas(res.caravana); })
        .catch(function () { /* mantém o que está na tela */ });
    }

    /* ---------- só mostra o formulário se o servidor souber gravar ----------
       Mostra um dos dois depois da resposta, para o aviso de "fora do ar"
       não piscar na abertura da página. */
    var decidido = false;
    function mostrar(aceita, lotado) {
      if (decidido) return;
      decidido = true;
      if (carregando) carregando.hidden = true;
      form.hidden = !aceita || lotado;
      if (fora) fora.hidden = aceita;
      if (esgotado) esgotado.hidden = !(aceita && lotado);
    }
    // rede muito lenta: depois de 12s assume que não vai responder
    var prazo = setTimeout(function () { mostrar(false); }, 12000);

    fetch(INSCRICAO_URL)
      .then(function (r) { return r.json(); })
      .then(function (res) {
        clearTimeout(prazo);
        /* Só abre o formulário se esta implantação já grava os acompanhantes:
           com o script antigo, os nomes e CPFs se perderiam sem aviso. */
        var aceita = !!(res && res.aceitaCaravana && res.aceitaAcompanhantes);
        var lotado = aceita ? mostrarVagas(res.caravana) : false;
        mostrar(aceita, lotado);
      })
      .catch(function () { clearTimeout(prazo); mostrar(false); });

    var fNome = document.getElementById('cNome');
    var fZap = document.getElementById('cZap');
    var fCpf = document.getElementById('cCpf');
    var fAdultos = document.getElementById('cAdultos');
    var fLeva = document.getElementById('cLevaCriancas');
    var listaAdultos = document.getElementById('listaAdultos');
    var fldQtd = document.getElementById('fldQtdCriancas');
    var fQtd = document.getElementById('cQtdCriancas');
    var lista = document.getElementById('listaCriancas');
    var resPoltronas = document.getElementById('resPoltronas');
    var resValor = document.getElementById('resValor');
    var nota = document.getElementById('caravNote');
    var telaOk = document.getElementById('caravOk');
    var okMsg = document.getElementById('okMsg');
    var okTitle = document.getElementById('okTitle');
    var okZap = document.getElementById('okZap');
    var okOutra = document.getElementById('okOutra');

    /* ---------- máscaras ---------- */
    function maskPhone(v) {
      v = v.replace(/\D/g, '').slice(0, 11);
      if (v.length <= 10) return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
      return v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    }
    function maskCpf(v) {
      v = v.replace(/\D/g, '').slice(0, 11);
      return v
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
    }
    fZap.addEventListener('input', function () { fZap.value = maskPhone(fZap.value); });
    fCpf.addEventListener('input', function () { fCpf.value = maskCpf(fCpf.value); });

    /* ---------- adultos acompanhantes ----------
       Quem reserva já é o adulto 1. Para cada adulto a mais, nome completo e
       CPF: a lista do ônibus precisa de todos. Blocos já preenchidos ficam
       quando a quantidade muda. */
    function montarAdultos() {
      var extras = Math.min(Math.max(inteiro(fAdultos.value, 1), 1), 20) - 1;
      var atuais = listaAdultos.querySelectorAll('.crianca').length;
      for (var i = atuais; i < extras; i++) listaAdultos.appendChild(blocoAdulto(i + 2));
      for (var j = atuais; j > extras; j--) listaAdultos.removeChild(listaAdultos.lastElementChild);
      listaAdultos.hidden = extras === 0;
      limparAoDigitar(listaAdultos);
    }

    function blocoAdulto(n) {
      var div = document.createElement('div');
      div.className = 'crianca';
      div.innerHTML =
        '<div class="crianca-top"><span class="crianca-num">Adulto ' + n + '</span></div>' +
        '<div class="crianca-campos">' +
          '<div class="fld">' +
            '<label for="aNome' + n + '">Nome completo</label>' +
            '<input class="inp" type="text" id="aNome' + n + '" data-nome placeholder="Nome do acompanhante" autocomplete="off">' +
            '<span class="errmsg" data-err></span>' +
          '</div>' +
          '<div class="fld">' +
            '<label for="aCpf' + n + '">CPF</label>' +
            '<input class="inp" type="text" id="aCpf' + n + '" data-cpf placeholder="000.000.000-00" inputmode="numeric" maxlength="14" autocomplete="off">' +
            '<span class="errmsg" data-err></span>' +
          '</div>' +
        '</div>';
      var cpf = div.querySelector('[data-cpf]');
      cpf.addEventListener('input', function () { cpf.value = maskCpf(cpf.value); });
      return div;
    }

    function acompanhantes() {
      return Array.prototype.map.call(listaAdultos.querySelectorAll('.crianca'), function (div) {
        return { nome: div.querySelector('[data-nome]').value.trim(), cpf: div.querySelector('[data-cpf]').value.trim() };
      });
    }

    /* CPF de verdade: 11 dígitos, não todos iguais, dois dígitos verificadores.
       Mesma checagem roda no servidor — aqui é só para avisar antes de enviar. */
    function cpfValido(valor) {
      var cpf = String(valor || '').replace(/\D/g, '');
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
      for (var corte = 9; corte < 11; corte++) {
        var soma = 0;
        for (var i = 0; i < corte; i++) soma += parseInt(cpf.charAt(i), 10) * (corte + 1 - i);
        var dig = (soma * 10) % 11;
        if (dig === 10) dig = 0;
        if (dig !== parseInt(cpf.charAt(corte), 10)) return false;
      }
      return true;
    }

    /* ---------- erros por campo ---------- */
    function setErr(input, msg) {
      input.classList.toggle('err', !!msg);
      var holder = input.parentNode.querySelector('[data-err]');
      if (holder) holder.textContent = msg || '';
    }
    function limparAoDigitar(escopo) {
      escopo.querySelectorAll('.inp').forEach(function (inp) {
        if (inp.dataset.limpaErro) return;
        inp.dataset.limpaErro = '1';
        var limpa = function () { if (inp.classList.contains('err')) setErr(inp, ''); };
        inp.addEventListener('input', limpa);
        inp.addEventListener('change', limpa);
      });
    }
    limparAoDigitar(form);

    /* ---------- blocos de criança ---------- */
    function inteiro(v, padrao) {
      var n = parseInt(String(v).replace(/\D/g, ''), 10);
      return isNaN(n) ? padrao : n;
    }

    /* Mantém na tela um bloco por criança: idade e como ela viaja.
       Blocos já preenchidos são preservados quando a quantidade muda. */
    function montarCriancas() {
      var quantas = fLeva.value === 'Sim' ? Math.min(Math.max(inteiro(fQtd.value, 0), 0), 10) : 0;
      var atuais = lista.querySelectorAll('.crianca').length;

      for (var i = atuais; i < quantas; i++) lista.appendChild(blocoCrianca(i));
      for (var j = atuais; j > quantas; j--) lista.removeChild(lista.lastElementChild);

      lista.hidden = quantas === 0;
      limparAoDigitar(lista);
      atualizarResumo();
    }

    function blocoCrianca(indice) {
      var div = document.createElement('div');
      div.className = 'crianca';
      var n = indice + 1;
      div.innerHTML =
        '<div class="crianca-top">' +
          '<span class="crianca-num">Criança ' + n + '</span>' +
          '<span class="crianca-tag" data-tag>—</span>' +
        '</div>' +
        '<div class="fld">' +
          '<label for="cNomeCrianca' + n + '">Nome da criança</label>' +
          '<input class="inp" type="text" id="cNomeCrianca' + n + '" data-nome placeholder="Nome completo" autocomplete="off">' +
          '<span class="errmsg" data-err></span>' +
        '</div>' +
        '<div class="crianca-campos">' +
          '<div class="fld">' +
            '<label for="cIdade' + n + '">Idade</label>' +
            '<input class="inp" type="number" id="cIdade' + n + '" data-idade min="0" max="17" step="1" inputmode="numeric" placeholder="anos">' +
            '<span class="errmsg" data-err></span>' +
          '</div>' +
          '<div class="fld">' +
            '<label for="cLugar' + n + '">Como vai viajar?</label>' +
            '<select class="inp" id="cLugar' + n + '" data-lugar>' +
              '<option value="colo">No colo (sem poltrona)</option>' +
              '<option value="poltrona">Em poltrona (R$ 60,00)</option>' +
            '</select>' +
            '<span class="errmsg" data-err></span>' +
          '</div>' +
        '</div>';

      var idade = div.querySelector('[data-idade]');
      var lugar = div.querySelector('[data-lugar]');
      idade.addEventListener('input', function () { aplicarRegra(div); });
      idade.addEventListener('change', function () { aplicarRegra(div); });
      lugar.addEventListener('change', function () { aplicarRegra(div); });
      return div;
    }

    /* A regra oficial: até 5 anos pode ir no colo; acima disso a criança
       ocupa poltrona e paga, então a opção "no colo" sai do ar. */
    function aplicarRegra(div) {
      var idade = div.querySelector('[data-idade]');
      var lugar = div.querySelector('[data-lugar]');
      var tag = div.querySelector('[data-tag]');
      var opColo = lugar.querySelector('option[value="colo"]');
      var anos = idade.value === '' ? null : inteiro(idade.value, -1);

      var precisaPoltrona = anos !== null && anos > IDADE_COLO;
      opColo.disabled = precisaPoltrona;
      if (precisaPoltrona) lugar.value = 'poltrona';

      tag.className = 'crianca-tag';
      if (anos === null) {
        tag.textContent = '—';
      } else if (precisaPoltrona) {
        tag.textContent = 'Poltrona · R$ 60,00';
        tag.classList.add('paga');
      } else if (lugar.value === 'poltrona') {
        tag.textContent = 'Poltrona · R$ 60,00';
        tag.classList.add('paga');
      } else {
        tag.textContent = 'No colo · grátis';
        tag.classList.add('gratis');
      }
      atualizarResumo();
    }

    /* ---------- resumo ---------- */
    function contagem() {
      var adultos = Math.min(Math.max(inteiro(fAdultos.value, 1), 1), 20);
      var blocos = lista.querySelectorAll('.crianca');
      var criancas = fLeva.value === 'Sim' ? blocos.length : 0;
      var comPoltrona = 0;
      if (fLeva.value === 'Sim') {
        blocos.forEach(function (div) {
          if (div.querySelector('[data-lugar]').value === 'poltrona') comPoltrona++;
        });
      }
      var poltronas = adultos + comPoltrona;
      return {
        adultos: adultos,
        criancas: criancas,
        comPoltrona: comPoltrona,
        noColo: criancas - comPoltrona,
        poltronas: poltronas,
        valor: poltronas * VALOR_POLTRONA
      };
    }

    function atualizarResumo() {
      var c = contagem();
      if (resPoltronas) resPoltronas.textContent = String(c.poltronas);
      if (resValor) resValor.textContent = dinheiro(c.valor);
    }

    fAdultos.addEventListener('input', function () { montarAdultos(); atualizarResumo(); });
    fAdultos.addEventListener('change', function () { montarAdultos(); atualizarResumo(); });
    fQtd.addEventListener('input', montarCriancas);
    fQtd.addEventListener('change', montarCriancas);
    fLeva.addEventListener('change', function () {
      var leva = fLeva.value === 'Sim';
      fldQtd.hidden = !leva;
      if (leva) {
        if (!fQtd.value) fQtd.value = '1';
      } else {
        fQtd.value = '';
        setErr(fQtd, '');
      }
      montarCriancas();
      if (leva) fQtd.focus();
    });
    atualizarResumo();

    /* ---------- envio ---------- */
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
      req(fCpf, cpfValido(fCpf.value), 'Informe um CPF válido.');
      req(fAdultos, inteiro(fAdultos.value, 0) >= 1, 'Informe pelo menos uma pessoa adulta.');

      var cpfsVistos = [fCpf.value.replace(/\D/g, '')];
      listaAdultos.querySelectorAll('.crianca').forEach(function (div) {
        var nomeAc = div.querySelector('[data-nome]');
        var cpfAc = div.querySelector('[data-cpf]');
        req(nomeAc, nomeAc.value.trim().length > 2, 'Informe o nome completo.');
        var digitosAc = cpfAc.value.replace(/\D/g, '');
        if (!cpfValido(cpfAc.value)) {
          req(cpfAc, false, 'Informe um CPF válido.');
        } else {
          req(cpfAc, cpfsVistos.indexOf(digitosAc) === -1, 'Esse CPF já está nesta reserva.');
          cpfsVistos.push(digitosAc);
        }
      });

      if (fLeva.value === 'Sim') {
        req(fQtd, inteiro(fQtd.value, 0) >= 1, 'Informe quantas crianças.');
        lista.querySelectorAll('.crianca').forEach(function (div) {
          var nomeCri = div.querySelector('[data-nome]');
          req(nomeCri, nomeCri.value.trim().length > 1, 'Informe o nome da criança.');
          var idade = div.querySelector('[data-idade]');
          var anos = idade.value === '' ? null : inteiro(idade.value, -1);
          req(idade, anos !== null && anos >= 0 && anos <= 17, 'Informe a idade da criança.');
        });
      }
      if (!ok) return;

      var c = contagem();
      if (vagasRestantes !== null && c.poltronas > vagasRestantes) {
        msg(vagasRestantes === 0
          ? 'As poltronas do ônibus acabaram. Fale com a Dayane para entrar na lista de espera.'
          : 'Esta reserva soma ' + c.poltronas + ' poltronas, mas ' +
            (vagasRestantes === 1 ? 'resta só 1' : 'restam só ' + vagasRestantes) + '. Ajuste a quantidade.', 'form-err');
        return;
      }
      var idades = [];
      lista.querySelectorAll('.crianca').forEach(function (div) {
        var nomeCri = div.querySelector('[data-nome]').value.trim();
        var anos = div.querySelector('[data-idade]').value;
        var lugar = div.querySelector('[data-lugar]').value === 'poltrona' ? 'poltrona' : 'colo';
        idades.push(nomeCri + ', ' + anos + ' anos (' + lugar + ')');
      });

      var dados = new URLSearchParams();
      dados.set('destino', 'caravana');
      dados.set('nome', fNome.value.trim());
      dados.set('telefone', fZap.value.trim());
      dados.set('cpf', fCpf.value.trim());
      dados.set('adultos', String(c.adultos));
      dados.set('criancas', String(c.criancas));
      dados.set('criancasPoltrona', String(c.comPoltrona));
      dados.set('acompanhantes', JSON.stringify(acompanhantes()));
      dados.set('idades', idades.join(' · '));
      dados.set('origem', 'site');

      enviando(true);
      msg('Enviando sua reserva...', 'form-note');

      fetch(INSCRICAO_URL, { method: 'POST', body: dados })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok === false) {
            if (res.erro === 'caravana-lotada') return lotou(res.caravana);
            throw new Error(res.erro || 'falha');
          }
          concluir(res && res.duplicado, c);
        })
        .catch(function () {
          /* Se o navegador bloquear a leitura da resposta (CORS no redirect do
             Google), reenviamos em no-cors: não dá para ler o retorno, mas a
             linha é gravada. A duplicidade é tratada no servidor, então
             reenviar não cria linha repetida. */
          return fetch(INSCRICAO_URL, { method: 'POST', mode: 'no-cors', body: dados })
            .then(function () { concluir(false, c); })
            .catch(falhar);
        });
    });

    function enviando(estado) {
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.disabled = estado;
      btn.style.opacity = estado ? '.6' : '';
      btn.style.cursor = estado ? 'progress' : '';
      btn.textContent = estado ? 'Enviando...' : 'Reservar minha vaga';
    }

    function msg(texto, classe) {
      if (!nota) return;
      nota.className = classe;
      nota.textContent = texto;
      nota.onclick = null;
      nota.style.cursor = '';
    }

    /* ---------- tela de sucesso ---------- */
    function concluir(duplicado, c) {
      enviando(false);
      msg('Usamos seus dados apenas para organizar a caravana e falar com você pelo WhatsApp.', 'form-note');

      var plural = c.poltronas > 1 ? 's' : '';
      okTitle.textContent = duplicado ? 'Você já tinha reservado' : 'Reserva registrada!';
      okMsg.textContent = duplicado
        ? 'Já existe uma reserva com esse WhatsApp. Não registramos de novo, para não duplicar. Se precisar mudar algo, fale com a Dayane.'
        : c.poltronas + ' poltrona' + plural + ' reservada' + plural + ' · ' + dinheiro(c.valor) +
          '. A reserva fica confirmada quando o pagamento for feito e o comprovante chegar para a Dayane, com nome completo e CPF.';

      var texto = [
        'Olá, Dayane! Fiz minha reserva na Caravana Anastácio pelo site.',
        '',
        'Nome completo: ' + fNome.value.trim(),
        'CPF: ' + fCpf.value.trim(),
        'Poltronas: ' + c.poltronas,
        'Valor: ' + dinheiro(c.valor),
        '',
        'Segue o comprovante de pagamento.'
      ].join('\n');
      okZap.href = 'https://wa.me/' + ZAP_DAYANE + '?text=' + encodeURIComponent(texto);

      telaOk.hidden = false;
      telaOk.classList.remove('saindo');
      okTitle.focus();
      limpar();
      atualizarVagas();
    }

    /* Campos limpos por trás da tela de sucesso: quem for reservar outra
       vaga já encontra o formulário em branco. */
    function limpar() {
      fNome.value = '';
      fZap.value = '';
      fCpf.value = '';
      fAdultos.value = '1';
      listaAdultos.innerHTML = '';
      listaAdultos.hidden = true;
      fLeva.value = 'Não';
      fQtd.value = '';
      fldQtd.hidden = true;
      lista.innerHTML = '';
      lista.hidden = true;
      form.querySelectorAll('.inp').forEach(function (i) { setErr(i, ''); });
      atualizarResumo();
    }

    if (okOutra) {
      okOutra.addEventListener('click', function () {
        telaOk.classList.add('saindo');
        setTimeout(function () {
          telaOk.hidden = true;
          telaOk.classList.remove('saindo');
          fNome.focus();
        }, 300);
      });
    }

    /* ---------- ônibus cheio ---------- */
    function lotou(caravana) {
      enviando(false);
      mostrarVagas(caravana);
      var vagas = caravana && typeof caravana.vagas === 'number' ? caravana.vagas : 0;
      msg(vagas > 0
        ? (vagas === 1 ? 'Resta só 1 poltrona' : 'Restam só ' + vagas + ' poltronas') + ' no ônibus. Ajuste a quantidade ou fale com a Dayane.'
        : 'As poltronas do ônibus acabaram. Fale com a Dayane para entrar na lista de espera.', 'form-err');
      if (nota) {
        nota.style.cursor = 'pointer';
        nota.onclick = function () {
          window.open('https://wa.me/' + ZAP_DAYANE, '_blank', 'noopener');
        };
      }
    }

    /* Para a reserva feita à mão pela Dayane quando o envio falha. */
    function listaAcompanhantesTexto() {
      var lista = acompanhantes();
      if (!lista.length) return [];
      return ['', 'Acompanhantes:'].concat(lista.map(function (a) { return '• ' + a.nome + ' · CPF ' + a.cpf; }));
    }
    function listaCriancasTexto() {
      var blocos = fLeva.value === 'Sim' ? lista.querySelectorAll('.crianca') : [];
      if (!blocos.length) return [];
      return ['', 'Crianças:'].concat(Array.prototype.map.call(blocos, function (div) {
        return '• ' + div.querySelector('[data-nome]').value.trim() + ', ' + div.querySelector('[data-idade]').value +
          ' anos (' + (div.querySelector('[data-lugar]').value === 'poltrona' ? 'poltrona' : 'colo') + ')';
      }));
    }

    function falhar() {
      enviando(false);
      var c = contagem();
      var texto = [
        'Olá, Dayane! Quero reservar minha vaga na Caravana Anastácio.',
        '',
        'Nome completo: ' + fNome.value.trim(),
        'WhatsApp: ' + fZap.value.trim(),
        'CPF: ' + fCpf.value.trim(),
        'Adultos: ' + c.adultos,
        'Crianças: ' + c.criancas + (c.criancas ? ' (' + c.comPoltrona + ' em poltrona, ' + c.noColo + ' no colo)' : ''),
        'Poltronas: ' + c.poltronas,
        'Valor: ' + dinheiro(c.valor)
      ].concat(
        listaAcompanhantesTexto(),
        listaCriancasTexto()
      ).join('\n');
      msg('Não conseguimos enviar agora. Toque aqui para concluir pelo WhatsApp.', 'form-err');
      if (nota) {
        nota.style.cursor = 'pointer';
        nota.onclick = function () {
          window.open('https://wa.me/' + ZAP_DAYANE + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
        };
      }
    }
  });
})();
