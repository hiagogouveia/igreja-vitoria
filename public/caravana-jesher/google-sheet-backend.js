/**
 * INSTRUÇÕES PARA CONFIGURAÇÃO NO GOOGLE SHEETS:
 * 
 * ==========================================
 * ABA 1: "INSCRICOES"
 * ==========================================
 * A-L: (Dados da inscrição)
 * M: Pago ("SIM" conta vaga no ônibus)
 * 
 * ==========================================
 * ABA 2: "CONFIG_ONIBUS"
 * ==========================================
 * A1: CapacidadeTotal
 * A2: 50
 * 
 * ==========================================
 * ABA 3: "CONFIG_QUARTOS"
 * ==========================================
 * A1: Tipo           | B1: VagasRestantes | C1: Ativo
 * A2: individual     | B2: 5              | C2: SIM
 * A3: duplo          | B3: 10             | C3: SIM
 * A4: triplo         | B4: 0              | C4: SIM
 * A5: semover        | B5: 100            | C5: SIM
 * 
 * (Digite exatamente "individual", "duplo", "triplo", "semover" na coluna A)
 */

function doGet(e) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheetInscricoes = ss.getSheetByName("INSCRICOES");
        var sheetBusConfig = ss.getSheetByName("CONFIG_ONIBUS");
        var sheetRoomConfig = ss.getSheetByName("CONFIG_QUARTOS");

        // --- 1. BUS LOGIC ---
        var capacidadeBus = 50;
        if (sheetBusConfig) {
            var val = sheetBusConfig.getRange("A2").getValue();
            if (val && !isNaN(val)) capacidadeBus = parseInt(val);
        }

        var ocupadasBus = 0;
        if (sheetInscricoes && sheetInscricoes.getLastRow() > 1) {
            var dados = sheetInscricoes.getRange(2, 13, sheetInscricoes.getLastRow() - 1, 1).getValues();
            for (var i = 0; i < dados.length; i++) {
                if (dados[i][0] && dados[i][0].toString().toUpperCase().trim() === "SIM") {
                    ocupadasBus++;
                }
            }
        }

        var restantesBus = capacidadeBus - ocupadasBus;
        if (restantesBus < 0) restantesBus = 0;

        // --- 2. ROOM LOGIC ---
        var quartos = {};
        if (sheetRoomConfig) {
            // Ler linhas 2 até onde tiver dados
            var lastRow = sheetRoomConfig.getLastRow();
            if (lastRow > 1) {
                // Modified to read 4 columns: A(Tipo), B(Total), C(Disponível), D(Ativo)
                var dadosQuartos = sheetRoomConfig.getRange(2, 1, lastRow - 1, 4).getValues();

                for (var j = 0; j < dadosQuartos.length; j++) {
                    var tipo = dadosQuartos[j][0].toString().toLowerCase().trim(); // A: Tipo
                    var vagas = dadosQuartos[j][2]; // C: Disponível (Calculated by Formula)
                    var ativo = dadosQuartos[j][3].toString().toUpperCase().trim() === "SIM"; // D: Ativo

                    if (tipo) {
                        quartos[tipo] = {
                            restantes: parseInt(vagas) || 0,
                            ativo: ativo
                        };
                    }
                }
            }
        }

        var result = {
            bus: {
                capacidade: capacidadeBus,
                ocupadas: ocupadasBus,
                restantes: restantesBus
            },
            quartos: quartos
        };

        return ContentService.createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("INSCRICOES");
        if (!sheet) return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Aba INSCRICOES nao encontrada' })).setMimeType(ContentService.MimeType.JSON);

        var data = JSON.parse(e.postData.contents);

        var row = [
            new Date(),
            data.roomTypeSelection,
            data.calculatedPrice,
            data.guest_1_name,
            data.guest_1_cpf,
            data.guest_1_phone,
            data.guest_1_email,
            data.guest_2_name || '',
            data.guest_2_cpf || '',
            data.guest_3_name || '',
            data.guest_3_cpf || '',
            data.observations,
            "NAO"
        ];

        sheet.appendRow(row);

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
