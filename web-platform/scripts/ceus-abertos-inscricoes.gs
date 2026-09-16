/**
 * Inscrições · Igreja Vitória
 * Recebe formulários do site e grava na planilha, uma aba por evento:
 *   - Conferência Céus Abertos 2026 → primeira aba (a que já existe)
 *   - Deep · Curso de Membresia ..... → aba "Deep" (criada automaticamente)
 *
 * O site escolhe a aba pelo parâmetro "destino" ("ceus-abertos" ou "deep").
 * Sem esse parâmetro, cai no Céus Abertos — mantém compatibilidade.
 *
 * PRATOS DO SISTER
 *   Quem vai ao Sister escolhe levar um prato Salgado ou Doce para o brunch.
 *   A aba "Sister · Pratos" (criada automaticamente) controla quais opções o
 *   site oferece: desmarque a caixinha para fechar uma opção. Vale na hora,
 *   sem implantar nada. A mesma aba mostra quantas inscritas escolheram cada uma.
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

/** Pratos com a caixinha marcada, na ordem de PRATOS. */
function pratosAbertos(ss) {
  var sheet = abaPratos(ss);
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

    // Validação mínima no servidor (o site já valida, mas nunca confie só no cliente)
    if (nome.length < 3 || digitos.length < 10) {
      return json({ ok: false, erro: 'dados incompletos' });
    }

    var ss = abrirPlanilha();
    var destino = String(p.destino || 'ceus-abertos').toLowerCase();
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
    } else {
      var sexo = String(p.sexo || '').trim();
      var sister = sexo === 'Feminino' ? String(p.sister || '') : '';
      var prato = '';

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

/** O site consulta por GET quais pratos do Sister estão abertos. */
function doGet() {
  try {
    return json({ ok: true, servico: 'inscricoes-igreja-vitoria', pratos: pratosAbertos(abrirPlanilha()) });
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
