/* 
  ACAMPS VIT 2026 - Main Script
  Includes: Google Sheets Integration, Phone Mask, and User Logic
*/

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXpSKQAfZjoGuzP4CCrB4tDIxnXYardbNcPuDHU1E4Rj4pfu2hybjQXN0qGa_XQ9vm/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const typeSelect = document.getElementById('type');
    const qtyGroup = document.getElementById('qty-group');
    const quantityInput = document.getElementById('quantity');
    const familyMembersGroup = document.getElementById('family-members-group'); // Certifique-se que este ID existe no HTML
    const feedback = document.getElementById('feedback');
    const phoneInput = document.getElementById('phone');

    // --- 1. MÁSCARA DE TELEFONE ---
    const applyMask = (input) => {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 7) {
            value = `${value.slice(0, 9)}-${value.slice(9)}`;
        }
        input.value = value;
    };

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => applyMask(e.target));
    }

    // --- 2. CAMPOS DINÂMICOS (MEMBROS) ---
    const updateFamilyFields = () => {
        if (!familyMembersGroup) return;

        familyMembersGroup.innerHTML = ''; // Limpa campos anteriores
        const type = typeSelect.value;
        let count = 0;

        // Regra: Casal = +1 pessoa. Família = (Total - 1) pessoas extras.
        if (type === 'Casal') {
            count = 1;
        } else if (type === 'Familia') {
            const qty = parseInt(quantityInput.value) || 0;
            count = Math.max(0, qty - 1);
        }

        for (let i = 0; i < count; i++) {
            const index = i + 2; // Começa da "Pessoa 2"

            const div = document.createElement('div');
            div.className = 'input-group member-group';
            div.style.borderLeft = '3px solid #ff6600'; // Cor laranja
            div.style.paddingLeft = '15px';
            div.style.marginBottom = '20px';

            div.innerHTML = `
                <h4 style="margin-bottom: 10px; color: #0044cc; font-size: 0.9rem;">Pessoa ${index}</h4>
                <div style="margin-bottom: 10px;">
                     <label style="font-size: 0.85rem; display:block; margin-bottom:5px;">Nome Completo</label>
                     <input type="text" name="member_name_${index}" class="member-name" required placeholder="Nome da pessoa ${index}" style="width:100%; padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                </div>
                <div>
                     <label style="font-size: 0.85rem; display:block; margin-bottom:5px;">WhatsApp (Opcional)</label>
                     <input type="tel" name="member_phone_${index}" class="member-phone" placeholder="(XX) 99999-9999" style="width:100%; padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                </div>
            `;

            // Adiciona máscara ao novo campo de telefone
            const newPhoneInput = div.querySelector('.member-phone');
            newPhoneInput.addEventListener('input', (e) => applyMask(e.target));

            familyMembersGroup.appendChild(div);
        }
    };

    // --- 3. EVENTOS DE MUDANÇA ---
    typeSelect.addEventListener('change', (e) => {
        const val = e.target.value;

        // Controle do campo Quantidade
        if (val === 'Familia') {
            qtyGroup.style.display = 'block';
            quantityInput.setAttribute('required', 'true');
            if (quantityInput.value < 2) quantityInput.value = 2;
        } else {
            qtyGroup.style.display = 'none';
            quantityInput.removeAttribute('required');
        }

        // Atualiza campos extras
        updateFamilyFields();
    });

    // Se mudar a quantidade na opção Família, atualiza os campos
    if (quantityInput) {
        quantityInput.addEventListener('input', updateFamilyFields);
    }

    // --- 4. ENVIO DO FORMULÁRIO ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Enviando...';
        btn.disabled = true;

        // Coletar dados dos membros extras
        let membersInfo = '';
        const memberNames = document.querySelectorAll('.member-name');
        const memberPhones = document.querySelectorAll('.member-phone');

        if (memberNames.length > 0) {
            membersInfo = ' | Membros: ';
            memberNames.forEach((input, index) => {
                const name = input.value;
                const phone = memberPhones[index].value || 'Sem fone';
                membersInfo += `${name} (${phone}), `;
            });
            membersInfo = membersInfo.slice(0, -2); // Remove vírgula final
        }

        const obsValue = document.getElementById('obs').value;
        // Concatena observações com os dados dos membros
        const finalObs = obsValue + membersInfo;

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            type: document.getElementById('type').value,
            quantity: document.getElementById('type').value === 'Casal' ? 2 : (document.getElementById('quantity').value || 1),
            obs: finalObs // Envia tudo junto para não quebrar a planilha
        };

        try {
            if (GOOGLE_SCRIPT_URL) {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                console.log('Simulação:', formData);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Sucesso
            feedback.style.display = 'block';
            feedback.className = 'feedback-msg feedback-success';
            feedback.innerHTML = `
                <h3>✅ Inscrição Recebida!</h3>
                <p>Obrigado, ${formData.name.split(' ')[0]}! Entraremos em contato pelo WhatsApp para confirmar o pagamento.</p>
            `;
            form.reset();
            qtyGroup.style.display = 'none';
            if (familyMembersGroup) familyMembersGroup.innerHTML = ''; // Limpa campos

        } catch (error) {
            console.error('Erro:', error);
            feedback.style.display = 'block';
            feedback.className = 'feedback-msg feedback-error';
            feedback.innerText = 'Houve um erro ao enviar. Por favor, tente novamente ou chame no WhatsApp.';
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
});
