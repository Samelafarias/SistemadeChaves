document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
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
                    window.location.href = '/pag_principal.html';
                } else {
                    alert('Usuário ou senha inválidos');
                }
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
        });
    }

    const tbody = document.getElementById('body_table');
    if (tbody) {
        fetch('http://localhost:5500/pag_registros')
            .then(response => response.json())
            .then(data => {
                // Ordena os dados por data
                data.sort((a, b) => new Date(a.date) - new Date(b.date));

                // Limpa o conteúdo anterior da tabela
                tbody.innerHTML = '';

                data.forEach(registro => {
                    const tr = document.createElement('tr');
                    const operacao = registro.operacao.toUpperCase();
                    const operacaoFormatada = operacao === 'ENTREGA' ? 'ENTREGA' : 'DEVOLUÇÃO';

                    tr.innerHTML = `
                        <td>${formatarData(registro.date)}</td>
                        <td>${registro.setor}</td>
                        <td>${operacaoFormatada}</td>
                        <td>${registro.time}</td>
                        <td>${registro.responsavel}</td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }

    document.getElementById('entrega').addEventListener('click', function() {
        clicar(this);
    });
    document.getElementById('devolucao').addEventListener('click', function() {
        clicar(this);
    });
    document.getElementById('bnt_registrar').addEventListener('click', registrar_dados);

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
        operation: entrega ? 'ENTREGA' : 'DEVOLUÇÃO'
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

function clicar(btnClicado) {
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
    window.open('pag_chaves.html', '_blank');
}

function abrir_pag_registros() {
    window.open('pag_registros.html', '_blank');
}

function formatarData(data) {
    const date = new Date(data);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
