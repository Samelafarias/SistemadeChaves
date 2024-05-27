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
  const { username, password } = req.body;
  console.log('Nome de usuário:', username);
  console.log('Senha:', password);

  const query = `SELECT * FROM users WHERE username = ?`;
  db.query(query, [username], async (error, results) => {
      if (error) {
          console.error('Erro ao buscar usuário:', error);
          res.status(500).send({ message: 'Erro ao realizar login' });
      } else if (results.length === 0) {
          console.log('Usuário não encontrado');
          res.status(401).send({ message: 'Usuário ou senha inválidos' });
      } else {
          const user = results[0];
          if (await bcrypt.compare(password, user.password)) {
              console.log('Login realizado com sucesso para o usuário:', username);
              res.send({ message: 'Login realizado com sucesso!' });
          } else {
              console.log('Senha incorreta para o usuário:', username);
              res.status(401).send({ message: 'Usuário ou senha inválidos' });
          }
      }
  });
});

  
  // API PARA CADASTRAR CHAVE
  /*app.post('/keys', (req, res) => {
    const { user_id, key_name, key_value } = req.body;
    const query = `INSERT INTO keys (user_id, key_name, key_value) VALUES (?, ?, ?)`;
    db.query(query, [user_id, key_name, key_value], (err, results) => {
      if (err) {
        res.status(500).send({ message: 'Erro ao cadastrar chave' });
      } else {
        res.send({ message: 'Chave cadastrada com sucesso!' });
      }
    });
  });*/
  
  // API PARA RECEBER DADOS
  app.post('/db_pj_chaves/dados', (req, res) => {
    const { user_id, data_value } = req.body;
    const query = `INSERT INTO data (user_id, data_value) VALUES (?, ?)`;
    db.query(query, [user_id, data_value], (error, results) => {
      if (error) {
        res.status(500).send({ message: 'Erro ao receber dados' });
      } else {
        res.send({ message: 'Dados recebidos com sucesso!' });
      }
    });
  });
  
  // INICIAR O SERVIDOR
const port = 5500;
  app.listen(port, () => {
    console.log(`Servidor iniciado na porta http://localhost:${port}/`);
  });