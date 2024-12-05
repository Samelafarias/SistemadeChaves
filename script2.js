// Carrega dados dos selects ao iniciar a página
window.onload = async function carregarOpcoes() {
  try {
    // Carregar setores
    const responseSetores = await fetch('https://sistema-de-chaves.onrender.com/getSetores');
    const setores = await responseSetores.json();
    preencherSelect(setores, 'setorPagEntrega'); // Para a página de entrega
    preencherSelect(setores, 'setorPagDevolucao'); // Para a página de devolução

    // Carregar responsáveis
    const responseResponsaveis = await fetch('https://sistema-de-chaves.onrender.com/getResponsaveis');
    const responsaveis = await responseResponsaveis.json();
    preencherSelect(responsaveis, 'respPagEntrega'); 
    preencherSelect(responsaveis, 'respPagDevolucao'); 

  } catch (error) {
    console.error('Erro ao carregar opções:', error);
  }
};

// Função para preencher os selects
function preencherSelect(dados, selectId) {
  const selectElement = document.getElementById(selectId);
  if (selectElement) {
    dados.forEach(item => {
      const option = document.createElement('option');
      option.value = item.nome || item.setor;
      option.textContent = item.nome ? `${item.nome} - ${item.profissao}` : item.setor;
      selectElement.appendChild(option);
    });
  }
}

// Registrar dados ao clicar no botão
document.querySelectorAll('.registrar-entr-dev').forEach(button => {
  button.addEventListener('click', async () => {
    const isEntrega = document.querySelector('h2').textContent.includes('Entrega');
    const responsavelId = isEntrega ? 'respPagEntrega' : 'respPagDevolucao';
    const setorId = isEntrega ? 'setorPagEntrega' : 'setorPagDevolucao';

    const responsavel = document.getElementById(responsavelId).value;
    const setor = document.getElementById(setorId).value;

    if (!responsavel || !setor) {
      alert('Por favor, selecione todas as opções.');
      return;
    }

    const dataAtual = new Date().toISOString();
    const tipoOperacao = isEntrega ? 'Entrega' : 'Devolução';

    const registro = {
      responsavel,
      setor,
      tipoOperacao,
      dataHora: dataAtual
    };

    try {
      const response = await fetch('https://sistema-de-chaves.onrender.com/pag_entrega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar: ' + response.statusText);
      }

      alert(`${tipoOperacao} registrada com sucesso!`);
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro ao salvar o registro.');
    }
    try {
      const response = await fetch('https://sistema-de-chaves.onrender.com/pag_devolucao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar: ' + response.statusText);
      }

      alert(`${tipoOperacao} registrada com sucesso!`);
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro ao salvar o registro.');
    }
  });
});