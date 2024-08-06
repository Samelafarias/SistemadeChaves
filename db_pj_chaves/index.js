const mysql = require('mysql')//Importa o módulo Mysql para conectar ao banco de dados
const express = require('express')// Importa o módulo Express para criar o servidor web
const bodyParser = require('body-parser')// Middleware para interpretar o corpo das requisições

const bcrypt = require('bcrypt')// Biblioteca para hashing de senhas
const cors = require('cors')// Middleware para permitir requisições CORS

// CONFIGURAÇÃO DO BANCO DE DADOS
const dbConfig = {
    host: 'localhost',  // Endereço do servidor do banco de dados
    user: 'root', // Usuário do banco de dados
    password: '1234567', //Senha do banco de dados
    database: 'db_pj_chaves', //Nome do banco de dados
    port: '3306' //Porta do servidor Mysql
};

const app = express(); // Cria uma instância do servidor Express
app.use(bodyParser.json()); // Middleware para interpretar JSON no corpo das requisições
app.use(cors()); // Aplica o middleware CORS para permitir requisições de diferentes origens
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para interpretar dados codificados na URL

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

// API PÁGINA DE LOGIN
// Rota para login de usuários
app.post('/pag_login', (req, res) => {
    const username = req.body.username; // Obtém o nome de usuário do corpo da requisição
    const password = req.body.password; // Obtém a senha do corpo da requisição

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    const query = 'SELECT * FROM login WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.status(200).json({ message: 'Login bem-sucedido' });
        } else {
            res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }
    });
});

    //API da página de cadastro de chaves
    // Rota para lidar com o cadastro de chaves
app.post('/pag_cadastro_chaves', (req, res) => {
    const { name, numero } = req.body;
  
    if (!name || !numero) {
      return res.status(400).json({ error: 'Nome da sala e número da sala são obrigatórios.' });
    }
  
    const query = 'INSERT INTO chaves (nome, numero) VALUES (?, ?)';
    db.query(query, [name, numero], (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao inserir dados no banco de dados.' });
      }
      res.status(200).json({ message: 'Chave cadastrada com sucesso.' });
    });
  });
  

    //API DA PÁGINA DE REGISTRO DE ADMS
   // Rota para cadastrar administrador
   app.post('/pag_cadastro_adm', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Erro ao criptografar a senha:', err);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }

        db.query('INSERT INTO login (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
            if (err) {
                console.error('Erro ao inserir o usuário:', err);
                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }

            res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
        });
    });
});

    //API DA PÁGINA DE REGISTRO DE RESPONSÁVEIS
    // Rota para lidar com o cadastro de chaves
app.post('/pag_cadastro_resp', (req, res) => {
    const { nome, profissao, email } = req.body;
  
    if (!nome || !profissao || !email) {
      return res.status(400).json({ error: 'Nome da sala e número da sala são obrigatórios.' });
    }
  
    const query = 'INSERT INTO responsaveis (nome, profissao, email) VALUES (?, ?, ?)';
    db.query(query, [nome, profissao, email], (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao inserir dados no banco de dados.' });
      }
      res.status(200).json({ message: 'Chave cadastrada com sucesso.' });
    });
  });

  //API PPÁGINA PRINCIPAL
// Rota para criar novos registros
app.post('/pag_principal', (req, res) => {
    const newRecord = req.body;
    const query = 'INSERT INTO registros (date, setor, operacao, responsavel, time) VALUES (?, ?, ?, ?, ?)';
    const values = [newRecord.date, newRecord.sector, newRecord.operation, newRecord.responsible, newRecord.time];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Registro criado com sucesso', id: result.insertId });
    });
});

// Rota para obter setores
app.get('/getSetores', (req, res) => {
    const query = 'SELECT nome FROM chaves';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Rota para obter responsáveis
app.get('/getResponsaveis', (req, res) => {
    const query = 'SELECT profissao, nome FROM responsaveis';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// API PARA PÁGINA DE REGISTROS
// Rota para obter todos os registros
app.get('/pag_registros', (req, res) => {
    let sql = 'SELECT * FROM registros';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// API PARA PÁGINA DE CHAVES
// Rota para obter setor e operação dos registros (ajuste conforme sua estrutura de tabela)
app.get('/pag_chaves', (req, res) => {
    const query = 'SELECT setor, operacao FROM registros';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados:', err);
            res.status(500).send('Erro ao buscar dados');
            return;
        }
        res.json(results);
    });
});

// Servindo arquivos estáticos (HTML, CSS, JS) na pasta 'public'
app.use(express.static('public'));

// INICIAR O SERVIDOR
const port = 5500; // Porta em que o servidor vai escutar
app.listen(port, () => {
    console.log(`Servidor iniciado na porta http://localhost:${port}/`);
});

  