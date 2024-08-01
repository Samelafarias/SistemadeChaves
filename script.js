document.addEventListener('DOMContentLoaded', function () {

    //SCRIPT DA PÁGINA DE LOGIN
    // Função para manipulação do formulário de login
    function setupLoginForm() {
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
                        window.location.href = '/pag_menu.html'; // Redireciona em caso de login bem-sucedido
                    } else {
                        alert('Usuário ou senha inválidos'); // Exibe alerta em caso de erro no login
                    }
                })
                .catch((error) => {
                    console.error('Erro:', error); // Log de erro caso ocorra um problema na requisição
                });
            });
        }
    }

    //SCRIPT DA PÁGINA DE REGISTRO DE NOVAS CHAVES
    // Função para manipulação do formulário de cadastro de chaves
    function setupCadastroChaveForm() {
        const cadastroChaveForm = document.getElementById('cadast-chave Form');
        if (cadastroChaveForm) {
            cadastroChaveForm.addEventListener('submit', function(event) {
                event.preventDefault();
              
                const name = document.getElementById('name').value;
                const numero = document.getElementById('numero').value;
              
                fetch('http://localhost:5500/pag_cadastro_chaves', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ name, numero })
                })
                .then(response => response.json())
                .then(data => {
                  if (data.error) {
                    alert(`Erro: ${data.error}`);
                  } else {
                    alert(data.message);
                  }
                })
                .catch(error => {
                  console.error('Erro ao enviar dados:', error);
                });
            });
        }
    }


    //SCRIPT DA PÁGINA DE REGISTRO DE ADMS
    // Função para manipulação do formulário de cadastro de administradores
    function setupCadastroAdmForm() {
        const cadastroAdmForm = document.getElementById('cadast-admForm');
        if (cadastroAdmForm) {
            cadastroAdmForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                if (password !== confirmPassword) {
                    alert('As senhas não coincidem.');
                    return;
                }

                fetch('http://localhost:5500/pag_cadastro_adm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(`Erro: ${data.error}`);
                    } else {
                        alert(data.message);
                        cadastroAdmForm.reset(); // Limpa o formulário após sucesso
                    }
                })
                .catch(error => {
                    console.error('Erro ao enviar dados:', error);
                });
            });
        }
    }




    //SCRIPT DA PÁGINA DE REGISTRO DE RESPONSÁVEIS
    function setupCadastroRespForm() {
    const cadastroRespForm = document.getElementById('cadast-respForm');
    if (cadastroRespForm) {
        cadastroRespForm.addEventListener('submit', function(event) {
            event.preventDefault();
          
            const nome = document.getElementById('username').value;
            const profissao = document.getElementById('select').value;
            const email = document.getElementById('email').value;
          
            fetch('http://localhost:5500/pag_cadastro_resp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ nome, profissao, email })
            })
            .then(response => response.json())
            .then(data => {
              if (data.error) {
                alert(`Erro: ${data.error}`);
              } else {
                alert(data.message);
              }
            })
            .catch(error => {
              console.error('Erro ao enviar dados:', error);
            });
        });
    }
}


    //SCRIPT DA PÁGINA DE REGISTROS
    // Função para manipulação dos filtros de registros
    function setupFilterButton() {
        const filterButton = document.getElementById('filterbnt');
        if (filterButton) {
            filterButton.addEventListener('click', function() {
                const mes = document.getElementById('mes_pag_princ').value;
                const ano = document.getElementById('ano_registro').value;
                const tbody = document.getElementById('body_table');

                if (tbody) {
                    fetch('http://localhost:5500/pag_registros')
                    .then(response => response.json())
                    .then(data => {
                        const registrosFiltrados = data.filter(registro => {
                            const dataRegistro = new Date(registro.date);
                            return dataRegistro.getMonth() + 1 === parseInt(mes) && dataRegistro.getFullYear() === parseInt(ano);
                        });

                        registrosFiltrados.sort((a, b) => new Date(a.date) - new Date(b.date));
                        tbody.innerHTML = '';

                        registrosFiltrados.forEach(registro => {
                            const tr = document.createElement('tr');
                            const operacao = registro.operacao.toUpperCase();
                            const operacaoFormatada = operacao === 'ENTREGA' ? 'ENTREGA' : 'DEVOLUÇÃO';
                            localStorage.setItem('operacao', operacao); // Armazena a operação no localStorage

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
                    .catch(error => console.error('Erro ao buscar dados:', error)); // Log de erro caso ocorra um problema na requisição
                }
            });

            function formatarData(data) {
                const date = new Date(data);
                const dia = String(date.getDate()).padStart(2, '0');
                const mes = String(date.getMonth() + 1).padStart(2, '0');
                const ano = date.getFullYear();
                return `${dia}/${mes}/${ano}`; // Formata a data no formato dd/mm/aaaa
            }
        }
    }

    //SCRIPT DA PÁGINA DE CHAVES
    // Função para manipulação da página de chaves
    function setupChaves() {
        const chaves = document.querySelectorAll('.disp_chave');
        if (chaves.length > 0) {
            fetch('http://localhost:5500/pag_chaves')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição: ' + response.statusText);
                }
                return response.json();
            })
            .then(registros => {
                chaves.forEach(chave => {
                    const setor = chave.dataset.setor;
                    // Filtrar os registros apenas para a chave atual
                    const registrosChave = registros.filter(r => r.setor === setor);
        
                    // Verificar qual foi a última operação registrada para a chave
                    if (registrosChave.length > 0) {
                        const ultimoRegistro = registrosChave[registrosChave.length - 1];
                        if (ultimoRegistro.operacao.toUpperCase() === 'ENTREGA') {
                            chave.style.backgroundColor = 'red'; // Define cor vermelha para entrega
                        } else if (ultimoRegistro.operacao.toUpperCase() === 'DEVOLUÇÃO') {
                            chave.style.backgroundColor = 'green'; // Define cor verde para devolução
                        } else {
                            chave.style.backgroundColor = 'green'; // Caso não seja especificado, padrão para verde
                        }
                    } else {
                        chave.style.backgroundColor = 'green'; // Se não houver registros, padrão para verde
                    }
                });
            })
            .catch(error => {
                console.error('Erro ao buscar registros:', error); // Log de erro caso ocorra um problema na requisição
            });
        }
    }
    
    //SCRIPT DA PÁGINA PRINCIPAL
    // Função para manipulação dos botões da página principal
    function setupPaginaPrincipal() {
        const entregaButton = document.getElementById('entrega');
        const devolucaoButton = document.getElementById('devolucao');
        const registrarButton = document.getElementById('bnt_registrar');
        if (entregaButton && devolucaoButton && registrarButton) {
            entregaButton.addEventListener('click', function() {
                clicar(this);
            });
            devolucaoButton.addEventListener('click', function() {
                clicar(this);
            });
            registrarButton.addEventListener('click', registrar_dados);

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
        }
    }

    // Inicializar todos os scripts
    setupLoginForm();
    setupCadastroChaveForm();
    setupCadastroRespForm();
    setupCadastroAdmForm();
    setupFilterButton();
    setupChaves();
    setupPaginaPrincipal();

});

// Funções para abrir as páginas de chaves e registros
function abrir_pag_chave() {
    window.open('pag_chaves.html', '_blank'); // Abre uma nova janela para a página de chaves
}

function abrir_pag_registros() {
    window.open('pag_registros.html', '_blank'); // Abre uma nova janela para a página de registros
}
