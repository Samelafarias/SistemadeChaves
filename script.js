document.addEventListener('DOMContentLoaded', function () {
 
    // Configuração de cabeçalhos para lidar com CORS
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    //SCRIPT DA PÁGINA DE LOGIN
    // Função para manipulação do formulário de login
    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                fetch('https://sistema-de-chaves.onrender.com/pag_login', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ username, password })
                })
    .then(response => {
        console.log('Código de Status:', response.status);
        return response.text(); // Converte a resposta para texto
    })
    .then(text => {
        console.log('Resposta do Servidor:', text); // Exibe o texto recebido
        // Tente analisar o JSON aqui se a resposta estiver correta
        const data = JSON.parse(text); // Use JSON.parse apenas se o texto for um JSON válido
        if (data.message === 'Login bem-sucedido') {
            window.location.href = '/pag_menu.html';
        } else {
            alert('Usuário ou senha inválidos');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });

        });
    }
}

    //SCRIPT DA PÁGINA DE CADASTRO DE NOVAS CHAVES
    function setupCadastroChaveForm() {
        const cadastroChaveForm = document.getElementById('cadast-chaveForm');
        if (cadastroChaveForm) {
            cadastroChaveForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const name = document.getElementById('name').value;

                fetch('https://sistema-de-chaves.onrender.com/pag_cadastro_chaves', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({name})
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.error ? `Erro: ${data.error}` : data.message);
                })
                .catch(error => console.error('Erro ao enviar dados:', error));
            });
        }
    }

    

    //SCRIPT DA PÁGINA DE CADASTRO DE ADMS
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

                fetch('https://sistema-de-chaves.onrender.com/pag_cadastro_adm', {
                    method: 'POST',
                    headers,
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

    //SCRIPT DA PÁGINA DE CADSATRO DE RESPONSÁVEIS
    function setupCadastroRespForm() {
    const cadastroRespForm = document.getElementById('cadast-respForm');
    if (cadastroRespForm) {
        cadastroRespForm.addEventListener('submit', function(event) {
            event.preventDefault();
          
            const nome = document.getElementById('username').value;
            const profissao = document.getElementById('select').value;
          
            fetch('https://sistema-de-chaves.onrender.com/pag_cadastro_resp', {
                method: 'POST',
                headers,
                body: JSON.stringify({ nome, profissao })
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
                    fetch('https://sistema-de-chaves.onrender.com/pag_registros', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    })
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
                            tr.innerHTML = `
                                <td>${formatarData(registro.date)}</td>
                                <td>${registro.setor}</td>
                                <td>${operacao === 'ENTREGA' ? 'ENTREGA' : 'DEVOLUÇÃO'}</td>
                                <td>${registro.time}</td>
                                <td>${registro.responsavel}</td>
                            `;
                            tbody.appendChild(tr);
                        });
                    })
                    .catch(error => console.error('Erro ao buscar dados:', error));
                } else {
                    console.warn('Elemento tbody não encontrado!');
                }
            });
        } else {
            console.warn('Elemento filterbnt não encontrado!');
        }

        function formatarData(data) {
            const date = new Date(data);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }
    }
    
    
    //SCRIPT DA PÁGINA DE CHAVES
     // Função para criar o HTML das chaves dinamicamente
     function createChaveHTML(setor, numero) {
        return `
            <div class="chave">
                <div class="disp_chave" id="${setor}" data-setor="${setor}" data-numero="${numero}"></div>
                <div class="name-sala">${setor}</div>
                <img src="img/chave.png" alt="imagem de uma chave" class="img_chave">
                <div class="tooltip" style="display: none;"></div>
            </div>
        `;
    }

    // Função para manipulação da página de chaves
    function setupChaves() {
        fetch('https://sistema-de-chaves.onrender.com/pag_chaves')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const sectionChave = document.querySelector('.section_chave');
            const { chaves, registros } = data;

            chaves.forEach(chave => {
                sectionChave.innerHTML += createChaveHTML(chave.setor);
            });

            const dispChaves = document.querySelectorAll('.disp_chave');

            dispChaves.forEach(dispChave => {
                const setor = dispChave.dataset.setor;
                const registrosChave = registros.filter(r => r.setor === setor);
              
                console.log(`Registros for setor ${setor}:`, registrosChave);
              
                if (registrosChave.length > 0) {
                  const ultimoRegistro = registrosChave[registrosChave.length - 1];
                  console.log(`Last registro for setor ${setor}:`, ultimoRegistro);
              
                  if (ultimoRegistro.operacao.toUpperCase() === 'ENTREGA') {
                    dispChave.style.backgroundColor = 'red';
                    dispChave.dataset.responsavel = ultimoRegistro.responsavel;
                  } else if (ultimoRegistro.operacao.toUpperCase() === 'DEVOLUÇÃO') {
                    dispChave.style.backgroundColor = 'green';
                  } else {
                    dispChave.style.backgroundColor = 'green';
                  }
                } else {
                  dispChave.style.backgroundColor = 'green';
                }
              });

            // Adiciona o evento de tooltip
            document.querySelectorAll('.chave').forEach(chave => {
                const tooltip = chave.querySelector('.tooltip');
                const dispChave = chave.querySelector('.disp_chave');

                dispChave.addEventListener('mouseover', function() {
                    tooltip.textContent = dispChave.dataset.responsavel ? `Chave com: ${dispChave.dataset.responsavel}` : 'Sala livre';
                    tooltip.style.display = 'block';
                    const rect = dispChave.getBoundingClientRect();
                    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight}px`;
                    tooltip.style.left = `${rect.left + window.scrollX}px`;
                });

                dispChave.addEventListener('mouseout', function() {
                    tooltip.style.display = 'none';
                });
            });
        })
     /*   .catch(error => {
            console.error('Erro ao buscar registros:', error);
        });*/
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
            const setor = document.getElementById('setorPagPrinc').value;
            const responsavel = document.getElementById('respPagPrinc').value;
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
                const response = await fetch('https://sistema-de-chaves.onrender.com/pag_principal', {
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

// FUNÇÃO PARA CARRREGAR OS RESPONSAVEIS E OS SETORES NA PÁGINA PRINCIPAL
async function carregarOpcoes() {
    try {
        const responseSetores = await fetch('https://sistema-de-chaves.onrender.com/getSetores');
        
        // Verifique se a resposta foi bem-sucedida
        if (!responseSetores.ok) {
            throw new Error('Erro ao buscar setores: ' + responseSetores.statusText);
        }
        
        const setores = await responseSetores.json();
        console.log('setores:', setores); // Verifique o que está sendo retornado

        const responseResponsaveis = await fetch('https://sistema-de-chaves.onrender.com/getResponsaveis');
        
        // Verifique se a resposta foi bem-sucedida
        if (!responseResponsaveis.ok) {
            throw new Error('Erro ao buscar responsáveis: ' + responseResponsaveis.statusText);
        }
        
        const responsaveis = await responseResponsaveis.json();
        console.log('responsaveis:', responsaveis); // Verifique o que está sendo retornado

        // Seleciona os elementos no DOM
        const setorSelect = document.getElementById('setorPagPrinc');
        const responsavelSelect = document.getElementById('respPagPrinc');

        // Verifica se os elementos existem antes de manipular
        if (setorSelect) {
            // Verifica se `setores` é um array antes de usar `forEach`
            const setoresArray = Array.isArray(setores) ? setores : setores.data || [];
            
            setoresArray.forEach(setor => {
                const option = document.createElement('option');
                option.value = setor.setor;
                option.textContent = setor.setor;
                setorSelect.appendChild(option);
            });
        } else {
            console.warn('Elemento com ID "setorPagPrinc" não encontrado no DOM.');
        }

        if (responsavelSelect) {
            // Garante que `responsaveis` é um array antes de usar `forEach`
            const responsaveisArray = Array.isArray(responsaveis) ? responsaveis : responsaveis.data || [];
            
            responsaveisArray.forEach(responsavel => {
                const option = document.createElement('option');
                option.value = responsavel.nome;
                option.textContent = `${responsavel.nome} - ${responsavel.profissao}`;
                responsavelSelect.appendChild(option);
            });
        } else {
            console.warn('Elemento com ID "respPagPrinc" não encontrado no DOM.');
        }
    } catch (error) {
        console.error('Erro ao carregar opções:', error);
    }
}

//SCRIPT DA PÁGINA DE REGITRAR
let tipoRegistro = '';
function selecionarTipo(tipo) {
    tipoRegistro = tipo;
    document.getElementById('titulo-registro').innerText = tipo === 'entrega' ? 'Entrega de Chaves' : 'Devolução de Chaves';
    document.getElementById('form-container').style.display = 'block';
}

async function carregarOpcoes() {
    try {
        const responseSetores = await fetch('https://sistema-de-chaves.onrender.com/getSetores');
        const setores = await responseSetores.json();
        const responseResponsaveis = await fetch('https://sistema-de-chaves.onrender.com/getResponsaveis');
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
        data,
        time
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



    // INICIALIZA TODOS OS SCRIPTS
    setupLoginForm();
    setupCadastroChaveForm() ;
    setupCadastroRespForm();
    setupCadastroAdmForm();
    setupFilterButton();
    setupPaginaPrincipal();
    setupChaves();
    carregarOpcoes();

});

// FUNÇÕES PARA ABRIR A PÁGINA DE CHAVES E DE REGISTROS
function abrir_pag_chave() {
    window.open('pag_chaves.html', '_blank'); // Abre uma nova janela para a página de chaves
}

function abrir_pag_registros() {
    window.open('pag_registros.html', '_blank'); // Abre uma nova janela para a página de registros
}

