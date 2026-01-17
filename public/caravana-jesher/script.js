// --- CONFIGURATION ---
const CONFIG = {
    busPrice: 400.00,
    busSeatsTotal: 50,
    busSeatsTaken: 0, // CONTROLADO MANUALMENTE AQUI
    taxRate: 0.05, // 5%
    roomPrices: { // Valor da DIÁRIA por QUARTO
        individual: 312.00,
        duplo: 342.00,
        triplo: 492.00,
        semover: 0
    },
    availability: {
        individual: { total: 5, taken: 0, active: true },
        duplo: { total: 20, taken: 0, active: true },
        triplo: { total: 10, taken: 0, active: true },
        semover: { total: 999, taken: 0, active: true }
    }
};

// --- DOM ELEMENTS ---
const roomTypeSelect = document.getElementById('roomType');
const formRoomTypeSelect = document.getElementById('formRoomType');
const peopleCountInput = document.getElementById('peopleCount');
const dynamicFieldsContainer = document.getElementById('dynamicFieldsContainer');
const totalCostDisplay = document.getElementById('totalCost');

// Group Total Elements
const groupTotalContainer = document.getElementById('groupTotalContainer');
const groupCountSpan = document.getElementById('groupCount');
const groupTotalValueSpan = document.getElementById('groupTotalValue');

// Breakdown Elements
const hotelBreakdownRow = document.getElementById('hotelBreakdown');
const taxBreakdownRow = document.getElementById('taxBreakdown');
const hotelMath = document.getElementById('hotelMath');
const hotelBaseValue = document.getElementById('hotelBaseValue');
const taxValue = document.getElementById('taxValue');

// Form Elements
const registrationForm = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');

// INSTRUÇÃO: Mantenha a URL que o usuário já colocou ou use placeholder se for novo
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgyCzixA1eYCjfBD2vzq9pfAQq5u21akKnq4DVSJVk8SWSKnQsuCSWJ1uATnM6wYF7Eg/exec';

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    updateAvailabilityUI();

    // Listeners
    if (roomTypeSelect) roomTypeSelect.addEventListener('change', calculateTotal);
    if (formRoomTypeSelect) formRoomTypeSelect.addEventListener('change', updateFormFields);

    // Initial Run
    calculateTotal();
    updateFormFields(); // Initialize form state

    // SAFE INTEGRATION: Fetch live data in background
    setTimeout(fetchLiveStatus, 100);
});

async function fetchLiveStatus() {
    if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE')) {
        console.warn("URL do Google Script não configurada.");
        return;
    }

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();

        // 1. Update Bus Data safely
        if (data.bus && typeof data.bus.restantes !== 'undefined') {
            console.log("Atualizando status do ônibus:", data.bus);
            // Update CONFIG with live data
            CONFIG.busSeatsTaken = data.bus.ocupadas;
            CONFIG.busSeatsTotal = data.bus.capacidade;
            // Update UI
            initProgressBar();
        }

        // 2. Update Room Data safely
        if (data.quartos) {
            console.log("Atualizando status dos quartos:", data.quartos);
            Object.keys(data.quartos).forEach(key => {
                if (CONFIG.availability[key]) {
                    CONFIG.availability[key].total = data.quartos[key].restantes + CONFIG.availability[key].taken; // Estimate total or just trust 'restantes'
                    // Actually, let's just trust 'restantes' logic from backend
                    // But our current frontend logic uses (taken >= total).
                    // Let's adapt: If backend says 5 remaining, we set taken=0, total=5.
                    CONFIG.availability[key].taken = 0;
                    CONFIG.availability[key].total = data.quartos[key].restantes;

                    // Fail-open: Only deactivate if explicitly false or invalid
                    // If the sheet has "SIM" -> true. If "NAO" -> false.
                    // If empty or undefined, better to show it than hide everything.
                    // Backend returns boolean.
                    CONFIG.availability[key].active = data.quartos[key].ativo;
                }
            });
            // Update UI
            updateAvailabilityUI();
        }

    } catch (e) {
        console.error("Erro ao buscar dados da planilha (O site continuará funcionando offline):", e);
    }
}

// --- AVAILABILITY LOGIC ---
function updateAvailabilityUI() {
    const selects = [roomTypeSelect, formRoomTypeSelect];

    selects.forEach(select => {
        if (!select) return;

        Array.from(select.options).forEach(option => {
            const key = option.value.toLowerCase();
            const config = CONFIG.availability[key];

            if (!config) return;

            // Check if sold out or inactive
            const isSoldOut = config.taken >= config.total;

            if (!config.active) {
                option.style.display = 'none'; // Hide completely if inactive
            } else if (isSoldOut) {
                option.disabled = true;
                option.textContent += ' (ESGOTADO)';
            }
        });
    });
}

function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const seatsTakenDisplay = document.getElementById('seatsTaken');

    if (progressBar && seatsTakenDisplay) {
        const percentage = (CONFIG.busSeatsTaken / CONFIG.busSeatsTotal) * 100;
        seatsTakenDisplay.textContent = CONFIG.busSeatsTaken;
        setTimeout(() => {
            progressBar.style.width = percentage + '%';
        }, 500);
    }
}

// --- CALCULATOR LOGIC ---
function calculateTotal() {
    const roomType = roomTypeSelect.value;
    const days = 2; // FIXED RULE: 2 DAYS

    // 1. Handle Bus Only
    if (roomType === 'semover') {
        if (hotelBreakdownRow) hotelBreakdownRow.style.display = 'none';
        if (taxBreakdownRow) taxBreakdownRow.style.display = 'none';
        if (groupTotalContainer) groupTotalContainer.style.display = 'none'; // Ensure hidden
        totalCostDisplay.textContent = formatCurrency(CONFIG.busPrice);
        return;
    }

    // Show breakdown
    if (hotelBreakdownRow) hotelBreakdownRow.style.display = 'flex';
    if (taxBreakdownRow) taxBreakdownRow.style.display = 'flex';

    // 2. Get Prices
    let dailyRoomPrice = CONFIG.roomPrices[roomType] || 0;

    // 3. Determine Occupancy Divisor
    let divisor = 1;
    if (roomType === 'duplo') divisor = 2;
    if (roomType === 'triplo') divisor = 3;

    // 4. Calculate Hotel Cost (Per Person)
    // (Valor Diária / Pessoas) * 2 Dias
    let hotelMs = (dailyRoomPrice / divisor) * days;

    // 5. Calculate Tax (5% of Hotel Cost)
    let taxMs = hotelMs * CONFIG.taxRate;

    // 6. Total (Per Person)
    let totalPerPerson = CONFIG.busPrice + hotelMs + taxMs;

    // 7. Update UI (Per Person)
    // Using string concatenation to prevent potential template literal syntax issues
    if (hotelMath) hotelMath.textContent = '(R$ ' + dailyRoomPrice.toFixed(2).replace('.', ',') + ' ÷ ' + divisor + ') x ' + days + ' diárias';
    if (hotelBaseValue) hotelBaseValue.textContent = formatCurrency(hotelMs);
    if (taxValue) taxValue.textContent = formatCurrency(taxMs);
    if (totalCostDisplay) totalCostDisplay.textContent = formatCurrency(totalPerPerson);

    // 8. Group Total Logic
    // Re-query elements here to ensure they are found even if DOM init had issues
    const groupContainer = document.getElementById('groupTotalContainer');
    const groupCount = document.getElementById('groupCount');
    const groupValue = document.getElementById('groupTotalValue');

    if (groupContainer) {
        if (divisor > 1) { // Only for Double (2) or Triple (3)
            groupContainer.style.display = 'block';
            if (groupCount) groupCount.textContent = divisor;

            // Group Total = Total Per Person * People Count
            let groupTotal = totalPerPerson * divisor;

            if (groupValue) groupValue.textContent = formatCurrency(groupTotal);
        } else {
            groupContainer.style.display = 'none';
        }
    }
}

// --- DYNAMIC FORM LOGIC ---
function updateFormFields() {
    if (!formRoomTypeSelect) return;

    const roomType = formRoomTypeSelect.value.toLowerCase();
    let people = 1;

    if (roomType === 'duplo') people = 2;
    if (roomType === 'triplo') people = 3;

    // Update hidden people count input if it exists, or just track logically
    if (peopleCountInput) {
        peopleCountInput.value = people;
    }

    renderGuestFields(people);
}

function renderGuestFields(count) {
    if (!dynamicFieldsContainer) return;
    dynamicFieldsContainer.innerHTML = ''; // Clear

    for (let i = 1; i <= count; i++) {
        const title = i === 1 ? 'Pessoa 1 (Responsável)' : 'Pessoa ' + i;
        const isResponsible = i === 1;

        const html = '<div class="guest-block" style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid #e2e8f0;">' +
            '<h4 style="margin-bottom: 1rem; color: #0f172a; font-size: 1.1rem; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.5rem; display:flex; align-items:center; gap:0.5rem;">' +
            '<i class="fa-solid fa-user"></i> ' + title +
            '</h4>' +
            '<div class="form-grid">' +
            '<div class="form-group">' +
            '<label>Nome Completo *</label>' +
            '<input type="text" name="guest_' + i + '_name" required placeholder="Nome completo">' +
            '</div>' +
            '<div class="form-group">' +
            '<label>CPF *</label>' +
            '<input type="text" name="guest_' + i + '_cpf" required placeholder="000.000.000-00">' +
            '</div>' +
            '</div>' +
            (isResponsible ?
                '<div class="form-grid">' +
                '<div class="form-group">' +
                '<label>WhatsApp *</label>' +
                '<input type="tel" name="guest_1_phone" required placeholder="(11) 99999-9999">' +
                '</div>' +
                '<div class="form-group">' +
                '<label>E-mail *</label>' +
                '<input type="email" name="guest_1_email" required placeholder="email@exemplo.com">' +
                '</div>' +
                '</div>' : '') +
            '</div>';

        dynamicFieldsContainer.insertAdjacentHTML('beforeend', html);
    }
}

// --- UTILS ---
function formatCurrency(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- FORM SUBMISSION ---
if (registrationForm) {
    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Disable UI
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        formFeedback.textContent = '';

        // Collect Data
        const formData = new FormData(registrationForm);
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        data.timestamp = new Date().toISOString();

        // Calculate price again to send to backend (security)
        const roomType = formRoomTypeSelect.value.toLowerCase();
        data.roomTypeSelection = roomType;

        // Mock or Send
        if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE')) {
            setTimeout(() => {
                formFeedback.innerHTML = '<div style="color:#15803d; background:#dcfce7; padding:1rem; border-radius:8px; margin-top:1rem;"><strong>Simulação de Sucesso!</strong><br>Os dados foram validados. Configure a URL do Google Script para funcionar de verdade.</div>';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Confirmar Inscrição';
            }, 1000);
        } else {
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(() => {
                    formFeedback.innerHTML = '<div style="color:#15803d; background:#dcfce7; padding:1rem; border-radius:8px; margin-top:1rem;"><strong>Inscrição Realizada com Sucesso!</strong><br>Entraremos em contato via WhatsApp para confirmar o pagamento.</div>';
                    registrationForm.reset();
                    updateFormFields(); // Reset logic
                    submitBtn.innerHTML = 'Enviado <i class="fa-solid fa-check"></i>';
                })
                .catch(err => {
                    formFeedback.innerHTML = '<div style="color:#b91c1c; background:#fee2e2; padding:1rem; border-radius:8px; margin-top:1rem;"><strong>Erro ao enviar.</strong><br>Tente novamente ou chame no WhatsApp.</div>';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Tentar Novamente';
                });
        }
    });
}
