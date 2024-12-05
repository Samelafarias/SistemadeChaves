let tipoRegistro = ''; // Variável global para armazenar o tipo de operação

function selecionarTipo(tipo) {
    tipoRegistro = tipo;
    document.getElementById('titulo-registro').innerText = tipo === 'entrega' ? 'Entrega de Chaves' : 'Devolução de Chaves';
    document.getElementById('form-container').style.display = 'block';
}

async function carregarOpcoes() {
    try {
        const responseSetores = await fetch('/getSetores');
        const setores = await responseSetores.json();
        const responseResponsaveis = await fetch('/getResponsaveis');
        const responsaveis = await responseResponsaveis.json();

        // Preenche os selects
        preencherSelect('setorSelect', setores, 'setor');
        preencherSelect('respSelect', responsaveis, 'nome');
    } catch (error) {
        console.error('Erro ao carregar opções:', error);
    }
}

function preencherSelect(elementId, data, key) {
    const select = document.getElementById(elementId);
    select.innerHTML = '<option value="">Selecione</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[key];
        option.textContent = item[key];
        select.appendChild(option);
    });
}

async function registrarDados() {
    const responsavel = document.getElementById('respSelect').value;
    const setor = document.getElementById('setorSelect').value;
    const dataHora = new Date().toISOString(); // Captura data e hora

    if (!responsavel || !setor) {
        alert('Preencha todos os campos!');
        return;
    }

    const dadosRegistro = {
        tipo: tipoRegistro,
        responsavel,
        setor,
        dataHora
    };

    try {
        const response = await fetch('https://sistema-de-chaves.onrender.com/pag_registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosRegistro)
        });

        if (response.ok) {
            alert('Registro salvo com sucesso!');
        } else {
            alert('Erro ao salvar registro.');
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
    }
}
