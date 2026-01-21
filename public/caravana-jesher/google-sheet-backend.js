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

        // --- 1. BUS LOGIC (COUNT PEOPLE, NOT ROWS) ---
        var capacidadeBus = 50;
        if (sheetBusConfig) {
            var val = sheetBusConfig.getRange("A2").getValue();
            if (val && !isNaN(val)) capacidadeBus = parseInt(val);
        }

        var ocupadasBus = 0; // Pagos strictly
        var totalPeople = 0; // Total Registered (Paid + Unpaid)

        if (sheetInscricoes && sheetInscricoes.getLastRow() > 1) {
            // Read Columns: Name(D), P2Name(H), P3Name(J), Pago(M)
            // Indices (0-based from separate getValues checks? No, let's get whole range)
            // D(Resp_Nome)=3, H(P2_Nome)=7, J(P3_Nome)=9, M(Pago)=12
            var dados = sheetInscricoes.getRange(2, 1, sheetInscricoes.getLastRow() - 1, 13).getValues();

            for (var i = 0; i < dados.length; i++) {
                var pago = dados[i][12] ? dados[i][12].toString().toUpperCase().trim() : "";

                // Count People in this row (Resp + P2 + P3)
                var rowCount = 1; // Resp always exists
                if (dados[i][7] && dados[i][7].toString().trim() !== "") rowCount++;
                if (dados[i][9] && dados[i][9].toString().trim() !== "") rowCount++;

                // Add to Total Registered
                totalPeople += rowCount;

                // Add to Paid Count only if Pago=SIM
                if (pago === "SIM") {
                    ocupadasBus += rowCount;
                }
            }
        }

        var restantesBus = capacidadeBus - ocupadasBus;
        if (restantesBus < 0) restantesBus = 0;

        // --- 2. ROOM LOGIC (SHARED INVENTORY) ---
        // Expected Sheet Structure for CONFIG_QUARTOS:
        // A: Tipo (Casal_Twin, Triplo), B: Capacidade, C: Disponível, D: Ativo

        var inventory = {
            "casal_twin": { restantes: 0, ativo: false },
            "triplo": { restantes: 0, ativo: false },
            "semover": { restantes: 999, ativo: true }
        };

        if (sheetRoomConfig) {
            var lastRow = sheetRoomConfig.getLastRow();
            if (lastRow > 1) {
                var dadosQuartos = sheetRoomConfig.getRange(2, 1, lastRow - 1, 4).getValues();

                for (var j = 0; j < dadosQuartos.length; j++) {
                    var tipoRaw = dadosQuartos[j][0].toString().toLowerCase().trim();
                    var vagas = dadosQuartos[j][2]; // C: Disponível
                    var ativo = dadosQuartos[j][3].toString().toUpperCase().trim() === "SIM";

                    if (inventory[tipoRaw]) {
                        inventory[tipoRaw].restantes = parseInt(vagas) || 0;
                        inventory[tipoRaw].ativo = ativo;
                    }
                    // Handle legacy "individual/duplo" if user hasn't updated sheet yet, 
                    // mapping them to casal_twin logic internally if found? 
                    // No, stick to strict "Casal_Twin" requirement per Doc.
                    // But if user keeps 'individual' in sheet, it wont match 'casal_twin'.
                    // I will calculate both to be safe, but map frontend keys to inventory keys.
                    if (tipoRaw === 'individual' || tipoRaw === 'duplo') {
                        if (!inventory['casal_twin'].ativo) { // fallback
                            inventory['casal_twin'].restantes = parseInt(vagas) || 0;
                            inventory['casal_twin'].ativo = ativo;
                        }
                    }
                }
            }
        }

        // --- 3. MAPPING TO FRONTEND KEYS ---
        // Frontend expects: individual, duplo, triplo, semover
        var quartos = {
            "individual": {
                restantes: inventory["casal_twin"].restantes,
                ativo: inventory["casal_twin"].ativo
            },
            "duplo": {
                restantes: inventory["casal_twin"].restantes,
                ativo: inventory["casal_twin"].ativo
            },
            "triplo": {
                restantes: inventory["triplo"].restantes,
                ativo: inventory["triplo"].ativo
            },
            "semover": {
                restantes: inventory["semover"].restantes,
                ativo: inventory["semover"].ativo
            }
        };

        var result = {
            bus: {
                capacidade: capacidadeBus,
                ocupadas: ocupadasBus, // "Pagas"
                total: totalPeople,    // "Inscritos Totais"
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
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = doc.getSheetByName("INSCRICOES");

        // Parse JSON Body
        // NOTE: This relies on the previous 'working method' where e.postData.contents was populated.
        // If sent as 'no-cors', sometimes contents is empty for complex requests, but simple JSON text/plain usually works.
        var data = JSON.parse(e.postData.contents);

        // Prepare Row Data based on user's screenshot order:
        // A: Data
        // B: Quarto
        // C: Valor
        // D: Resp_Nome
        // E: Resp_CPF
        // F: Resp_Zap
        // G: Resp_Email
        // H: P2_Nome
        // I: P2_CPF
        // J: P3_Nome
        // K: P3_CPF
        // L: Obs
        // M: Pago

        var row = [
            new Date(),                         // A: Data
            data.roomTypeSelection || "",       // B: Quarto
            data.total_price || "",             // C: Valor
            data.guest_1_name || "",            // D: Resp_Nome
            data.guest_1_cpf || "",             // E: Resp_CPF
            data.guest_1_phone || "",           // F: Resp_Zap
            data.guest_1_email || "",           // G: Resp_Email
            data.guest_2_name || "",            // H: P2_Nome
            data.guest_2_cpf || "",             // I: P2_CPF
            data.guest_3_name || "",            // J: P3_Nome
            data.guest_3_cpf || "",             // K: P3_CPF
            data.observations || "",            // L: Obs
            "NAO"                               // M: Pago (Default)
        ];

        sheet.appendRow(row);

        return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}
