/*Esse não será o script usado, sera refeito e depois, alterado no codigo real!!!!!!!!!!. Ele será soomente para ter uma base de como ficará o programa na prática, já implemetado ao banco de dados*/
//script pagina de login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5500/pag_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Redireciona para a página principal apenas se o login for bem-sucedido
            window.location.href = "pag_principal.html";
        } else {
            alert(data.message || "Erro ao fazer login.");
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login.');
    }
}


//script página principal
// script.js

async function registrar_dados() {
    const data = document.getElementById('data').value;
    const setor = document.getElementById('setor_pag_princ').value;
    const responsavel = document.getElementById('resp_pag_princ').value;
    const horario = document.getElementById('horario').value;
    const entrega = document.getElementById('entrega').classList.contains('ativo');
    const devolucao = document.getElementById('devolucao').classList.contains('ativo');

    if (!data || !setor || !responsavel || !horario || (!entrega && !devolucao)) {
        alert("Por favor, preencha todos os campos e selecione uma operação.");
        return;
    }

    const dataFormatada = new Date(data).toISOString().split('T')[0];

    const dados = {
        date: dataFormatada,
        sector: setor,
        responsible: responsavel,
        time: horario,
        operation: entrega ? 'entrega' : 'devolucao'
    };

    try {
        const response = await fetch('http://localhost:5500/pag_principal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Dados registrados com sucesso!");
        } else {
            alert("Erro ao registrar dados.");
        }
    } catch (error) {
        console.error('Erro ao registrar dados:', error);
        alert('Erro ao registrar dados. Verifique se todos os campos foram preenchidos corretamente.');
    }
}

// Função para mudar a cor dos botões e aplicar a mudança em outra página
function clicar(btnClicado) {
    // Seleciona os elementos HTML dos botões
    const entrega = document.getElementById('entrega');
    const devolucao = document.getElementById('devolucao');

    // Verifica qual botão foi clicado e aplica a mudança de cor
    if (btnClicado === entrega) {
        entrega.classList.add('ativo');
        devolucao.classList.remove('ativo');
    } else if (btnClicado === devolucao) {
        devolucao.classList.add('ativo');
        entrega.classList.remove('ativo');
    }
}

// Funções para abrir as páginas
function abrir_pag_chave() {
    window.open('pag_chaves.html', '_blank');
}

function abrir_pag_registros() {
    window.open('pag_registros.html', '_blank');
}

// Adiciona os ouvintes de eventos aos botões
document.getElementById('entrega').addEventListener('click', function() {
    clicar(this);
});
document.getElementById('devolucao').addEventListener('click', function() {
    clicar(this);
});
document.getElementById('bnt_registrar').addEventListener('click', registrar_dados);


//script página de chaves
//para registrar a mudança de status
//fazer com que ela apareça quando registrar a operação
document.addEventListener('DOMContentLoaded', function() {
    const operacao = localStorage.getItem('operacao');
    if (operacao === 'entrega') {
        document.getElementById('cor-chave2').style.backgroundColor = 'red';
    } else if (operacao === 'devolucao') {
        document.getElementById('cor-chave').style.backgroundColor = 'green';
    }
});


// script página de registros
document.getElementById('submitBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById('dataForm'));
    const dados = Object.fromEntries(formData.entries());
    const response = await fetch('http://localhost:5500/pag_registros', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });
    const result = await response.json();
    alert(result.message);


    // Após enviar os dados, recarrega os registros para atualizar a tabela
    carregarRegistros();
});

// Função para carregar os registros da API e atualizar a tabela na página
function carregarRegistros() {
    // Faz uma requisição GET para a API de registros
    fetch('http://localhost:5500/pag_registros')
        // Processa a resposta da requisição como JSON
        .then(response => response.json())
        // Quando os registros são recebidos com sucesso, executa o seguinte bloco de código
        .then(data => {
            const tableBody = document.getElementById('body_table');
            tableBody.innerHTML = ''; // Limpa o conteúdo atual da tabela
            // Para cada registro recebido, cria uma nova linha na tabela e insere os dados nas células
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${row.id}</td><td>${row.user_id}</td><td>${row.data_value}</td><td>${row.date}</td><td>${row.sector}</td><td>${row.operation}</td><td>${row.responsible}</td><td>${row.time}</td>`;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar registros:', error);
            // Exibe um alerta para o usuário informando sobre o erro
            alert('Erro ao carregar registros.');
        });
}

// Adiciona um event listener para chamar a função carregarRegistros quando a página é carregada
window.addEventListener('load', carregarRegistros);
