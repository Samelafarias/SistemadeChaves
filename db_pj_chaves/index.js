const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

// CONFIGURAÇÃO DO BANCO DE DADOS
const dbConfig = {
    host: 'localhost', // Corrigido o nome do host
    user: 'root',
    password: '1234567',
    database: 'db_pj_chaves',
    port: '3306'
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

// CONFIGURAR O BODY-PARSER PARA LIDAR COM AS REQUISIÇÕES URL-ENCODED
app.use(bodyParser.urlencoded({ extended: true }));

// CRIAR CONEXÃO COM O BANCO DE DADOS
const db = mysql.createConnection(dbConfig);

// CONECTAR AO BANCO DE DADOS
db.connect((error) => {
    if (error) {
        console.error('Erro ao conectar com o banco de dados');
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!!!');
});

  

// API PARA LOGIN
app.post(`/pag_login`, async (req, res) => {
  //extraímos o nome de usuario e a senha do corpo da requisição
  const { username, password } = req.body;
  console.log('Nome de usuário:', username);
  console.log('Senha:', password);

  //verifica se o nome de usuario e a senha foram fornecidos
  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, forneça um nome de usuário e uma senha.' });
}

//define a query SQL para buscar o usuario pelo nome de usuario
const query = 'SELECT * FROM users WHERE username = ?';

//executa a query no banco de dados
db.query(query, [username], async (error, results) => {
    if (error) {
      //se houver erro ao buscar o usuario, registramos o erro e enviamos uma requisição
        console.error('Erro ao buscar usuário:', error);
        return res.status(500).send({ message: 'Erro ao realizar login' });
    }

    //verificamos se o usuario foi encontrado
    if (results.length === 0) {
      //se o usuario nao for encontrado, registramos isso e enviamos uma resposta 401
        console.log('Usuário não encontrado');
        return res.status(401).send({ message: 'Usuário ou senha inválidos' });
    }
//se o usuario for encontrado, extraimos seus dados
    const user = results[0];
    console.log('Usuário encontrado:', user);

    // Verificando o hash da senha armazenada
    try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Comparação de senha:', passwordMatch);
//se a senha for correta, enviamos uma resposta de sucesso 
        if (passwordMatch) {
            console.log('Login realizado com sucesso para o usuário:', username);
            return res.send({ message: 'Login realizado com sucesso!' });
        } else {
          //se a senha estiver incorreta, enviamos uma resposta 401
            console.log('Senha incorreta para o usuário:', username);
            return res.status(401).send({ message: 'Usuário ou senha inválidos' });
        }
    } catch (compareError) {
      //se houver erro ao comparar senhas, registramos o erro e enviamos uma resposta 500
        console.error('Erro ao comparar as senhas:', compareError);
        return res.status(500).send({ message: 'Erro no servidor ao verificar senha' });
    }
});
});

//API PARA PAGINA PRINCIPAL
app.post('/pag_principal', (req, res) => {
  const dados = req.body;
  console.log('Dados recebidos:', dados);
  res.json({ message: 'Dados registrados com sucesso!', dados: dados });
});

//API PARA PAGINA DE CHAVES 
//API PARA PAGINA DE REGISTROS
app.post('/pag_registros', (req, res) => {
  const newRecord = req.body;
  const query = 'INSERT INTO registros (id, data_value, date, setor, operacao, responsavel, time) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [newRecord.user_id, newRecord.data_value, newRecord.date, newRecord.sector, newRecord.operation, newRecord.responsible, newRecord.time];

  db.query(query, values, (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Registro criado com sucesso', id: result.insertId });
  });
});

// Endpoint para obter todos os registros
app.get('/pag_registros', (req, res) => {
  const query = 'SELECT * FROM registros';

  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
  });
});



  // INICIAR O SERVIDOR
const port = 5500;
  app.listen(port, () => {
    console.log(`Servidor iniciado na porta http://localhost:${port}/`);
  });

  