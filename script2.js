document.addEventListener('DOMContentLoaded', function () {
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
    // Determina se a operação é entrega ou devolução com base no título da página
    const isEntrega = document.querySelector('h2').textContent.includes('Entrega');
    const responsavelId = isEntrega ? 'respPagEntrega' : 'respPagDevolucao';
    const setorId = isEntrega ? 'setorPagEntrega' : 'setorPagDevolucao';

    // Obtém valores selecionados
    const responsavel = document.getElementById(responsavelId).value;
    const setor = document.getElementById(setorId).value;

    // Validação dos dados
    if (!responsavel || !setor) {
      alert('Por favor, selecione todas as opções.');
      return;
    }

    // Cria o objeto de registro
    const dataAtual = new Date().toISOString();
    const tipoOperacao = isEntrega ? 'Entrega' : 'Devolução';

    const registro = {
      responsavel,
      setor,
      tipoOperacao,
      dataHora: dataAtual
    };

    // Define a URL correta com base no tipo de operação
    const url = isEntrega 
      ? 'https://sistema-de-chaves.onrender.com/pag_entrega' 
      : 'https://sistema-de-chaves.onrender.com/pag_devolucao';

    // Envia o registro para a rota correta
    try {
      const response = await fetch(url, {
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
});