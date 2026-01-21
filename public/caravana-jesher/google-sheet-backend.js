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

        // DATA PARSING (Supports both JSON and POST Parameters)
        var params = e.parameter; // Default from FormData
        if (!params || Object.keys(params).length === 0) {
            if (e.postData && e.postData.contents) {
                try {
                    params = JSON.parse(e.postData.contents);
                } catch (ex) {
                    // If parsing fails, maybe it's raw text?
                    params = {};
                }
            }
        }

        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        var nextRow = sheet.getLastRow() + 1;
        var newRow = [];
        var rowData = {}; // Temp object to fill based on headers

        // --- SMART MAPPING LOGIC (Updated for Abbreviated Headers) ---
        for (var i = 0; i < headers.length; i++) {
            var header = headers[i].toString().toLowerCase().trim();
            var value = "";

            // 1. DIRECT MATCH (If form field name matches header exactly)
            if (params[headers[i]]) value = params[headers[i]];

            // 2. FUZZY / SMART MATCH

            // Date/Timestamp
            else if (header === "data" || header === "timestamp" || header.includes("data_inscricao")) value = new Date();

            // RESPONSAVEL (Resp_Nome, Resp_CPF, Resp_Zap, etc.)
            else if (header.startsWith("resp") || header.includes("responsavel")) {
                if (header.includes("cpf")) value = params["guest_1_cpf"];
                else if (header.includes("email")) value = params["guest_1_email"];
                else if (header.includes("tel") || header.includes("whats") || header.includes("zap")) value = params["guest_1_phone"];
                else if (header.includes("nome")) value = params["guest_1_name"];
            }

            // PESSOA 2 (P2_Nome, P2_CPF, Acompanhante2, Nome 2)
            else if (header.startsWith("p2") || header.includes("acompanhante2") || header === "nome 2") {
                if (header.includes("cpf")) value = params["guest_2_cpf"];
                else value = params["guest_2_name"];
            }

            // PESSOA 3 (P3_Nome, P3_CPF, Acompanhante3, Nome 3)
            else if (header.startsWith("p3") || header.includes("acompanhante3") || header === "nome 3") {
                if (header.includes("cpf")) value = params["guest_3_cpf"];
                else value = params["guest_3_name"];
            }

            // ROOM & PAYMENT
            else if (header === "quarto" || header.includes("tipo")) value = params["roomType"] || params["roomTypeSelection"];
            else if (header === "valor" || header.includes("total") || header.includes("preco")) value = params["total_price"];
            else if (header.includes("pagamento") || header.includes("metodo")) value = params["payment_method"];

            // OTHERS
            else if (header === "obs" || header.includes("observacoes")) value = params["observations"];
            else if (header === "pago") value = "NAO"; // Default status

            // Ensure we don't return "undefined" string
            if (value === undefined || value === null) value = "";

            newRow.push(value);
        }

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        return ContentService.createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}
