document.addEventListener('DOMContentLoaded', function () {
    // Script da página de login
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

    // Script da página de registros
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
                        localStorage.setItem('operacao', operacao);
    
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
        });

        function formatarData(data) {
            const date = new Date(data);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }    
    }

    //script dos botoes da pagina principal
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

        //no código abaixo deve haver mudanças
/*
// Script da página de chaves
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5500/pag_chaves')
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          const setor = item.setor;
          const operacao = item.operacao;
          const chaveElement = document.querySelector(`.name-sala:contains(${setor})`).previousElementSibling;
          
          if (operacao === 'entregue') {
            chaveElement.style.backgroundColor = 'red';
          } else if (operacao === 'devolvida') {
            chaveElement.style.backgroundColor = 'green';
          }
        });
      })
      .catch(error => console.error('Erro ao buscar dados:', error));
  });
*/

// Função para criar e adicionar a estrutura dinâmica
function createDispChaveElement(setorId, operacao) {
    // Cria o elemento div para a disponibilidade da chave
    const dispChaveDiv = document.createElement('div');
    dispChaveDiv.className = 'disp_chave';
    dispChaveDiv.id = `setor ${setorId}`;

    // Adiciona a classe de cor baseada na operação
    if (operacao === 'ENTREGA') {
        dispChaveDiv.classList.add('red');
    } else if (operacao === 'DEVOLUCAO') {
        dispChaveDiv.classList.add('green');
    }

    // Cria o elemento div para o nome da sala
    const nameSalaDiv = document.createElement('div');
    nameSalaDiv.className = 'name-sala';
    nameSalaDiv.dataset.setor = setorId;
    nameSalaDiv.textContent = `Sala ${setorId}`;

    // Cria o elemento img para a imagem da chave
    const imgChave = document.createElement('img');
    imgChave.src = 'img/chave.png';
    imgChave.alt = 'imagem de uma chave';
    imgChave.className = 'img_chave';

    // Cria o elemento div principal com a classe 'chave'
    const chaveDiv = document.createElement('div');
    chaveDiv.className = 'chave';
    chaveDiv.appendChild(dispChaveDiv);
    chaveDiv.appendChild(nameSalaDiv);
    chaveDiv.appendChild(imgChave);

    // Adiciona o elemento 'chave' ao contêiner
    const chavesContainer = document.getElementById('chaves-container');
    chavesContainer.appendChild(chaveDiv);
}

// Função para buscar os dados do banco de dados
async function fetchData() {
    try {
        const response = await fetch('http://localhost:5500/pag_chaves');
        const data = await response.json();

        data.forEach(registro => {
            const setorId = registro.setor;
            const operacao = registro.operacao.toUpperCase();
            createDispChaveElement(setorId, operacao);
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Função para criar várias divs de disponibilidade de chave automaticamente
function createMultipleDispChaveElements(totalElements) {
    for (let i = 1; i <= totalElements; i++) {
        const setorId = String(i).padStart(2, '0'); // Garante que o ID tenha dois dígitos
        createDispChaveElement(setorId, ''); // Inicialmente sem operação
    }
}

// Chama a função para buscar os dados e criar os elementos
fetchData();


//script página principal
    // Funções globais, usadas em várias partes do código
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
    });

  // Funções para abrir as páginas de chaves e registros
function abrir_pag_chave() {
    window.open('pag_chaves.html', '_blank');
}

function abrir_pag_registros() {
    window.open('pag_registros.html', '_blank');
}


