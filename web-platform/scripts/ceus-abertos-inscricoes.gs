/**
 * Inscrições · Igreja Vitória
 * Recebe formulários do site e grava na planilha, uma aba por finalidade.
 * O site escolhe a aba pelo parâmetro "destino":
 *
 *   deep ............ aba "Deep" (inscrição do curso; hoje fechada, ver DEEP_FECHADO)
 *   deep-interesse .. aba "Deep · Interessados" (lista de espera da próxima turma)
 *   tlc ............. aba "TLC" (Treinamento de Líderes de CAV)
 *   testemunho ...... aba "Testemunhos"
 *
 * Destino ausente ou desconhecido é recusado (erro "destino-invalido"), para
 * nunca gravar na aba errada. As abas são criadas sozinhas no primeiro envio.
 *
 * TLC
 *   O formulário de /tlc grava na aba "TLC": nome, telefone, e-mail, endereço,
 *   data de nascimento, sexo e se a pessoa quer ser anfitriã (abrir uma CAV na
 *   casa dela). A coluna Idade (H) é uma fórmula sobre a data de nascimento (G).
 *   Inscrição repetida (mesmo telefone ou mesmo e-mail) não grava de novo. A mesma pessoa (mesmo telefone) só entra uma vez.
 *
 * INTERESSADOS NO DEEP
 *   Com as inscrições encerradas, o site do Deep recolhe quem quer ser
 *   avisado da próxima turma. Sem valor e sem pagamento: é só uma lista de espera.
 *
 * TESTEMUNHOS
 *   O formulário de testemunho do site da conferência. Não tem trava de
 *   repetição: a mesma pessoa pode mandar mais de um.
 *
 * PRESENÇA DO DEEP
 *   A aba "Deep · Presença" tem os inscritos do Deep em ordem alfabética e uma
 *   caixinha por aula (6 segundas a partir de 21/09). Cada nova inscrição no
 *   Deep entra nela sozinha. Para criar a aba ou puxar nomes que faltam, rode
 *   criarPresencaDeep pelo editor.
 *
 * COMO ATUALIZAR (precisa ser feito a cada mudança neste arquivo)
 *   1. Cole este conteúdo no Código.gs e salve
 *   2. Implantar → Gerenciar implantações → editar (lápis)
 *      → Versão: "Nova versão" → Implantar
 *   Só salvar NÃO atualiza a URL pública.
 */

var PLANILHA_ID = '1as5jde5YMTVBaKYD2SRrIEpQQwGSa0F3azPXC5K7KuA';

/** Fuso de Campo Grande/MS (UTC-4 o ano todo — o Brasil não tem mais horário
 *  de verão). Sem isso o Google grava no fuso padrão do projeto (UTC-7) e o
 *  horário da inscrição sai 3h atrasado. */
var FUSO = 'America/Campo_Grande';

var COLUNAS_DEEP = [
  'Data/Hora', 'Nome', 'Telefone', 'Telefone (só dígitos)', 'E-mail',
  'Endereço', 'Data de nascimento', 'Origem'
];

var COL_TELEFONE_DIGITOS = 4; // 1-indexado, igual em todas as abas

/* Inscrições do Deep encerradas. Para reabrir, volte para false (e troque
   DEEP_ABERTO no /deep/script.js do site). */
var DEEP_FECHADO = true;

var ABA_INTERESSE_DEEP = 'Deep · Interessados';
var COLUNAS_INTERESSE_DEEP = [
  'Data/Hora', 'Nome', 'Telefone', 'Telefone (só dígitos)', 'E-mail',
  'Endereço', 'Data de nascimento', 'Origem'
];

/* Inscrições do TLC (Treinamento de Líderes de CAV), destino=tlc.
   Telefone (só dígitos) fica na coluna 4, como nas outras abas: é por ela que
   jaInscrito() barra a mesma pessoa duas vezes. */
var ABA_TLC = 'TLC';
var COLUNAS_TLC = [
  'Data/Hora', 'Nome', 'Telefone', 'Telefone (só dígitos)', 'E-mail',
  'Endereço', 'Data de nascimento', 'Idade', 'Sexo', 'Quer ser anfitrião?', 'Origem'
];
var COL_NASC_TLC = 7;  // G: data de nascimento (data de verdade)
var COL_IDADE_TLC = 8; // H: idade, calculada pela planilha a partir da coluna G

var ABA_TESTEMUNHOS = 'Testemunhos';
var COLUNAS_TESTEMUNHO = [
  // coluna nova entra no FIM: as linhas já gravadas continuam alinhadas
  'Data/Hora', 'Nome', 'Telefone', 'Testemunho', 'Pode compartilhar', 'Origem',
  'Elogio ou sugestão'
];

var ABA_PRESENCA_DEEP = 'Deep · Presença';
var AULAS_DEEP = ['21/09', '28/09', '05/10', '12/10', '19/10', '26/10'];
// Na aba Deep, a coluna I é onde a igreja anota o pagamento ("pg pix", "pg dinheiro"...)
var COL_PAGAMENTO_DEEP = 9;

function abrirPlanilha() {
  var ss = SpreadsheetApp.openById(PLANILHA_ID);
  // Garante o fuso na própria planilha: a data fica correta na exibição,
  // continua sendo data de verdade (ordena e filtra) e não depende de ajuste manual.
  if (ss.getSpreadsheetTimeZone() !== FUSO) ss.setSpreadsheetTimeZone(FUSO);
  return ss;
}

/**
 * Escreve uma fórmula na célula. O separador de argumentos depende do
 * idioma da planilha (vírgula em inglês, ponto e vírgula em português), então
 * testa os dois e fica com o que a planilha aceitar.
 */
function escreverFormulaLocal(celula, montar) {
  var separadores = [';', ','];
  for (var i = 0; i < separadores.length; i++) {
    celula.setFormula(montar(separadores[i]));
    SpreadsheetApp.flush();
    if (String(celula.getDisplayValue()).charAt(0) !== '#') return separadores[i];
  }
  return null;
}

/** Aba do Deep: cria na primeira inscrição, com o cabeçalho próprio. */
function abaDeep(ss) {
  var sheet = ss.getSheetByName('Deep') || ss.insertSheet('Deep', ss.getSheets().length);
  garantirCabecalho(sheet, COLUNAS_DEEP);
  return sheet;
}

/**
 * Aba de chamada do Deep. Colunas: Nome, Telefone, uma caixinha por aula e o
 * total de presenças da pessoa. A linha 2 soma os presentes de cada aula.
 * As fórmulas não usam separador de argumentos, então funcionam em planilha
 * de qualquer idioma, e usam ROW() para continuar certas quando a aba é
 * reordenada.
 */
function abaPresencaDeep(ss) {
  var sheet = ss.getSheetByName(ABA_PRESENCA_DEEP);
  if (sheet) return sheet;

  sheet = ss.insertSheet(ABA_PRESENCA_DEEP, ss.getSheets().length);
  var cab = ['Nome', 'Telefone'];
  AULAS_DEEP.forEach(function (data, i) { cab.push('Aula ' + (i + 1) + '\n' + data); });
  cab.push('Presenças');
  sheet.getRange(1, 1, 1, cab.length).setValues([cab])
    .setFontWeight('bold').setHorizontalAlignment('center').setWrap(true);

  sheet.getRange(2, 1).setValue('Presentes na aula');
  for (var c = 3; c < 3 + AULAS_DEEP.length; c++) {
    var letra = sheet.getRange(1, c).getA1Notation().replace(/\d+/g, '');
    sheet.getRange(2, c).setFormula('=SUMPRODUCT(' + letra + '3:' + letra + '*1)');
  }
  sheet.getRange(2, 1, 1, cab.length).setFontWeight('bold').setBackground('#EEF3F8');
  sheet.getRange(2, 3, 1, AULAS_DEEP.length + 1).setHorizontalAlignment('center');

  sheet.setFrozenRows(2);
  sheet.setFrozenColumns(1);
  sheet.setColumnWidth(1, 260);
  sheet.setColumnWidth(2, 130);
  for (var k = 3; k <= cab.length; k++) sheet.setColumnWidth(k, 85);
  return sheet;
}

/** Coluna "Pagamento" da chamada: logo depois de "Presenças". */
function colPagamentoPresenca() { return 3 + AULAS_DEEP.length + 1; }

/**
 * Pagamento de cada pessoa, puxado ao vivo da coluna I da aba Deep pelo
 * telefone. Em branco lá = "Não pago" aqui. É fórmula, então quando alguém
 * anota o pagamento na aba Deep a chamada já mostra, sem rodar nada.
 */
function formulaPagamento(sep) {
  var letra = String.fromCharCode(64 + COL_PAGAMENTO_DEEP);
  var achar = "INDEX('Deep'!" + letra + ':' + letra + sep +
    'MATCH(INDIRECT("B"&ROW())' + sep + "'Deep'!C:C" + sep + '0))';
  return '=IFERROR(IF(TRIM(' + achar + ')=""' + sep + '"Não pago"' + sep + 'TRIM(' + achar + '))' + sep + '"")';
}

/** Cria a coluna "Pagamento" (se faltar) e põe a fórmula nas linhas sem ela. */
function garantirColunaPagamento(pres) {
  var col = colPagamentoPresenca();
  var cab = pres.getRange(1, col);
  if (String(cab.getValue()).trim() === '') {
    cab.setValue('Pagamento').setFontWeight('bold').setHorizontalAlignment('center').setWrap(true);
    pres.setColumnWidth(col, 140);
    var regra = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Não pago').setFontColor('#B3261E').setBackground('#FDECEA')
      .setRanges([pres.getRange(3, col, Math.max(pres.getMaxRows() - 2, 1), 1)]).build();
    var regras = pres.getConditionalFormatRules();
    regras.push(regra);
    pres.setConditionalFormatRules(regras);
  }
  var ultima = pres.getLastRow();
  if (ultima < 3) return;
  var formulas = pres.getRange(3, col, ultima - 2, 1).getFormulas();
  var valores = pres.getRange(3, col, ultima - 2, 1).getDisplayValues();

  /* Só preenche onde está realmente vazio. Quem foi anotado à mão (por
     exemplo alguém da turma anterior, repondo aula, que não está na aba Deep)
     mantém o que foi escrito: a fórmula não passa por cima. */
  function faltaFormula(i) {
    return !formulas[i][0] && String(valores[i][0]).trim() === '';
  }
  var primeira = -1;
  for (var i = 0; i < formulas.length; i++) { if (faltaFormula(i)) { primeira = i; break; } }
  if (primeira === -1) return;
  // descobre o separador na primeira célula vazia e usa o mesmo no resto
  var sep = escreverFormulaLocal(pres.getRange(3 + primeira, col), formulaPagamento);
  if (!sep) return;
  for (var j = 0; j < formulas.length; j++) {
    if (j !== primeira && faltaFormula(j)) {
      pres.getRange(3 + j, col, 1, 1).setFormula(formulaPagamento(sep)).setHorizontalAlignment('center');
    }
  }
  pres.getRange(3, col, formulas.length, 1).setHorizontalAlignment('center');
}

/**
 * Garante a fórmula de "Presenças" em todas as linhas. Linhas digitadas à mão
 * entram sem ela, e o total da pessoa fica em branco.
 */
function garantirTotalPresencas(pres) {
  var colTotal = 3 + AULAS_DEEP.length;
  var ultima = pres.getLastRow();
  if (ultima < 3) return;
  var letraFim = pres.getRange(1, colTotal - 1).getA1Notation().replace(/\d+/g, '');
  var formula = '=SUMPRODUCT(INDIRECT("C"&ROW()&":' + letraFim + '"&ROW())*1)';
  var atuais = pres.getRange(3, colTotal, ultima - 2, 1).getFormulas();
  for (var i = 0; i < atuais.length; i++) {
    if (!atuais[i][0]) {
      pres.getRange(3 + i, colTotal, 1, 1).setFormula(formula).setHorizontalAlignment('center');
    }
  }
}

/** Nome comparável: sem acento, sem espaço sobrando, tudo minúsculo. */
function chaveNome(nome) {
  return String(nome).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').trim().toLowerCase();
}

/** "KAROLINA KURTZ FERNANDES" → "Karolina Kurtz Fernandes" (só na chamada). */
function nomeBonito(nome) {
  var minusculas = ['de', 'da', 'do', 'das', 'dos', 'e'];
  return String(nome).trim().toLowerCase().split(/\s+/).map(function (p, i) {
    if (i > 0 && minusculas.indexOf(p) !== -1) return p;
    return p.charAt(0).toUpperCase() + p.slice(1);
  }).join(' ');
}

/**
 * Acrescenta no fim da chamada quem está inscrito no Deep e ainda não está
 * nela, sem mexer nas caixinhas já marcadas. Compara pelo telefone, a mesma
 * chave que impede inscrição repetida no Deep. Com `ordenar`, reordena por
 * nome; a inscrição automática não ordena, para as linhas não mudarem de
 * lugar enquanto alguém marca a presença. Devolve quantas pessoas entraram.
 */
function sincronizarPresencaDeep(ss, ordenar) {
  var deep = abaDeep(ss);
  var pres = abaPresencaDeep(ss);
  var ultimaDeep = deep.getLastRow();
  if (ultimaDeep < 2) return 0;

  var inscritos = deep.getRange(2, 2, ultimaDeep - 1, 3).getValues();
  var nomePorTelefone = {};
  inscritos.forEach(function (r) {
    var digitos = String(r[2]).replace(/\D/g, '');
    if (digitos && String(r[0]).trim()) nomePorTelefone[digitos] = nomeBonito(r[0]);
  });

  // A aba Deep é a fonte: nome corrigido lá é corrigido aqui também.
  var jaNaChamada = {};
  var ultimaPres = pres.getLastRow();
  if (ultimaPres >= 3) {
    var linhas = pres.getRange(3, 1, ultimaPres - 2, 2).getDisplayValues();
    var nomes = linhas.map(function (r) { return [r[0]]; });
    var mudou = false;
    linhas.forEach(function (r, i) {
      var digitos = String(r[1]).replace(/\D/g, '');
      jaNaChamada[digitos] = true;
      var certo = nomePorTelefone[digitos];
      if (certo && certo !== r[0]) { nomes[i][0] = certo; mudou = true; }
    });
    if (mudou) pres.getRange(3, 1, nomes.length, 1).setValues(nomes);
  }

  var novos = [];
  inscritos.forEach(function (r) {
    var nome = String(r[0]).trim();
    var digitos = String(r[2]).replace(/\D/g, '');
    if (!nome || !digitos || jaNaChamada[digitos]) return;
    if (nome.toUpperCase().indexOf('TESTE') === 0) return;
    jaNaChamada[digitos] = true;
    novos.push([nomeBonito(nome), String(r[1]).trim()]);
  });
  if (!novos.length) {
    garantirTotalPresencas(pres);
    garantirColunaPagamento(pres);
    if (ordenar) ordenarPresencaDeep(pres);
    return 0;
  }

  var inicio = Math.max(ultimaPres, 2) + 1;
  var n = novos.length;
  var colTotal = 3 + AULAS_DEEP.length;
  var letraFim = pres.getRange(1, colTotal - 1).getA1Notation().replace(/\d+/g, '');
  pres.getRange(inicio, 1, n, 2).setValues(novos);
  pres.getRange(inicio, 3, n, AULAS_DEEP.length).insertCheckboxes().setHorizontalAlignment('center');
  var formulas = [];
  for (var i = 0; i < n; i++) {
    formulas.push(['=SUMPRODUCT(INDIRECT("C"&ROW()&":' + letraFim + '"&ROW())*1)']);
  }
  pres.getRange(inicio, colTotal, n, 1).setFormulas(formulas).setHorizontalAlignment('center');
  garantirTotalPresencas(pres);
  garantirColunaPagamento(pres);

  if (ordenar) ordenarPresencaDeep(pres);
  return n;
}

/** Ordena por nome levando a linha inteira, inclusive colunas acrescentadas à mão. */
function ordenarPresencaDeep(pres) {
  var total = pres.getLastRow() - 2;
  if (total < 2) return;
  var largura = Math.max(pres.getLastColumn(), 3 + AULAS_DEEP.length);
  pres.getRange(3, 1, total, largura).sort({ column: 1, ascending: true });
}

/**
 * Uso manual, pelo editor (Executar): cria a chamada ou puxa quem falta, e
 * deixa tudo em ordem alfabética. Pode rodar quantas vezes quiser.
 */
function criarPresencaDeep() {
  var ss = abrirPlanilha();
  var entraram = sincronizarPresencaDeep(ss, true);
  Logger.log('Deep · Presença → ' + entraram + ' pessoa(s) acrescentada(s). Total na chamada: ' +
    (abaPresencaDeep(ss).getLastRow() - 2));
}

/** Aba da lista de espera do Deep, criada no primeiro envio. */
function abaInteresseDeep(ss) {
  var sheet = ss.getSheetByName(ABA_INTERESSE_DEEP);
  if (!sheet) {
    sheet = ss.insertSheet(ABA_INTERESSE_DEEP, ss.getSheets().length);
    sheet.setColumnWidth(2, 260);
    sheet.setColumnWidth(6, 320);
  }
  garantirCabecalho(sheet, COLUNAS_INTERESSE_DEEP);
  return sheet;
}

/** Escreve a fórmula da idade (em anos completos) numa linha da aba TLC. */
function escreverIdadeTlc(sheet, linha) {
  var nasc = 'G' + linha;
  return escreverFormulaLocal(sheet.getRange(linha, COL_IDADE_TLC), function (sep) {
    return '=IFERROR(IF(ISNUMBER(' + nasc + ')' + sep + 'DATEDIF(' + nasc + sep + 'TODAY()' + sep + '"Y")' + sep + '"")' + sep + '"")';
  });
}

/**
 * Uso manual, pelo editor (Executar): recoloca a fórmula da idade em todas as
 * linhas da aba TLC (útil se alguém apagou ou colou por cima).
 */
function refazerIdadesTlc() {
  var sheet = abaTlc(abrirPlanilha());
  var ultima = sheet.getLastRow();
  for (var r = 2; r <= ultima; r++) escreverIdadeTlc(sheet, r);
  Logger.log('Idades refeitas em ' + Math.max(ultima - 1, 0) + ' linha(s).');
}

/** Aba das inscrições do TLC, criada no primeiro envio. */
function abaTlc(ss) {
  var sheet = ss.getSheetByName(ABA_TLC);
  if (!sheet) {
    sheet = ss.insertSheet(ABA_TLC, ss.getSheets().length);
    sheet.setColumnWidth(2, 260);
    sheet.setColumnWidth(5, 220);
    sheet.setColumnWidth(6, 320);
    sheet.setColumnWidth(COL_IDADE_TLC, 70);
  }
  garantirCabecalho(sheet, COLUNAS_TLC);
  return sheet;
}

/** Aba dos testemunhos, criada no primeiro envio. */
function abaTestemunhos(ss) {
  var sheet = ss.getSheetByName(ABA_TESTEMUNHOS);
  if (!sheet) {
    sheet = ss.insertSheet(ABA_TESTEMUNHOS, ss.getSheets().length);
    sheet.setColumnWidth(2, 240);
    sheet.setColumnWidth(4, 620);
    sheet.setColumnWidth(7, 420);
  }
  garantirCabecalho(sheet, COLUNAS_TESTEMUNHO);
  return sheet;
}

function doPost(e) {
  // Uma inscrição por vez: evita que dois envios simultâneos gravem na mesma
  // linha ou furem a checagem de duplicidade.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json({ ok: false, erro: 'ocupado' });
  }

  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var nome = String(p.nome || '').trim();
    var telefone = String(p.telefone || '').trim();
    var digitos = telefone.replace(/\D/g, '');

    // Testemunho é outro tipo de envio: texto obrigatório, telefone opcional.
    if (String(p.destino || '').toLowerCase() === 'testemunho') {
      var texto = String(p.testemunho || '').trim();
      if (nome.length < 3 || texto.length < 10) {
        return json({ ok: false, erro: 'dados incompletos' });
      }
      abaTestemunhos(abrirPlanilha()).appendRow([
        new Date(),
        nome,
        telefone,
        texto,
        String(p.compartilhar || '').trim(),
        String(p.origem || 'site'),
        String(p.sugestao || '').trim()
      ]);
      return json({ ok: true, duplicado: false });
    }

    // Validação mínima no servidor (o site já valida, mas nunca confie só no cliente)
    if (nome.length < 3 || digitos.length < 10) {
      return json({ ok: false, erro: 'dados incompletos' });
    }

    var ss = abrirPlanilha();
    var destino = String(p.destino || '').toLowerCase();

    if (destino === 'deep' && DEEP_FECHADO) {
      return json({ ok: false, erro: 'deep-fechado' });
    }

    if (destino === 'deep-interesse') {
      var listaEspera = abaInteresseDeep(ss);
      if (jaInscrito(listaEspera, digitos)) {
        return json({ ok: true, duplicado: true });
      }
      listaEspera.appendRow([
        new Date(),
        nome,
        telefone,
        "'" + digitos,
        String(p.email || '').trim(),
        String(p.endereco || '').trim(),
        String(p.nascimento || '').trim(),
        String(p.origem || 'site')
      ]);
      return json({ ok: true, duplicado: false });
    }
    if (destino === 'tlc') {
      var inscritosTlc = abaTlc(ss);
      // Repetida = mesmo telefone OU mesmo e-mail já na aba.
      if (jaInscritoTlc(inscritosTlc, digitos, p.email)) {
        return json({ ok: true, duplicado: true });
      }
      var nascimento = String(p.nascimento || '').trim();
      var nascData = null;
      try { nascData = Utilities.parseDate(nascimento, FUSO, 'dd/MM/yyyy'); } catch (errData) {}
      inscritosTlc.appendRow([
        new Date(),
        nome,
        telefone,
        "'" + digitos,
        String(p.email || '').trim(),
        String(p.endereco || '').trim(),
        nascData || nascimento, // data de verdade, para a idade poder ser calculada
        '',                     // idade: preenchida pela fórmula logo abaixo
        String(p.sexo || '').trim(),
        String(p.anfitriao || '').trim(),
        String(p.origem || 'site')
      ]);
      var linhaTlc = inscritosTlc.getLastRow();
      inscritosTlc.getRange(linhaTlc, COL_NASC_TLC).setNumberFormat('dd/MM/yyyy');
      // Idade sempre em dia: a planilha recalcula sozinha todo ano/dia.
      try { escreverIdadeTlc(inscritosTlc, linhaTlc); } catch (errIdade) {}
      return json({ ok: true, duplicado: false });
    }
    // Só o Deep chega até aqui; qualquer outro destino é recusado, para nunca
    // gravar na aba errada.
    if (destino !== 'deep') {
      return json({ ok: false, erro: 'destino-invalido' });
    }
    var sheet = abaDeep(ss);

    // Duplicidade pelo telefone normalizado, dentro da própria aba.
    if (jaInscrito(sheet, digitos)) {
      return json({ ok: true, duplicado: true });
    }

    sheet.appendRow([
      new Date(),
      nome,
      telefone,
      "'" + digitos, // apóstrofo força texto: preserva o zero à esquerda
      String(p.email || '').trim(),
      String(p.endereco || '').trim(),
      String(p.nascimento || '').trim(),
      String(p.origem || 'site')
    ]);
    // A chamada é um extra: se falhar, a inscrição já está gravada.
    try { sincronizarPresencaDeep(ss, false); } catch (errPresenca) {}

    return json({ ok: true, duplicado: false });
  } catch (err) {
    return json({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Inscrição repetida no TLC: o mesmo telefone (só dígitos, coluna D) ou o mesmo
 * e-mail (sem diferença de maiúsculas, coluna E) já está na aba.
 * Roda dentro do lock do doPost, então dois envios simultâneos não passam.
 */
function jaInscritoTlc(sheet, digitos, email) {
  var ultima = sheet.getLastRow();
  if (ultima < 2) return false;
  var mail = String(email || '').trim().toLowerCase();
  var linhas = sheet.getRange(2, COL_TELEFONE_DIGITOS, ultima - 1, 2).getValues();
  for (var i = 0; i < linhas.length; i++) {
    if (String(linhas[i][0]).replace(/\D/g, '') === digitos) return true;
    if (mail && String(linhas[i][1]).trim().toLowerCase() === mail) return true;
  }
  return false;
}

function jaInscrito(sheet, digitos) {
  var ultima = sheet.getLastRow();
  if (ultima < 2) return false;
  var existentes = sheet.getRange(2, COL_TELEFONE_DIGITOS, ultima - 1, 1).getValues();
  for (var i = 0; i < existentes.length; i++) {
    if (String(existentes[i][0]).replace(/\D/g, '') === digitos) return true;
  }
  return false;
}

/**
 * Escreve o cabeçalho se a aba estiver vazia. Se a aba já existe, só preenche
 * títulos de colunas novas que ainda estão em branco — nunca sobrescreve.
 */
function garantirCabecalho(sheet, colunas) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(colunas);
    sheet.getRange(1, 1, 1, colunas.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return;
  }
  var atual = sheet.getRange(1, 1, 1, colunas.length).getValues()[0];
  for (var i = 0; i < colunas.length; i++) {
    if (String(atual[i]).trim() === '') {
      sheet.getRange(1, i + 1).setValue(colunas[i]).setFontWeight('bold');
    }
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * O site consulta por GET o que esta implantação já sabe gravar (aceitaTlc,
 * aceitaInteresseDeep...). Com ?diag=1 devolve também contagens (só números,
 * nenhum dado pessoal): inscritos do Deep, chamada, interessados e TLC.
 */
function doGet(e) {
  try {
    var ss = abrirPlanilha();
    var resposta = {
      ok: true,
      servico: 'inscricoes-igreja-vitoria',
      deep: { aberto: !DEEP_FECHADO },
      // dizem ao site que esta implantação já sabe gravar cada coisa
      aceitaTestemunho: true,
      aceitaSugestao: true,
      aceitaInteresseDeep: true,
      aceitaTlc: true
    };
    if (e && e.parameter && e.parameter.diag) {
      var pres = ss.getSheetByName(ABA_PRESENCA_DEEP);
      var deep = ss.getSheetByName('Deep');
      resposta.deep = {
        aberto: !DEEP_FECHADO,
        inscritos: deep ? Math.max(deep.getLastRow() - 1, 0) : 0,
        abaPresencaExiste: !!pres,
        naChamada: pres ? Math.max(pres.getLastRow() - 2, 0) : 0
      };
      var test = ss.getSheetByName(ABA_TESTEMUNHOS);
      resposta.testemunhos = test ? Math.max(test.getLastRow() - 1, 0) : 0;
      var espera = ss.getSheetByName(ABA_INTERESSE_DEEP);
      resposta.deep.interessados = espera ? Math.max(espera.getLastRow() - 1, 0) : 0;
      var tlc = ss.getSheetByName(ABA_TLC);
      resposta.tlc = { inscritos: tlc ? Math.max(tlc.getLastRow() - 1, 0) : 0 };
    }
    return json(resposta);
  } catch (err) {
    return json({ ok: false, erro: String(err) });
  }
}

/**
 * Utilitário de uso manual: apaga as linhas de teste (Nome começando com
 * "TESTE") de todas as abas. Rode pelo editor (Executar), nunca pela web —
 * de propósito não está exposto no doPost.
 */
function limparTestes() {
  var ss = abrirPlanilha();
  var total = 0;
  ss.getSheets().forEach(function (sheet) {
    var ultima = sheet.getLastRow();
    if (ultima < 2) return;
    var nomes = sheet.getRange(2, 2, ultima - 1, 1).getValues(); // coluna Nome
    // De baixo para cima: apagar de cima desloca as linhas seguintes.
    for (var i = nomes.length - 1; i >= 0; i--) {
      if (String(nomes[i][0]).trim().toUpperCase().indexOf('TESTE') === 0) {
        sheet.deleteRow(i + 2);
        total++;
      }
    }
  });
  Logger.log('Linhas de teste removidas: ' + total);
}
