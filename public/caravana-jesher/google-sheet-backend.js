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

        // --- SMART MAPPING LOGIC ---
        // Iterate headers and find matching param
        for (var i = 0; i < headers.length; i++) {
            var header = headers[i].toString().toLowerCase().trim();
            var value = "";

            // 1. DIRECT MATCH
            if (params[headers[i]]) value = params[headers[i]];

            // 2. FUZZY / SMART MATCH
            else if (header.includes("data") || header === "timestamp") value = new Date();

            else if (header.includes("responsavel") || header === "nome" || header === "nome completo") {
                if (header.includes("cpf")) value = params["guest_1_cpf"];
                else if (header.includes("email")) value = params["guest_1_email"];
                else if (header.includes("tel") || header.includes("whats")) value = params["guest_1_phone"];
                else value = params["guest_1_name"]; // Default to Name
            }

            else if (header.includes("acompanhante")) {
                // Extract number? "Acompanhante 2" -> 2
                var num = header.replace(/\D/g, '');
                if (!num) num = "2"; // Default if just "Acompanhante"

                if (header.includes("cpf")) value = params["guest_" + num + "_cpf"];
                else value = params["guest_" + num + "_name"];
            }

            // P2 Name fallback (if header is just "Nome 2" etc)
            else if (header === "nome 2" || header === "segundo nome") value = params["guest_2_name"];
            else if (header === "cpf 2") value = params["guest_2_cpf"];

            else if (header.includes("quarto") || header.includes("tipo")) value = params["roomType"] || params["roomTypeSelection"];
            else if (header.includes("pagamento") || header.includes("metodo")) value = params["payment_method"];
            else if (header.includes("valor") || header.includes("preco") || header.includes("total")) value = params["total_price"];
            else if (header.includes("obs")) value = params["observations"];
            else if (header === "pago") value = "NAO"; // Default status

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
