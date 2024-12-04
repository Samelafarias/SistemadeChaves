document.addEventListener('DOMContentLoaded', function () {
    //Script da página de entrega de chaves
    document.getElementById('registrar_dados').addEventListener('click', () => {
        const responsavel = document.getElementById('respPagEntrega').value || document.getElementById('respPagPrinc').value;
        const setor = document.getElementById('setorPagEntrega').value;
        const tipo = document.getElementById('h3-pag-entrega-dev').innerText.includes('Entrega') ? 'Entrega' : 'Devolução';
      
        if (!responsavel || !setor) {
          alert('Por favor, selecione todos os campos.');
          return;
        }
      
        fetch('https://sistema-de-chaves.onrender.com/pag_entrega', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ responsavel, setor, tipo })
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Erro:', error));
      });
      

    //Script da página de devolução das chaves
    document.getElementById('registrar_dados').addEventListener('click', () => {document.getElementById('registrar_dados').addEventListener('click', () => {
        const responsavel = document.getElementById('respPagDevolucao').value || document.getElementById('respPagPrinc').value;
        const setor = document.getElementById('setorPagDevolucao').value;
        const tipo = document.getElementById('h3-pag-entrega-dev').innerText.includes('Devolucao') ? 'Devolucao' : 'Entrega';
      
        if (!responsavel || !setor) {
          alert('Por favor, selecione todos os campos.');
          return;
        }
      
        fetch('https://sistema-de-chaves.onrender.com/pag_devolucao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ responsavel, setor, tipo })
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Erro:', error));
      });
    });
});