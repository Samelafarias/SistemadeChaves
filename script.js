/*Esse não será o script usado, sera refeito e depois, alterado no codigo real!!!!!!!!!!. Ele será soomente para ter uma base de como ficará o programa na prática, já implemetado ao banco de dados*/


// login.js
document.getElementById('enter_login').addEventListener('click',login)
// Função assíncrona para lidar com o login
async function login(button) {
    // Obtém o valor dos campos de usuário e senha
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Envia uma requisição POST para a URL especificada, com os dados de usuário e senha no corpo da requisição
        const response = await fetch(`http://localhost:5500/pag_login`, {
            method: 'POST', // Método da requisição
            headers: {
                'Content-Type': 'application/json' // Tipo de conteúdo da requisição
            },
            body: JSON.stringify({ username, password }) // Corpo da requisição, convertido para JSON
        });

        const data = await response.json();
        // Verifica se a resposta da requisição foi bem-sucedida
        if (response.ok) {
            // Redireciona para a página principal
            window.location.href = "pag_principal.html";
        } else {
            // Se a resposta não foi bem-sucedida, exibe uma mensagem de usuário ou senha inválidos
            alert(data.message || "Erro ao fazer login.");
        }
    }catch (error) {
        // Se ocorrer um erro durante a requisição, exibe uma mensagem de erro genérica
        /*console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login.');*/
    }
}




/*
//script página principal
// script.js
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


// Função para registrar os dados no banco de dados
async function registrar() {
    const data = document.getElementById('data').value;
    const setor = document.getElementById('setor_pag_princ').value;
    const responsavel = document.getElementById('resp_pag_princ').value;
    const horario = document.getElementById('horario').value;
    const operacao = localStorage.getItem('operacao');

    if(!data || !setor || !responsavel || !horario || !operacao){
        alert("Porfavor, preencha todos os campos e selecione uma operação.");
        return;
    }

    try {
        const response = await fetch(``, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mes, data, setor, nome, hora })
        });

        if (response.ok) {
            alert("Dados registrados com sucesso!");
            // Redirecionar para outra página (opcional)
            // window.location.href = "outra_pagina.html";
        } else {
            alert("Erro ao registrar dados.");
        }
    } catch (error) {
        console.error('Erro ao registrar dados:', error);
        alert('Erro ao registrar dados. Verifique se todos os campos foram preenchidos corretamente.');
    }
}

// Funções para abrir as páginas
function abrir_pag_chave() {
    window.open('pag_chaves.html');
}

function abrir_pag_registros() {
    window.open('pag_registros.html');
}

//script página de chaves
//para registrar a mudança de status
//fazer com que ela apareça quando registrar a operação
document.addEventListener('DOMContentLoaded', function() {
    const operacao = localStorage.getItem('operacao');
    if (operacao === 'entrega') {
        document.getElementById('cor-chave2').style.backgroundColor = 'red';
    } else if (operacao === 'devolucao') {
        document.getElementById('cor-chave1').style.backgroundColor = 'green';
    }
});

// script página de registros
document.getElementById('submitBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById('dataForm'));
    const dados = Object.fromEntries(formData.entries());
    const response = await fetch('/dados', {
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
    fetch('http://localhost:5500')
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
*/


