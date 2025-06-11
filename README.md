# Sistema de Chaves: Automação para Instituições de Ensino

Este é um projeto de sistema web desenvolvido para automatizar o processo de entrega e devolução de chaves em portarias de instituições de ensino. O objetivo principal é digitalizar e simplificar a gestão de chaves, eliminando a necessidade de registros manuais em papel e proporcionando maior controle e rastreabilidade.

## Visão Geral do Projeto

O sistema permite que a portaria registre as chaves existentes, cadastre novas chaves, responsáveis (professores, funcionários) e administradores, gerencie empréstimos e devoluções, e visualize o histórico de todas as transações.

## Funcionalidades Principais

* **Login e Autenticação:** Acesso seguro ao sistema.
* **Gestão de Administradores:** Cadastro e gerenciamento de usuários com privilégios de administração.
* **Gestão de Responsáveis:** Cadastro de pessoas autorizadas a pegar chaves (alunos (autorizados), professores, funcionários).
* **Gestão de Chaves:** Cadastro de novas chaves, identificação e status (disponível/emprestada).
* **Registro de Empréstimo e Devolução:** Funcionalidade para registrar a saída e entrada de chaves.
* **Histórico de Registros:** Visualização detalhada de todas as transações de chaves (quem pegou, qual chave, data/hora, devolução).
* **Interface Intuitiva:** Páginas web dedicadas para cada funcionalidade principal.

## Tecnologias Utilizadas

Este projeto é construído com tecnologias front-end e um indicativo de um ambiente Node.js, que pode ser usado para dependências e scripts.

* **HTML5:** Estrutura e marcação de todas as páginas web do sistema.
* **CSS3:** Estilização e design da interface do usuário, garantindo uma experiência visual agradável e responsiva.
* **JavaScript:** Lógica de programação client-side para interatividade das páginas, validação de formulários e manipulação do DOM.
* **Node.js (indireto):** A presença de `package.json` e `node_modules` indica que o projeto utiliza o ecossistema Node.js para gerenciamento de dependências ou execução de scripts de desenvolvimento/build.
* **Banco de Dados (Componente):** A pasta `db_pj_chaves` sugere a existência de um componente de banco de dados, que pode ser um banco de dados local (como SQLite) ou scripts de configuração para um banco de dados externo.

## Estrutura Detalhada do Projeto

A organização do projeto reflete a separação de responsabilidades entre as diferentes partes do sistema:
```
SistemadeChaves/
├── .vscode/                  # Configurações do ambiente de desenvolvimento VS Code.
├── db_pj_chaves/             # Diretório Crucial: Contém arquivos relacionados ao banco de dados do sistema,
│                             # possivelmente scripts de schema, dados iniciais ou o próprio arquivo do DB.
├── img/                      # Armazena todas as imagens e ícones utilizados na interface do sistema.
├── node_modules/             # Diretório gerado automaticamente que contém todas as dependências do Node.js
│                             # instaladas através do 'npm' (Node Package Manager).
├── .gitattributes            # Configurações do Git para tratamento de arquivos.
├── package-lock.json         # Garante a consistência das versões das dependências instaladas.
├── package.json              # Arquivo de metadados do projeto Node.js, lista as dependências e scripts.
├── pag_cadastro_adm.html     # Página: Interface para o cadastro de novos usuários administradores do sistema.
├── pag_cadastro_chaves.html  # Página: Interface para registrar novas chaves no sistema, definindo seus detalhes.
├── pag_cadastro_resp.html    # Página: Interface para o cadastro de responsáveis (quem irá pegar/devolver chaves).
├── pag_chaves.html           # Página: Visualização e gestão das chaves cadastradas, com seus status.
├── pag_login.html            # Página: Interface para que os usuários façam login no sistema.
├── pag_menu.html             # Página: Menu de navegação principal, redirecionando para as diferentes funcionalidades.
├── pag_principal.html        # Página: Dashboard ou página inicial após o login, com informações relevantes.
├── pag_registrar.html        # Página: Pode ser uma página genérica de registro ou específica para operações de empréstimo/devolução.
├── pag_registros.html        # Página: Exibe o histórico detalhado de todas as operações de empréstimo e devolução de chaves.
├── script.js                 # Script JavaScript: Contém a lógica principal de interatividade, manipulação de dados e chamadas (se houver) para o backend/DB.
├── script2.js                # Script JavaScript: Pode ser um script auxiliar para funcionalidades específicas ou separação de responsabilidades.
└── style.css                 # Folha de Estilos: Define todo o design visual e o layout das páginas do sistema.
```

## Como Configurar e Executar (Estimado)

Para colocar o Sistema de Chaves em funcionamento localmente:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Samelafarias/SistemadeChaves.git](https://github.com/Samelafarias/SistemadeChaves.git)
    cd SistemadeChaves
    ```
2.  **Instale as dependências (se necessário):**
    Caso o projeto utilize alguma biblioteca ou framework através do `npm` (indicado por `package.json`), execute:
    ```bash
    npm install
    ```
3.  **Configurar o Banco de Dados:**
    Verifique o conteúdo da pasta `db_pj_chaves`. Pode ser necessário inicializar um banco de dados ou rodar scripts de criação de tabelas. As instruções exatas dependerão da tecnologia de DB utilizada.
4.  **Abrir o Sistema:**
    Como é um projeto web, você pode abrir `pag_login.html` ou `pag_principal.html` diretamente no seu navegador. **Idealmente**, para um sistema com lógica de banco de dados e possivelmente um backend, seria necessário iniciar um servidor web local (por exemplo, com `Node.js` e `Express`, ou usando extensões como "Live Server" no VS Code).

## Como Usar

1.  **Acesso:** Abra a `pag_login.html` no seu navegador.
2.  **Login:** Utilize credenciais de administrador (se já houver) ou cadastre um novo administrador via `pag_cadastro_adm.html` (se o fluxo permitir sem login inicial).
3.  **Cadastro:** Navegue para as páginas de cadastro (`pag_cadastro_chaves.html`, `pag_cadastro_resp.html`) para registrar novas chaves e responsáveis.
4.  **Gestão:** Use a `pag_chaves.html` para ver o status das chaves e a `pag_registrar.html` para registrar empréstimos e devoluções.
5.  **Histórico:** Consulte `pag_registros.html` para visualizar todas as transações.

## Melhorias e Possíveis Expansões Futuras

Este projeto tem um grande potencial para expansão:

* **Backend Robusto:** Implementar um backend completo (com Node.js/Express, Python/Django/Flask, PHP/Laravel, etc.) para gerenciar o banco de dados de forma segura e escalável, além de expor APIs.
* **Banco de Dados Real:** Migrar de um potencial DB local para um banco de dados robusto (MySQL, PostgreSQL, MongoDB, SQLite).
* **Autenticação e Autorização:** Implementar um sistema de autenticação mais avançado (JWT, sessões) e controle de acesso baseado em papéis (Admin, Usuário, etc.).
* **Notificações:** Adicionar alertas ou notificações para chaves atrasadas ou eventos importantes.
* **Interface Responsiva:** Otimizar o design para que o sistema funcione perfeitamente em dispositivos móveis.
* **Pesquisa e Filtros:** Adicionar funcionalidades de busca e filtros para facilitar a localização de chaves e registros.
* **Relatórios:** Gerar relatórios sobre o uso das chaves, chaves mais populares, etc.
* **Tratamento de Erros:** Melhorar o feedback visual e o tratamento de erros para o usuário.

---
