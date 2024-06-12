/*Esse não será o script usado, sera refeito e depois, alterado no codigo real!!!!!!!!!!. Ele será soomente para ter uma base de como ficará o programa na prática, já implemetado ao banco de dados*/
//script pagina de login
/*
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:5500/pag_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Login bem-sucedido') {
                window.location.href = '/pag_principal.html'; // Redireciona para a página principal
            } else {
                alert('Usuário ou senha inválidos');
            }
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
    });
});
*/
/*
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
*/
/*
//script página de chaves
//para registrar a mudança de status
//fazer com que ela apareça quando registrar a operação
document.addEventListener('DOMContentLoaded', function() {
    const operacao = localStorage.getItem('operacao');
    const chaveElements = document.querySelectorAll('.disp_chave', '.cor_chave');

    chaveElements.forEach((chaveElement) => {
        if (operacao === 'entrega') {
            chaveElement.style.backgroundColor = 'red';
        } else if (operacao === 'devolucao') {
            chaveElement.style.backgroundColor = 'green';
        }
    });
});
*/

// script página de registros
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5500/pag_registros')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('body_table');
            data.forEach(registro => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${registro.date}</td>
                    <td>${registro.setor}</td>
                    <td>${registro.operacao}</td>
                    <td>${registro.time}</td>
                    <td>${registro.responsavel}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
});
