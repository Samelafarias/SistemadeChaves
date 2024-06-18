document.addEventListener('DOMContentLoaded', function () {
    // Espera o documento HTML ser completamente carregado
    const loginForm = document.getElementById('loginForm');

    // Obtém o formulário de login pelo ID
    if (loginForm) {
        // Verifica se o formulário foi encontrado

        loginForm.addEventListener('submit', function (event) {
            // Adiciona um ouvinte de evento para o envio do formulário
            event.preventDefault();
            // Previne o comportamento padrão de envio do formulário

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            // Obtém os valores de usuário e senha dos campos do formulário

            fetch('http://localhost:5500/pag_login', {
                // Envia uma requisição POST para a URL de login
                method: 'POST',
                // Define o método da requisição como POST
                headers: {
                    'Content-Type': 'application/json'
                },
                // Define o cabeçalho da requisição
                body: JSON.stringify({ username: username, password: password })
                // Converte os dados para JSON e envia no corpo da requisição
            })
            .then(response => response.json())
            // Converte a resposta para JSON
            .then(data => {
                if (data.message === 'Login bem-sucedido') {
                    window.location.href = '/pag_principal.html';
                    // Redireciona para a página principal em caso de login bem-sucedido
                } else {
                    alert('Usuário ou senha inválidos');
                    // Exibe um alerta em caso de usuário ou senha inválidos
                }
            })
            .catch((error) => {
                console.error('Erro:', error);
                // Exibe um erro no console em caso de falha na requisição
            });
        });
    }

    const tbody = document.getElementById('body_table');
    // Obtém o corpo da tabela pelo ID

    if (tbody) {
        // Verifica se o corpo da tabela foi encontrado

        fetch('http://localhost:5500/pag_registros')
        // Envia uma requisição para obter os registros
            .then(response => response.json())
            // Converte a resposta para JSON
            .then(data => {
                // Manipula os dados recebidos

                data.sort((a, b) => new Date(a.date) - new Date(b.date));
                // Ordena os dados por data

                tbody.innerHTML = '';
                // Limpa o conteúdo anterior da tabela

                data.forEach(registro => {
                    // Para cada registro, cria uma nova linha na tabela

                    const tr = document.createElement('tr');
                    // Cria um novo elemento 'tr' (linha da tabela)
                    const operacao = registro.operacao.toUpperCase();
                    // Obtém a operação do registro e converte para maiúsculas
                    const operacaoFormatada = operacao === 'ENTREGA' ? 'ENTREGA' : 'DEVOLUÇÃO';
                    // Formata a operação

                    tr.innerHTML = `
                        <td>${formatarData(registro.date)}</td>
                        <td>${registro.setor}</td>
                        <td>${operacaoFormatada}</td>
                        <td>${registro.time}</td>
                        <td>${registro.responsavel}</td>
                    `;
                    // Preenche a linha com os dados do registro

                    tbody.appendChild(tr);
                    // Adiciona a linha à tabela
                });
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }

    document.getElementById('entrega').addEventListener('click', function() {
        // Adiciona um ouvinte de evento para o clique no botão de entrega
        clicar(this);
        // Chama a função 'clicar' passando o botão clicado como argumento
    });
    document.getElementById('devolucao').addEventListener('click', function() {
        // Adiciona um ouvinte de evento para o clique no botão de devolução
        clicar(this);
        // Chama a função 'clicar' passando o botão clicado como argumento
    });
    document.getElementById('bnt_registrar').addEventListener('click', registrar_dados);
    // Adiciona um ouvinte de evento para o clique no botão de registrar, chamando a função 'registrar_dados'

    const operacao = localStorage.getItem('operacao');
    // Obtém a operação armazenada no localStorage
    const chaveElements = document.querySelectorAll('.disp_chave', '.cor_chave');
    // Obtém todos os elementos com as classes 'disp_chave' e 'cor_chave'

    chaveElements.forEach((chaveElement) => {
        // Para cada elemento, verifica a operação e define a cor de fundo
        if (operacao === 'entrega') {
            chaveElement.style.backgroundColor = 'red';
        } else if (operacao === 'devolucao') {
            chaveElement.style.backgroundColor = 'green';
        }
    });
});

async function registrar_dados() {
    // Função assíncrona para registrar os dados
    const data = document.getElementById('data').value;
    const setor = document.getElementById('setor_pag_princ').value;
    const responsavel = document.getElementById('resp_pag_princ').value;
    const horario = document.getElementById('horario').value;
    const entrega = document.getElementById('entrega').classList.contains('ativo');
    const devolucao = document.getElementById('devolucao').classList.contains('ativo');
    // Obtém os valores dos campos do formulário

    if (!data || !setor || !responsavel || !horario || (!entrega && !devolucao)) {
        // Verifica se algum campo está vazio
        alert("Por favor, preencha todos os campos e selecione uma operação.");
        return;
    }

    const dataFormatada = new Date(data).toISOString().split('T')[0];
    // Formata a data para o formato ISO

    const dados = {
        date: dataFormatada,
        sector: setor,
        responsible: responsavel,
        time: horario,
        operation: entrega ? 'ENTREGA' : 'DEVOLUÇÃO'
    };
    // Cria um objeto com os dados formatados

    try {
        const response = await fetch('http://localhost:5500/pag_principal', {
            // Envia uma requisição POST para a URL de registro
            method: 'POST',
            // Define o método da requisição como POST
            headers: {
                'Content-Type': 'application/json'
            },
            // Define o cabeçalho da requisição
            body: JSON.stringify(dados)
            // Converte os dados para JSON e envia no corpo da requisição
        });

        if (response.ok) {
            // Verifica se a resposta da requisição foi bem-sucedida
            alert("Dados registrados com sucesso!");
        } else {
            alert("Erro ao registrar dados.");
        }
    } catch (error) {
        console.error('Erro ao registrar dados:', error);
        alert('Erro ao registrar dados. Verifique se todos os campos foram preenchidos corretamente.');
    }
}

function clicar(btnClicado) {
    // Função para alternar entre os botões de entrega e devolução
    const entrega = document.getElementById('entrega');
    const devolucao = document.getElementById('devolucao');

    if (btnClicado === entrega) {
        entrega.classList.add('ativo');
        devolucao.classList.remove('ativo');
    } else if (btnClicado === devolucao) {
        devolucao.classList.add('ativo');
        entrega.classList.remove('ativo');
    }
}

function abrir_pag_chave() {
    // Função para abrir a página de chaves em uma nova janela
    window.open('pag_chaves.html', '_blank');
}

function abrir_pag_registros() {
    // Função para abrir a página de registros em uma nova janela
    window.open('pag_registros.html', '_blank');
}

function formatarData(data) {
    // Função para formatar a data no formato 'dd/mm/yyyy'
    const date = new Date(data);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
