/**
 * Inscrições · Igreja Vitória
 * Recebe formulários do site e grava na planilha, uma aba por evento:
 *   - Conferência Céus Abertos 2026 → primeira aba (a que já existe)
 *   - Deep · Curso de Membresia ..... → aba "Deep" (criada automaticamente)
 *
 * O site escolhe a aba pelo parâmetro "destino" ("ceus-abertos" ou "deep").
 * Sem esse parâmetro, cai no Céus Abertos — mantém compatibilidade.
 *
 * CARAVANA ANASTÁCIO (Conferência Mercosul · 10/10)
 *   Reservas do ônibus, na aba "Caravana Anastácio" (destino=caravana).
 *   O servidor recalcula poltronas e valor a partir dos números enviados,
 *   em vez de confiar na conta feita no navegador.
 *   O TOTAL DE VAGAS fica na própria planilha, na aba "Caravana Anastácio",
 *   célula Q2 (com o título "Vagas no ônibus" em Q1). É a única fonte desse
 *   número: o site lê dali, desconta as poltronas reservadas e trava sozinho
 *   quando lota. Q2 vazia = sem limite. R2 mostra quantas vagas restam.
 *
 * INTERESSADOS NO DEEP
 *   Com as inscrições encerradas, o site do Deep recolhe quem quer ser
 *   avisado da próxima turma, na aba "Deep · Interessados" (destino=
 *   deep-interesse). Sem valor e sem pagamento: é só uma lista de espera.
 *
 * TESTEMUNHOS
 *   O site da conferência tem um formulário de testemunho, que grava na aba
 *   "Testemunhos" (criada automaticamente). Não tem trava de repetição: a
 *   mesma pessoa pode mandar mais de um.
 *
 * VAGAS DO SISTER
 *   O Sister tem LIMITE_SISTER vagas. A conta é feita aqui, na hora de
 *   gravar e dentro do lock, então duas inscrições simultâneas não furam o
 *   limite. Cheio, o site para de oferecer o Sister (a inscrição na
 *   conferência continua normal).
 *
 * CHECK-IN DO SISTER
 *   A aba "Sister · Check-in" lista, em ordem alfabética, as mulheres que
 *   marcaram "Sim" no Sister, com uma caixinha para marcar a chegada. Rode
 *   criarCheckinSister pelo editor para criar a aba ou puxar quem faltar
 *   (inclusive quem você inscrever à mão na aba da conferência).
 *
 * PRATOS DO SISTER
 *   Quem vai ao Sister escolhe levar um prato Salgado ou Doce para o brunch.
 *   A aba "Sister · Pratos" (criada automaticamente) controla quais opções o
 *   site oferece: desmarque a caixinha para fechar uma opção. Vale na hora,
 *   sem implantar nada. A mesma aba mostra quantas inscritas escolheram cada uma.
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

var COLUNAS_CEUS = [
  'Data/Hora', 'Nome', 'Telefone', 'Telefone (só dígitos)', 'Sexo', 'Sister',
  'Endereço', 'Bairro', 'Cidade', 'Já participa de CAV', 'Qual CAV', 'Origem',
  // colunas novas entram sempre no FIM: as linhas antigas continuam alinhadas
  'Prato (Sister)'
];

var COLUNAS_DEEP = [
  'Data/Hora', 'Nome', 'Telefone', 'Telefone (só dígitos)', 'E-mail',
  'Endereço', 'Data de nascimento', 'Origem'
];

var COL_TELEFONE_DIGITOS = 4; // 1-indexado, igual nas duas abas

/* Inscrições do Deep encerradas. Para reabrir, volte para false (e troque
   DEEP_ABERTO no /deep/script.js do site). */
var DEEP_FECHADO = true;

var VALOR_POLTRONA = 60;

/* Onde a equipe digita o total de vagas do ônibus (aba da caravana).
   Fica à direita das colunas das reservas, nas duas linhas congeladas,
   então aparece sempre no topo da aba. */
var CELULA_VAGAS_CARAVANA = 'Q2';
var CELULA_RESTANTES_CARAVANA = 'R2';

var ABA_CARAVANA = 'Caravana Anastácio';
var COLUNAS_CARAVANA = [
  'Data/Hora', 'Nome', 'Telefone', 'Telefone (só dígitos)', 'CPF', 'Adultos',
  'Leva crianças', 'Crianças (total)', 'Crianças (nome · idade · lugar)', 'Crianças no colo',
  'Crianças com poltrona', 'Poltronas', 'Valor estimado (R$)', 'Pagamento', 'Origem',
  'Acompanhantes adultos (nome · CPF)'
];
var TITULO_ANTIGO_CRIANCAS = 'Idades das crianças';

var ABA_INTERESSE_DEEP = 'Deep · Interessados';
var COLUNAS_INTERESSE_DEEP = [
  'Data/Hora', 'Nome', 'Telefone', 'Telefone (só dígitos)', 'E-mail',
  'Endereço', 'Data de nascimento', 'Origem'
];

var ABA_TESTEMUNHOS = 'Testemunhos';
var COLUNAS_TESTEMUNHO = [
  // coluna nova entra no FIM: as linhas já gravadas continuam alinhadas
  'Data/Hora', 'Nome', 'Telefone', 'Testemunho', 'Pode compartilhar', 'Origem',
  'Elogio ou sugestão'
];

var LIMITE_SISTER = 160;
/* Fechamento manual do Sister, independente das vagas: a igreja encerrou as
   inscrições e vai inscrever na hora quem chegar sem inscrição. Para reabrir,
   volte para false. */
var SISTER_FECHADO = true;
var COL_SISTER = 6; // 1-indexado, igual em COLUNAS_CEUS

var ABA_CHECKIN_SISTER = 'Sister · Check-in';

var ABA_PRESENCA_DEEP = 'Deep · Presença';
var AULAS_DEEP = ['21/09', '28/09', '05/10', '12/10', '19/10', '26/10'];
// Na aba Deep, a coluna I é onde a igreja anota o pagamento ("pg pix", "pg dinheiro"...)
var COL_PAGAMENTO_DEEP = 9;

var ABA_PRATOS = 'Sister · Pratos';
var PRATOS = ['Salgado', 'Doce'];

function abrirPlanilha() {
  var ss = SpreadsheetApp.openById(PLANILHA_ID);
  // Garante o fuso na própria planilha: a data fica correta na exibição,
  // continua sendo data de verdade (ordena e filtra) e não depende de ajuste manual.
  if (ss.getSpreadsheetTimeZone() !== FUSO) ss.setSpreadsheetTimeZone(FUSO);
  return ss;
}

/** Aba do Céus Abertos: a primeira, que já tem os dados. Não renomeia nada. */
function abaCeusAbertos(ss) {
  var sheet = ss.getSheets()[0];
  garantirCabecalho(sheet, COLUNAS_CEUS);
  return sheet;
}

/**
 * Aba de controle dos pratos. Criada na primeira vez que alguém usa o site
 * depois desta versão. Procura cada prato pelo nome na coluna A, então dá
 * para reordenar as linhas sem quebrar nada.
 */
function abaPratos(ss) {
  var sheet = ss.getSheetByName(ABA_PRATOS);
  if (sheet) return sheet;

  // sempre no fim: a aba da conferência é identificada por ser a primeira
  sheet = ss.insertSheet(ABA_PRATOS, ss.getSheets().length);

  sheet.getRange(1, 1, 1, 3).setValues([['Prato', 'Aceitando no site?', 'Já escolheram']])
    .setFontWeight('bold');
  PRATOS.forEach(function (prato, i) {
    var linha = i + 2;
    sheet.getRange(linha, 1).setValue(prato);
    sheet.getRange(linha, 2).insertCheckboxes().setValue(true);
    escreverContagem(ss, sheet.getRange(linha, 3), prato);
  });
  sheet.getRange(PRATOS.length + 3, 1).setValue(
    'Desmarque uma caixinha para o site parar de oferecer aquele prato. ' +
    'Vale na hora, sem publicar nada. Se as duas estiverem desmarcadas, ' +
    'a pergunta do prato some e a inscrição no Sister continua aberta.'
  ).setFontStyle('italic');
  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 170);
  sheet.setColumnWidth(3, 140);
  sheet.setFrozenRows(1);
  return sheet;
}

/**
 * Fórmula "Já escolheram" de um prato. O separador de argumentos depende do
 * idioma da planilha (vírgula em inglês, ponto e vírgula em português), então
 * testa os dois e fica com o que a planilha aceitar.
 * O asterisco conta também as linhas marcadas como "(fora do limite)".
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

function escreverContagem(ss, celula, prato) {
  var ceus = ss.getSheets()[0];
  var colPrato = COLUNAS_CEUS.indexOf('Prato (Sister)') + 1;
  var letra = ceus.getRange(1, colPrato).getA1Notation().replace(/\d+/g, '');
  var ref = "'" + ceus.getName().replace(/'/g, "''") + "'!" + letra + ':' + letra;

  var separadores = [';', ','];
  for (var i = 0; i < separadores.length; i++) {
    celula.setFormula('=COUNTIF(' + ref + separadores[i] + '"' + prato + '*")');
    SpreadsheetApp.flush();
    if (String(celula.getDisplayValue()).charAt(0) !== '#') return true;
  }
  return false;
}

/**
 * Uso manual, pelo editor (Executar): reescreve a coluna "Já escolheram"
 * da aba de pratos, sem mexer nas caixinhas.
 */
function consertarContagem() {
  var ss = abrirPlanilha();
  var sheet = abaPratos(ss);
  var linhas = sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), 1).getValues();
  var feitos = [];
  PRATOS.forEach(function (prato) {
    for (var i = 1; i < linhas.length; i++) {
      if (String(linhas[i][0]).trim().toLowerCase() === prato.toLowerCase()) {
        var celula = sheet.getRange(i + 1, 3);
        var ok = escreverContagem(ss, celula, prato);
        feitos.push(prato + ': ' + (ok ? celula.getDisplayValue() : 'ERRO'));
      }
    }
  });
  Logger.log('Contagem → ' + feitos.join(' | '));
}

/** Quantas já estão inscritas no Sister (coluna Sister = "Sim"). */
function inscritasSister(ss) {
  var ceus = ss.getSheets()[0];
  var ultima = ceus.getLastRow();
  if (ultima < 2) return 0;
  var total = 0;
  ceus.getRange(2, COL_SISTER, ultima - 1, 1).getValues().forEach(function (r) {
    if (String(r[0]).trim().toLowerCase() === 'sim') total++;
  });
  return total;
}

/** Situação das vagas do Sister, do jeito que o site usa. */
function vagasSister(ss) {
  var inscritas = inscritasSister(ss);
  var vagas = Math.max(LIMITE_SISTER - inscritas, 0);
  return {
    limite: LIMITE_SISTER,
    inscritas: inscritas,
    vagas: vagas,
    aberto: !SISTER_FECHADO && vagas > 0
  };
}

/**
 * Aba de check-in do Sister: Nome, caixinha de chegada e o telefone numa
 * coluna oculta, que serve de chave para não repetir ninguém.
 */
function abaCheckinSister(ss) {
  var sheet = ss.getSheetByName(ABA_CHECKIN_SISTER);
  if (sheet) return sheet;

  sheet = ss.insertSheet(ABA_CHECKIN_SISTER, ss.getSheets().length);
  sheet.getRange(1, 1, 1, 3).setValues([['Nome', 'Check-in', 'Telefone']])
    .setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange(1, 1).setHorizontalAlignment('left');
  sheet.getRange(2, 1).setValue('Fizeram check-in');
  sheet.getRange(2, 2).setFormula('=SUMPRODUCT(B3:B*1)').setHorizontalAlignment('center');
  sheet.getRange(2, 1, 1, 3).setFontWeight('bold').setBackground('#F7E7E3');
  sheet.setFrozenRows(2);
  sheet.setFrozenColumns(1);
  sheet.setColumnWidth(1, 300);
  sheet.setColumnWidth(2, 110);
  sheet.hideColumns(3); // o telefone fica escondido: a lista é só nome e chegada
  return sheet;
}

/**
 * Acrescenta na lista de check-in quem marcou "Sim" no Sister e ainda não
 * está nela, sem mexer nas caixinhas já marcadas. Com `ordenar`, deixa em
 * ordem alfabética. Devolve quantas entraram.
 */
function sincronizarCheckinSister(ss, ordenar) {
  var ceus = ss.getSheets()[0];
  var sheet = abaCheckinSister(ss);
  var ultimaCeus = ceus.getLastRow();
  if (ultimaCeus < 2) return 0;

  /* Quem já está na lista, por telefone E por nome: assim funciona tanto para
     quem veio do site quanto para quem foi escrito à mão, com ou sem telefone,
     e ninguém aparece duas vezes. */
  var ja = {};
  var ultima = sheet.getLastRow();
  if (ultima >= 3) {
    sheet.getRange(3, 1, ultima - 2, 3).getDisplayValues().forEach(function (r) {
      var digitos = String(r[2]).replace(/\D/g, '');
      if (digitos) ja['tel:' + digitos] = true;
      if (String(r[0]).trim()) ja['nome:' + chaveNome(r[0])] = true;
    });
  }

  var novos = [];
  ceus.getRange(2, 2, ultimaCeus - 1, 5).getValues().forEach(function (r) {
    // r: Nome, Telefone, Telefone (dígitos), Sexo, Sister
    var nome = String(r[0]).trim();
    var digitos = String(r[2]).replace(/\D/g, '');
    if (String(r[4]).trim().toLowerCase() !== 'sim') return;
    if (!nome) return;
    if (nome.toUpperCase().indexOf('TESTE') === 0) return;
    if ((digitos && ja['tel:' + digitos]) || ja['nome:' + chaveNome(nome)]) return;
    if (digitos) ja['tel:' + digitos] = true;
    ja['nome:' + chaveNome(nome)] = true;
    novos.push([nomeBonito(nome), false, String(r[1]).trim()]);
  });
  if (novos.length) {
    var inicio = Math.max(ultima, 2) + 1;
    sheet.getRange(inicio, 1, novos.length, 3).setValues(novos);
    sheet.getRange(inicio, 2, novos.length, 1).insertCheckboxes().setHorizontalAlignment('center');
  }
  if (ordenar) {
    var total = sheet.getLastRow() - 2;
    if (total > 1) sheet.getRange(3, 1, total, Math.max(sheet.getLastColumn(), 3))
      .sort({ column: 1, ascending: true });
  }
  return novos.length;
}

/**
 * Uso manual, pelo editor (Executar): cria a lista de check-in do Sister ou
 * puxa quem faltar, e deixa em ordem alfabética. Pode rodar quantas vezes
 * quiser, inclusive no dia, depois de inscrever alguém à mão.
 */
function criarCheckinSister() {
  var ss = abrirPlanilha();
  var entraram = sincronizarCheckinSister(ss, true);
  Logger.log('Sister · Check-in → ' + entraram + ' nome(s) acrescentado(s). Total na lista: ' +
    (abaCheckinSister(ss).getLastRow() - 2));
}

/** Linha de cada prato na aba de controle, procurando pelo nome na coluna A. */
function linhasDosPratos(sheet) {
  var nomes = sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), 1).getValues();
  var linhas = {};
  PRATOS.forEach(function (prato) {
    for (var i = 1; i < nomes.length; i++) {
      if (String(nomes[i][0]).trim().toLowerCase() === prato.toLowerCase()) { linhas[prato] = i + 1; return; }
    }
  });
  return linhas;
}

/**
 * Autocorreção da coluna "Já escolheram": se a fórmula de algum prato sumiu
 * (alguém digitou por cima, colou só valores...), escreve de novo. Roda a cada
 * consulta do site, então a contagem nunca fica congelada por muito tempo.
 */
function garantirContagem(ss, sheet) {
  var linhas = linhasDosPratos(sheet);
  Object.keys(linhas).forEach(function (prato) {
    var celula = sheet.getRange(linhas[prato], 3);
    if (String(celula.getFormula() || '').toUpperCase().indexOf('COUNTIF') === -1) {
      escreverContagem(ss, celula, prato);
    }
  });
}

/** Conta cada prato lendo a coluna linha por linha, sem depender de fórmula. */
function contagemReal(ss) {
  var ceus = ss.getSheets()[0];
  var col = COLUNAS_CEUS.indexOf('Prato (Sister)') + 1;
  var ultima = ceus.getLastRow();
  var total = {};
  PRATOS.forEach(function (prato) { total[prato] = 0; });
  if (ultima < 2) return total;
  ceus.getRange(2, col, ultima - 1, 1).getValues().forEach(function (r) {
    var v = String(r[0]).trim().toLowerCase();
    PRATOS.forEach(function (prato) {
      if (v.indexOf(prato.toLowerCase()) === 0) total[prato]++;
    });
  });
  return total;
}

/** Pratos com a caixinha marcada, na ordem de PRATOS. */
function pratosAbertos(ss) {
  var sheet = abaPratos(ss);
  try { garantirContagem(ss, sheet); } catch (errContagem) {}
  var ultima = Math.max(sheet.getLastRow(), 1);
  var linhas = sheet.getRange(1, 1, ultima, 2).getValues();
  return PRATOS.filter(function (prato) {
    for (var i = 1; i < linhas.length; i++) {
      if (String(linhas[i][0]).trim().toLowerCase() === prato.toLowerCase()) {
        return linhas[i][1] === true;
      }
    }
    return true; // linha apagada por engano: não fecha a opção sem querer
  });
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

/**
 * Aba das reservas da caravana. A linha 2 soma os totais, para a equipe ver
 * de uma olhada quantas poltronas já foram ocupadas.
 */
function abaCaravana(ss) {
  var sheet = ss.getSheetByName(ABA_CARAVANA);
  if (sheet) {
    // aba criada antes dos acompanhantes: ganha a coluna nova e o título novo
    var colCriancas = COLUNAS_CARAVANA.indexOf('Crianças (nome · idade · lugar)') + 1;
    var tituloCriancas = sheet.getRange(1, colCriancas);
    if (tituloCriancas.getValue() === TITULO_ANTIGO_CRIANCAS) {
      tituloCriancas.setValue(COLUNAS_CARAVANA[colCriancas - 1]);
    }
    garantirCabecalho(sheet, COLUNAS_CARAVANA);
    garantirConfigCaravana(sheet);
    return sheet;
  }

  try {
    sheet = ss.insertSheet(ABA_CARAVANA, ss.getSheets().length);
  } catch (err) {
    // duas visitas ao mesmo tempo logo após a implantação: a outra já criou
    var criada = ss.getSheetByName(ABA_CARAVANA);
    if (criada) return criada;
    throw err;
  }
  sheet.getRange(1, 1, 1, COLUNAS_CARAVANA.length).setValues([COLUNAS_CARAVANA]).setFontWeight('bold');
  sheet.getRange(2, 1).setValue('Totais');
  // SUM de coluna inteira não usa separador de argumentos: vale em pt-BR e en-US
  [6, 8, 10, 11, 12, 13].forEach(function (col) {
    var letra = sheet.getRange(1, col).getA1Notation().replace(/\d+/g, '');
    sheet.getRange(2, col).setFormula('=SUM(' + letra + '3:' + letra + ')');
  });
  sheet.getRange(2, 1, 1, COLUNAS_CARAVANA.length).setFontWeight('bold').setBackground('#E8F0FE');
  sheet.setFrozenRows(2);
  sheet.setColumnWidth(2, 240);
  sheet.setColumnWidth(9, 160);
  sheet.setColumnWidth(14, 150);
  sheet.setColumnWidth(16, 320);
  garantirConfigCaravana(sheet);
  return sheet;
}

/**
 * Bloco de configuração das vagas (Q1:R2). Só escreve os títulos e a conta
 * de restantes quando estão vazios: o número digitado em Q2 nunca é tocado.
 */
function garantirConfigCaravana(sheet) {
  var titulo = sheet.getRange('Q1');
  if (titulo.getValue() !== '') return;
  titulo.setValue('Vagas no ônibus');
  sheet.getRange('R1').setValue('Vagas restantes');
  sheet.getRange('Q1:R1').setFontWeight('bold');
  sheet.getRange(CELULA_VAGAS_CARAVANA).setBackground('#FFF2CC').setFontWeight('bold')
    .setNote('Digite aqui o total de vagas (poltronas) do ônibus. O site lê este número. Vazio = sem limite.');
  // L2 = total de poltronas reservadas (linha de totais)
  escreverFormulaLocal(sheet.getRange(CELULA_RESTANTES_CARAVANA), function (sep) {
    return '=IF(Q2=""' + sep + '""' + sep + 'MAX(0' + sep + 'Q2-L2))';
  });
  sheet.getRange(CELULA_RESTANTES_CARAVANA).setFontWeight('bold');
  sheet.setColumnWidth(17, 130);
  sheet.setColumnWidth(18, 130);
}

/** Total de vagas digitado na planilha; 0 quando vazio ou inválido (= sem limite). */
function limiteCaravana(ss) {
  var valor = abaCaravana(ss).getRange(CELULA_VAGAS_CARAVANA).getValue();
  var n = parseInt(valor, 10);
  return isNaN(n) || n < 0 ? 0 : n;
}

/** Poltronas já reservadas (coluna "Poltronas", a partir da linha 3). */
function poltronasOcupadas(ss) {
  var sheet = abaCaravana(ss);
  var ultima = sheet.getLastRow();
  if (ultima < 3) return 0;
  var col = COLUNAS_CARAVANA.indexOf('Poltronas') + 1;
  var total = 0;
  sheet.getRange(3, col, ultima - 2, 1).getValues().forEach(function (r) {
    var n = parseInt(r[0], 10);
    if (!isNaN(n)) total += n;
  });
  return total;
}

/** Situação das vagas da caravana, do jeito que o site usa. */
function vagasCaravana(ss) {
  var limite = limiteCaravana(ss);
  if (!limite) return { limite: 0, vagas: null, aberto: true };
  var vagas = Math.max(limite - poltronasOcupadas(ss), 0);
  // só números agregados: nada de quem reservou
  return { limite: limite, vagas: vagas, aberto: vagas > 0 };
}

/** CPF válido (11 dígitos e os dois dígitos verificadores batendo). */
function cpfValido(cpf) {
  var d = String(cpf || '').replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  for (var j = 9; j < 11; j++) {
    var soma = 0;
    for (var i = 0; i < j; i++) soma += parseInt(d.charAt(i), 10) * ((j + 1) - i);
    var dig = (soma * 10) % 11 % 10;
    if (dig !== parseInt(d.charAt(j), 10)) return false;
  }
  return true;
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
    var destino = String(p.destino || 'ceus-abertos').toLowerCase();

    if (destino === 'deep' && DEEP_FECHADO) {
      return json({ ok: false, erro: 'deep-fechado' });
    }

    if (destino === 'caravana') {
      if (nome.length < 3 || digitos.length < 10 || !cpfValido(p.cpf)) {
        return json({ ok: false, erro: 'dados incompletos' });
      }

      /* A conta é refeita aqui: o navegador só manda os números, e quem decide
         quantas poltronas e quanto custa é o servidor. */
      var inteiro = function (v, minimo) {
        var n = parseInt(v, 10);
        if (isNaN(n) || n < minimo) return minimo;
        return Math.min(n, 60);
      };
      var adultos = inteiro(p.adultos, 1);
      var criancas = inteiro(p.criancas, 0);
      var comPoltrona = Math.min(inteiro(p.criancasPoltrona, 0), criancas);
      var noColo = criancas - comPoltrona;
      var poltronas = adultos + comPoltrona;
      var valor = poltronas * VALOR_POLTRONA;

      /* Cada adulto além de quem reserva vem com nome completo e CPF válido,
         um por pessoa e sem CPF repetido na mesma reserva. */
      var acompanhantes;
      try { acompanhantes = JSON.parse(p.acompanhantes || '[]'); } catch (errJson) { acompanhantes = null; }
      if (!Array.isArray(acompanhantes) || acompanhantes.length !== adultos - 1) {
        return json({ ok: false, erro: 'dados incompletos' });
      }
      var cpfsVistos = [String(p.cpf || '').replace(/\D/g, '')];
      for (var ia = 0; ia < acompanhantes.length; ia++) {
        var ac = acompanhantes[ia] || {};
        var acNome = String(ac.nome || '').trim();
        var acCpf = String(ac.cpf || '').replace(/\D/g, '');
        if (acNome.length < 3 || !cpfValido(acCpf) || cpfsVistos.indexOf(acCpf) !== -1) {
          return json({ ok: false, erro: 'dados incompletos' });
        }
        cpfsVistos.push(acCpf);
        acompanhantes[ia] = acNome + ' · ' + String(ac.cpf).trim();
      }

      var caravana = abaCaravana(ss);
      if (jaInscrito(caravana, digitos)) {
        return json({ ok: true, duplicado: true });
      }

      var situacao = vagasCaravana(ss);
      if (situacao.limite && situacao.vagas < poltronas) {
        return json({ ok: false, erro: 'caravana-lotada', caravana: situacao });
      }

      caravana.appendRow([
        new Date(),
        nome,
        telefone,
        "'" + digitos,
        String(p.cpf || '').trim(),
        adultos,
        criancas > 0 ? 'Sim' : 'Não',
        criancas,
        String(p.idades || '').trim(),
        noColo,
        comPoltrona,
        poltronas,
        valor,
        '', // Pagamento: a equipe preenche quando o comprovante chegar
        String(p.origem || 'site'),
        acompanhantes.join('\n')
      ]);
      return json({ ok: true, duplicado: false, poltronas: poltronas, valor: valor });
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
    var sheet = destino === 'deep' ? abaDeep(ss) : abaCeusAbertos(ss);

    // Duplicidade pelo telefone normalizado, dentro da própria aba:
    // a mesma pessoa pode se inscrever na conferência E no Deep.
    if (jaInscrito(sheet, digitos)) {
      return json({ ok: true, duplicado: true });
    }

    if (destino === 'deep') {
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
    } else {
      var sexo = String(p.sexo || '').trim();
      var sister = sexo === 'Feminino' ? String(p.sister || '') : '';
      var prato = '';

      if (sister === 'Sim') {
        // Conferido aqui dentro, com o lock ativo: mesmo com dois envios ao
        // mesmo tempo, o limite não é ultrapassado.
        var situacao = vagasSister(ss);
        if (!situacao.aberto) {
          if (p.envio !== 'cego') {
            // devolve a situação para o site avisar e reenviar sem o Sister
            return json({ ok: false, erro: 'sister-lotado', sister: situacao });
          }
          // reenvio sem leitura de resposta: grava a inscrição na conferência
          // sem o Sister, porque as vagas acabaram
          sister = '';
        }
      }

      if (sister === 'Sim') {
        var abertos = pratosAbertos(ss);
        var escolhido = String(p.prato || '').trim();
        var clienteNovo = p.prato !== undefined; // site antigo em cache não manda o campo

        if (!clienteNovo) {
          prato = 'Não informado';
        } else if (!escolhido && abertos.length === 0) {
          prato = ''; // nenhum prato aberto: o site nem perguntou
        } else if (abertos.indexOf(escolhido) !== -1) {
          prato = escolhido;
        } else if (p.envio !== 'cego') {
          // A opção fechou depois que a página abriu. Devolve as opções atuais
          // para o site pedir outra escolha, sem gravar nada.
          return json({ ok: false, erro: 'prato-indisponivel', pratos: abertos });
        } else {
          // Reenvio sem leitura de resposta (no-cors): o site não teria como
          // mostrar o erro, então grava e sinaliza em vez de perder a inscrição.
          prato = (escolhido || 'Não informado') + ' (fora do limite)';
        }
      }

      sheet.appendRow([
        new Date(),
        nome,
        telefone,
        "'" + digitos,
        sexo,
        sister,
        String(p.endereco || '').trim(),
        String(p.bairro || '').trim(),
        String(p.cidade || '').trim(),
        String(p.cav || '').trim(),
        String(p.qualCav || '').trim(),
        String(p.origem || 'site'),
        prato
      ]);
    }

    // A lista de check-in do Sister é um extra: se falhar, a inscrição já está gravada.
    if (destino !== 'deep') {
      try { sincronizarCheckinSister(ss, false); } catch (errCheckin) {}
    }

    return json({ ok: true, duplicado: false });
  } catch (err) {
    return json({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
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
 * O site consulta por GET quais pratos do Sister estão abertos.
 * Com ?diag=1 devolve também uma conferência (só números, nenhum dado pessoal):
 * o que a aba de pratos mostra, a contagem feita linha por linha e o tamanho
 * da chamada do Deep.
 */
function doGet(e) {
  try {
    var ss = abrirPlanilha();
    var resposta = {
      ok: true,
      servico: 'inscricoes-igreja-vitoria',
      pratos: pratosAbertos(ss),
      sister: vagasSister(ss),
      deep: { aberto: !DEEP_FECHADO },
      // dizem ao site que esta implantação já sabe gravar cada coisa
      aceitaTestemunho: true,
      aceitaCaravana: true,
      aceitaAcompanhantes: true, // grava nome e CPF dos adultos acompanhantes
      caravana: vagasCaravana(ss),
      aceitaSugestao: true,
      aceitaInteresseDeep: true
    };
    if (e && e.parameter && e.parameter.diag) {
      var aba = abaPratos(ss);
      var linhas = linhasDosPratos(aba);
      var real = contagemReal(ss);
      resposta.contagem = PRATOS.map(function (prato) {
        if (!linhas[prato]) return { prato: prato, naPlanilha: 'linha não encontrada', contadoLinhaALinha: real[prato] };
        var celula = aba.getRange(linhas[prato], 3);
        return {
          prato: prato,
          naPlanilha: celula.getDisplayValue(),
          contadoLinhaALinha: real[prato],
          temFormula: String(celula.getFormula() || '') !== ''
        };
      });
      resposta.contagemSister = inscritasSister(ss);
      var checkin = ss.getSheetByName(ABA_CHECKIN_SISTER);
      resposta.checkinSister = {
        abaExiste: !!checkin,
        naLista: checkin ? Math.max(checkin.getLastRow() - 2, 0) : 0
      };
      var pres = ss.getSheetByName(ABA_PRESENCA_DEEP);
      var deep = ss.getSheetByName('Deep');
      resposta.deep = {
        aberto: !DEEP_FECHADO,
        inscritos: deep ? Math.max(deep.getLastRow() - 1, 0) : 0,
        abaPresencaExiste: !!pres,
        naChamada: pres ? Math.max(pres.getLastRow() - 2, 0) : 0
      };
      var carav = ss.getSheetByName(ABA_CARAVANA);
      resposta.caravanaDiag = {
        abaExiste: !!carav,
        reservas: carav ? Math.max(carav.getLastRow() - 2, 0) : 0,
        poltronas: carav ? poltronasOcupadas(ss) : 0,
        vagasNaPlanilha: carav ? limiteCaravana(ss) : 0
      };
      var test = ss.getSheetByName(ABA_TESTEMUNHOS);
      resposta.testemunhos = test ? Math.max(test.getLastRow() - 1, 0) : 0;
      var espera = ss.getSheetByName(ABA_INTERESSE_DEEP);
      resposta.deep.interessados = espera ? Math.max(espera.getLastRow() - 1, 0) : 0;
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
