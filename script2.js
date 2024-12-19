document.addEventListener('DOMContentLoaded', () => {
    let tipoRegistro = '';

    function selecionarTipo(tipo) {
        tipoRegistro = tipo;
        const titulo = document.getElementById('titulo-registro');
        const formContainer = document.getElementById('form-container');

        if (!titulo || !formContainer) {
            console.error('Elementos necessários não encontrados no DOM.');
            return;
        }

        // Atualizar título e exibir o formulário
        titulo.innerText = tipo === 'entrega' ? 'Entrega de Chaves' : 'Devolução de Chaves';
        formContainer.style.display = 'block';

        // Alterar a aparência dos botões
        const botoes = document.querySelectorAll('.menu-pag-registrar button');
        botoes.forEach(botao => botao.classList.remove('selecionado'));
        const botaoSelecionado = document.querySelector(`button[onclick="selecionarTipo('${tipo}')"]`);
        if (botaoSelecionado) {
            botaoSelecionado.classList.add('selecionado');
        }

        // Carregar opções para os selects
        carregarOpcoes();
    }

    async function carregarOpcoes() {
        try {
            const responseSetores = await fetch('https://sistema-de-chaves.onrender.com/getSetores');
            const setores = await responseSetores.json();

            const responseResponsaveis = await fetch('https://sistema-de-chaves.onrender.com/getResponsaveis');
            const responsaveis = await responseResponsaveis.json();

            preencherSelect('setorSelect', Array.isArray(setores) ? setores : setores.data || [], 'setor');
            preencherSelect('respSelect', Array.isArray(responsaveis) ? responsaveis : responsaveis.data || [], 'nome');
        } catch (error) {
            console.error('Erro ao carregar opções:', error);
        }
    }

    function preencherSelect(elementId, data, key) {
        const select = document.getElementById(elementId);

        if (!select) {
            console.error(`Elemento com ID "${elementId}" não encontrado no DOM.`);
            return;
        }

        if (!Array.isArray(data)) {
            console.error('Dados recebidos não são um array:', data);
            return;
        }

        select.innerHTML = '<option value="">Selecione</option>';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[key];
            option.textContent = item[key];
            select.appendChild(option);
        });
    }

    function obterDataHoraLocal() {
        const agora = new Date();

        // Ajustar para o fuso horário de Brasília (se necessário)
        const offsetBrasilia = -3 * 60; // Brasília está em UTC-3
        const dataHoraLocal = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000 + offsetBrasilia * 60000);

        // Formatar para "YYYY-MM-DD HH:MM:SS"
        const data = dataHoraLocal.toISOString().split('T')[0];
        const hora = dataHoraLocal.toISOString().split('T')[1].split('.')[0];
        return `${data} ${hora}`;
    }

    function registrarDados() {
        const responsavel = document.getElementById('respSelect').value;
        const setor = document.getElementById('setorSelect').value;

        if (!responsavel || !setor) {
            alert('Preencha todos os campos!');
            return;
        }

        const dataHora = obterDataHoraLocal();

        const dadosRegistro = {
            tipo: tipoRegistro,
            responsavel,
            setor,
            dataHora,
        };

        fetch('https://sistema-de-chaves.onrender.com/pag_registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosRegistro)
        })
        .then(response => {
            if (response.ok) {
                alert('Registro salvo com sucesso!');
            } else {
                response.text().then(errorText => {
                    alert('Erro ao salvar registro: ' + errorText);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao registrar:', error);
        });
    }

    window.selecionarTipo = selecionarTipo;
    window.carregarOpcoes = carregarOpcoes;
    window.registrarDados = registrarDados;
});
