/**
 * Inscrições · Igreja Vitória
 * Recebe formulários do site e grava na planilha, uma aba por evento:
 *   - Conferência Céus Abertos 2026 → primeira aba (a que já existe)
 *   - Deep · Curso de Membresia ..... → aba "Deep" (criada automaticamente)
 *
 * O site escolhe a aba pelo parâmetro "destino" ("ceus-abertos" ou "deep").
 * Sem esse parâmetro, cai no Céus Abertos — mantém compatibilidade.
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
  'Endereço', 'Bairro', 'Cidade', 'Já participa de CAV', 'Qual CAV', 'Origem'
];

var COLUNAS_DEEP = [
  'Data/Hora', 'Nome', 'Telefone', 'Telefone (só dígitos)', 'E-mail',
  'Endereço', 'Data de nascimento', 'Origem'
];

var COL_TELEFONE_DIGITOS = 4; // 1-indexado, igual nas duas abas

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

/** Aba do Deep: cria na primeira inscrição, com o cabeçalho próprio. */
function abaDeep(ss) {
  var sheet = ss.getSheetByName('Deep') || ss.insertSheet('Deep');
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
      sheet.appendRow([
        new Date(),
        nome,
        telefone,
        "'" + digitos,
        sexo,
        sexo === 'Feminino' ? String(p.sister || '') : '',
        String(p.endereco || '').trim(),
        String(p.bairro || '').trim(),
        String(p.cidade || '').trim(),
        String(p.cav || '').trim(),
        String(p.qualCav || '').trim(),
        String(p.origem || 'site')
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

/** Escreve o cabeçalho se a aba estiver vazia. */
function garantirCabecalho(sheet, colunas) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(colunas);
    sheet.getRange(1, 1, 1, colunas.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Acesso por GET não é usado pelo site; responde algo neutro. */
function doGet() {
  return json({ ok: true, servico: 'inscricoes-igreja-vitoria' });
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
