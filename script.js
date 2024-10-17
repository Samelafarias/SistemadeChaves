document.addEventListener('DOMContentLoaded', function () {
    // Função de Login
    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async function (event) {
                event.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                try {
                    const response = await fetch('https://sistema-de-chaves.onrender.com/pag_login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });

                    const data = await response.json();
                    if (response.ok && data.message === 'Login bem-sucedido') {
                        window.location.href = '/pag_menu.html';
                    } else {
                        alert('Usuário ou senha inválidos');
                    }
                } catch (error) {
                    console.error('Erro:', error);
                }
            });
        }
    }

    // Função de Cadastro de Chaves
    function setupCadastroChaveForm() {
        const cadastroChaveForm = document.getElementById('cadast-chaveForm');
        if (cadastroChaveForm) {
            cadastroChaveForm.addEventListener('submit', async function (event) {
                event.preventDefault();
                const name = document.getElementById('name').value;
                const numero = document.getElementById('numero').value;

                try {
                    const response = await fetch('https://sistema-de-chaves.onrender.com/pag_cadastro_chaves', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, numero })
                    });

                    const data = await response.json();
                    alert(data.message || `Erro: ${data.error}`);
                } catch (error) {
                    console.error('Erro ao enviar dados:', error);
                }
            });
        }
    }

    // Função de Cadastro de Administradores
    function setupCadastroAdmForm() {
        const cadastroAdmForm = document.getElementById('cadast-admForm');
        if (cadastroAdmForm) {
            cadastroAdmForm.addEventListener('submit', async function (event) {
                event.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                if (password !== confirmPassword) {
                    alert('As senhas não coincidem.');
                    return;
                }

                try {
                    const response = await fetch('https://sistema-de-chaves.onrender.com/pag_cadastro_adm', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });

                    const data = await response.json();
                    alert(data.message || `Erro: ${data.error}`);
                    if (!data.error) cadastroAdmForm.reset();
                } catch (error) {
                    console.error('Erro ao enviar dados:', error);
                }
            });
        }
    }

    // Função de Cadastro de Responsáveis
    function setupCadastroRespForm() {
        const cadastroRespForm = document.getElementById('cadast-respForm');
        if (cadastroRespForm) {
            cadastroRespForm.addEventListener('submit', async function (event) {
                event.preventDefault();
                const nome = document.getElementById('username').value;
                const profissao = document.getElementById('select').value;

                try {
                    const response = await fetch('https://sistema-de-chaves.onrender.com/pag_cadastro_resp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nome, profissao })
                    });

                    const data = await response.json();
                    alert(data.message || `Erro: ${data.error}`);
                } catch (error) {
                    console.error('Erro ao enviar dados:', error);
                }
            });
        }
    }

    // Função de Filtro de Registros
    function setupFilterButton() {
        const filterButton = document.getElementById('filterbnt');
        if (filterButton) {
            filterButton.addEventListener('click', async function () {
                const mes = parseInt(document.getElementById('mes_pag_princ').value);
                const ano = parseInt(document.getElementById('ano_registro').value);
                const tbody = document.getElementById('body_table');

                try {
                    const response = await fetch('https://sistema-de-chaves.onrender.com/pag_registros');
                    const data = await response.json();

                    const registrosFiltrados = data.filter(registro => {
                        const dataRegistro = new Date(registro.date);
                        return dataRegistro.getMonth() + 1 === mes && dataRegistro.getFullYear() === ano;
                    });

                    tbody.innerHTML = registrosFiltrados.map(registro => `
                        <tr>
                            <td>${formatarData(registro.date)}</td>
                            <td>${registro.setor}</td>
                            <td>${registro.operacao.toUpperCase()}</td>
                            <td>${registro.time}</td>
                            <td>${registro.responsavel}</td>
                        </tr>`).join('');
                } catch (error) {
                    console.error('Erro ao buscar dados:', error);
                }
            });

            function formatarData(data) {
                const date = new Date(data);
                return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            }
        }
    }

    // Função de Carregamento de Chaves
    function setupChaves() {
        fetch('https://sistema-de-chaves.onrender.com/pag_chaves')
            .then(response => response.json())
            .then(({ chaves, registros }) => {
                const sectionChave = document.querySelector('.section_chave');
                sectionChave.innerHTML = chaves.map(chave => `
                    <div class="chave">
                        <div class="disp_chave" id="${chave.setor}" data-setor="${chave.setor}" data-numero="${chave.numero}"></div>
                        <div class="name-sala">${chave.setor}</div>
                        <img src="img/chave.png" alt="imagem de uma chave" class="img_chave">
                        <div class="tooltip" style="display: none;"></div>
                    </div>`).join('');
            })
            .catch(error => console.error('Erro ao buscar chaves:', error));
    }

    // Inicialização dos Scripts
    setupLoginForm();
    setupCadastroChaveForm();
    setupCadastroRespForm();
    setupCadastroAdmForm();
    setupFilterButton();
    setupChaves();
});
